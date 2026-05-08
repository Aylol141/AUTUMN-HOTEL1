'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Check, 
  X, 
  Trash2, 
  Search, 
  Calendar, 
  Phone, 
  User, 
  BedDouble,
  Clock,
  Filter
} from 'lucide-react';

export default function AdminBookingsPage() {
  const bookings = useStore((state) => state.bookings);
  const updateBookingStatus = useStore((state) => state.updateBookingStatus);
  const deleteBooking = useStore((state) => state.deleteBooking);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerPhone.includes(searchTerm) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .reverse();

  const handleConfirm = (id: string) => {
    updateBookingStatus(id, 'confirmed');
  };

  const handleCancel = (id: string) => {
    updateBookingStatus(id, 'cancelled');
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الحجز نهائياً؟')) {
      deleteBooking(id);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-[#2D1B14]">إدارة الحجوزات</h1>
        <div className="flex items-center gap-2 text-sm font-medium text-[#8D6E63] bg-[#F4ECE8] px-4 py-2 rounded-full">
          <Calendar className="h-4 w-4" />
          <span>إجمالي الحجوزات: {bookings.length}</span>
        </div>
      </div>

      {/* Filters Area - متطابق مع الصورة */}
      <div className="bg-white p-5 rounded-[2rem] border border-[#D7CCC8] shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8D6E63]" />
            <Input
              type="text"
              placeholder="بحث بالاسم، رقم الجوال، أو نوع الجناح..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 h-12 bg-[#FDF8F5] border-[#D7CCC8] rounded-2xl focus:ring-[#D35400] transition-all"
            />
          </div>
          
          <div className="flex bg-[#FDF8F5] p-1 rounded-2xl border border-[#D7CCC8] self-start overflow-x-auto max-w-full">
            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  statusFilter === status 
                  ? 'bg-[#D35400] text-white shadow-md' 
                  : 'text-[#8D6E63] hover:text-[#3E2723]'
                }`}
              >
                {status === 'all' ? 'الكل' : 
                 status === 'pending' ? 'قيد الانتظار' : 
                 status === 'confirmed' ? 'مؤكد' : 'ملغي'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table/List */}
      <div className="bg-white rounded-[2rem] border border-[#D7CCC8] shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-24">
            <div className="bg-[#F4ECE8] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-[#D7CCC8]" />
            </div>
            <p className="text-[#8D6E63] font-medium">لا توجد حجوزات متاحة حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#FDF8F5] border-b border-[#D7CCC8]">
                  <th className="px-6 py-4 text-[#3E2723] font-bold text-sm">النزيل</th>
                  <th className="px-6 py-4 text-[#3E2723] font-bold text-sm">الجناح / الخدمة</th>
                  <th className="px-6 py-4 text-[#3E2723] font-bold text-sm">التاريخ</th>
                  <th className="px-6 py-4 text-[#3E2723] font-bold text-sm">الحالة</th>
                  <th className="px-6 py-4 text-[#3E2723] font-bold text-sm">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7CCC8]">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#FDF8F5]/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3E2723] flex items-center justify-center text-white text-xs font-bold">
                          {booking.customerName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#2D1B14]">{booking.customerName}</div>
                          <div className="text-xs text-[#8D6E63] flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span dir="ltr">{booking.customerPhone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <BedDouble className="h-4 w-4 text-[#D35400]" />
                        <span className="font-medium text-[#3E2723]">{booking.serviceName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-[#2D1B14]">{new Date(booking.date).toLocaleDateString('ar-SA')}</div>
                      <div className="text-xs text-[#8D6E63] flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {booking.time}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-[#D35400]'
                      }`}>
                        {booking.status === 'confirmed' ? 'مؤكد' : booking.status === 'cancelled' ? 'ملغي' : 'قيد الانتظار'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 w-9 p-0 border-[#D7CCC8] text-green-600 hover:bg-green-50 rounded-xl"
                              onClick={() => handleConfirm(booking.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 w-9 p-0 border-[#D7CCC8] text-[#D35400] hover:bg-orange-50 rounded-xl"
                              onClick={() => handleCancel(booking.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 w-9 p-0 border-[#D7CCC8] text-red-600 hover:bg-red-50 rounded-xl"
                          onClick={() => handleDelete(booking.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}