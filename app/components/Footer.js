import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-50 border-t border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <Sparkles className="size-5" />
              </div>
              <span className="text-lg font-bold">
                Fragrance
                <span className="text-blue-500"> Marketplace</span>
              </span>
            </Link>
            <p className="text-sm text-surface-500 leading-relaxed">
              שוק הבשמים המקוון — השוו מחירים ממוכרים מדורגים,
              מצאו את העסקה הטובה ביותר.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-surface-900 mb-4">ניווט מהיר</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/catalog" className="text-sm text-surface-500 hover:text-blue-500 transition-colors">
                  קטלוג
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-surface-500 hover:text-blue-500 transition-colors">
                  לוח בקרה
                </Link>
              </li>
              <li>
                <Link href="/dashboard/new-listing" className="text-sm text-surface-500 hover:text-blue-500 transition-colors">
                  פרסם מודעה
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-sm font-bold text-surface-900 mb-4">מידע</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/terms" className="text-sm text-surface-500 hover:text-blue-500 transition-colors">
                  תקנון
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-surface-500 hover:text-blue-500 transition-colors">
                  אודות
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-surface-900 mb-4">תמיכה</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/terms#disputes" className="text-sm text-surface-500 hover:text-blue-500 transition-colors">
                  פתרון סכסוכים
                </Link>
              </li>
              <li>
                <Link href="/terms#buyer-protection" className="text-sm text-surface-500 hover:text-blue-500 transition-colors">
                  הגנת קונים
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-400">
            © {currentYear} Fragrance Marketplace. כל הזכויות שמורות.
          </p>
          <p className="text-xs text-surface-400 flex items-center gap-1">
            נבנה באהבה <Heart className="size-3 text-red-400 fill-red-400" /> 🇮🇱
          </p>
        </div>
      </div>
    </footer>
  );
}
