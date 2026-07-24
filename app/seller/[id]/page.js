import Link from 'next/link';
import { ArrowRight, BadgeCheck, Calendar, Package, Star } from 'lucide-react';
import StarRating from '@/app/components/StarRating';
import { formatPrice, getRelativeTimeHe } from '@/app/lib/utils';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `פרופיל מוכר | Fragrance Marketplace`,
  };
}

export default async function SellerProfilePage({ params }) {
  const { id } = await params;

  // Fetch seller data
  let seller = null;
  let listings = [];
  let reviews = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const [sellerRes, reviewsRes] = await Promise.all([
      fetch(`${baseUrl}/api/listings?seller_id=${id}`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/reviews?seller_id=${id}`, { cache: 'no-store' }),
    ]);
    if (sellerRes.ok) {
      const data = await sellerRes.json();
      listings = data.listings || [];
    }
    if (reviewsRes.ok) {
      const data = await reviewsRes.json();
      reviews = data.reviews || [];
    }
  } catch (err) {
    console.error('Error fetching seller:', err);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
        <Link href="/" className="hover:text-blue-500 transition-colors">דף הבית</Link>
        <ArrowRight className="size-3 flip-rtl" />
        <span className="text-surface-900 font-medium">פרופיל מוכר</span>
      </nav>

      {/* Seller Header */}
      <div className="bg-white border border-surface-200 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            ?
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-surface-900">מוכר #{id.slice(0, 8)}</h1>
              <BadgeCheck className="size-5 text-blue-500" />
            </div>
            <StarRating rating={0} size="sm" showValue />
            <div className="flex items-center gap-4 mt-2 text-sm text-surface-500">
              <span className="flex items-center gap-1"><Package className="size-3.5" /> {listings.length} מודעות</span>
              <span className="flex items-center gap-1"><Star className="size-3.5" /> {reviews.length} ביקורות</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Listings */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-surface-900 mb-4">מודעות פעילות</h2>
        {listings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {listings.map((listing, i) => (
              <div key={listing.id || i} className="p-5 bg-white border border-surface-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-surface-900">{listing.fragrance_name || 'בושם'}</h3>
                  <p className="text-sm text-surface-500">{listing.condition}</p>
                </div>
                <span className="text-lg font-bold text-surface-900 price-ltr">
                  {formatPrice(listing.price)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-surface-400 text-center py-8">אין מודעות פעילות</p>
        )}
      </section>

      {/* Reviews */}
      <section>
        <h2 className="text-xl font-bold text-surface-900 mb-4">ביקורות</h2>
        {reviews.length > 0 ? (
          <div className="flex flex-col gap-3">
            {reviews.map((review, i) => (
              <div key={review.id || i} className="p-5 bg-white border border-surface-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={review.rating} size="xs" />
                  <span className="text-sm text-surface-500">{review.reviewer_name || 'קונה'}</span>
                </div>
                {review.comment && <p className="text-surface-600 text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-surface-400 text-center py-8">אין ביקורות עדיין</p>
        )}
      </section>
    </div>
  );
}
