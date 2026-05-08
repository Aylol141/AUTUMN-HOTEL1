'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, PlayCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-start">
      
      {/* 1. فيديو الخلفية الكامل */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="h-full w-full object-cover scale-105"
        >
          <source src="/videos/WhatsApp Video 2026-05-05 at 11.31.01 PM.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 shadow-[inset_0_0_150px_rgba(0,0,0,0.7)]" />
      </div>

      {/* 2. اسم الفندق Ghost خلفية سينمائية */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <h1 className="text-[20vw] font-black uppercase text-white/[0.03] tracking-[-0.05em] select-none italic whitespace-nowrap">
          Autumn Resort
        </h1>
      </div>

      {/* 3. المحتوى العائم (الجهة اليمنى) */}
      <div className="container mx-auto px-8 relative z-20">
        <div className="max-w-4xl text-right mr-0 ml-auto flex flex-col items-end">
          
          {/* Badge */}
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-10">
            <span className="w-2 h-2 bg-[#dda15e] rounded-full animate-ping" />
            <span className="text-white/80 text-[10px] font-light tracking-[0.3em] uppercase">The Art of Living</span>
          </div>

          {/* العنوان - أيـ🍂ـلول */}
          <div className="mb-10 text-right">
            <h2 className="text-8xl md:text-9xl font-serif text-white leading-none tracking-tighter mb-8">
              أيـ🍂ـلول
            </h2>
            <p className="text-[#dda15e] text-2xl md:text-4xl font-serif italic tracking-wide leading-snug">
              سكون المكان .. فخامة اللحظة
            </p>
          </div>

          {/* وصف قصير */}
          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-lg font-light leading-relaxed border-r-2 border-[#bc6c25] pr-8">
            أجنحة ملكية مصممة بعناية فائقة لتمنحك <br />
            الخصوصية التي تليق بتطلعاتك وتفردك.
          </p>

          {/* الأزرار العائمة */}
          <div className="flex flex-row-reverse items-center gap-10">
            <Link href="/booking">
              <Button 
                size="lg" 
                className="relative group h-16 px-12 bg-white text-black hover:bg-[#bc6c25] hover:text-white rounded-full transition-all duration-500 overflow-hidden shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-3 font-bold text-lg">
                  <Calendar className="w-5 h-5" />
                  احجز الآن
                </span>
                <div className="absolute inset-0 bg-[#bc6c25] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
            </Link>

            <Link href="/services" className="group flex items-center gap-4 text-white hover:text-[#dda15e] transition-colors">
              <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100">تصفح المرفق</span>
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#dda15e] transition-all group-hover:scale-110 backdrop-blur-sm">
                <PlayCircle className="w-6 h-6" />
              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* مؤشر النزول الجانبي */}
      <div className="absolute bottom-12 left-12 z-20 flex items-center gap-4 -rotate-90 origin-left">
        <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-bold">Scroll to Explore</span>
        <div className="w-20 h-[1px] bg-white/10" />
      </div>

    </section>
  );
}