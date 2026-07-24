'use client';

import { Star } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function StarRating({ rating = 0, maxStars = 5, size = 'sm', showValue = false, className }) {
  const sizes = {
    xs: 'size-3',
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  };

  return (
    <div className={cn('star-rating flex items-center gap-1', className)} dir="ltr">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => {
          const filled = i < Math.floor(rating);
          const halfFilled = !filled && i < rating;
          return (
            <Star
              key={i}
              className={cn(
                sizes[size],
                'transition-colors',
                filled ? 'text-amber-400 fill-amber-400' : halfFilled ? 'text-amber-400 fill-amber-200' : 'text-surface-300'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-surface-600 mr-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
