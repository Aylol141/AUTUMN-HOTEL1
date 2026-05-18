'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { Phone, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const store = useStore() as any;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      name, phone, message,
      createdAt: new Date().toISOString(),
      read: false
    };

    if (store.addMessage) {
      store.addMessage(newMessage);
      setIsSubmitted(true);
      setName(''); setPhone(''); setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-right font-sans relative overflow-hidden dark" dir="rtl">
      
      {/* 1. خلفية الصورة مع طبقة تعتيم متوازنة */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" 
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" /> 
      </div>

      <Header />
      
      <main className="flex-1 relative pt-32 pb-20 container mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 2. بطاقة إرسال رسالة (تأثير الزجاج المتوازن) */}
          <div className="lg:col-span-7 bg-white/[0.08] backdrop-blur-[25px] p-12 shadow-2xl flex flex-col border border-white/20 rounded-[4rem]">
            <h2 className="text-3xl text-white font-medium mb-10 pr-2">ارسال رسالة</h2>
            
            {isSubmitted ? (
              <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                <CheckCircle className="h-16 w-16 text-[#b07d3e] mb-4" />
                <p className="text-white text-xl font-light">تم استلام رسالتكِ بنجاح</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                <Input 
                  placeholder="الاسم الكريم" 
                  value={name} onChange={(e) => setName(e.target.value)} required
                  className="bg-white/5 border border-white/10 h-16 rounded-full text-white placeholder:text-gray-400 px-8 text-lg focus:ring-1 focus:ring-[#b07d3e]/50 transition-all"
                />
                <Input 
                  placeholder="رقم الجوال" 
                  value={phone} onChange={(e) => setPhone(e.target.value)} required
                  className="bg-white/5 border border-white/10 h-16 rounded-full text-white placeholder:text-gray-400 px-8 text-lg text-right focus:ring-1 focus:ring-[#b07d3e]/50 transition-all"
                />
                <textarea 
                  placeholder="رسالتك" 
                  value={message} onChange={(e) => setMessage(e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 rounded-[3rem] min-h-[220px] text-white placeholder:text-gray-400 p-8 text-lg focus:outline-none focus:ring-1 focus:ring-[#b07d3e]/50 resize-none transition-all"
                />
                <Button type="submit" className="mt-auto w-full bg-[#b07d3e] hover:bg-[#8e6432] text-white h-16 rounded-full text-xl font-semibold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-[#b07d3e]/20">
                   إرسال الرسالة
                  <Send className="h-5 w-5 rotate-[-45deg]" />
                </Button>
              </form>
            )}
          </div>

          {/* 3. بطاقة معلومات التواصل - معدلة لإدلب */}
          <div className="lg:col-span-3 bg-white/[0.08] backdrop-blur-[25px] p-10 flex flex-col shadow-2xl border border-white/20 rounded-[4rem]">
            <h2 className="text-2xl text-white font-medium mb-12 text-center">معلومات التواصل</h2>
            <div className="space-y-10 mb-10 flex-1">
              <div className="flex items-center justify-end gap-5 text-white/90 hover:text-[#b07d3e] transition-colors group cursor-pointer">
                <span className="text-xl font-light tracking-wider" dir="ltr">+963-XXX-XXX</span>
                <Phone className="h-6 w-6 text-[#b07d3e] group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-center justify-end gap-5 text-white/90 hover:text-[#b07d3e] transition-colors group cursor-pointer">
                <span className="text-xl font-light">واتساب</span>
                <MessageCircle className="h-6 w-6 text-[#b07d3e] group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-center justify-end gap-5 text-white/90 group cursor-pointer">
                <span className="text-xl font-light text-left leading-relaxed">إدلب، سوريا</span>
                <MapPin className="h-6 w-6 text-[#b07d3e] group-hover:animate-bounce transition-transform" />
              </div>
            </div>
            
            <div className="mt-auto h-48 rounded-[3rem] overflow-hidden border border-white/20 shadow-inner group relative">
              {/* تعديل الـ Iframe ليشير إلى إدلب */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102927.87707441865!2d36.58611843105432!3d35.92873132049183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1525a3962630604b%3A0xc3b5e40e69888995!2sIdlib%2C%20Syria!5e0!3m2!1sen!2s!4v1715000000000!5m2!1sen!2s"
                width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(0.9) opacity(0.8)' }}
                allowFullScreen loading="lazy"
              />
            </div>
          </div>

          {/* 4. بطاقات الجانب الأيسر (ساعات العمل وواتساب) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex-1 bg-white/[0.1] backdrop-blur-[30px] rounded-[4rem] p-10 flex flex-col items-center justify-center text-center border border-white/20 hover:bg-white/[0.15] transition-all group shadow-2xl">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#b07d3e]/50 transition-all">
                <Clock className="h-8 w-8 text-[#b07d3e] group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="text-xl text-white font-light">ساعات العمل</h3>
            </div>
            
            <div className="flex-1 bg-white/[0.1] backdrop-blur-[30px] rounded-[4rem] p-10 flex flex-col items-center justify-center text-center border border-white/20 hover:bg-white/[0.15] transition-all group cursor-pointer shadow-2xl">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#b07d3e]/50 transition-all">
                <MessageCircle className="h-8 w-8 text-[#b07d3e] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl text-white font-light">واتساب</h3>
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}