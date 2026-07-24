'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Package, DollarSign, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/app/lib/utils';

const CONDITIONS = [
  { value: 'new_sealed', label: 'חדש אטום', emoji: '✨' },
  { value: 'new_opened', label: 'חדש פתוח', emoji: '📦' },
  { value: 'used', label: 'משומש', emoji: '🧴' },
  { value: 'tester', label: 'טסטר', emoji: '🧪' },
];

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fragranceName: '',
    brandName: '',
    price: '',
    condition: 'used',
    fillLevel: 100,
    bottleSize: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fragranceName || !form.brandName || !form.price) {
      toast.error('נא למלא את כל השדות הנדרשים');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('המודעה פורסמה בהצלחה!');
        router.push('/dashboard');
      } else {
        const data = await res.json();
        toast.error(data.error || 'שגיאה בפרסום המודעה');
      }
    } catch (err) {
      toast.error('שגיאה בפרסום המודעה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-surface-900 mb-2">פרסם מודעה חדשה</h1>
      <p className="text-surface-500 mb-8">הוסף בושם למכירה — המודעה תופיע בקטלוג לאחר אישור</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Fragrance Name */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">שם הבושם *</label>
          <input
            type="text"
            value={form.fragranceName}
            onChange={(e) => setForm({ ...form, fragranceName: e.target.value })}
            placeholder="לדוגמה: Bleu de Chanel"
            className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">מותג *</label>
          <input
            type="text"
            value={form.brandName}
            onChange={(e) => setForm({ ...form, brandName: e.target.value })}
            placeholder="לדוגמה: Chanel"
            className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">מחיר (₪) *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0"
            min="1"
            className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
            dir="ltr"
            required
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">מצב הבקבוק</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm({ ...form, condition: c.value })}
                className={cn(
                  'p-3 rounded-xl border text-sm font-medium text-center transition-all',
                  form.condition === c.value
                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                    : 'border-surface-200 bg-white text-surface-600 hover:bg-surface-50'
                )}
              >
                <div className="text-xl mb-1">{c.emoji}</div>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fill Level */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">
            אחוז מילוי: {form.fillLevel}%
          </label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={form.fillLevel}
            onChange={(e) => setForm({ ...form, fillLevel: parseInt(e.target.value) })}
            className="w-full accent-blue-400"
          />
          <div className="flex justify-between text-xs text-surface-400 mt-1">
            <span>5%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Bottle Size */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">גודל בקבוק (מ"ל)</label>
          <input
            type="number"
            value={form.bottleSize}
            onChange={(e) => setForm({ ...form, bottleSize: e.target.value })}
            placeholder="100"
            className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
            dir="ltr"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">תיאור (אופציונלי)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="ספר על הבושם, מתי נקנה, שימוש..."
            rows={3}
            className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'מפרסם...' : 'פרסם מודעה'}
        </button>

        <p className="text-xs text-surface-400 text-center">
          <Info className="size-3 inline-block ml-1" />
          המודעה תופיע בקטלוג לאחר אישור מנהל
        </p>
      </form>
    </div>
  );
}
