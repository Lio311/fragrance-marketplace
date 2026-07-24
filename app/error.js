'use client';

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 text-center">
      <div className="text-6xl mb-4">😔</div>
      <h1 className="text-2xl font-bold mb-2">שגיאה</h1>
      <p className="text-surface-500 mb-8 max-w-md">
        אירעה שגיאה בלתי צפויה. נסו שוב או חזרו לדף הבית.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#333] transition-colors"
      >
        נסה שוב
      </button>
    </div>
  );
}
