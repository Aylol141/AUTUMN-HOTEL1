'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, CalendarCheck, Hotel, Send, Sparkles, X } from 'lucide-react';
import { useStore } from '@/lib/store';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  meta?: {
    bookingId?: string;
  };
};

type CatalogItem = {
  id: string;
  name: string;
  type?: string;
  department?: string;
  price: number;
  duration?: number;
  description?: string | null;
};

type Catalog = {
  rooms: CatalogItem[];
  services: CatalogItem[];
};

type BookingDraft = {
  kind: 'room' | 'service';
  itemId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  paymentMethod: 'bank' | 'sham_cash';
  paymentReference: string;
};

const welcomeText =
  'أهلاً وسهلاً في Autumn Hotel. أنا مساعدك الذكي، بقدر جاوبك عن الغرف، الأجنحة، الخدمات، الأسعار، وسياسة الحجز. وكمان بقدر أعمل لك حجز يوصل مباشرة للوحة التحكم.';

const quickQuestions = [
  'شو الغرف المتاحة؟',
  'شو الخدمات الموجودة؟',
  'بدي أحجز غرفة',
  'بدي أحجز خدمة',
  'شو سياسة الإلغاء؟',
];

const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

function makeMessage(role: ChatMessage['role'], text: string, meta?: ChatMessage['meta']): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    meta,
  };
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').trim();
}

function formatItems(items: CatalogItem[], label: string) {
  if (items.length === 0) return `حالياً ما في ${label} مسجلة بالنظام.`;

  return items
    .map((item, index) => {
      const details = item.description ? ` - ${item.description}` : '';
      return `${index + 1}. ${item.name}: $${item.price}${details}`;
    })
    .join('\n');
}

