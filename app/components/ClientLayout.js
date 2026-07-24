'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      <Header />
      <main className={`min-h-screen ${isHomePage ? '' : 'pt-20'}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
