import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgeCheck, Droplet } from 'lucide-react';
import { formatPrice } from '@/app/lib/utils';
import SellerListingsClient from './SellerListingsClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  // In production this would fetch from DB
  return {
    title: `${decodeURIComponent(slug)} | Fragrance Marketplace`,
    description: `השוו מחירים ומוכרים עבור ${decodeURIComponent(slug)}`,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  // Fetch fragrance data from API
  let fragrance = null;
  let listings = [];
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      fragrance = data.fragrance;
      listings = data.listings || [];
    }
  } catch (err) {
    console.error('Error fetching product:', err);
  }

  // Show placeholder if no data (during initial setup before DB)
  if (!fragrance) {
    fragrance = {
      name_he: decodeURIComponent(slug).replace(/-/g, ' '),
      brand_he: 'מותג',
      description_he: 'תיאור הבושם יופיע כאן לאחר שמנהל יאשר אותו.',
      concentration: 'EDP',
      gender: 'unisex',
      top_notes: [],
      heart_notes: [],
      base_notes: [],
    };
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/50 mb-10 animate-fade-in-up">
          <Link href="/" className="hover:text-[#d4af37] transition-colors">דף הבית</Link>
          <ArrowRight className="size-3 flip-rtl" />
          <Link href="/catalog" className="hover:text-[#d4af37] transition-colors">הקולקציה</Link>
          <ArrowRight className="size-3 flip-rtl" />
          <span className="text-white font-bold">{fragrance.name_he}</span>
        </nav>

        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Image */}
          <div className="relative aspect-square bg-gradient-to-br from-white/5 to-transparent rounded-[2rem] overflow-hidden border border-white/10 flex items-center justify-center p-10 shadow-2xl animate-scale-in">
            {fragrance.image_url ? (
              <Image
                src={fragrance.image_url}
                alt={fragrance.name_he}
                fill
                className="object-contain p-12 drop-shadow-[0_20px_50px_rgba(212,175,55,0.15)] hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            ) : (
              <div className="text-center opacity-30 text-white">
                <div className="flex justify-center mb-6">
                  <Droplet className="size-24" />
                </div>
                <p className="text-lg font-medium tracking-wide">תמונה רשמית תתווסף בקרוב</p>
              </div>
            )}
            
            {/* Ambient glow behind image */}
            <div className="absolute inset-0 bg-[#d4af37]/5 blur-3xl -z-10 rounded-full scale-75 pointer-events-none" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-3">
              <span className="inline-block text-[#d4af37] font-bold tracking-widest text-sm uppercase px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20">
                {fragrance.brand_he}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] drop-shadow-lg">
              {fragrance.name_he}
            </h1>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 mb-8">
              {fragrance.concentration && (
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white/90">
                  {fragrance.concentration}
                </span>
              )}
              {fragrance.gender && (
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white/90">
                  {fragrance.gender === 'men' ? 'גברים' : fragrance.gender === 'women' ? 'נשים' : 'יוניסקס'}
                </span>
              )}
              {fragrance.year_released && (
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white/90">
                  {fragrance.year_released}
                </span>
              )}
            </div>

            {/* Description */}
            {fragrance.description_he && (
              <p className="text-white/70 text-lg leading-relaxed mb-10 font-light">
                {fragrance.description_he}
              </p>
            )}

            {/* Fragrance Notes Pyramid */}
            {(fragrance.top_notes?.length > 0 || fragrance.heart_notes?.length > 0 || fragrance.base_notes?.length > 0) && (
              <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-[#d4af37]"></span>
                  פירמידת הניחוחות
                </h3>
                <div className="flex flex-col gap-6">
                  {fragrance.top_notes?.length > 0 && (
                    <div>
                      <span className="block text-sm font-bold text-[#d4af37] mb-2">תווים עליונים</span>
                      <div className="flex flex-wrap gap-2">
                        {fragrance.top_notes.map((note, i) => (
                          <span key={i} className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-sm text-white/80">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {fragrance.heart_notes?.length > 0 && (
                    <div>
                      <span className="block text-sm font-bold text-[#d4af37] mb-2">תווי לב</span>
                      <div className="flex flex-wrap gap-2">
                        {fragrance.heart_notes.map((note, i) => (
                          <span key={i} className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-sm text-white/80">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {fragrance.base_notes?.length > 0 && (
                    <div>
                      <span className="block text-sm font-bold text-[#d4af37] mb-2">תווי בסיס</span>
                      <div className="flex flex-wrap gap-2">
                        {fragrance.base_notes.map((note, i) => (
                          <span key={i} className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-sm text-white/80">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seller Listings Section */}
        <section className="relative z-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">מוכרים פעילים</h2>
              <p className="text-white/50 text-sm">
                {listings.length > 0 ? `${listings.length} מוכרים מציעים את הבושם הזה` : 'אין מוכרים כרגע'}
              </p>
            </div>
          </div>

          <SellerListingsClient listings={listings} />
        </section>
      </div>
    </div>
  );
}
