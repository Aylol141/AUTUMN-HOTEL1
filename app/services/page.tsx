'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { serviceCategoryLabels, type ServiceCategory } from '@/lib/types';
import { Clock, Star, ArrowLeft } from 'lucide-react';

// تم تعديل الـ keys لتطابق تماماً ما هو موجود في الـ Store ولوحة التحكم عندك
const categories: { key: ServiceCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'spa', label: 'سبا وجمال' },
  { key: 'fitness', label: 'رياضية' },
  { key: 'hotel', label: 'فندقية' },
  { key: 'extra', label: 'إضافية' },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const services = useStore((state) => state.services);

  // الفلترة الآن ستعمل بشكل مثالي لأن الـ keys تطابق الـ Store
  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter((service) => service.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f110c] text-right" dir="rtl">
      <Header />
      
      <main className="flex-1 relative">
        {/* الخلفية الثابتة البلورية */}
        <div className="fixed inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" 
            alt="Autumn Resort" 
            className="w-full h-full object-cover scale-110" 
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-48 pb-20 text-center">
          <div className="container mx-auto px-6">
            <span className="text-[#dda15e] text-xs font-bold uppercase tracking-[0.6em] mb-4 block">
              Pure Luxury Experience
            </span>
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 drop-shadow-2xl">
              خدماتنا
            </h1>
            <p className="text-white/80 text-xl max-w-2xl mx-auto font-light leading-relaxed backdrop-blur-sm bg-black/10 p-4 rounded-xl inline-block">
               مجموعة مختارة من أرقى الخدمات المصممة لتلبية تطلعاتكم في Autumn Hotel
            </p>
          </div>
        </section>

        {/* الأزرار البلورية - الفلترة الذكية */}
        <section className="sticky top-20 z-50 py-4 overflow-hidden">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 overflow-x-auto no-scrollbar shadow-2xl">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-500 whitespace-nowrap ${
                    activeCategory === category.key
                      ? 'bg-[#dda15e] text-white shadow-lg scale-105'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* شبكة الخدمات الديناميكية */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] overflow-hidden hover:bg-white/15 transition-all duration-700 shadow-2xl hover:-translate-y-2"
                >
                  {/* صورة الخدمة */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f110c]/80 to-transparent" />
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                        {serviceCategoryLabels[service.category]}
                      </div>
                    </div>
                  </div>

                  {/* تفاصيل الخدمة */}
                  <div className="p-8 text-white">
                    <div className="flex justify-end gap-1 mb-4">
                       {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-[#dda15e] text-[#dda15e] opacity-80" />)}
                    </div>
                    <h3 className="text-2xl font-serif mb-3 group-hover:text-[#dda15e] transition-colors tracking-wide">
                      {service.name}
                    </h3>
                    <p className="text-white/60 text-sm font-light mb-8 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div>
                        <span className="text-2xl font-serif text-[#dda15e] font-bold">{service.price}</span>
                        <span className="text-[10px] text-white/40 mr-1 uppercase">SAR</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-xs font-bold italic">
                         {service.duration} Min <Clock className="h-3 w-3 text-[#dda15e]" />
                      </div>
                    </div>

                    <Link href={`/booking?service=${service.id}`} className="block mt-8">
                      <Button className="w-full h-14 bg-white/5 hover:bg-[#dda15e] text-white rounded-2xl border border-white/10 hover:border-transparent transition-all duration-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                         <span>احجز هذه الخدمة</span>
                         <ArrowLeft className="mr-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* في حال كانت الفئة المختارة فارغة */}
            {filteredServices.length === 0 && (
              <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 max-w-2xl mx-auto">
                <p className="text-white/40 font-serif italic text-xl">
                  نعمل حالياً على إضافة خدمات مميزة لهذا القسم...
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
      
    </div>
  );
}