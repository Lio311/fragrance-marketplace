import Link from 'next/link';
import Image from 'next/image';
import { Users, TrendingDown } from 'lucide-react';
import StarRating from './StarRating';
import { formatPrice } from '@/app/lib/utils';

export default function ProductCard({ fragrance }) {
  const {
    slug,
    name_he,
    brand_he,
    image_url,
    concentration,
    gender,
    lowest_price,
    sellers_count,
    avg_rating,
  } = fragrance;

  return (
    <Link href={`/product/${slug}`} className="product-card group block">
      {/* Image */}
      <div className="relative aspect-square bg-surface-50 overflow-hidden">
        {image_url ? (
          <Image
            src={image_url}
            alt={name_he}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-surface-300 text-4xl">
            🧴
          </div>
        )}

        {/* Price Badge */}
        {lowest_price && (
          <div className="absolute bottom-3 left-3">
            <div className="price-badge price-badge--lowest flex items-center gap-1">
              <TrendingDown className="size-3.5" />
              <span>{formatPrice(lowest_price)}</span>
            </div>
          </div>
        )}

        {/* Condition Tags */}
        {concentration && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-surface-600 border border-surface-200">
              {concentration}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-xs text-gold-500 font-medium mb-0.5">{brand_he}</p>
        <h3 className="text-sm font-bold text-surface-900 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors">
          {name_he}
        </h3>

        <div className="flex items-center justify-between">
          {/* Sellers Count */}
          <div className="flex items-center gap-1 text-xs text-surface-500">
            <Users className="size-3.5" />
            <span>{sellers_count || 0} מוכרים</span>
          </div>

          {/* Rating */}
          {avg_rating > 0 && (
            <StarRating rating={avg_rating} size="xs" showValue />
          )}
        </div>
      </div>
    </Link>
  );
}
