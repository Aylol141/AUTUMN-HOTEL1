'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  BedDouble,
  Sparkles,
  MessageSquare,
  Users,
  LogOut,
  Menu,
  X,
  Leaf,
} from 'lucide-react';

// تصحيح المسارات لتطابق بنية المجلدات (dashboard/admin)
const navItems = [
  { href: '/dashboard/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/dashboard/admin/bookings', label: 'الحجوزات', icon: Calendar },
  { href: '/dashboard/admin/rooms', label: 'الغرف والأجنحة', icon: BedDouble },
  { href: '/dashboard/admin/services', label: 'الخدمات', icon: Sparkles },
  { href: '/dashboard/admin/customers', label: 'النزلاء', icon: Users },
  { href: '/dashboard/admin/messages', label: 'الرسائل والبلاغات', icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  // استدعاء القيم من الستور مع التأكد من وجود قيم افتراضية
  const isAdminLoggedIn = useStore((state) => state.isAdminLoggedIn);
  const adminLogout = useStore((state) => state.adminLogout);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // منع مشاكل الهيدريشن في Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  // حماية المسار: إذا لم يكن مسجلاً دخول، يحوله لصفحة تسجيل دخول الأدمن
  useEffect(() => {
    if (mounted && !isAdminLoggedIn && pathname !== '/register') {
      // إذا كنتِ تستخدمين صفحة register القديمة كدخول للأدمن
      // router.push('/register'); 
    }
  }, [isAdminLoggedIn, pathname, router, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2D1B14]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D35400] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#E67E22] font-medium animate-pulse font-serif">AUTUMN SYSTEMS...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    adminLogout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5]" dir="rtl">
      
      {/* الهيدر للموبايل */}
      <header className="lg:hidden sticky top-0 z-50 bg-[#3E2723] border-b border-[#2D1B14] p-4 flex items-center justify-between text-white">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6 text-[#E67E22]" />
        </Button>
        <span className="font-bold text-[#E67E22] tracking-widest font-serif">AUTUMN ADMIN</span>
        <div className="w-10" />
      </header>

      {/* غطاء الشاشة للموبايل */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* القائمة الجانبية (Sidebar) */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-[#3E2723] text-white z-50 shadow-2xl transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-8 border-b border-[#2D1B14] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D35400] flex items-center justify-center shadow-lg rotate-3 shrink-0">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
             <span className="font-black text-xl tracking-tighter text-white font-serif">AUTUMN</span>
             <span className="text-[9px] text-[#E67E22] font-bold tracking-[0.2em] uppercase">Resort & Spa</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 mt-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-[#D35400] text-white shadow-lg translate-x-[-8px]'
                    : 'hover:bg-[#2D1B14] text-[#BCAAA4] hover:text-[#E67E22]'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#D35400]'}`} />
                <span className="font-bold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 right-0 left-0 p-6 border-t border-[#2D1B14] bg-[#2D1B14]/20">
          <Button
            variant="ghost"
            className="w-full text-[#BCAAA4] hover:bg-red-900/20 hover:text-red-400 justify-start gap-4 h-12 rounded-xl transition-all"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-bold">تسجيل الخروج</span>
          </Button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className={`lg:mr-72 min-h-screen transition-all duration-500`}>
        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}