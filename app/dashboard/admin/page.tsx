'use client';

import { useStore } from '../../../lib/store'; // تأكدي من المسار بناءً على مكان الملف في المجلدات
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
  // جلب البيانات من الستور الجديد بالأسماء الصحيحة
  const appointments = useStore((state) => state.appointments || []);
  const products = useStore((state) => state.products || []);
  const services = useStore((state) => state.services || []);
  const messages = useStore((state) => state.messages || []);
  const users = useStore((state) => state.users || []);

  // حساب الإحصائيات بناءً على الأسماء الجديدة
  const pendingBookings = appointments.filter((b) => b.status === 'pending').length;
  const unreadMessages = messages.filter((m) => !m.read).length;
  
  // الإيرادات (بفرض أن الطلبات مخزنة في الستور أو حسابها من المنتجات)
  const totalRevenue = products.reduce((acc, p) => acc + (p.price || 0), 0); 

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

  // أخذ آخر 5 حجوزات للعرض
  const recentBookings = [...appointments].slice(-5).reverse();

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-[#2D1B14]">لوحة تحكم ريزورت أيلول</h1>
        <p className="text-[#8D6E63] mt-1">إدارة الأجنحة، الحجوزات، والخدمات الفندقية.</p>
      </div>

      {/* شبكة الإحصائيات */}
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
        {/* جدول الحجوزات الأخيرة */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#D7CCC8] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#F4ECE8] p-2 rounded-lg">
                <Clock className="h-5 w-5 text-[#D35400]" />
              </div>
              <h2 className="text-xl font-bold text-[#2D1B14]">آخر عمليات الحجز</h2>
            </div>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[#F4ECE8] rounded-2xl">
              <p className="text-[#8D6E63]">لا توجد حجوزات في النظام حالياً</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="group flex items-center justify-between p-4 bg-[#FDF8F5] hover:bg-[#F4ECE8] rounded-2xl transition-colors border border-transparent hover:border-[#D7CCC8]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#3E2723] flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {booking.patientName?.charAt(0) || 'G'}
                    </div>
                    <div>
                      <div className="font-bold text-[#2D1B14]">{booking.patientName}</div>
                      <div className="text-xs text-[#8D6E63] font-medium">{booking.serviceName}</div>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-bold tracking-wide ${
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

        {/* كرت جانبي ترويجي */}
        <div className="bg-[#3E2723] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">نظام "أيلول" الإداري</h3>
            <p className="text-[#D7CCC8] text-sm leading-relaxed mb-6">
              تم تحديث النظام ليتوافق مع إدارة المنتجعات الصحية. يمكنك الآن متابعة جلسات المساج وحجوزات الأجنحة في مكان واحد.
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-amber-200 italic">
              "الفخامة في التفاصيل، والراحة في التنظيم."
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <BedDouble size={200} />
          </div>
        </div>
      </div>
    </div>
  );
}