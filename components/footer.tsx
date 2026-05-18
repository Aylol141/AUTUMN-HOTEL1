'use client';

import Link from 'next/link';
import { Phone, MapPin, Instagram, Facebook, Twitter, Mail, ArrowUpLeft } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080808] text-white pt-24 pb-12 relative overflow-hidden">
      {/* نص خلفي ضخم وشفاف يعطي لمسة فنية غير مطروقة */}
      <div className="absolute -bottom-10 left-0 right-0 text-center pointer-events-none select-none opacity-[0.02] font-serif font-bold text-[15vw] leading-none uppercase">
        Autumn Resort
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-20">
          
          {/* الجزء العلوي: شعار وزر العودة للأعلى */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
            <div className="space-y-4 text-right md:text-right w-full md:w-auto">
              <span className="text-4xl md:text-6xl font-serif font-medium tracking-tighter text-[#dda15e]">
                AUTUMN
              </span>
              <p className="text-white/40 text-sm max-w-sm mr-auto md:mr-0 font-light leading-relaxed">
                حيث تلتقي فخامة أيلول بسكون الطبيعة. نحن هنا لنصنع من إقامتكم حكاية تروى.
              </p>
            </div>
            
            <button 
              onClick={scrollToTop}
              className="group flex items-center gap-3 text-[#dda15e] text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-all"
            >
              <span>العودة للأعلى</span>
              <div className="h-12 w-12 border border-[#dda15e]/30 rounded-full flex items-center justify-center group-hover:bg-[#dda15e] group-hover:text-black transition-all">
                <ArrowUpLeft className="h-5 w-5" />
              </div>
            </button>
          </div>

          {/* الجزء الأوسط: روابط وتواصل بشكل أفقي ناعم */}
          <div className="flex flex-wrap justify-between items-start gap-y-12 gap-x-6 text-right" dir="rtl">
            
            {/* القائمة */}
            <div className="space-y-6">
              <h4 className="text-[#dda15e] text-[10px] uppercase tracking-[0.3em]">الوصول السريع</h4>
              <nav className="flex flex-col gap-3">
                {['الرئيسية', 'الأجنحة', 'المرافق', 'احجز الآن'].map((item) => (
                  <Link key={item} href="#" className="text-lg font-light text-white/60 hover:text-[#dda15e] transition-colors">
                    {item}
                  </Link>
                ))}
              </nav>
            </div>

            {/* التواصل */}
            <div className="space-y-6">
              <h4 className="text-[#dda15e] text-[10px] uppercase tracking-[0.3em]">ابقَ على اتصال</h4>
              <div className="flex flex-col gap-4">
                <a href="tel:+966501234567" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                  <span dir="ltr" className="font-light">+966 50 123 4567</span>
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#dda15e]/10">
                    <Phone className="h-3 w-3 text-[#dda15e]" />
                  </div>
                </a>
                <a href="mailto:info@autumn.com" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                  <span className="font-light">info@autumn-resort.com</span>
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#dda15e]/10">
                    <Mail className="h-3 w-3 text-[#dda15e]" />
                  </div>
                </a>
              </div>
            </div>

            {/* الموقع */}
            <div className="space-y-6">
              <h4 className="text-[#dda15e] text-[10px] uppercase tracking-[0.3em]">موقعنا</h4>
              <div className="flex items-start gap-3 text-white/60">
                <p className="max-w-[150px] font-light leading-loose text-sm">
                  سوريا، إدلب<br />
                  بجانب الطبيعة الخلابة
                </p>
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-[#dda15e]" />
                </div>
              </div>
            </div>

            {/* التواصل الاجتماعي */}
            <div className="space-y-6">
              <h4 className="text-[#dda15e] text-[10px] uppercase tracking-[0.3em]">تابعنا</h4>
              <div className="flex gap-3">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="h-12 w-12 flex items-center justify-center border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* الحقوق السفلى */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] text-white/20 tracking-[0.5em] uppercase order-2 md:order-1">
              &copy; {new Date().getFullYear()} Autumn Resort . Crafted for Luxury
            </p>
            <div className="flex gap-8 order-1 md:order-2">
              <Link href="#" className="text-[9px] text-white/40 tracking-[0.2em] uppercase hover:text-[#dda15e]">Privacy Policy</Link>
              <Link href="#" className="text-[9px] text-white/40 tracking-[0.2em] uppercase hover:text-[#dda15e]">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}