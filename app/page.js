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
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Immersive Dark Hero Section */}
      <section className="relative w-full h-[600px] sm:h-[800px] flex flex-col items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#050505]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-16 animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-[#d4af37]/30 text-[#ffdf73] text-sm font-medium tracking-wide">
            ✨ הדרך החכמה לגלות את הריח שלך
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] leading-[1.2] tracking-tight mb-6 drop-shadow-2xl">
            להריח יוקרה.<br />בלי להתחייב.
          </h1>
          <p className="text-lg sm:text-xl text-white/70 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            אוסף בשמי הנישה והבוטיק הטובים בעולם. השוו מחירים ממוכרים מדורגים, ראו ביקורות, ורכשו בביטחון מלא.
          </p>

          {/* Minimalist Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <form action="/catalog" className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 pl-4 focus-within:bg-white/20 focus-within:border-[#d4af37]/50 transition-all duration-300 shadow-2xl">
              <input
                type="text"
                name="q"
                placeholder="חפש בושם, מותג, או תו ריח..."
                className="flex-1 bg-transparent border-none text-white placeholder:text-white/60 px-4 focus:outline-none text-lg focus:ring-0"
              />
              <button
                type="submit"
                className="size-12 bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:scale-105 rounded-full flex items-center justify-center text-black transition-all flex-shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                <Search className="size-5 font-bold" />
              </button>
            </form>
            
            {/* Decorative Floating Badges */}
            <div className="hidden md:flex absolute -left-12 -top-12 items-center gap-2 bg-black/40 backdrop-blur-md border border-[#d4af37]/30 px-4 py-2 rounded-2xl animate-float shadow-2xl">
              <Star className="size-4 text-[#ffdf73] fill-[#ffdf73]" />
              <span className="text-[#ffdf73] text-sm font-medium tracking-wide">מוכרים מדורגים</span>
            </div>
            <div className="hidden md:flex absolute -right-8 -bottom-14 items-center gap-2 bg-black/40 backdrop-blur-md border border-[#d4af37]/30 px-4 py-2 rounded-2xl animate-float shadow-2xl" style={{ animationDelay: '1s' }}>
              <TrendingUp className="size-4 text-[#ffdf73]" />
              <span className="text-[#ffdf73] text-sm font-medium tracking-wide">המחיר הזול ביותר</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features: Why Choosing Us */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-16 items-start relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="lg:w-1/4">
          <h2 className="text-4xl font-bold text-gradient-gold leading-tight mb-4">למה לבחור<br />בנו?</h2>
          <p className="text-white/50 text-sm">סטנדרט חדש לקניית בשמי יוקרה ברשת.</p>
        </div>
        
        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="size-14 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center mb-6 border border-[#d4af37]/20">
              <Search className="size-7 text-[#d4af37]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">חיפוש חכם</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              מנוע חיפוש מתקדם המאפשר למצוא בדיוק את הבושם שחיפשתם בעברית או באנגלית בקליק אחד.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="size-14 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center mb-6 border border-[#d4af37]/20">
              <TrendingUp className="size-7 text-[#d4af37]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">השוואת מחירים</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              קבלו גישה למספר מוכרים עבור אותו בושם, כך שתוכלו להשוות ולבחור את ההצעה המשתלמת ביותר.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="size-14 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center mb-6 border border-[#d4af37]/20">
              <ShieldCheck className="size-7 text-[#d4af37]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">קנייה בטוחה</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              מערכת ביקורות פתוחה ושקופה מבטיחה שתוכלו לרכוש ממוכרים אמינים בלבד בביטחון מלא.
            </p>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-32 relative border-t border-white/5">
        <div className="absolute top-1/2 right-0 w-1/2 h-full bg-blue-900/5 rounded-full blur-3xl -z-10 pointer-events-none -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-8">בשמים פופולריים</h2>
            
            {/* Category Pills */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1.5 shadow-xl overflow-x-auto max-w-full backdrop-blur-sm">
              <Link href="/catalog" className="px-8 py-2.5 rounded-full bg-[#d4af37] text-black text-sm font-bold whitespace-nowrap shadow-[0_0_15px_rgba(212,175,55,0.4)]">הכל</Link>
              <Link href="/catalog?gender=men" className="px-8 py-2.5 rounded-full text-white/70 hover:text-white text-sm font-medium transition-colors whitespace-nowrap hover:bg-white/10">גברים</Link>
              <Link href="/catalog?gender=women" className="px-8 py-2.5 rounded-full text-white/70 hover:text-white text-sm font-medium transition-colors whitespace-nowrap hover:bg-white/10">נשים</Link>
              <Link href="/catalog?gender=unisex" className="px-8 py-2.5 rounded-full text-white/70 hover:text-white text-sm font-medium transition-colors whitespace-nowrap hover:bg-white/10">יוניסקס</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {popularFragrances.map((f) => (
              <ProductCard key={f.id} fragrance={f} />
            ))}
            {popularFragrances.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <span className="text-4xl opacity-50 block mb-4">✨</span>
                <span className="text-white/60">אין מוצרים להצגה כרגע.</span>
              </div>
            )}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/catalog" className="inline-flex items-center gap-2 text-[#d4af37] font-bold hover:text-[#ffdf73] transition-colors group text-lg">
              צפה בכל הקולקציה 
              <ChevronRight className="size-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-32 relative border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#d4af37]/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center size-20 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] rounded-3xl mb-8 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <Sparkles className="size-10" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            הבושם הבא שלך מחכה לך
          </h2>
          <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
            הצטרף לשוק הבשמים היוקרתי בישראל. 
            מכור את הבשמים שלך למאות קונים פוטנציאליים או מצא את הריח הבא שלך.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/become-a-seller"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] text-lg"
            >
              הפוך למוכר
              <ArrowLeft className="size-5" />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all text-lg"
            >
              עיין בקטלוג
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
