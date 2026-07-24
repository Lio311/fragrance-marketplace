'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BecomeSellerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('הקובץ גדול מדי. מקסימום 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idImage) {
      toast.error('נא להעלות צילום תעודת זהות');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/seller-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idDocumentUrl: idImage }),
      });
      
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        toast.error(data.error || 'שגיאה בשליחת הבקשה');
      }
    } catch (err) {
      toast.error('שגיאה בשליחת הבקשה');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-surface-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center">
          <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="size-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 mb-4">הבקשה נשלחה בהצלחה!</h2>
          <p className="text-surface-600 mb-8 leading-relaxed">
            תעודת הזהות שלך הועברה לבדיקת צוות האתר. תהליך האישור לוקח עד 24 שעות. 
            ברגע שתאושר, תוכל להתחיל למכור בשמים מיד.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-[#333] transition-colors"
          >
            חזרה לדף הבית
            <ArrowLeft className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-surface-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-200">
          <div className="text-center mb-8">
            <div className="size-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="size-7 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-surface-900 mb-2">הרשמה כמוכר</h1>
            <p className="text-surface-500">
              כדי להבטיח קהילה בטוחה ואמינה, אנו דורשים אימות זהות מכל המוכרים שלנו.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-surface-900 mb-2">
                צילום תעודת זהות
              </label>
              <div className="border-2 border-dashed border-surface-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-surface-50 cursor-pointer relative overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {idImage ? (
                  <div className="flex flex-col items-center">
                    <img src={idImage} alt="ID Preview" className="h-32 object-contain mb-3 rounded-lg shadow-sm" />
                    <span className="text-sm font-medium text-blue-600">החלף תמונה</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-surface-500">
                    <Upload className="size-8 mb-3 text-surface-400" />
                    <span className="font-medium text-surface-700">לחץ לבחירת קובץ או גרור לכאן</span>
                    <span className="text-xs mt-1">JPEG, PNG עד 5MB</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-surface-500 mt-3 leading-relaxed">
                המידע נשמר באופן מאובטח ומשמש אך ורק לאימות זהותך מול צוות האתר. 
                הוא לעולם לא יוצג לקונים או יועבר לצד שלישי.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !idImage}
              className="w-full py-3.5 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'שולח לאישור...'
              ) : (
                <>
                  שלח תעודה לאישור מנהל
                  <ShieldCheck className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
