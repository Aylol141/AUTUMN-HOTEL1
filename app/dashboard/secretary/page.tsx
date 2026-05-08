'use client';
import { useStore } from '../../../lib/store';
import { 
  CalendarDays, 
  Clock, 
  Check, 
  X, 
  User, 
  ArrowLeftRight, 
  LayoutGrid, 
  BellRing,
  Coffee
} from 'lucide-react';
import { useState } from 'react';

export default function SecretaryPage() {
  const { appointments, updateBookingStatus } = useStore();
  const [activeTab, setActiveTab] = useState('pending');

  const filtered = appointments.filter(app => app.status === activeTab);

  return (
    <div className="min-h-screen space-y-8" dir="rtl">
      {/* Header - تصميم عصري وبسيط */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stone-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight">الاستقبال</h1>
          <p className="text-stone-500 font-medium mt-2 flex items-center gap-2">
            <BellRing size={16} className="text-amber-600" />
            لديك {appointments.filter(a => a.status === 'pending').length} طلبات جديدة تتطلب انتباهك
          </p>
        </div>
        
        {/* Navigation Tabs - بديل للفلاتر التقليدية */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl w-full md:w-auto">
          {[
            { id: 'pending', label: 'طلبات معلقة', icon: Clock },
            { id: 'confirmed', label: 'مؤكدة', icon: Check },
            { id: 'cancelled', label: 'ملغية', icon: X },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content - نظام الكروت الشبكي */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-stone-300">
            <Coffee size={48} strokeWidth={1} />
            <p className="mt-4 font-medium text-stone-400">لا يوجد مهام في هذا القسم حالياً.. وقت القهوة؟</p>
          </div>
        ) : (
          filtered.map((app) => (
            <div 
              key={app.id} 
              className="group bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* زخرفة خلفية خفيفة لكل كرت لكسر الجمود */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-stone-50 rounded-full group-hover:bg-amber-50 transition-colors" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <User size={24} />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block mb-1">موعد الحجز</span>
                    <div className="flex items-center gap-2 text-stone-900 font-bold">
                      <CalendarDays size={14} className="text-amber-700" />
                      {app.date}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900">{app.patientName}</h3>
                    <p className="text-amber-800 font-medium text-sm mt-1">{app.serviceName}</p>
                  </div>

                  <div className="flex items-center gap-4 py-4 border-y border-stone-50">
                    <div className="flex items-center gap-2 text-stone-500 text-sm">
                      <Clock size={16} />
                      {app.time}
                    </div>
                    <div className="w-[1px] h-4 bg-stone-200" />
                    <div className="flex items-center gap-2 text-stone-500 text-sm">
                      <LayoutGrid size={16} />
                      قسم الرفاهية
                    </div>
                  </div>

                  {/* Actions - أزرار تفاعلية ضخمة وسهلة */}
                  {activeTab === 'pending' && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => updateBookingStatus(app.id, 'confirmed')}
                        className="bg-stone-900 text-white py-4 rounded-2xl text-xs font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Check size={16} /> تأكيد
                      </button>
                      <button 
                        onClick={() => updateBookingStatus(app.id, 'cancelled')}
                        className="bg-stone-100 text-stone-500 py-4 rounded-2xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                      >
                        <X size={16} /> رفض
                      </button>
                    </div>
                  )}

                  {(activeTab === 'confirmed' || activeTab === 'cancelled') && (
                    <div className={`mt-4 py-3 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest ${
                      activeTab === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                      الحالة: {activeTab === 'confirmed' ? 'مقبول وتم التأكيد' : 'تم الإلغاء'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}