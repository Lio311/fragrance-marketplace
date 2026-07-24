import Link from 'next/link';
import { Search, ShieldCheck, Star, Users, ArrowLeft, TrendingUp, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Fragrance Marketplace — שוק הבשמים',
  description: 'שוק בשמים מקוון — השוו מחירים ממוכרים מדורגים, מצאו את העסקה הטובה ביותר',
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-50 to-white py-20 sm:py-28">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 size-72 bg-gold-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 size-96 bg-gold-100/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-50 border border-gold-200 rounded-full text-sm text-gold-700 font-medium mb-6">
              <Sparkles className="size-4" />
              השוק המוביל לבשמים בישראל
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 leading-tight mb-6">
              מצא את הבושם המושלם
              <br />
              <span className="text-gradient-gold">במחיר הטוב ביותר</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              השוו מחירים ממוכרים מדורגים, מצאו את העסקה הטובה ביותר — 
              הכל במקום אחד, עם מערכת דירוגים שקופה.
            </p>
            
            {/* Hero Search */}
            <div className="max-w-xl mx-auto mb-6">
              <form action="/catalog" className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-surface-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="חפש בושם, מותג, תווי ריח..."
                  className="w-full pr-12 pl-32 py-4 bg-white border-2 border-surface-200 rounded-2xl text-base placeholder:text-surface-400 focus:outline-none focus:ring-4 focus:ring-gold-400/20 focus:border-gold-400 shadow-lg transition-all"
                />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] transition-colors"
                >
                  חפש
                </button>
              </form>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-surface-400">
              <span>חיפוש חכם</span>
              <span>•</span>
              <span>תמיכה בעברית</span>
              <span>•</span>
              <span>שימוש חינמי</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-surface-900 mb-3">איך זה עובד?</h2>
            <p className="text-surface-500">שלושה צעדים פשוטים למציאת הבושם המושלם</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: 'חפשו',
                description: 'חפשו את הבושם שאתם מחפשים מתוך מאות אפשרויות',
                step: '01',
              },
              {
                icon: TrendingUp,
                title: 'השוו מחירים',
                description: 'ראו את כל המוכרים והשוו מחירים ודירוגים',
                step: '02',
              },
              {
                icon: ShieldCheck,
                title: 'רכשו בביטחון',
                description: 'צרו קשר עם המוכר המדורג ורכשו בביטחון מלא',
                step: '03',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl border border-surface-200 hover:border-gold-300 hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className="absolute -top-3 right-6 px-3 py-0.5 bg-gold-400 text-white text-xs font-bold rounded-full">
                  {item.step}
                </div>
                <div className="size-14 rounded-xl bg-surface-50 flex items-center justify-center mb-5 group-hover:bg-gold-50 transition-colors">
                  <item.icon className="size-7 text-surface-600 group-hover:text-gold-500 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-2">{item.title}</h3>
                <p className="text-surface-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-surface-900 mb-3">למה לסמוך עלינו?</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: 'מוכרים מאומתים', value: 'מערכת אימות' },
              { icon: Star, label: 'מערכת דירוגים', value: 'שקופה וניטרלית' },
              { icon: Users, label: 'קהילת מוכרים', value: 'פעילה וגדלה' },
              { icon: Sparkles, label: 'שימוש חינמי', value: 'ללא עמלות' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white border border-surface-200">
                <div className="size-12 rounded-xl bg-gold-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="size-6 text-gold-500" />
                </div>
                <h3 className="font-bold text-surface-900 mb-1">{item.label}</h3>
                <p className="text-sm text-surface-500">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
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
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-[#333] transition-colors shadow-lg"
            >
              פרסם מודעה
              <ArrowLeft className="size-4" />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-surface-200 text-surface-700 rounded-xl font-medium hover:bg-surface-50 transition-colors"
            >
              עיין בקטלוג
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
