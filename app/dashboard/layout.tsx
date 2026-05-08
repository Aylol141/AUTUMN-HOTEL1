'use client';

import { useStore } from '../../lib/store'; 
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, CalendarCheck, Home, LogOut, UserCircle } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // تعديل التوجيه: إذا لم يوجد مستخدم، يذهب للصفحة الرئيسية "/"
  useEffect(() => {
    if (isMounted && !currentUser) {
      router.replace('/'); 
    }
  }, [currentUser, router, isMounted]);

  if (!isMounted || !currentUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fdfcfb]">
        <div className="animate-pulse text-amber-900 font-serif">جاري تحضير تجربة أيلول...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fdfcfb]" dir="rtl">
      {/* القائمة الجانبية */}
      <aside className="w-72 bg-[#1c0f0a] text-white flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.1)] relative z-20">
        <div className="p-10 text-center border-b border-white/5">
          <h2 className="text-3xl font-serif font-bold text-amber-200 tracking-tighter">أيلول</h2>
          <p className="text-[9px] tracking-[0.3em] text-amber-500/60 uppercase italic mt-2">Resort & Spa</p>
        </div>

        <nav className="flex-1 p-6 space-y-3 mt-4 text-right">
          <p className="text-[10px] text-white/30 mr-3 mb-4 uppercase tracking-widest">القائمة الإدارية</p>
          
          {currentUser.role === 'admin' && (
            <Link 
              href="/dashboard/admin" 
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 font-medium ${pathname === '/dashboard/admin' ? 'bg-amber-600 text-white shadow-lg' : 'hover:bg-white/5 text-stone-400'}`}
            >
              <LayoutDashboard size={20} /> لوحة الإدارة
            </Link>
          )}

          {(currentUser.role === 'secretary' || currentUser.role === 'admin') && (
            <Link 
              href="/dashboard/secretary" 
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 font-medium ${pathname === '/dashboard/secretary' ? 'bg-amber-600 text-white shadow-lg' : 'hover:bg-white/5 text-stone-400'}`}
            >
              <CalendarCheck size={20} /> إدارة المواعيد
            </Link>
          )}

          {currentUser.role === 'guest' && (
            <Link 
              href="/dashboard/guest" 
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 font-medium ${pathname === '/dashboard/guest' ? 'bg-amber-800/40 text-white' : 'hover:bg-white/5 text-stone-400'}`}
            >
              <Home size={20} /> واجهة النزيل
            </Link>
          )}
        </nav>

        <div className="p-6 border-t border-white/5 bg-white/2">
          <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white shadow-inner">
              <UserCircle size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-stone-100">{currentUser.name}</p>
              <p className="text-[9px] text-amber-500/60 italic font-medium uppercase tracking-tighter">
                {currentUser.role === 'secretary' ? 'مكتب الاستقبال' : currentUser.role}
              </p>
            </div>
          </div>
          
          {/* زر تسجيل الخروج: يقوم بمسح الحالة والتوجه للرئيسية فوراً */}
          <button 
            onClick={() => { 
              logout(); 
              router.push('/'); // التوجه للرئيسية
            }}
            className="w-full p-4 bg-red-950/20 hover:bg-red-900/40 rounded-2xl text-red-400 text-xs font-bold transition-all border border-red-900/10 flex items-center justify-center gap-2 group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <div className="p-12 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}