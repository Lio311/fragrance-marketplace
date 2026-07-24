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
    <Link href={`/product/${slug}`} className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-[#d4af37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-white/5 to-transparent overflow-hidden flex items-center justify-center p-6">
        {image_url ? (
          <Image
            src={image_url}
            alt={name_he}
            fill
            className="object-contain p-6 drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/20 text-5xl">
            🧴
          </div>
        )}

        {/* Price Badge */}
        {lowest_price && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <TrendingDown className="size-3.5" />
              <span className="direction-ltr">{formatPrice(lowest_price)}</span>
            </div>
          </div>
        )}

        {/* Condition Tags */}
        {concentration && (
          <div className="absolute top-4 right-4">
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white/90 border border-white/20 tracking-wider">
              {concentration}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 border-t border-white/5">
        <p className="text-xs text-[#d4af37] font-bold tracking-widest mb-1.5 uppercase">{brand_he}</p>
        <h3 className="text-base font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-[#ffdf73] transition-colors">
          {name_he}
        </h3>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          {/* Sellers Count */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-white/50">
            <Users className="size-4 opacity-70" />
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
