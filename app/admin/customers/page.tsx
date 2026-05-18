'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Phone, 
  MapPin, 
  Search, 
  Calendar, 
  Mail, 
  ShieldCheck,
  Star,
  ArrowUpRight
} from 'lucide-react';

export default function AdminCustomersPage() {
  const orders = useStore((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState('');

  // استخراج قائمة النزلاء الفريدين من الطلبات
  const customers = Array.from(new Set(orders.map(o => o.customerPhone))).map(phone => {
    const lastOrder = orders.find(o => o.customerPhone === phone);
    const totalSpent = orders
      .filter(o => o.customerPhone === phone && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalPrice, 0);
    const ordersCount = orders.filter(o => o.customerPhone === phone).length;

    return {
      name: lastOrder?.customerName || 'نزيل غير معروف',
      phone: phone,
      address: lastOrder?.customerAddress || 'لا يوجد عنوان مسجل',
      totalSpent: totalSpent,
      ordersCount: ordersCount,
      lastSeen: lastOrder?.createdAt || new Date(),
    };
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2D1B14]">سجل النزلاء</h1>
          <p className="text-[#8D6E63] text-sm mt-1">قاعدة بيانات العملاء والنزلاء الدائمين لـ Autumn Hotel</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-[#D7CCC8] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F4ECE8] rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-[#D35400]" />
          </div>
          <div>
            <p className="text-[10px] text-[#8D6E63] font-bold uppercase">إجمالي النزلاء</p>
            <p className="text-lg font-black text-[#2D1B14] leading-none">{customers.length}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-[2rem] border border-[#D7CCC8] shadow-sm">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8D6E63]" />
          <Input
            type="text"
            placeholder="بحث عن نزيل بالاسم أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-12 h-12 bg-[#FDF8F5] border-[#D7CCC8] rounded-2xl focus:ring-[#D35400] transition-all"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-[#D7CCC8]">
            <User className="h-12 w-12 text-[#D7CCC8] mx-auto mb-4 opacity-50" />
            <p className="text-[#8D6E63]">لا يوجد نزلاء مسجلين بهذا الاسم</p>
          </div>
        ) : (
          filteredCustomers.map((customer, index) => (
            <div key={index} className="bg-white rounded-[2rem] border border-[#D7CCC8] p-6 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#3E2723] flex items-center justify-center text-white text-xl font-bold shadow-inner">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#2D1B14] flex items-center gap-2">
                      {customer.name}
                      {customer.ordersCount > 3 && (
                        <span className="bg-orange-100 text-[#D35400] text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" /> نزيل مميز
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-[#8D6E63]">
                      <span className="flex items-center gap-1" dir="ltr">
                        <Phone className="h-3 w-3" /> {customer.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {customer.address}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mb-1">إجمالي المدفوعات</div>
                  <div className="text-xl font-black text-[#D35400]">${customer.totalSpent}</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F4ECE8] flex items-center justify-between">
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-[10px] text-[#8D6E63] font-bold">الحجوزات</p>
                    <p className="text-sm font-black text-[#3E2723]">{customer.ordersCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-[#8D6E63] font-bold">آخر زيارة</p>
                    <p className="text-sm font-black text-[#3E2723]">
                      {new Date(customer.lastSeen).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                
                <button className="flex items-center gap-1 text-xs font-bold text-[#3E2723] hover:text-[#D35400] transition-colors">
                  عرض سجل الحجوزات <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}