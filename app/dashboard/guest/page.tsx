'use client';
import { useStore } from '../../../lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Home, 
  Star, 
  ChevronRight,
  BedDouble
} from 'lucide-react';
import type { Appointment } from '@/lib/types';

export default function GuestDashboard() {
  const { currentUser } = useStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.id) return;

    setLoadingBookings(true);
    fetch(`/api/bookings?userId=${encodeURIComponent(currentUser.id)}`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoadingBookings(false));
  }, [currentUser?.id]);

  const cancelBooking = async (bookingId: string) => {
    if (!currentUser?.id || cancellingId) return;

    setCancellingId(bookingId);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) throw new Error('Cancel failed');

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking,
        ),
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen pb-20" dir="rtl">
      {/* Welcome Section */}
      <div className="relative h-[40vh] rounded-[3rem] overflow-hidden mb-12 shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Resort"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />
        <div className="absolute bottom-10 right-10 text-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[1px] w-8 bg-amber-500" />
            <span className="text-amber-500 uppercase tracking-[0.3em] text-[10px] font-bold">عالم من الرفاهية بانتظارك</span>
          </div>
          <h1 className="text-5xl font-black mb-2 tracking-tight">السيد {currentUser?.name || 'ميس'}</h1>
          <p className="text-stone-300 font-serif italic text-lg">أهلاً بك مجدداً في أيلول.. حيث يبدأ الاسترخاء</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Actions */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-3">
            <Sparkles className="text-amber-600" size={24} />
            خيارات الإقامة والخدمات
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* بطاقة حجز الخدمات (تجميلية، رياضية، إلخ) */}
            <div 
              onClick={() => router.push('/services')} // توجيه لصفحة الخدمات الرئيسية
              className="group bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-stone-50 rounded-full group-hover:scale-[3] transition-transform duration-700 opacity-50" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-amber-600 transition-colors">
                  <Calendar size={28} />
                </div>
                <h3 className="text-xl font-black text-stone-900 mb-2">حجز الخدمات</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  استكشف خدماتنا: التجميلية، الرياضية، والمساج العلاجي.
                </p>
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-widest">
                  استعراض الخدمات <ChevronRight size={14} className="group-hover:translate-x-[-4px] transition-transform" />
                </div>
              </div>
            </div>

            {/* بطاقة حجز الغرف والأجنحة (بدل خدمة الغرف) */}
            <div 
              onClick={() => router.push('/products')} // توجيه لصفحة الغرف والأجنحة
              className="group bg-stone-900 p-8 rounded-[2.5rem] shadow-xl hover:shadow-amber-900/20 transition-all duration-500 cursor-pointer"
            >
              <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <BedDouble size={28} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">الأجنحة والغرف</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                احجز إقامتك القادمة في أفخم الأجنحة المطلة على الطبيعة.
              </p>
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
                حجز الآن <ChevronRight size={14} />
              </div>
            </div>
          </div>

          {/* بطاقة سريعة للتحويل المباشر */}
          <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm">
                <Star size={20} />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-lg">الجديد في أيلول</h4>
                <p className="text-stone-600 text-sm">تم افتتاح النادي الرياضي المطور، احجز حصتك التدريبية الآن.</p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/services?cat=gym')}
              className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors"
            >
              الذهاب للرياضية
            </button>
          </div>
        </div>

        {/* Sidebar - الحالة الحالية */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm">
            <h3 className="text-xl font-black text-stone-900 mb-6 border-b border-stone-50 pb-4">مواعيدك</h3>
            {loadingBookings ? (
              <div className="py-10 text-center text-stone-400 text-sm font-medium">جاري تحميل حجوزاتك...</div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="rounded-3xl border border-stone-100 bg-stone-50 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black ${
                        booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : booking.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status === 'cancelled' ? 'ملغي' : booking.status === 'confirmed' ? 'مؤكد' : 'قيد المراجعة'}
                      </span>
                      <h4 className="text-sm font-black text-stone-900">{booking.serviceName}</h4>
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-stone-500">
                      <span>{booking.time}</span>
                      <span>{booking.date}</span>
                    </div>
                    <div className="mb-4 rounded-2xl bg-white p-3 text-xs text-stone-600">
                      <div className="mb-1 font-black text-stone-900">
                        الدفع: {booking.paymentMethod === 'bank' ? 'تحويل بنكي' : booking.paymentMethod === 'sham_cash' ? 'شام كاش' : 'نقداً'}
                      </div>
                      <div>رقم العملية: <span dir="ltr">{booking.paymentReference || 'غير مسجل'}</span></div>
                      <div className="mt-1">
                        الحالة: {booking.paymentStatus === 'paid' ? 'مدفوع' : booking.paymentStatus === 'rejected' ? 'مرفوض' : 'بانتظار مراجعة الدفع'}
                      </div>
                    </div>
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-xs font-black text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        {cancellingId === booking.id ? 'جاري إلغاء الحجز...' : 'إلغاء الحجز'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                  <Clock size={30} />
                </div>
                <p className="text-stone-400 text-sm font-medium">لا توجد حجوزات نشطة حالياً</p>
                <button 
                  onClick={() => router.push('/products')}
                  className="mt-6 text-amber-600 text-xs font-bold underline underline-offset-4"
                >
                  ابدأ رحلتك واحجز الآن
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
