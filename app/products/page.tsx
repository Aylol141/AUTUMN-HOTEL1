'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { 
  Bed, Users, Maximize, Star, Wifi, ArrowRight 
} from 'lucide-react';

export default function ProductsPage() {
  const products = useStore((state) => state.products) || [];
  const [activeFilter, setActiveFilter] = useState<'all' | 'suite' | 'room'>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredRooms = useMemo(() => {
    return activeFilter === 'all' 
      ? products 
      : products.filter(p => p.category === activeFilter);
  }, [products, activeFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d09] text-right font-sans" dir="rtl">
      <Header />
      
      <main className="flex-1 relative">
        {/* الخلفية كما هي */}
        <div className="fixed inset-0 z-0">
          <img 
            src="https://i.pinimg.com/1200x/6f/78/82/6f7882c0fdf3cd02250abe50c6e5e595.jpg" 
            className="w-full h-full object-cover scale-110 opacity-30 brightness-50" 
            alt="Luxury Background"
          />
         // لتكون الشفافية 50% مثلاً
<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </div>

        {/* القسم العلوي ثابت */}
        <section className={`relative z-10 pt-48 pb-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-6 text-center">
            <span className="text-[#dda15e] text-sm font-bold uppercase tracking-[0.5em] mb-4 block">Autumn Luxury Stay</span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-8">إقامة تفوق <span className="text-[#dda15e]">الخيال</span></h1>
          </div>
        </section>

        {/* الفلترة ثابتة */}
        <div className="sticky top-20 z-50 py-6 flex justify-center">
          <div className="flex gap-2 p-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl">
            {[{ id: 'all', label: 'كافة الوحدات' }, { id: 'room', label: 'الغرف الملكية' }, { id: 'suite', label: 'الأجنحة الفاخرة' }].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-10 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ${
                  activeFilter === tab.id ? 'bg-[#dda15e] text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* شبكة العرض المعدلة (هنا تم التصغير) */}
        <section className="relative z-10 container mx-auto px-6 pb-32">
          {/* تم تغيير lg:grid-cols-2 إلى lg:grid-cols-3 لتقليص حجم الكارد */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((product) => (
              <div key={product.id} className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-[#dda15e]/40 transition-all duration-500">
                
                {/* الصورة: ارتفاع متناسق h-56 */}
                <div className="relative h-56 overflow-hidden">
                  <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 text-[#dda15e] font-bold text-sm">
                    {product.price} USD
                  </div>
                </div>

                {/* المحتوى: مسافات p-8 تجعل الكارد أنيقاً وملموماً */}
                <div className="p-8 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-serif">{product.name}</h3>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={10} className="fill-[#dda15e] text-[#dda15e]" />)}
                    </div>
                  </div>
                  
                  <p className="text-white/40 text-xs mb-6 h-10 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* الخدمات: تم تصغير حجمها لتناسب الكارد الجديد */}
                  <div className="grid grid-cols-3 gap-2 mb-8">
                    <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/5">
                      <Maximize size={16} className="text-[#dda15e]" />
                      <span className="text-[10px] text-white/50">45 م²</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/5">
                      <Users size={16} className="text-[#dda15e]" />
                      <span className="text-[10px] text-white/50">2 ضيوف</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/5">
                      <Wifi size={16} className="text-[#dda15e]" />
                      <span className="text-[10px] text-white/50">مجاني</span>
                    </div>
                  </div>

                  <Link href={`/booking?room=${product.id}`}>
                    <Button className="w-full h-12 bg-[#dda15e] hover:bg-white hover:text-black text-black font-bold text-sm rounded-xl transition-all duration-500 shadow-lg shadow-[#dda15e]/10">
                      احجز الآن
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      
    </div>
  );
}