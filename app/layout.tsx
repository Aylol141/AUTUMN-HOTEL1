import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const tajawal = Tajawal({ 
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'AUTUMN',
  description: 'مركز سمايل هاوس للتجميل والعناية بالبشرة والشعر - خدمات احترافية بأعلى معايير الجودة',
  keywords: 'تجميل, عناية بالبشرة, ليزر, مكياج, عناية بالشعر, صالون تجميل',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-background">
      <body className={`${tajawal.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
