import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Phone } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0b0d09]">
      {/* خلفية بتدرج خريفي دافئ بدلاً من الوردي والأزرق */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2c1810] via-[#dda15e]/20 to-[#0b0d09] opacity-60" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance tracking-tight">
            استعد لتجربة إقامة استثنائية
          </h2>
          
          <p className="text-white/70 text-lg md:text-xl mb-10 leading-relaxed font-normal">
            احجز جناحك الآن واستمتع بلحظات من الخصوصية والرفاهية في قلب الطبيعة الخريفية.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/booking" className="w-full sm:w-auto">
              <Button 
                size="xl" 
                className="w-full sm:w-auto text-lg px-10 py-7 rounded-full bg-[#dda15e] text-[#2c1810] hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-[#dda15e]/10"
              >
                <Calendar className="ml-2 h-5 w-5" />
                احجز الآن
              </Button>
            </Link>
            
            <a href="tel:+966501234567" className="w-full sm:w-auto">
              <Button 
                size="xl" 
                variant="outline" 
                className="w-full sm:w-auto text-lg px-10 py-7 rounded-full border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                <Phone className="ml-2 h-5 w-5" />
                اتصل بنا
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* لمسة فنية لخلفية خريفية ناعمة */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#dda15e]/10 blur-[120px] rounded-full" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2c1810]/40 blur-[120px] rounded-full" />
    </section>
  );
}