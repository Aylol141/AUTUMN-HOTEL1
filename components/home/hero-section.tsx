'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, PlayCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
      
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
        {/* التظليل: زدناه قليلاً للموبايل عشان النصوص البيضاء تظهر بوضوح */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/50 shadow-[inset_0_0_150px_rgba(0,0,0,0.7)]" />
      </div>

      {/* 2. اسم الفندق Ghost خلفية سينمائية - مخفي في الموبايل الصغير جداً عشان الزحمة */}
      <div className="absolute inset-0 hidden sm:flex items-center justify-center z-10 pointer-events-none">
        <h1 className="text-[25vw] md:text-[20vw] font-black uppercase text-white/[0.03] tracking-[-0.05em] select-none italic whitespace-nowrap">
          Autumn
        </h1>
      </div>

      {/* 3. المحتوى العائم */}
      <div className="container mx-auto px-6 md:px-8 relative z-20">
        {/* جعلنا المحتوى يتوسط الشاشة في الموبايل وينحاز لليمين في اللابتوب */}
        <div className="max-w-4xl text-center md:text-right mr-auto md:mr-0 ml-auto flex flex-col items-center md:items-end">
          
          {/* Badge */}
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-6 md:mb-10">
            <span className="w-2 h-2 bg-[#dda15e] rounded-full animate-ping" />
            <span className="text-white/80 text-[8px] md:text-[10px] font-light tracking-[0.2em] md:tracking-[0.3em] uppercase">The Art of Living</span>
          </div>

          {/* العنوان - أيـ🍂ـلول */}
          <div className="mb-6 md:mb-10">
            <h2 className="text-6xl sm:text-7xl md:text-9xl font-serif text-white leading-none tracking-tighter mb-4 md:mb-8">
              أيـ🍂ـلول
            </h2>
            <p className="text-[#dda15e] text-xl md:text-4xl font-serif italic tracking-wide leading-snug">
              سكون المكان .. فخامة اللحظة
            </p>
          </div>

          {/* وصف قصير - غيرنا حدود الـ Border لتناسب المركزية في الموبايل */}
          <p className="text-base md:text-xl text-white/70 md:text-white/50 mb-8 md:mb-12 max-w-lg font-light leading-relaxed border-b-2 md:border-b-0 md:border-r-2 border-[#bc6c25] pb-4 md:pb-0 md:pr-8">
            أجنحة ملكية مصممة بعناية فائقة لتمنحك <br className="hidden md:block" />
            الخصوصية التي تليق بتطلعاتك وتفردك.
          </p>

          {/* الأزرار العائمة - flex-col للموبايل لتكون أسهل في الضغط */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-10 w-full md:w-auto">
            <Link href="/booking" className="w-full md:w-auto">
              <Button 
                size="lg" 
                className="w-full md:w-auto relative group h-14 md:h-16 px-12 bg-white text-black hover:bg-[#bc6c25] hover:text-white rounded-full transition-all duration-500 overflow-hidden shadow-2xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 font-bold text-base md:text-lg">
                  <Calendar className="w-5 h-5" />
                  احجز الآن
                </span>
                <div className="absolute inset-0 bg-[#bc6c25] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
            </Link>

            <Link href="/services" className="group flex items-center gap-4 text-white hover:text-[#dda15e] transition-colors">
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100">تصفح المرفق</span>
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#dda15e] transition-all group-hover:scale-110 backdrop-blur-sm">
                <PlayCircle className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* مؤشر النزول الجانبي - مخفي في الموبايل لتقليل التشتت */}
      <div className="absolute bottom-12 left-12 z-20 hidden md:flex items-center gap-4 -rotate-90 origin-left">
        <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-bold">Scroll to Explore</span>
        <div className="w-20 h-[1px] bg-white/10" />
      </div>

    </section>
  );
}