'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, UserCircle } from 'lucide-react'; // حذفنا ShoppingBag
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useStore } from '@/lib/store';
import { LoginForm } from '@/components/auth/login-form';

// التعديل هنا فقط في الروابط (تغيير اسم التبويب)
const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/services', label: 'عن الفندق' },
  { href: '/products', label: 'الأجنحة والغرف' },
  { href: '/booking', label: 'الحجوزات' },
  { href: '/discover', label: 'لماذا Autumn؟' }, // التبويب الجديد مكان "تواصل معنا"
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        
        {/* جهة اليسار: تسجيل الدخول فقط (بعد حذف السلة) */}
        <div className="flex items-center gap-6 order-first">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="hidden md:flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 rounded-none border-l border-white/10 pl-6 transition-all"
              >
                <UserCircle className="h-5 w-5 text-[#dda15e]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">تسجيل الدخول</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 border-none bg-transparent shadow-none">
                <LoginForm />
            </DialogContent>
          </Dialog>
          {/* تم حذف كود السلة من هنا تماماً */}
        </div>

        {/* روابط التنقل (الوسط) - نفس ترتيبك الأصلي مع تنسيق أرقى */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] transition-all hover:text-[#dda15e] relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 right-0 w-0 h-[1px] bg-[#dda15e] transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* اللوجو (اليمين) - حافظنا على مكانه وترتيبه */}
        <Link href="/" className="flex items-center gap-4 order-last group">
          <div className="text-right">
            <span style={{ fontFamily: 'AutumnFont' }} className="block text-xl font-bold text-white tracking-tighter leading-none group-hover:text-[#dda15e] transition-colors">
              AUTUMN
            </span>
            <span className="text-[9px] text-white/40 tracking-[0.4em] uppercase font-light italic">Resort</span>
          </div>
          <div className="h-10 w-[1px] bg-white/20 rotate-[25deg] mx-1" />
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm group-hover:border-[#dda15e]/50 transition-all">
              <div className="w-1.5 h-1.5 bg-[#bc6c25] rounded-full shadow-[0_0_10px_#bc6c25]" />
          </div>
        </Link>

        {/* الموبايل منيو - نفس المنطق الأصلي */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full bg-black/95 border-white/10 text-white flex flex-col justify-center items-center">
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-light text-white/70 hover:text-[#dda15e] transition-colors"
                  style={{ fontFamily: 'AutumnFont' }}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-[1px] w-20 bg-white/10 mx-auto my-4" />
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-[#bc6c25] text-[#dda15e] hover:bg-[#bc6c25] hover:text-white rounded-none px-10">
                    تسجيل الدخول
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 border-none bg-transparent shadow-none">
                  <LoginForm />
                </DialogContent>
              </Dialog>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}