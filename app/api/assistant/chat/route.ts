import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type IncomingMessage = {
  role: 'assistant' | 'user';
  text: string;
};

const fallbackModel = 'gemini-2.5-flash';

function stringifyCatalogItem(item: {
  name: string;
  type?: string | null;
  department?: string | null;
  duration?: number | null;
  price: number;
  description?: string | null;
}) {
  const details = [
    item.type ? `النوع: ${item.type}` : null,
    item.department ? `القسم: ${item.department}` : null,
    item.duration ? `المدة: ${item.duration} دقيقة` : null,
    `السعر: $${item.price}`,
    item.description ? `الوصف: ${item.description}` : null,
  ].filter(Boolean);

  return `- ${item.name} (${details.join('، ')})`;
}

function getTextFromGeminiResponse(data: unknown) {
  if (!data || typeof data !== 'object') return '';

  const candidates = (data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }).candidates;
  return candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() || '';
}

export async function POST(request: Request) {
  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ''
  ).trim();

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing Gemini API key. Add GEMINI_API_KEY to .env to enable Gemini replies.' },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { messages?: IncomingMessage[] };
  const messages = (body.messages || [])
    .filter((message) => message.text?.trim())
    .slice(-10);

  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');

  if (!latestUserMessage) {
    return NextResponse.json({ error: 'No user message provided.' }, { status: 400 });
  }

  const [rooms, services] = await Promise.all([
    prisma.room.findMany({
      orderBy: { price: 'asc' },
      select: {
        name: true,
        type: true,
        price: true,
        description: true,
      },
    }),
    prisma.service.findMany({
      orderBy: { price: 'asc' },
      select: {
        name: true,
        department: true,
        duration: true,
        price: true,
        description: true,
      },
    }),
  ]);

  const hotelContext = [
    'Autumn Hotel & Resort هو فندق ومنتجع يقدم غرفاً وأجنحة وخدمات فندقية.',
    'بيانات الغرف المتوفرة حالياً:',
    rooms.length ? rooms.map(stringifyCatalogItem).join('\n') : '- لا توجد غرف مسجلة حالياً.',
    'بيانات الخدمات المتوفرة حالياً:',
    services.length ? services.map(stringifyCatalogItem).join('\n') : '- لا توجد خدمات مسجلة حالياً.',
    'سياسة الإلغاء: الأفضل التواصل قبل الموعد بـ 48 ساعة. الحجوزات القريبة تراجعها الإدارة.',
    'إذا أراد المستخدم الحجز، اطلب منه كتابة أنه يريد حجز غرفة أو خدمة. واجهة الموقع ستفتح نموذج الحجز.',
  ].join('\n');

  const systemInstruction = [
    'أنت Autumn AI Concierge، مساعد ذكي ودود لموقع Autumn Hotel.',
    'أجب بالعربية أولاً وبلهجة مفهومة قريبة من المستخدم، ويمكنك الرد بالإنجليزية إذا كتب المستخدم بالإنجليزية.',
    'استخدم بيانات الفندق التالية كمصدر للحقيقة ولا تخترع أسعاراً أو خدمات غير موجودة.',
    'إذا سأل المستخدم سؤالاً عاماً خارج الفندق، أجب باختصار وبشكل مفيد، ثم اربط الجواب بخدمة الفندق عند المناسب.',
    'لا تطلب بيانات حساسة. لا تؤكد حجزاً بنفسك؛ الحجز يتم فقط عبر نموذج الموقع.',
    hotelContext,
  ].join('\n\n');

  const conversation = [...messages];

  while (conversation[0]?.role === 'assistant') {
    conversation.shift();
  }

  const contents = conversation.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.text }],
  }));

  const model = process.env.GEMINI_MODEL || fallbackModel;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 500,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Gemini assistant error:', data);
    const geminiError = (data as { error?: { message?: string; status?: string } }).error;
    const locationUnsupported = geminiError?.message?.toLowerCase().includes('location is not supported');

    return NextResponse.json(
      {
        code: locationUnsupported ? 'LOCATION_NOT_SUPPORTED' : geminiError?.status || 'GEMINI_REQUEST_FAILED',
        error: locationUnsupported
          ? 'Gemini API is not supported from the current server location.'
          : 'Gemini request failed.',
      },
      { status: locationUnsupported ? 403 : 502 },
    );
  }

  const answer = getTextFromGeminiResponse(data);

  if (!answer) {
    return NextResponse.json({ error: 'Gemini returned an empty answer.' }, { status: 502 });
  }

  return NextResponse.json({ answer });
}
