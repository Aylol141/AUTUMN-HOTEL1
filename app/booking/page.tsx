'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { Calendar as CalendarIcon, Clock, CheckCircle, Phone, User, CalendarDays, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

const timeSlots = [
  '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

function BookingForm() {
  const searchParams = useSearchParams();
  const roomIdFromUrl = searchParams.get('room'); 
  const serviceIdFromUrl = searchParams.get('service');
  const products = useStore((state) => state.products) || [];
  const services = useStore((state) => state.services) || [];
  const currentUser = useStore((state) => state.currentUser);

  const [step, setStep] = useState(1);
  const [selectedItem, setSelectedItem] = useState<string>(roomIdFromUrl || serviceIdFromUrl || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'sham_cash'>('sham_cash');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const bookableItems = useMemo(
    () => [
      ...products.map((product) => ({ ...product, bookingType: 'room' as const })),
      ...services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        image: service.image,
        category: service.category,
        inStock: true,
        bookingType: 'service' as const,
      })),
    ],
    [products, services],
  );

  const selectedRoomData = useMemo(
    () => bookableItems.find((item) => item.id === selectedItem),
    [bookableItems, selectedItem],
  );

  const handleAddToGoogleCalendar = () => {
    if (!selectedRoomData) return;
    const title = encodeURIComponent(`Reservation at AUTUMN: ${selectedRoomData.name}`);
    const details = encodeURIComponent(`Welcome ${customerName}, we are excited to host you.`);
    const dateFormatted = selectedDate.replace(/-/g, '');
    const startTime = `${dateFormatted}T100000Z`;
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startTime}/${startTime}`;
    window.open(googleUrl, '_blank');
  };

  const handleSubmitBooking = async () => {
    if (!selectedRoomData || isSaving) return;

    if (!currentUser) {
      setBookingError('لازم تسجل دخول أو تنشئ حساب قبل تأكيد الحجز.');
      return;
    }

    if (selectedDate < today) {
      setBookingError('لا يمكن اختيار تاريخ قديم للحجز.');
      setStep(2);
      return;
    }

    setIsSaving(true);
    setBookingError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedItem,
          serviceName: selectedRoomData.name,
          customerName: customerName || currentUser.name,
          customerPhone: customerPhone || currentUser.phone,
          date: selectedDate,
          time: selectedTime,
          price: selectedRoomData.price,
          bookingType: selectedRoomData.bookingType,
          userId: currentUser.id,
          username: currentUser.username,
          userRole: currentUser.role,
          paymentMethod,
          paymentReference,
          paymentNote,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Booking request failed');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Booking error:', error);
      setBookingError(error instanceof Error ? error.message : 'تعذر حفظ الحجز، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSaving(false);
    }
  };

  if (isSubmitted && selectedRoomData) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="w-24 h-24 bg-[#dda15e] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(221,161,94,0.3)]">
          <CheckCircle className="h-12 w-12 text-black" />
        </div>
        <h2 style={{ fontFamily: 'AutumnFont' }} className="text-4xl text-white mb-4 italic font-bold">اكتمل السحر</h2>
        <p className="text-white/60 mb-10 text-lg font-medium tracking-tight">سيد/ة {customerName}، ننتظر تشريفك في {selectedRoomData.name}</p>
        <div className="bg-black/40 backdrop-blur-[45px] rounded-[3rem] border border-white/20 p-10 shadow-2xl">
          <Button onClick={handleAddToGoogleCalendar} className="w-full bg-white text-black hover:bg-[#dda15e] hover:text-white rounded-full py-8 font-black text-xl transition-all">
            <CalendarDays className="ml-3" size={24} /> حفظ في تقويم جوجل
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto relative z-10 px-6">
      {!currentUser && (
        <div className="mb-10 rounded-[2rem] border border-[#dda15e]/30 bg-black/60 p-6 text-center text-white shadow-2xl">
          <p className="mb-4 text-lg font-bold">الحجز متاح فقط للأعضاء المسجلين.</p>
          <p className="mb-6 text-sm text-white/60">أنشئ حساب أو سجّل دخولك حتى نربط الحجز بحسابك وتقدر تلغيه لاحقاً من لوحة النزيل.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button className="rounded-full bg-[#dda15e] px-8 text-black hover:bg-white">إنشاء حساب</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="rounded-full border border-white/20 px-8 text-white hover:bg-white/10">تسجيل الدخول</Button>
            </Link>
          </div>
        </div>
      )}
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        
        {/* النافذة اليسرى مع الفيديو */}
        <div className="lg:col-span-5 hidden lg:block relative group">
            <div className="absolute inset-0 bg-[#dda15e]/10 blur-[100px] rounded-full" />
            <div className="relative rounded-t-[20rem] rounded-b-[4rem] overflow-hidden border-[15px] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] aspect-[4/5.5]">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                >
                  <source src="/videos/WhatsApp Video 2026-05-05 at 11.31.01 PM.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-0 right-0 text-center px-6">
                   <p style={{ fontFamily: 'AutumnFont' }} className="text-[#dda15e] text-4xl italic font-bold drop-shadow-lg tracking-tighter">
                     {selectedRoomData?.name || "Choose Your Haven"}
                   </p>
                </div>
            </div>
        </div>

        {/* الفورم الكريستالي */}
        <div className="lg:col-span-7 bg-white/[0.05] backdrop-blur-[50px] border border-white/20 rounded-[5rem] p-10 md:p-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
            {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-10 duration-700">
                <h2 style={{ fontFamily: 'AutumnFont' }} className="text-5xl text-white mb-12 text-right font-bold">
                  اختر <span style={{ fontFamily: 'AutumnFont' }} className="text-[#dda15e] italic">ملاذك</span>
                </h2>
                <div className="grid gap-5 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar text-right">
                {bookableItems.map((room) => (
                    <div key={room.id} onClick={() => setSelectedItem(room.id)}
                    className={`p-7 rounded-[3rem] border-2 transition-all duration-500 cursor-pointer flex items-center justify-between gap-6 ${
                        selectedItem === room.id ? 'bg-white border-white text-black scale-[0.98]' : 'bg-black/40 border-white/10 text-white hover:border-white/30'
                    }`}>
                        <span className={`font-black text-xl tracking-tight ${selectedItem === room.id ? 'text-black' : 'text-[#dda15e]'}`}>{room.price} $</span>
                        <div className="text-right">
                          <h3 style={{ fontFamily: 'AutumnFont' }} className="font-bold text-2xl">{room.name}</h3>
                          <p className="mt-1 text-xs opacity-60">{room.bookingType === 'room' ? 'غرفة / جناح' : 'خدمة فندقية'}</p>
                        </div>
                    </div>
                ))}
                </div>
                <Button onClick={() => setStep(2)} disabled={!selectedItem || !currentUser} className="w-full mt-12 h-20 rounded-full bg-[#dda15e] text-white hover:bg-white hover:text-black font-black text-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-widest">تحديد الموعد</Button>
            </div>
            )}

            {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-10 duration-700">
                <h2 style={{ fontFamily: 'AutumnFont' }} className="text-5xl text-white mb-12 font-bold text-right tracking-tighter italic">
                  موعد <span style={{ fontFamily: 'AutumnFont' }} className="text-[#dda15e]">السكينة</span>
                </h2>
                <div className="space-y-10">
                    <div className="relative">
                        <Input type="date" min={today} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} 
                        className="bg-black/40 border-white/10 h-20 rounded-[2.5rem] text-white text-right text-2xl font-bold focus:border-[#dda15e] transition-all px-10" />
                    </div>
                    {selectedDate && (
                        <div className="animate-in fade-in slide-in-from-top-6 duration-700 grid grid-cols-4 gap-3">
                            {timeSlots.map(t => (
                                <button key={t} onClick={() => setSelectedTime(t)} className={`h-16 rounded-[1.5rem] text-sm font-black border-2 transition-all ${selectedTime === t ? 'bg-[#dda15e] border-[#dda15e] text-black shadow-xl scale-110' : 'bg-black/30 border-white/5 text-white hover:border-white/20'}`}>{t}</button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-16 flex gap-5">
                    <Button variant="ghost" onClick={() => setStep(1)} className="h-20 w-24 rounded-full bg-white/5 text-white hover:bg-white/10 flex items-center justify-center border border-white/5"><ArrowRight size={28} /></Button>
                    <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime} className="flex-1 h-20 rounded-full bg-[#dda15e] text-white font-black text-2xl shadow-xl uppercase tracking-widest">الخطوة الأخيرة</Button>
                </div>
            </div>
            )}

            {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-10 duration-700 text-right">
                <h2 style={{ fontFamily: 'AutumnFont' }} className="text-5xl text-white mb-12 font-bold tracking-tighter italic">
                  بصمتك <span style={{ fontFamily: 'AutumnFont' }} className="text-[#dda15e]">الأخيرة</span>
                </h2>
                <div className="space-y-8">
                    <Input placeholder="الاسم الكامل" value={customerName || currentUser?.name || ''} onChange={(e) => setCustomerName(e.target.value)} className="bg-black/40 border-white/10 h-20 rounded-[2.5rem] text-white text-right text-2xl font-bold px-10 focus:border-[#dda15e]" />
                    <Input placeholder="رقم الجوال" value={customerPhone || currentUser?.phone || ''} onChange={(e) => setCustomerPhone(e.target.value)} dir="ltr" className="bg-black/40 border-white/10 h-20 rounded-[2.5rem] text-white text-right text-2xl font-bold px-10 focus:border-[#dda15e]" />
                    <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
                      <p className="mb-4 text-sm font-black text-[#dda15e]">طريقة الدفع</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'sham_cash', label: 'شام كاش' },
                          { id: 'bank', label: 'تحويل بنكي' },
                        ].map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id as 'bank' | 'sham_cash')}
                            className={`h-14 rounded-2xl border text-sm font-black transition ${
                              paymentMethod === method.id
                                ? 'border-[#dda15e] bg-[#dda15e] text-black'
                                : 'border-white/10 bg-white/5 text-white hover:border-white/30'
                            }`}
                          >
                            {method.label}
                          </button>
                        ))}
                      </div>
                      <div className="mt-5 rounded-2xl bg-white/5 p-4 text-sm leading-7 text-white/75">
                        {paymentMethod === 'sham_cash' ? (
                          <>
                            حوّل المبلغ إلى شام كاش على الرقم: <span dir="ltr" className="font-black text-white">0999 000 000</span>
                          </>
                        ) : (
                          <>
                            التحويل البنكي إلى حساب Autumn Hotel، رقم الحساب: <span dir="ltr" className="font-black text-white">SY-AUTUMN-2026</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Input
                      placeholder="رقم عملية الدفع أو رقم الإشعار"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      dir="ltr"
                      className="bg-black/40 border-white/10 h-20 rounded-[2.5rem] text-white text-left text-2xl font-bold px-10 focus:border-[#dda15e]"
                    />
                    <Input
                      placeholder="ملاحظة اختيارية عن الدفع"
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      className="bg-black/40 border-white/10 h-16 rounded-[2rem] text-white text-right text-lg font-bold px-10 focus:border-[#dda15e]"
                    />
                </div>
                <div className="mt-16 flex gap-5">
                    <Button variant="ghost" onClick={() => setStep(2)} className="h-20 w-24 rounded-full bg-white/5 text-white hover:bg-white/10 flex items-center justify-center border border-white/5"><ArrowRight size={28} /></Button>
                    <Button onClick={handleSubmitBooking} 
                            disabled={!currentUser || !paymentReference || isSaving} 
                            className="flex-1 h-20 rounded-full bg-white text-black hover:bg-[#dda15e] hover:text-white font-black text-2xl shadow-[0_20px_60px_rgba(255,255,255,0.1)] transition-all duration-700">
                      {isSaving ? 'جاري حفظ الحجز...' : 'تأكيد الحجز الملكي'}
                    </Button>
                </div>
                {bookingError && (
                  <p className="mt-5 text-center text-sm font-bold text-red-300">{bookingError}</p>
                )}
            </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] relative overflow-hidden dark" dir="rtl">
      {/* الخلفية السينمائية */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://i.pinimg.com/1200x/9a/ab/a3/9aaba37dedb178ee1e7b80869a8b5a25.jpg" 
          alt="background"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[10px]" /> 
      </div>

      <Header />
      <main className="flex-1 relative pt-44 pb-32 z-10">
        <section className="mb-24 text-center relative px-4">
          <span className="text-[#dda15e] text-[10px] md:text-xs uppercase tracking-[1.5em] font-black mb-6 block opacity-80 animate-pulse">LUXURY DESTINATION</span>
          <h1 style={{ fontFamily: 'AutumnFont' }} className="text-8xl md:text-[12rem] text-white tracking-tighter font-bold leading-none drop-shadow-2xl">AUTUMN</h1>
          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-[#dda15e] to-transparent mx-auto mt-12 opacity-40" />
        </section>

        <Suspense fallback={<div className="text-center py-40 text-[#dda15e] font-serif text-4xl animate-pulse tracking-widest">L O A D I N G</div>}>
          <BookingForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
