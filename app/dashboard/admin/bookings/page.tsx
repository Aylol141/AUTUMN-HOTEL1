'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Appointment } from '@/lib/types';
import { 
  Check, 
  X, 
  Trash2, 
  Search, 
  Calendar, 
  Phone, 
  BedDouble,
  Clock,
  MoreVertical
} from 'lucide-react';

export default function AdminBookingsPage() {
  // تأكدي من مواءمة المسميات مع الـ Store (استخدمنا appointments سابقاً)
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    fetch('/api/bookings', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error('Failed to load bookings:', error))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        (booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.customerPhone?.includes(searchTerm)) ||
        (booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .reverse();

  const updateBookingStatus = async (id: string, status: Appointment['status']) => {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      setBookings((current) => current.map((booking) => (
        booking.id === id ? { ...booking, status } : booking
      )));
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: NonNullable<Appointment['paymentStatus']>) => {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus }),
    });

    if (response.ok) {
      setBookings((current) => current.map((booking) => (
        booking.id === id ? { ...booking, paymentStatus } : booking
      )));
    }
  };

  const handleConfirm = (id: string) => updateBookingStatus(id, 'confirmed');
  const handleCancel = (id: string) => updateBookingStatus(id, 'cancelled');
  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الحجز نهائياً؟')) {
      fetch(`/api/bookings/${id}`, { method: 'DELETE' }).then((response) => {
        if (response.ok) {
          setBookings((current) => current.filter((booking) => booking.id !== id));
        }
      });
    }
  };

  return (
    <div className="space-y-6 text-right pb-20" dir="rtl">
      {/* Header - متجاوب */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-black text-[#2D1B14]">إدارة الحجوزات</h1>
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#8D6E63] bg-[#F4ECE8] px-4 py-2 rounded-full w-fit">
          <Calendar className="h-4 w-4" />
          <span>إجمالي الحجوزات: {bookings.length}</span>
        </div>
      </div>

      {/* Filters - تحسين المسافات للموبايل */}
      <div className="bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border border-[#D7CCC8] shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8D6E63]" />
          <Input
            type="text"
            placeholder="بحث بالاسم، الجوال..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-12 h-12 bg-[#FDF8F5] border-[#D7CCC8] rounded-2xl focus:ring-[#D35400]"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2 text-[10px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap border ${
                statusFilter === status 
                ? 'bg-[#D35400] text-white border-[#D35400] shadow-md' 
                : 'bg-white text-[#8D6E63] border-[#D7CCC8] hover:bg-[#FDF8F5]'
              }`}
            >
              {status === 'all' ? 'الكل' : status === 'pending' ? 'قيد الانتظار' : status === 'confirmed' ? 'مؤكد' : 'ملغي'}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Content */}
      <div className="bg-transparent md:bg-white md:rounded-[2rem] md:border md:border-[#D7CCC8] md:shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-[#D7CCC8]">
            <p className="text-[#8D6E63] font-medium">جاري تحميل الحجوزات...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-[#D7CCC8]">
            <Calendar className="h-12 w-12 text-[#D7CCC8] mx-auto mb-4 opacity-50" />
            <p className="text-[#8D6E63] font-medium">لا توجد نتائج للبحث</p>
          </div>
        ) : (
          <>
            {/* عرض الجدول (للشاشات الكبيرة فقط) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-[#FDF8F5] border-b border-[#D7CCC8]">
                    <th className="px-6 py-4 text-[#3E2723] font-bold text-sm">النزيل</th>
                    <th className="px-6 py-4 text-[#3E2723] font-bold text-sm">الجناح / الخدمة</th>
                    <th className="px-6 py-4 text-[#3E2723] font-bold text-sm">التاريخ</th>
                    <th className="px-6 py-4 text-[#3E2723] font-bold text-sm">الدفع</th>
                    <th className="px-6 py-4 text-[#3E2723] font-bold text-sm">الحالة</th>
                    <th className="px-6 py-4 text-[#3E2723] font-bold text-sm text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D7CCC8]">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-[#FDF8F5]/50 group transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#3E2723] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {booking.customerName?.charAt(0) || 'G'}
                          </div>
                          <div>
                            <div className="font-bold text-[#2D1B14]">{booking.customerName}</div>
                            <div className="text-xs text-[#8D6E63]">{booking.customerPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-[#3E2723]">
                        <div className="flex items-center gap-2">
                          <BedDouble className="h-4 w-4 text-[#D35400]" />
                          {booking.serviceName}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-[#2D1B14]">{booking.date}</div>
                        <div className="text-xs text-[#8D6E63]">{booking.time}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs font-bold text-[#2D1B14]">
                          {booking.paymentMethod === 'bank' ? 'تحويل بنكي' : booking.paymentMethod === 'sham_cash' ? 'شام كاش' : 'نقداً'}
                        </div>
                        <div className="text-[11px] text-[#8D6E63]" dir="ltr">{booking.paymentReference || '-'}</div>
                        <div className={`mt-2 w-fit rounded-full px-3 py-1 text-[10px] font-black ${
                          booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                          booking.paymentStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.paymentStatus === 'paid' ? 'مدفوع' : booking.paymentStatus === 'rejected' ? 'مرفوض' : 'مراجعة الدفع'}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {booking.status === 'confirmed' ? 'مؤكد' : booking.status === 'cancelled' ? 'ملغي' : 'قيد الانتظار'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {booking.status === 'pending' && (
                            <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50" onClick={() => handleConfirm(booking.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {booking.paymentStatus !== 'paid' && (
                            <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-50" onClick={() => updatePaymentStatus(booking.id, 'paid')}>
                              دفع
                            </Button>
                          )}
                          {booking.paymentStatus !== 'rejected' && (
                            <Button size="sm" variant="ghost" className="text-orange-600 hover:bg-orange-50" onClick={() => updatePaymentStatus(booking.id, 'rejected')}>
                              رفض الدفع
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(booking.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* عرض البطاقات (للموبايل فقط) */}
            <div className="md:hidden space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white p-5 rounded-3xl border border-[#D7CCC8] shadow-sm relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#3E2723] flex items-center justify-center text-white text-lg font-bold">
                        {booking.customerName?.charAt(0) || 'G'}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2D1B14] leading-none mb-1">{booking.customerName}</h4>
                        <p className="text-xs text-[#8D6E63]">{booking.customerPhone}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {booking.status === 'confirmed' ? 'مؤكد' : 'معلق'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[#F4ECE8] mb-4 text-xs font-medium text-[#3E2723]">
                    <div className="flex items-center gap-2">
                      <BedDouble size={14} className="text-[#D35400]" />
                      {booking.serviceName}
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Calendar size={14} className="text-[#D35400]" />
                      {booking.date}
                    </div>
                  </div>
                  <div className="mb-4 rounded-2xl bg-[#FDF8F5] p-3 text-xs text-[#3E2723]">
                    <div className="font-black">{booking.paymentMethod === 'bank' ? 'تحويل بنكي' : booking.paymentMethod === 'sham_cash' ? 'شام كاش' : 'نقداً'}</div>
                    <div dir="ltr">{booking.paymentReference || '-'}</div>
                    <div>{booking.paymentStatus === 'paid' ? 'مدفوع' : booking.paymentStatus === 'rejected' ? 'مرفوض' : 'بانتظار مراجعة الدفع'}</div>
                  </div>

                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <Button className="flex-1 bg-[#D35400] hover:bg-[#3E2723] text-white rounded-xl h-10 text-xs" onClick={() => handleConfirm(booking.id)}>
                        تأكيد الحجز
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1 border-red-100 text-red-500 hover:bg-red-50 rounded-xl h-10 text-xs" onClick={() => handleDelete(booking.id)}>
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
