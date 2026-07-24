import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 text-center">
      <div className="text-8xl font-bold text-gold-400 mb-4">404</div>
      <h1 className="text-2xl font-bold mb-2">העמוד לא נמצא</h1>
      <p className="text-surface-500 mb-8 max-w-md">
        העמוד שחיפשתם לא קיים. ייתכן שהוסר או שהכתובת שגויה.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#333] transition-colors"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
}
