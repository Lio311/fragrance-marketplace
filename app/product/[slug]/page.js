import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, Users, ShieldCheck, BadgeCheck } from 'lucide-react';
import StarRating from '@/app/components/StarRating';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
        <Link href="/" className="hover:text-blue-500 transition-colors">דף הבית</Link>
        <ArrowRight className="size-3 flip-rtl" />
        <Link href="/catalog" className="hover:text-blue-500 transition-colors">קטלוג</Link>
        <ArrowRight className="size-3 flip-rtl" />
        <span className="text-surface-900 font-medium">{fragrance.name_he}</span>
      </nav>

      {/* Product Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Image */}
        <div className="relative aspect-square bg-surface-50 rounded-2xl overflow-hidden border border-surface-200">
          {fragrance.image_url ? (
            <Image
              src={fragrance.image_url}
              alt={fragrance.name_he}
              fill
              className="object-contain p-8"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-surface-300">
              <div className="text-center">
                <div className="text-7xl mb-4">🧴</div>
                <p className="text-sm text-surface-400">תמונה רשמית תתווסף בקרוב</p>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-1">
            <span className="text-sm text-blue-500 font-medium">{fragrance.brand_he}</span>
          </div>
          <h1 className="text-3xl font-bold text-surface-900 mb-4">{fragrance.name_he}</h1>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3 mb-6">
            {fragrance.concentration && (
              <span className="px-3 py-1 bg-surface-50 border border-surface-200 rounded-full text-sm font-medium text-surface-600">
                {fragrance.concentration}
              </span>
            )}
            {fragrance.gender && (
              <span className="px-3 py-1 bg-surface-50 border border-surface-200 rounded-full text-sm font-medium text-surface-600">
                {fragrance.gender === 'men' ? 'גברים' : fragrance.gender === 'women' ? 'נשים' : 'יוניסקס'}
              </span>
            )}
            {fragrance.year_released && (
              <span className="px-3 py-1 bg-surface-50 border border-surface-200 rounded-full text-sm font-medium text-surface-600">
                {fragrance.year_released}
              </span>
            )}
          </div>

          {/* Description */}
          {fragrance.description_he && (
            <p className="text-surface-600 leading-relaxed mb-6">
              {fragrance.description_he}
            </p>
          )}

          {/* Fragrance Notes Pyramid */}
          {(fragrance.top_notes?.length > 0 || fragrance.heart_notes?.length > 0 || fragrance.base_notes?.length > 0) && (
            <div className="bg-surface-50 rounded-2xl p-6 border border-surface-200">
              <h3 className="text-sm font-bold text-surface-900 mb-4">פירמידת ריחות</h3>
              <div className="flex flex-col gap-3">
                {fragrance.top_notes?.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-blue-500">תווים עליונים</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {fragrance.top_notes.map((note, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-white border border-surface-200 rounded-full text-xs text-surface-600">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {fragrance.heart_notes?.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-blue-500">תווי לב</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {fragrance.heart_notes.map((note, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-white border border-surface-200 rounded-full text-xs text-surface-600">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {fragrance.base_notes?.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-blue-500">תווי בסיס</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {fragrance.base_notes.map((note, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-white border border-surface-200 rounded-full text-xs text-surface-600">
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

      {/* Seller Listings Section — FIFA UT Style */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">מוכרים שמציעים את הבושם הזה</h2>
            <p className="text-surface-500 text-sm mt-1">
              {listings.length > 0 ? `${listings.length} מוכרים פעילים` : 'אין מוכרים כרגע'}
            </p>
          </div>
        </div>

        <SellerListingsClient listings={listings} />
      </section>
    </div>
  );
}
