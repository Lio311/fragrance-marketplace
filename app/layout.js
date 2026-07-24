import { Assistant } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { heIL } from '@clerk/localizations';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ClientLayout from './components/ClientLayout';

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-assistant',
  display: 'swap',
});

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: {
    template: '%s | Fragrance Marketplace',
    default: 'Fragrance Marketplace — שוק הבשמים',
  },
  description: 'שוק בשמים מקוון — השוו מחירים ממוכרים מדורגים, מצאו את העסקה הטובה ביותר',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Fragrance Marketplace — שוק הבשמים',
    description: 'שוק בשמים מקוון — השוו מחירים ממוכרים מדורגים',
    locale: 'he_IL',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      localization={heIL}
      appearance={{
        variables: { colorPrimary: '#1a1a1a' },
        elements: {
          formButtonPrimary__icon: { transform: 'rotate(180deg) !important' },
          otpCodeFieldInput: { direction: 'ltr !important', textAlign: 'center !important' },
          identityPreviewText: { direction: 'ltr !important' },
        },
      }}
    >
      <html lang="he" dir="rtl">
        <body className={`${assistant.variable} font-sans antialiased bg-white text-[#1a1a1a]`}>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                textAlign: 'center',
                maxWidth: '90vw',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '0.9rem',
              },
            }}
          />
          <ClientLayout>{children}</ClientLayout>

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                {
                  '@context': 'https://schema.org',
                  '@type': 'WebSite',
                  name: 'Fragrance Marketplace',
                  alternateName: 'שוק הבשמים',
                  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                  description: 'שוק בשמים מקוון — השוו מחירים ממוכרים מדורגים',
                  inLanguage: 'he-IL',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/catalog?q={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'Fragrance Marketplace',
                  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                },
              ]),
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
