'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpDown, MessageCircle, BadgeCheck, ImageIcon, PackageOpen } from 'lucide-react';
import StarRating from '@/app/components/StarRating';
import { cn, formatPrice } from '@/app/lib/utils';

const CONDITION_LABELS = {
  new_sealed: 'חדש אטום',
  new_opened: 'חדש פתוח',
  used: 'משומש',
  tester: 'טסטר',
};

const CONDITION_COLORS = {
  new_sealed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  new_opened: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  used: 'bg-white/10 text-white/70 border-white/20',
  tester: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
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
      <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
        <div className="flex justify-center mb-6 opacity-80 text-white">
          <PackageOpen className="size-16" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">אין מוכרים כרגע</h3>
        <p className="text-white/50 mb-8 max-w-md mx-auto">היו הראשונים להציע את הבושם הזה למכירה בשוק הבשמים.</p>
        <Link
          href="/dashboard/new-listing"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        >
          פרסם מודעה
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center gap-3 mb-6 bg-white/5 p-2 rounded-2xl border border-white/10 w-fit backdrop-blur-sm">
        <div className="flex items-center justify-center size-8 rounded-full bg-white/10 shrink-0">
          <ArrowUpDown className="size-4 text-white/60" />
        </div>
        <span className="text-sm font-medium text-white/50 pl-2">מיון:</span>
        <div className="flex items-center gap-1">
          {[
            { value: 'price_asc', label: 'מחיר ↑' },
            { value: 'price_desc', label: 'מחיר ↓' },
            { value: 'rating', label: 'דירוג מוכר' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                sortBy === opt.value
                  ? 'bg-[#d4af37]/20 text-[#ffdf73] border border-[#d4af37]/30'
                  : 'bg-transparent text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="flex flex-col gap-4">
        {sorted.map((listing, i) => (
          <div
            key={listing.id || i}
            className={cn(
              'group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 sm:p-6 rounded-2xl border transition-all duration-300',
              i === 0 
                ? 'border-[#d4af37]/50 bg-gradient-to-r from-[#d4af37]/10 to-transparent shadow-[0_0_30px_rgba(212,175,55,0.1)]' 
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
            )}
          >
            {/* Rank Badge */}
            {i === 0 && (
              <div className="hidden sm:flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-black text-lg font-extrabold shrink-0 shadow-lg">
                1
              </div>
            )}

            {/* Seller Info */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="size-14 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/20 flex items-center justify-center text-white font-bold overflow-hidden shrink-0 shadow-inner">
                {listing.seller_avatar ? (
                  <img src={listing.seller_avatar} alt="" className="size-full object-cover" />
                ) : (
                  <span className="text-xl text-[#d4af37]">{listing.seller_name?.[0] || '?'}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    href={`/seller/${listing.seller_id}`}
                    className="font-bold text-lg text-white hover:text-[#d4af37] transition-colors truncate"
                  >
                    {listing.seller_name || 'מוכר'}
                  </Link>
                  {listing.seller_verified && (
                    <BadgeCheck className="size-5 text-[#d4af37] shrink-0 drop-shadow-md" />
                  )}
                </div>
                <StarRating rating={listing.seller_rating || 0} size="sm" showValue />
              </div>
            </div>

            {/* Listing Details */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto">
              {/* Condition */}
              <span className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 tracking-wide',
                CONDITION_COLORS[listing.condition] || CONDITION_COLORS.used
              )}>
                {CONDITION_LABELS[listing.condition] || listing.condition}
              </span>

              {/* Fill Level */}
              {listing.fill_level && listing.fill_level < 100 && (
                <div className="flex items-center gap-3 shrink-0 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                  <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#d4af37] to-[#ffdf73] rounded-full transition-all"
                      style={{ width: `${listing.fill_level}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white/80">{listing.fill_level}%</span>
                </div>
              )}

              {/* Seller Photo */}
              {listing.seller_photo_url && (
                <button
                  onClick={() => setSelectedPhoto(listing.seller_photo_url)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs font-bold text-white/70 hover:text-white hover:border-white/30 transition-all shrink-0"
                >
                  <ImageIcon className="size-4" />
                  תמונה
                </button>
              )}
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0 mt-2 sm:mt-0">
              <div className="text-right shrink-0">
                <span className={cn(
                  'text-2xl font-extrabold block direction-ltr',
                  i === 0 ? 'text-[#d4af37]' : 'text-white'
                )}>
                  {formatPrice(listing.price)}
                </span>
                {listing.bottle_size_ml && (
                  <span className="block text-xs font-medium text-white/50">{listing.bottle_size_ml} מ"ל</span>
                )}
              </div>

              <Link
                href={`/seller/${listing.seller_id}`}
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shrink-0 shadow-lg',
                  i === 0
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-white text-black hover:bg-white/90 hover:scale-105'
                )}
              >
                <MessageCircle className="size-5" />
                <span className="hidden xs:inline">צור קשר</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-2xl w-full rounded-[2rem] overflow-hidden bg-[#1a1a1a] border border-white/10 shadow-2xl animate-scale-in">
            <button 
              className="absolute top-4 right-4 z-10 size-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 backdrop-blur-md transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              ✕
            </button>
            <div className="aspect-square relative flex items-center justify-center p-4">
              <Image
                src={selectedPhoto}
                alt="תמונת המוכר"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
