'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck, MapPin, Coffee, ArrowLeft, Crown } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    id: "01",
    title: "ملاذ الخصوصية التامة",
    highlight: "بعيداً عن الضجيج، قريباً من ذاتك.",
    desc: "في Autumn، صممنا نظام عزل صوتي وحماية فائقة لتنعم بهدوء ملكي لا يقطعه أحد.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80",
    icon: <ShieldCheck className="text-[#dda15e]" size={32} />
  },
  {
    id: "02",
    title: "خدمة الـ Concierge الشخصية",
    highlight: "لسنا مجرد فندق، نحن فريق في خدمتك.",
    desc: "منذ لحظة وصولك وحتى المغادرة، مساعدك الشخصي جاهز لتلبية أدق تفاصيل طلباتك فوراً.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
    icon: <Crown className="text-[#dda15e]" size={32} />
  },
  {
    id: "03",
    title: "موقع استراتيجي ملهم",
    highlight: "في قلب إدلب، وبإطلالة لا تنسى.",
    desc: "موقعنا يجمع بين سهولة الوصول وبين الإطلالة التي تمنحك شعوراً بأنك فوق السحاب.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80",
    icon: <MapPin className="text-[#dda15e]" size={32} />
  }
];

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans relative overflow-hidden" dir="rtl">
      
      {/* تأثيرات الخلفية - أضواء خافتة */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#dda15e]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.02] blur-[100px] rounded-full" />
      </div>

      <Header />

      <main className="relative z-10">
        {/* قسم البداية: فيديو بخلفية كاملة مع عنوان قوي */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          {/* طبقة بلورية ناعمة فوق الفيديو */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-black/60" />
          
          <div className="relative z-10 text-center space-y-8 px-6">
            <div className="flex justify-center mb-4">
              <div className="px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[#dda15e] text-[10px] tracking-[0.5em] uppercase">
                The Elite Choice
              </div>
            </div>
            <h1 style={{ fontFamily: 'AutumnFont' }} className="text-7xl md:text-[11rem] leading-none font-bold tracking-tighter transition-all">
              لماذا <span className="text-[#dda15e]">AUTUMN؟</span>
            </h1>
            <p className="text-white/80 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
              لأنك لا تبحث عن مجرد إقامة، بل تبحث عن <span className="text-[#dda15e] font-bold underline underline-offset-8">الفرق</span> الذي تعيشه في أدق التفاصيل.
            </p>
          </div>
        </section>

        {/* قسم نقاط القوة - تأثير البطاقات العملاقة (Immersive Cards) */}
        <section className="py-20 space-y-40 container mx-auto px-6">
          {features.map((item, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
              
              {/* الصورة */}
              <div className="lg:w-3/5 relative group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-[#dda15e]/10 mix-blend-overlay z-10" />
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-[500px] object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />
                <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 z-20 shadow-xl">
                  <span className="text-[#dda15e] font-black text-xl tracking-widest">{item.id}</span>
                </div>
              </div>

              {/* النص - مع خلفية زجاجية خفيفة جداً */}
              <div className="lg:w-2/5 space-y-6 p-8 bg-white/[0.01] backdrop-blur-sm rounded-[2rem] border border-white/5">
                <div className="w-16 h-16 bg-[#dda15e]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#dda15e]/20 shadow-lg shadow-[#dda15e]/5">
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: 'AutumnFont' }} className="text-4xl md:text-5xl font-bold tracking-tight">{item.title}</h3>
                <h4 className="text-[#dda15e] text-xl font-medium tracking-tight uppercase">{item.highlight}</h4>
                <p className="text-white/50 text-lg leading-relaxed font-light">
                  {item.desc}
                </p>
                <div className="pt-6">
                   <div className="h-px w-full bg-gradient-to-l from-[#dda15e]/50 via-[#dda15e]/10 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* قسم "الرقم الصعب" - إحصائية بلمسة بلورية */}
        <section className="py-40 relative overflow-hidden border-y border-white/5 bg-white/[0.01] backdrop-blur-sm">
          <div className="absolute left-0 top-0 text-[30vw] font-black text-white/[0.01] leading-none select-none italic pointer-events-none">AUTUMN</div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 style={{ fontFamily: 'AutumnFont' }} className="text-5xl md:text-7xl mb-10 tracking-tighter">أكثر من مجرد عنوان..</h2>
            <p className="text-[#dda15e] text-2xl md:text-3xl font-medium mb-16 tracking-wide">هي التجربة التي ستعيد تعريف مفهومك للراحة.</p>
            <div className="flex flex-wrap justify-center gap-16 md:gap-24">
               {[
                 { val: "100%", label: "خصوصية وأمان" },
                 { val: "24/7", label: "خدمة عملاء ملكية" },
                 { val: "5 Stars", label: "تقييم ضيوفنا" }
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center">
                    <div className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-b from-white to-[#dda15e]/40 bg-clip-text text-transparent italic">{stat.val}</div>
                    <div className="text-white/30 text-xs font-bold uppercase tracking-[0.3em]">{stat.label}</div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* الحجز النهائي - زر عملاق ومغري */}
        <section className="py-52 text-center relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#dda15e]/10 blur-[100px] rounded-full pointer-events-none" />
           <h3 className="text-2xl mb-16 text-white/40 font-light tracking-widest uppercase">هل أنت مستعد لتكون جزءاً من هذا العالم؟</h3>
           <Link href="/booking">
            <Button className="group relative bg-white text-black hover:bg-[#dda15e] hover:text-white rounded-full px-20 h-24 text-3xl font-black transition-all duration-700 shadow-2xl hover:shadow-[#dda15e]/30 overflow-hidden">
              <span className="relative z-10 flex items-center gap-6">
                احجز إقامتك الاستثنائية
                <ArrowLeft size={36} className="group-hover:-translate-x-4 transition-transform duration-500" />
              </span>
              <div className="absolute inset-0 bg-[#dda15e] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>
           </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}