import type { Metadata, Viewport } from 'next';
import { Tajawal } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import dynamic from 'next/dynamic';
import { AutumnAiAssistant } from '@/components/autumn-ai-assistant';


const tajawal = Tajawal({ 
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2D1B14',
};

export const metadata: Metadata = {
  title: {
    default: 'فندق ومنتجع أيلول | Autumn Hotel & Resort',
    template: '%s | فندق أيلول'
  },
  description: 'اكتشف الفخامة والهدوء في فندق ومنتجع أيلول. تجربة إقامة ملكية مع خدمات احترافية بأعلى معايير الجودة العالمية.',
  keywords: ['فندق', 'حجز فنادق', 'أجنحة ملكية', 'خدمات فندقية', 'Autumn Hotel', 'منتجع أيلول', 'استرخاء'],
  openGraph: {
    title: 'فندق ومنتجع أيلول | Autumn Hotel & Resort',
    description: 'تجربة إقامة ملكية في قلب الطبيعة - خدمات احترافية بأعلى معايير الجودة',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'Autumn Hotel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فندق ومنتجع أيلول | Autumn Hotel & Resort',
    description: 'فخامة الاسترخاء في قلب الطبيعة',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth"> 
      <body 
        className={`${tajawal.className} antialiased bg-[#FDF8F5] text-[#2D1B14] min-h-screen selection:bg-[#D35400] selection:text-white`}
      >
        {/* المكون الرئيسي للمحتوى */}
        <main className="relative overflow-x-hidden">
          {children}
        </main>

        <AutumnAiAssistant />
        <Analytics />
      </body>
    </html>
  );
}
