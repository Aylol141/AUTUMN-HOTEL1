'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import type { Appointment } from '@/lib/types';
import { 
  Calendar, 
  BedDouble, 
  Sparkles, 
  Users, 
  MessageSquare, 
  DollarSign, 
  ArrowUpRight,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const orders = useStore((state) => state.orders); // سنعتبرها "طلبات الغرف والخدمات"
  const products = useStore((state) => state.products); // سنعتبرها "الأجنحة المتاحة"
  const services = useStore((state) => state.services);
  const messages = useStore((state) => state.messages);

  useEffect(() => {
    fetch('/api/bookings', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error('Failed to load dashboard bookings:', error));
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const unreadMessages = messages.filter((m) => !m.read).length;
  
  // حساب الإيرادات بالدولار
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.totalPrice, 0);

  // إعادة ترتيب الكاردات حسب الأهمية الفندقية (الدخل أولاً ثم الحجوزات)
  const stats = [
    {
      title: 'إجمالي الإيرادات',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-[#D35400]', // برتقالي خريفي
      href: '/admin/orders',
      trend: '+12% هذا الشهر',
    },
    {
      title: 'الحجوزات النشطة',
      value: bookings.length,
      icon: Calendar,
      color: 'bg-[#3E2723]', // بني دافئ
      href: '/admin/bookings',
      badge: pendingBookings > 0 ? `${pendingBookings} معلق` : null,
    },
    {
      title: 'الغرف والأجنحة',
      value: products.length,
      icon: BedDouble,
      color: 'bg-[#5D4037]', // بني متوسط
      href: '/admin/rooms',
    },
    {
      title: 'الخدمات الترفيهية',
      value: services.length,
      icon: Sparkles,
      color: 'bg-[#E67E22]', // برتقالي فاتح
      href: '/admin/services',
    },
    {
      title: 'إجمالي النزلاء',
      value: '1,240', // بيانات تجريبية ثابتة لتعزيز الواجهة
      icon: Users,
      color: 'bg-[#8D6E63]',
      href: '/admin/guests',
    },
    {
      title: 'طلبات المساعدة',
      value: messages.length,
      icon: MessageSquare,
      color: 'bg-[#2D1B14]', // بني غامق جداً
      href: '/admin/messages',
      badge: unreadMessages > 0 ? `${unreadMessages} رسالة` : null,
    },
  ];

  const recentBookings = bookings.slice(-5).reverse();

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-[#2D1B14]">مرحباً بك في Autumn Hotel</h1>
        <p className="text-[#8D6E63] mt-1">إليك ملخص أداء الفندق لهذا اليوم.</p>
      </div>

      {/* Stats Grid - تصميم جديد كلياً */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="group bg-white rounded-2xl border border-[#D7CCC8] p-6 hover:border-[#D35400] transition-all shadow-sm hover:shadow-xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
              {stat.badge && (
                <span className="bg-[#D35400] text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
                  {stat.badge}
                </span>
              )}
            </div>
            
            <div className="mt-4">
              <div className="text-3xl font-black text-[#2D1B14]">{stat.value}</div>
              <div className="text-[#8D6E63] font-medium mt-1">{stat.title}</div>
            </div>

            {stat.trend && (
              <div className="mt-3 flex items-center text-xs text-green-600 font-bold">
                <ArrowUpRight className="h-3 w-3 ml-1" />
                {stat.trend}
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Bookings - جدول الحجوزات بتصميم فندقي */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#D7CCC8] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#F4ECE8] p-2 rounded-lg">
                <Clock className="h-5 w-5 text-[#D35400]" />
              </div>
              <h2 className="text-xl font-bold text-[#2D1B14]">آخر حجوزات الأجنحة</h2>
            </div>
            <Link href="/admin/bookings" className="text-[#D35400] text-sm font-bold hover:underline">
              عرض السجل الكامل
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#8D6E63]">لا يوجد حجوزات نشطة حالياً</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="group flex items-center justify-between p-4 bg-[#FDF8F5] hover:bg-[#F4ECE8] rounded-2xl transition-colors border border-transparent hover:border-[#D7CCC8]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#3E2723] flex items-center justify-center text-white font-bold text-xs">
                      {booking.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[#2D1B14]">{booking.customerName}</div>
                      <div className="text-xs text-[#8D6E63]">{booking.serviceName}</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-bold text-[#2D1B14]">
                      {new Date(booking.date).toLocaleDateString('ar-SA')}
                    </div>
                    <div className="text-xs text-[#8D6E63]">{booking.time}</div>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-bold tracking-wide uppercase ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {booking.status === 'confirmed' ? 'مؤكد' : booking.status === 'cancelled' ? 'ملغي' : 'بانتظار التأكيد'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions / Tips - لمسة فندقية إضافية */}
        <div className="bg-[#3E2723] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">نصيحة إدارة الخريف</h3>
            <p className="text-[#D7CCC8] text-sm leading-relaxed mb-6">
              نزلاء الأجنحة الملكية يفضلون حجز خدمات "المساج بالأحجار الدافئة" خلال هذا الموسم. تأكد من توفر المختصين.
            </p>
            <button className="w-full bg-[#D35400] hover:bg-[#E67E22] text-white font-bold py-3 rounded-xl transition-colors text-sm">
              إرسال عرض ترويجي للنزلاء
            </button>
          </div>
          {/* خلفية جمالية */}
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <Sparkles size={200} />
          </div>
        </div>
      </div>
    </div>
  );
}
