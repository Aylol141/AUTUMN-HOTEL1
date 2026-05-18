'use client';

import { useEffect, useState } from 'react';
import { useStore } from '../../../lib/store';
import type { Appointment } from '@/lib/types';
import { 
  Calendar, 
  BedDouble, 
  Sparkles, 
  Users, 
  MessageSquare, 
  DollarSign, 
  ArrowUpRight,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  // استخدام قيم افتراضية لضمان عدم حدوث خطأ إذا كان الـ Store فارغاً
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const products = useStore((state) => state.products) || [];
  const services = useStore((state) => state.services) || [];
  const messages = useStore((state) => state.messages) || [];
  const users = useStore((state) => state.users) || [];

  useEffect(() => {
    fetch('/api/bookings', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setAppointments(data))
      .catch((error) => console.error('Failed to load dashboard bookings:', error));
  }, []);

  // حساب الإحصائيات بأمان
  const pendingBookings = appointments.filter((b) => b.status === 'pending').length;
  const unreadMessages = messages.filter((m) => !m.read).length;
  // أضفت Check بسيط للتأكد من أن السعر رقم
  const totalRevenue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0); 

  const stats = [
    {
      title: 'إجمالي القيمة التقديرية',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-[#D35400]', 
      href: '#',
      trend: '+12% هذا الشهر',
    },
    {
      title: 'الحجوزات النشطة',
      value: appointments.length,
      icon: Calendar,
      color: 'bg-[#3E2723]', 
      href: '/dashboard/admin/bookings',
      badge: pendingBookings > 0 ? `${pendingBookings} معلق` : null,
    },
    {
      title: 'الأجنحة والغرف',
      value: products.length,
      icon: BedDouble,
      color: 'bg-[#5D4037]', 
      href: '/dashboard/admin/rooms',
    },
    {
      title: 'الخدمات المتاحة',
      value: services.length,
      icon: Sparkles,
      color: 'bg-[#E67E22]', 
      href: '/dashboard/admin/services',
    },
    {
      title: 'إجمالي المسجلين',
      value: users.length,
      icon: Users,
      color: 'bg-[#8D6E63]',
      href: '/dashboard/admin/customers',
    },
    {
      title: 'رسائل التواصل',
      value: messages.length,
      icon: MessageSquare,
      color: 'bg-[#2D1B14]', 
      href: '/dashboard/admin/messages',
      badge: unreadMessages > 0 ? `${unreadMessages} رسالة` : null,
    },
  ];

  // أخذ آخر 5 حجوزات مع التأكد من وجود مصفوفة
  const recentBookings = [...appointments].slice(-5).reverse();

  return (
    <div className="space-y-6 md:space-y-8 text-right pb-10" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2D1B14]">لوحة تحكم ريزورت أيلول</h1>
          <p className="text-[#8D6E63] mt-1 text-sm md:text-base">إدارة الأجنحة، الحجوزات، والخدمات الفندقية.</p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-[#D7CCC8] flex items-center gap-3 w-fit">
           <div className="bg-[#D35400] p-2 rounded-xl text-white">
              <LayoutDashboard size={20} />
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest pl-3 text-[#3E2723]">Admin Portal</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="group bg-white rounded-2xl border border-[#D7CCC8] p-5 md:p-6 hover:border-[#D35400] transition-all shadow-sm hover:shadow-xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              {stat.badge && (
                <span className="bg-[#D35400] text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                  {stat.badge}
                </span>
              )}
            </div>
            
            <div className="mt-4">
              <div className="text-2xl md:text-3xl font-black text-[#2D1B14]">{stat.value}</div>
              <div className="text-[#8D6E63] text-sm md:text-base font-medium mt-1">{stat.title}</div>
            </div>

            {stat.trend && (
              <div className="mt-3 flex items-center text-[10px] md:text-xs text-green-600 font-bold">
                <ArrowUpRight className="h-3 w-3 ml-1" />
                {stat.trend}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#D7CCC8] p-5 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#F4ECE8] p-2 rounded-lg">
                <Clock className="h-5 w-5 text-[#D35400]" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#2D1B14]">آخر عمليات الحجز</h2>
            </div>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[#F4ECE8] rounded-2xl">
              <p className="text-[#8D6E63] text-sm">لا توجد حجوزات في النظام حالياً</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#FDF8F5] hover:bg-[#F4ECE8] rounded-2xl transition-colors border border-transparent hover:border-[#D7CCC8] gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#3E2723] flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                      {(booking.customerName || booking.name || 'G').charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[#2D1B14] text-sm md:text-base">
                        {booking.customerName || booking.name || 'ضيف خارجي'}
                      </div>
                      <div className="text-[10px] md:text-xs text-[#8D6E63] font-medium">
                        {booking.serviceName || booking.packageName || 'حجز جناح'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-auto flex justify-end">
                    <span
                      className={`px-3 md:px-4 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold tracking-wide whitespace-nowrap ${
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="bg-[#3E2723] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[250px]">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">نظام "أيلول" الإداري</h3>
            <p className="text-[#D7CCC8] text-sm leading-relaxed mb-6">
              تم تحديث النظام ليتوافق مع إدارة المنتجعات الصحية. يمكنك الآن متابعة جلسات المساج وحجوزات الأجنحة في مكان واحد.
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] md:text-xs text-amber-200 italic text-center">
              "الفخامة في التفاصيل، والراحة في التنظيم."
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
            <BedDouble size={200} />
          </div>
        </div>
      </div>
    </div>
  );
}
