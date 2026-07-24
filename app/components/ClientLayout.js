'use client';

import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
