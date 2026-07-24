'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpDown, MessageCircle, BadgeCheck, ImageIcon } from 'lucide-react';
import StarRating from '@/app/components/StarRating';
import { cn, formatPrice } from '@/app/lib/utils';

const CONDITION_LABELS = {
  new_sealed: 'חדש אטום',
  new_opened: 'חדש פתוח',
  used: 'משומש',
  tester: 'טסטר',
};

const CONDITION_COLORS = {
  new_sealed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  new_opened: 'bg-blue-50 text-blue-700 border-blue-200',
  used: 'bg-surface-50 text-surface-600 border-surface-200',
  tester: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function SellerListingsClient({ listings = [] }) {
  const [sortBy, setSortBy] = useState('price_asc');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const sorted = useMemo(() => {
    const items = [...listings];
    switch (sortBy) {
      case 'price_asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return items.sort((a, b) => b.price - a.price);
      case 'rating':
        return items.sort((a, b) => (b.seller_rating || 0) - (a.seller_rating || 0));
      default:
        return items;
    }
  }, [listings, sortBy]);

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 bg-surface-50 rounded-2xl border border-surface-200">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-xl font-bold text-surface-900 mb-2">אין מוכרים כרגע</h3>
        <p className="text-surface-500 mb-6">היו הראשונים למכור את הבושם הזה!</p>
        <Link
          href="/dashboard/new-listing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-[#333] transition-colors"
        >
          פרסם מודעה
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center gap-2 mb-4">
        <ArrowUpDown className="size-4 text-surface-400" />
        <span className="text-sm text-surface-500">מיון:</span>
        {[
          { value: 'price_asc', label: 'מחיר ↑' },
          { value: 'price_desc', label: 'מחיר ↓' },
          { value: 'rating', label: 'דירוג' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSortBy(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              sortBy === opt.value
                ? 'bg-gold-50 text-gold-700 border border-gold-300'
                : 'bg-surface-50 text-surface-600 border border-surface-200 hover:bg-surface-100'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="flex flex-col gap-3">
        {sorted.map((listing, i) => (
          <div
            key={listing.id || i}
            className={cn(
              'flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border transition-all hover:shadow-card-hover',
              i === 0 ? 'border-gold-300 bg-gold-50/30' : 'border-surface-200 bg-white'
            )}
          >
            {/* Rank Badge */}
            {i === 0 && (
              <div className="hidden sm:flex items-center justify-center size-8 rounded-full bg-gold-400 text-white text-xs font-bold shrink-0">
                1
              </div>
            )}

            {/* Seller Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="size-11 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
                {listing.seller_avatar ? (
                  <img src={listing.seller_avatar} alt="" className="size-full object-cover" />
                ) : (
                  listing.seller_name?.[0] || '?'
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/seller/${listing.seller_id}`}
                    className="font-bold text-surface-900 hover:text-gold-500 transition-colors truncate"
                  >
                    {listing.seller_name || 'מוכר'}
                  </Link>
                  {listing.seller_verified && (
                    <BadgeCheck className="size-4 text-blue-500 shrink-0" />
                  )}
                </div>
                <StarRating rating={listing.seller_rating || 0} size="xs" showValue />
              </div>
            </div>

            {/* Condition */}
            <span className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0',
              CONDITION_COLORS[listing.condition] || CONDITION_COLORS.used
            )}>
              {CONDITION_LABELS[listing.condition] || listing.condition}
            </span>

            {/* Fill Level */}
            {listing.fill_level && listing.fill_level < 100 && (
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-400 rounded-full transition-all"
                    style={{ width: `${listing.fill_level}%` }}
                  />
                </div>
                <span className="text-xs text-surface-500">{listing.fill_level}%</span>
              </div>
            )}

            {/* Seller Photo */}
            {listing.seller_photo_url && (
              <button
                onClick={() => setSelectedPhoto(listing.seller_photo_url)}
                className="flex items-center gap-1 text-xs text-surface-500 hover:text-gold-500 transition-colors shrink-0"
              >
                <ImageIcon className="size-3.5" />
                תמונה
              </button>
            )}

            {/* Price */}
            <div className="text-left shrink-0">
              <span className={cn(
                'text-xl font-bold price-ltr',
                i === 0 ? 'text-emerald-600' : 'text-surface-900'
              )}>
                {formatPrice(listing.price)}
              </span>
              {listing.bottle_size_ml && (
                <span className="block text-xs text-surface-500">{listing.bottle_size_ml} מ"ל</span>
              )}
            </div>

            {/* Contact Button */}
            <Link
              href={`/seller/${listing.seller_id}`}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0',
                i === 0
                  ? 'bg-[#1a1a1a] text-white hover:bg-[#333]'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              )}
            >
              <MessageCircle className="size-4" />
              צור קשר
            </Link>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-lg w-full max-h-[80vh] rounded-2xl overflow-hidden bg-white animate-scale-in">
            <Image
              src={selectedPhoto}
              alt="תמונת המוכר"
              width={600}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
