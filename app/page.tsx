import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { HeroSection } from '@/components/home/hero-section';
import { AboutSection } from '@/components/home/about-section';
import { ServicesSection } from '@/components/home/services-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. الهيدر */}
      <Header />
      
      <main className="flex-1">
        {/* 2. قسم الهيرو (الفيديو) */}
        <HeroSection />
        
        {/* 3. من نحن */}
        <AboutSection />
        
        {/* 4. الخدمات والغرف */}
        <ServicesSection />
        
        {/* 5. آراء العملاء */}
        <TestimonialsSection />
        
        {/* 6. دعوة للحجز */}
        <CTASection />
      </main>

     

      {/* 8. الفوتر */}
      <Footer />
    </div>
  );
}