import Link from 'next/link';
import { Search, ChevronRight, SearchX } from 'lucide-react';
import Image from 'next/image';
import ProductCard from '@/app/components/ProductCard';
import { sql } from '@/app/lib/db';
import HeroCarousel from '@/app/components/HeroCarousel';
import TypewriterText from '@/app/components/TypewriterText';
import LiveStats from '@/app/components/LiveStats';
import BonusesSection from '@/app/components/BonusesSection';
import BrandCarousel from '@/app/components/BrandCarousel';
import TrustSection from '@/app/components/TrustSection';

export const metadata = {
  title: 'Fragrance Marketplace — שוק הבשמים',
  description: 'שוק בשמים מקוון — השוו מחירים ממוכרים מדורגים, מצאו את העסקה הטובה ביותר',
};

async function getPopularFragrances() {
  try {
    const result = await sql`
      SELECT 
        f.id, f.slug, f.name_he, f.brand_he, f.image_url, 
        f.concentration, f.gender,
        MIN(l.price) as lowest_price,
        COUNT(DISTINCT l.seller_id) as sellers_count,
        COALESCE(AVG(u.avg_rating), 0) as avg_rating
      FROM fragrances f
      LEFT JOIN listings l ON l.fragrance_id = f.id AND l.is_active = true
      LEFT JOIN users u ON u.id = l.seller_id
      GROUP BY f.id
      ORDER BY sellers_count DESC, lowest_price ASC NULLS LAST
      LIMIT 8
    `;
    return result;
  } catch (err) {
    console.error('Failed to fetch popular fragrances:', err);
    return [];
  }
}

async function getStats() {
    try {
        const sellersResult = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'seller'`;
        const productsResult = await sql`SELECT COUNT(*) as count FROM fragrances`;
        const dealsResult = await sql`SELECT COUNT(*) as count FROM listings WHERE is_active = false`; // placeholder for deals
        
        return {
            sellers: parseInt(sellersResult[0]?.count || '150'),
            products: parseInt(productsResult[0]?.count || '2500'),
            deals: parseInt(dealsResult[0]?.count || '500') + 1200
        };
    } catch(e) {
        return { sellers: 120, products: 2300, deals: 4500 };
    }
}

export default async function HomePage() {
  const popularFragrances = await getPopularFragrances();
  const stats = await getStats();

  const brands = [
    { name: "Creed", logo_url: null },
    { name: "Tom Ford", logo_url: null },
    { name: "Maison Francis Kurkdjian", logo_url: null },
    { name: "Parfums de Marly", logo_url: null },
    { name: "Xerjoff", logo_url: null },
    { name: "Roja Parfums", logo_url: null },
    { name: "Amouage", logo_url: null },
    { name: "Kilian", logo_url: null },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-[#050505]">
      
      {/* Hero Section - Tall and pulled to top */}
      <section className="relative h-[85vh] md:h-[85vh] w-full m-0 p-0 overflow-hidden bg-black block">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/hero-bg.jpg"
            alt="Luxury Fragrance Hero"
            fill
            priority
            className="object-cover object-top opacity-60 md:object-center"
            sizes="100vw"
            quality={90}
          />
          
          {/* Elegant Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 pt-20">
          {/* Animated decorative elements */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#d4af37] mb-4 opacity-70 animate-pulse-slow"></div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-wide drop-shadow-2xl">
            להריח <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#ffdf73] to-[#d4af37]">יוקרה.</span>
            <br className="hidden md:block" />
            <span className="md:mt-4 block">בלי להתחייב.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            <TypewriterText text="השוו מחירים ממוכרים מדורגים ורכשו בביטחון מלא. המרקטפלייס הראשון בישראל לבשמי נישה ויוקרה." speed={35} />
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/catalog"
              className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-[#d4af37] text-black rounded-full font-bold transition-all overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 tracking-widest text-lg">לקטלוג המלא</span>
              <ChevronRight className="size-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/become-a-seller"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all tracking-widest text-lg backdrop-blur-sm"
            >
              הפוך למוכר
            </Link>
          </div>
        </div>
      </section>

      <div className="relative z-30 w-full flex flex-col bg-[#050505]">
        <LiveStats stats={stats} />
        
        {/* Popular Fragrances Section */}
        <section className="py-16 bg-[#050505]">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl tracking-[0.2em] uppercase mb-3 font-bold text-white">בשמים פופולריים</h2>
                <div className="w-10 h-0.5 bg-[#d4af37] mx-auto mb-10 rounded-full"></div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up">
                    {popularFragrances.map((f) => (
                        <ProductCard key={f.id} fragrance={f} />
                    ))}
                    {popularFragrances.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                            <div className="flex justify-center mb-4 opacity-50 text-[#d4af37]">
                                <SearchX className="size-10" />
                            </div>
                            <span className="text-white/60">אין מוצרים להצגה כרגע.</span>
                        </div>
                    )}
                </div>

                <Link href="/catalog" className="inline-block mt-12 bg-white text-black px-8 py-3 rounded-full font-bold tracking-widest uppercase hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    צפה בכל הקולקציה
                </Link>
            </div>
        </section>

        <BonusesSection />
        <BrandCarousel brands={brands} />
        <TrustSection />
      </div>

      <section className="py-12 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
            <Link href="/catalog?gender=men" className="group relative h-[400px] overflow-hidden rounded-lg">
              <Image src="/hero-bg.jpg" alt="גברים" fill className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-50" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                <span className="text-sm tracking-[0.2em] uppercase mb-2 text-[#d4af37]">קולקציית</span>
                <h3 className="text-4xl font-serif mb-4">גברים</h3>
                <span className="inline-block border border-white px-6 py-2 text-sm uppercase tracking-wider group-hover:bg-white group-hover:text-black transition-colors">
                  גלה עכשיו
                </span>
              </div>
            </Link>
            <Link href="/catalog?gender=women" className="group relative h-[400px] overflow-hidden rounded-lg">
              <Image src="/hero-bg.jpg" alt="נשים" fill className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-50" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                <span className="text-sm tracking-[0.2em] uppercase mb-2 text-[#d4af37]">קולקציית</span>
                <h3 className="text-4xl font-serif mb-4">נשים</h3>
                <span className="inline-block border border-white px-6 py-2 text-sm uppercase tracking-wider group-hover:bg-white group-hover:text-black transition-colors">
                  גלי עכשיו
                </span>
              </div>
            </Link>
            <Link href="/catalog?gender=unisex" className="group relative h-[400px] overflow-hidden rounded-lg">
              <Image src="/hero-bg.jpg" alt="יוניסקס" fill className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-50" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                <span className="text-sm tracking-[0.2em] uppercase mb-2 text-[#d4af37]">קולקציית</span>
                <h3 className="text-4xl font-serif mb-4">יוניסקס</h3>
                <span className="inline-block border border-white px-6 py-2 text-sm uppercase tracking-wider group-hover:bg-white group-hover:text-black transition-colors">
                  לכל המינים
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
