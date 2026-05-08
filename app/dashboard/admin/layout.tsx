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

// قائمة التنقل المحدثة لفندق Autumn
const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'الحجوزات', icon: Calendar },
  { href: '/admin/rooms', label: 'الغرف والأجنحة', icon: BedDouble },
  { 
    href: '/admin/services', 
    label: 'الخدمات ', 
    icon: Sparkles 
  },
  { href: '/admin/guests', label: 'النزلاء', icon: Users },
  { href: '/admin/messages', label: 'الرسائل والبلاغات', icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminLoggedIn = useStore((state) => state.isAdminLoggedIn);
  const adminLogout = useStore((state) => state.adminLogout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAdminLoggedIn && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, pathname, router, mounted]);

  // شاشة التحميل بهوية الخريف
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2D1B14]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D35400] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#E67E22] font-medium animate-pulse">Autumn Hotel Systems...</p>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    adminLogout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5]"> {/* خلفية فاتحة دافئة للمحتوى */}
      
      {/* الهيدر للموبايل */}
      <header className="lg:hidden sticky top-0 z-50 bg-[#3E2723] border-b border-[#2D1B14] p-4 flex items-center justify-between text-white">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6 text-[#E67E22]" />
        </Button>
        <span className="font-bold text-[#E67E22] tracking-wider">AUTUMN ADMIN</span>
        <div className="w-10" />
      </header>

      {/* غطاء الشاشة عند فتح المنيو في الموبايل */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* القائمة الجانبية (Sidebar) */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-[#3E2723] text-white z-50 shadow-2xl transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* منطقة الشعار */}
        <div className="p-8 border-b border-[#2D1B14] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D35400] flex items-center justify-center shadow-inner rotate-3">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
             <span className="font-black text-xl tracking-tighter text-white">AUTUMN</span>
             <span className="text-[10px] text-[#E67E22] font-bold tracking-[0.3em] -mt-1">HOTEL & RESORT</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute left-2 top-2 text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* الروابط */}
        <nav className="p-6 mt-2 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-[#D35400] text-white shadow-lg shadow-orange-950/40 translate-x-[-5px]'
                    : 'hover:bg-[#2D1B14] text-[#BCAAA4] hover:text-[#E67E22]'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#D35400] group-hover:scale-110 transition-transform'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* زر تسجيل الخروج */}
        <div className="absolute bottom-0 right-0 left-0 p-6 border-t border-[#2D1B14] bg-[#2D1B14]/40">
          <Button
            variant="ghost"
            className="w-full text-[#BCAAA4] hover:bg-[#D35400] hover:text-white justify-start gap-4 h-12 rounded-xl transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-bold">تسجيل الخروج</span>
          </Button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className={`lg:mr-72 min-h-screen transition-all duration-500`}>
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}