export function AutumnAiAssistant() {
  const currentUser = useStore((state) => state.currentUser);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [catalog, setCatalog] = useState<Catalog>({ rooms: [], services: [] });
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [replying, setReplying] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const itemsForDraft = useMemo(() => {
    if (!draft) return [];
    return draft.kind === 'room' ? catalog.rooms : catalog.services;
  }, [catalog.rooms, catalog.services, draft]);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    setMessages([makeMessage('assistant', welcomeText)]);
  }, [messages.length, open]);

  useEffect(() => {
    if (!open || catalog.rooms.length || catalog.services.length || loadingCatalog) return;

    setLoadingCatalog(true);
    fetch('/api/assistant/catalog', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setCatalog({ rooms: data.rooms || [], services: data.services || [] }))
      .catch(() => {
        setMessages((current) => [
          ...current,
          makeMessage('assistant', 'تعذر تحميل بيانات الغرف والخدمات حالياً، جرّب بعد قليل.'),
        ]);
      })
      .finally(() => setLoadingCatalog(false));
  }, [catalog.rooms.length, catalog.services.length, loadingCatalog, open]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, draft]);

  const startBooking = (kind: BookingDraft['kind'], requestedText?: string) => {
    if (!currentUser) {
      setMessages((current) => [
        ...current,
        makeMessage('assistant', 'حتى أقدر أثبت لك حجز أو خدمة، لازم تسجل دخول أو تنشئ حساب أولاً. بعدها ارجع اكتب طلب الحجز وأنا بكمله معك.'),
      ]);
      return;
    }

    const source = kind === 'room' ? catalog.rooms : catalog.services;
    const normalized = normalize(requestedText || '');
    const matched =
      source.find((item) => normalize(item.name).split(/\s+/).some((part) => part.length > 2 && normalized.includes(part))) ||
      source[0];

    setDraft({
      kind,
      itemId: matched?.id || '',
      customerName: currentUser.name || '',
      customerPhone: currentUser.phone || '',
      date: '',
      time: '14:00',
      paymentMethod: 'sham_cash',
      paymentReference: '',
    });

    const label = kind === 'room' ? 'الغرفة أو الجناح' : 'الخدمة';
    setMessages((current) => [
      ...current,
      makeMessage('assistant', `تمام. اختر ${label} واملأ بياناتك، وبس تضغط تأكيد رح يوصل الحجز مباشرة للوحة التحكم.`),
    ]);
  };

  const answerFallback = (text: string) => {
    const q = normalize(text);

    if (q.includes('سعر') || q.includes('اسعار') || q.includes('كم')) {
      setMessages((current) => [
        ...current,
        makeMessage(
          'assistant',
          `هذه الأسعار المسجلة حالياً:\n\nالغرف والأجنحة:\n${formatItems(catalog.rooms, 'غرف')}\n\nالخدمات:\n${formatItems(catalog.services, 'خدمات')}`,
        ),
      ]);
      return;
    }

    if (q.includes('غرف') || q.includes('اجنحه') || q.includes('جناح') || q.includes('غرفه')) {
      setMessages((current) => [
        ...current,
        makeMessage('assistant', `الغرف والأجنحة المتوفرة حالياً:\n${formatItems(catalog.rooms, 'غرف')}\n\nإذا بدك، اكتب "بدي أحجز غرفة".`),
      ]);
      return;
    }

    if (q.includes('خدمات') || q.includes('خدمه') || q.includes('سبا') || q.includes('رياض')) {
      setMessages((current) => [
        ...current,
        makeMessage('assistant', `الخدمات المتوفرة:\n${formatItems(catalog.services, 'خدمات')}\n\nإذا بدك حجز خدمة، اكتب "بدي أحجز خدمة".`),
      ]);
      return;
    }

    if (q.includes('الغاء') || q.includes('الغاء') || q.includes('سياسه')) {
      setMessages((current) => [
        ...current,
        makeMessage('assistant', 'سياسة الإلغاء: الأفضل التواصل قبل الموعد بـ 48 ساعة. الحجوزات القريبة يتم مراجعتها من الإدارة، والسكرتير يقدر يأكد أو يلغي الطلب من لوحة التحكم.'),
      ]);
      return;
    }

    if (q.includes('موقع') || q.includes('وين') || q.includes('عنوان')) {
      setMessages((current) => [
        ...current,
        makeMessage('assistant', 'Autumn Hotel & Resort تجربة إقامة وخدمات فندقية فاخرة. للحجز أو الاستفسار، فيك تكمل معي هون أو تستخدم زر واتساب الموجود بالموقع.'),
      ]);
      return;
    }

    setMessages((current) => [
      ...current,
      makeMessage('assistant', 'أكيد. فيني ساعدك بالأسعار، الغرف، الأجنحة، الخدمات، سياسة الإلغاء، أو أعمل لك حجز مباشرة. إذا كان سؤالك عام، جرّب مرة ثانية بعد التأكد من ربط مفتاح Gemini.'),
    ]);
  };

  const shouldStartBooking = (text: string) => {
    const q = normalize(text);
    return q.includes('حجز') || q.includes('احجز') || q.includes('بدي احجز') || q.includes('اريد حجز');
  };

  const answerMessage = async (text: string, nextMessages: ChatMessage[]) => {
    const q = normalize(text);

    if (shouldStartBooking(text)) {
      if (q.includes('خدم') || q.includes('مساج') || q.includes('سبا') || q.includes('فطور') || q.includes('مطار')) {
        startBooking('service', text);
        return;
      }

      startBooking('room', text);
      return;
    }

    setReplying(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            text: message.text,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (errorData?.code === 'LOCATION_NOT_SUPPORTED') {
          setMessages((current) => [
            ...current,
            makeMessage(
              'assistant',
              'مفتاح Gemini مقروء، لكن Google رافضة الطلب من موقع تشغيل السيرفر الحالي. حتى يشتغل Gemini فعلياً، شغّل الموقع على استضافة أو سيرفر بمنطقة مدعومة من Google AI Studio.',
            ),
          ]);
          return;
        }

        throw new Error('Gemini failed');
      }

      const data = await response.json();
      setMessages((current) => [...current, makeMessage('assistant', data.answer || 'ما قدرت أجهّز رد مناسب حالياً.')]);
    } catch (error) {
      console.error('Assistant Gemini error:', error);
      answerFallback(text);
    } finally {
      setReplying(false);
    }
  };

  const sendMessage = (text = input) => {
    const clean = text.trim();
    if (!clean || replying) return;

    const userMessage = makeMessage('user', clean);
    setInput('');
    setMessages((current) => [...current, userMessage]);
    void answerMessage(clean, [...messages, userMessage]);
  };

  const submitBooking = async () => {
    if (!draft) return;

    const item = itemsForDraft.find((candidate) => candidate.id === draft.itemId);
    if (!item || !draft.customerName || !draft.customerPhone || !draft.date || !draft.time || !draft.paymentReference) {
      setMessages((current) => [...current, makeMessage('assistant', 'كمّل الاسم، الرقم، التاريخ، الوقت، ورقم عملية الدفع حتى أقدر أثبت الحجز.')]);
      return;
    }

    if (!currentUser) {
      setMessages((current) => [...current, makeMessage('assistant', 'لازم تسجل دخول قبل تأكيد الحجز حتى نربطه بحسابك وتقدر تلغيه لاحقاً.')]);
      return;
    }

    if (draft.date < today) {
      setMessages((current) => [...current, makeMessage('assistant', 'اختَر تاريخ اليوم أو تاريخ مستقبلي، ما فينا نثبت حجز بتاريخ قديم.')]);
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: item.id,
          serviceName: item.name,
          customerName: draft.customerName,
          customerPhone: draft.customerPhone,
          date: draft.date,
          time: draft.time,
          price: item.price,
          bookingType: draft.kind,
          userId: currentUser.id,
          username: currentUser.username,
          userRole: currentUser.role,
          paymentMethod: draft.paymentMethod,
          paymentReference: draft.paymentReference,
        }),
      });

      if (!response.ok) throw new Error('Booking failed');

      const booking = await response.json();
      setMessages((current) => [
        ...current,
        makeMessage(
          'assistant',
          `تم تسجيل الحجز بنجاح.\nالاسم: ${draft.customerName}\nالمطلوب: ${item.name}\nالتاريخ: ${draft.date}\nالوقت: ${draft.time}\nالحالة: قيد المراجعة\n\nوصل الطلب الآن للوحة التحكم ولوحة السكرتير.`,
          { bookingId: booking.id },
        ),
      ]);
      setDraft(null);
    } catch (error) {
      console.error('Assistant booking error:', error);
      setMessages((current) => [...current, makeMessage('assistant', 'صار خطأ أثناء تثبيت الحجز. جرّب مرة ثانية أو تواصل معنا عبر واتساب.')]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#c9a96e] text-[#1a1a18] shadow-[0_8px_30px_rgba(201,169,110,0.45)] transition-transform hover:scale-105"
        aria-label="فتح المساعد الذكي"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-[70] flex h-[590px] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-[1.5rem] border border-[#d8c7a4] bg-[#fbf7ef] text-right shadow-2xl sm:right-6" dir="rtl">
          <div className="flex items-center gap-3 bg-[#1f1712] px-4 py-4 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c9a96e] text-[#1f1712]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black">Autumn AI Concierge</p>
              <p className="text-xs text-emerald-200">متاح الآن للحجز والاستفسار</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[84%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-[#c9a96e] text-[#1f1712]'
                      : 'border border-[#ede1ca] bg-white text-[#2d2118]'
                  }`}
                >
                  {message.text}
                  {message.meta?.bookingId && (
                    <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700">
                      رقم الطلب: {message.meta.bookingId}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {replying && (
              <div className="flex justify-end">
                <div className="max-w-[84%] rounded-2xl border border-[#ede1ca] bg-white px-4 py-3 text-sm leading-6 text-[#2d2118]">
                  عم بحضّر الجواب...
                </div>
              </div>
            )}

            {draft && (
              <div className="rounded-2xl border border-[#d8c7a4] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-[#2d2118]">
                  {draft.kind === 'room' ? <Hotel className="h-4 w-4 text-[#c9a96e]" /> : <CalendarCheck className="h-4 w-4 text-[#c9a96e]" />}
                  <p className="text-sm font-black">{draft.kind === 'room' ? 'حجز غرفة أو جناح' : 'حجز خدمة'}</p>
                </div>

                <div className="space-y-3">
                  <select
                    value={draft.itemId}
                    onChange={(event) => setDraft({ ...draft, itemId: event.target.value })}
                    className="h-11 w-full rounded-xl border border-[#d8c7a4] bg-[#fbf7ef] px-3 text-sm outline-none"
                  >
                    {itemsForDraft.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - ${item.price}
                      </option>
                    ))}
                  </select>
                  <input
                    value={draft.customerName}
                    onChange={(event) => setDraft({ ...draft, customerName: event.target.value })}
                    placeholder="الاسم الكامل"
                    className="h-11 w-full rounded-xl border border-[#d8c7a4] bg-[#fbf7ef] px-3 text-sm outline-none"
                  />
                  <input
                    value={draft.customerPhone}
                    onChange={(event) => setDraft({ ...draft, customerPhone: event.target.value })}
                    placeholder="رقم الجوال"
                    dir="ltr"
                    className="h-11 w-full rounded-xl border border-[#d8c7a4] bg-[#fbf7ef] px-3 text-left text-sm outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      min={today}
                      value={draft.date}
                      onChange={(event) => setDraft({ ...draft, date: event.target.value })}
                      className="h-11 rounded-xl border border-[#d8c7a4] bg-[#fbf7ef] px-3 text-sm outline-none"
                    />
                    <select
                      value={draft.time}
                      onChange={(event) => setDraft({ ...draft, time: event.target.value })}
                      className="h-11 rounded-xl border border-[#d8c7a4] bg-[#fbf7ef] px-3 text-sm outline-none"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, paymentMethod: 'sham_cash' })}
                      className={`h-11 rounded-xl border text-sm font-bold ${draft.paymentMethod === 'sham_cash' ? 'border-[#c9a96e] bg-[#c9a96e] text-[#1f1712]' : 'border-[#d8c7a4] bg-[#fbf7ef] text-[#6f5a35]'}`}
                    >
                      شام كاش
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, paymentMethod: 'bank' })}
                      className={`h-11 rounded-xl border text-sm font-bold ${draft.paymentMethod === 'bank' ? 'border-[#c9a96e] bg-[#c9a96e] text-[#1f1712]' : 'border-[#d8c7a4] bg-[#fbf7ef] text-[#6f5a35]'}`}
                    >
                      تحويل بنكي
                    </button>
                  </div>
                  <div className="rounded-xl bg-[#fbf7ef] p-3 text-xs font-bold leading-6 text-[#6f5a35]">
                    {draft.paymentMethod === 'sham_cash'
                      ? 'حوّل على شام كاش: 0999 000 000 ثم اكتب رقم العملية.'
                      : 'حوّل بنكي إلى حساب SY-AUTUMN-2026 ثم اكتب رقم الإشعار.'}
                  </div>
                  <input
                    value={draft.paymentReference}
                    onChange={(event) => setDraft({ ...draft, paymentReference: event.target.value })}
                    placeholder="رقم عملية الدفع"
                    dir="ltr"
                    className="h-11 w-full rounded-xl border border-[#d8c7a4] bg-[#fbf7ef] px-3 text-left text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={submitBooking}
                    disabled={saving}
                    className="h-11 w-full rounded-xl bg-[#1f1712] text-sm font-black text-white transition hover:bg-[#c9a96e] hover:text-[#1f1712] disabled:opacity-60"
                  >
                    {saving ? 'جاري تثبيت الحجز...' : 'تأكيد الحجز وإرساله للإدارة'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-[#ede1ca] bg-white px-3 py-3">
            {quickQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => sendMessage(question)}
                disabled={replying}
                className="rounded-full border border-[#d8c7a4] px-3 py-1.5 text-xs font-bold text-[#6f5a35] hover:bg-[#fbf0dc]"
              >
                {question}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-[#ede1ca] bg-white px-3 py-3"
          >
            <button type="submit" disabled={replying} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a96e] text-[#1f1712] disabled:opacity-60">
              <Send className="h-4 w-4" />
            </button>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={replying}
              placeholder="اكتب سؤالك أو طلب الحجز..."
              className="h-10 min-w-0 flex-1 rounded-full border border-[#d8c7a4] bg-[#fbf7ef] px-4 text-sm outline-none focus:border-[#c9a96e] disabled:opacity-60"
            />
          </form>
        </div>
      )}
    </>
  );
}
