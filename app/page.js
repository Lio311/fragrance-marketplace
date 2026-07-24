import Link from 'next/link';
import { Search, ShieldCheck, Star, Users, ArrowLeft, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import ProductCard from '@/app/components/ProductCard';
import { sql } from '@/app/lib/db';

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
      LIMIT 4
    `;
    return result;
  } catch (err) {
    console.error('Failed to fetch popular fragrances:', err);
    return [];
  }
}

export default async function HomePage() {
  const popularFragrances = await getPopularFragrances();

  return (
    <div className="min-h-screen bg-white">
      {/* Immersive Dark Hero Section */}
      <section className="relative w-full h-[600px] sm:h-[700px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.jpg" 
            alt="Luxury Fragrance Background" 
            fill 
            className="object-cover"
            priority
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-16 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.2] tracking-tight mb-6">
            מצא את הבושם המושלם<br />במחיר הטוב ביותר
          </h1>
          <p className="text-lg sm:text-xl text-white/80 font-light max-w-2xl mx-auto mb-10">
            השוו מחירים ממוכרים מדורגים, ראו ביקורות, ורכשו בביטחון
          </p>

          {/* Minimalist Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <form action="/catalog" className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 pl-4 focus-within:bg-white/20 transition-all duration-300">
              <input
                type="text"
                name="q"
                placeholder="חפש בושם, מותג, או תו ריח..."
                className="flex-1 bg-transparent border-none text-white placeholder:text-white/60 px-4 focus:outline-none text-lg focus:ring-0"
              />
              <button
                type="submit"
                className="size-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white transition-colors flex-shrink-0"
              >
                <Search className="size-5" />
              </button>
            </form>
            
            {/* Decorative Floating Badges (Hidden on very small screens) */}
            <div className="hidden md:flex absolute -left-12 -top-12 items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl animate-float shadow-2xl">
              <Star className="size-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-medium">מוכרים מדורגים</span>
            </div>
            <div className="hidden md:flex absolute -right-8 -bottom-14 items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl animate-float shadow-2xl" style={{ animationDelay: '1s' }}>
              <TrendingUp className="size-4 text-blue-300" />
              <span className="text-white text-sm font-medium">המחיר הזול ביותר</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features: Why Choosing Us */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-1/4">
          <h2 className="text-3xl font-bold text-surface-900 leading-tight">למה לבחור<br />בנו?</h2>
        </div>
        
        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-lg font-bold text-surface-900 mb-3 flex items-center gap-2">
              <Search className="size-5 text-blue-500" /> חיפוש חכם
            </h3>
            <p className="text-surface-500 text-sm leading-relaxed">
              מנוע חיפוש מתקדם המאפשר למצוא בדיוק את הבושם שחיפשתם בעברית או באנגלית בקליק אחד.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-900 mb-3 flex items-center gap-2">
              <TrendingUp className="size-5 text-blue-500" /> השוואת מחירים
            </h3>
            <p className="text-surface-500 text-sm leading-relaxed">
              קבלו גישה למספר מוכרים עבור אותו בושם, כך שתוכלו להשוות ולבחור את ההצעה המשתלמת ביותר.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="size-5 text-blue-500" /> קנייה בטוחה
            </h3>
            <p className="text-surface-500 text-sm leading-relaxed">
              מערכת ביקורות פתוחה ושקופה מבטיחה שתוכלו לרכוש ממוכרים אמינים בלבד בביטחון מלא.
            </p>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-900 mb-6">בשמים פופולריים</h2>
            
            {/* Category Pills */}
            <div className="inline-flex items-center gap-2 bg-white border border-surface-200 rounded-full p-1 shadow-sm overflow-x-auto max-w-full">
              <Link href="/catalog" className="px-6 py-2 rounded-full bg-surface-100 text-surface-900 text-sm font-medium whitespace-nowrap">הכל</Link>
              <Link href="/catalog?gender=men" className="px-6 py-2 rounded-full text-surface-500 hover:text-surface-900 text-sm font-medium transition-colors whitespace-nowrap hover:bg-surface-50">גברים</Link>
              <Link href="/catalog?gender=women" className="px-6 py-2 rounded-full text-surface-500 hover:text-surface-900 text-sm font-medium transition-colors whitespace-nowrap hover:bg-surface-50">נשים</Link>
              <Link href="/catalog?gender=unisex" className="px-6 py-2 rounded-full text-surface-500 hover:text-surface-900 text-sm font-medium transition-colors whitespace-nowrap hover:bg-surface-50">יוניסקס</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {popularFragrances.map((f) => (
              <ProductCard key={f.id} fragrance={f} />
            ))}
            {popularFragrances.length === 0 && (
              <div className="col-span-full text-center py-12 text-surface-500">
                אין מוצרים להצגה כרגע.
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/catalog" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
              צפה בכל הקטלוג <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-20 bg-white border-t border-surface-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center size-16 bg-blue-50 text-blue-500 rounded-2xl mb-6">
            <Sparkles className="size-8" />
          </div>
          <h2 className="text-3xl font-bold text-surface-900 mb-4">
            יש לך בושם למכור?
          </h2>
          <p className="text-surface-500 mb-8">
            הצטרף לשוק הבשמים וקבל גישה למאות קונים פוטנציאליים. 
            פרסום מודעה חינמי ופשוט.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/new-listing"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-[#333] transition-colors shadow-lg"
            >
              פרסם מודעה
              <ArrowLeft className="size-4" />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 border-2 border-surface-200 text-surface-700 rounded-xl font-medium hover:bg-surface-50 transition-colors"
            >
              עיין בקטלוג
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
