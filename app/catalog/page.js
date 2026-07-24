'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '@/app/components/ProductCard';
import { cn } from '@/app/lib/utils';
import { useDebounce } from '@/app/hooks/useDebounce';

const CONCENTRATIONS = ['EDT', 'EDP', 'Parfum', 'Cologne', 'Extrait'];
const GENDERS = [
  { value: 'men', label: 'גברים' },
  { value: 'women', label: 'נשים' },
  { value: 'unisex', label: 'יוניסקס' },
];
const SORT_OPTIONS = [
  { value: 'price_asc', label: 'מחיר נמוך לגבוה' },
  { value: 'price_desc', label: 'מחיר גבוה לנמוך' },
  { value: 'rating', label: 'דירוג גבוה' },
  { value: 'newest', label: 'הכי חדש' },
  { value: 'sellers', label: 'הכי הרבה מוכרים' },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [fragrances, setFragrances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  const [filters, setFilters] = useState({
    gender: '',
    concentration: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchFragrances();
  }, [debouncedSearch, sortBy, filters]);

  async function fetchFragrances() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('q', debouncedSearch);
      if (sortBy) params.set('sort', sortBy);
      if (filters.gender) params.set('gender', filters.gender);
      if (filters.concentration) params.set('concentration', filters.concentration);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.brand) params.set('brand', filters.brand);
      
      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFragrances(data.fragrances || []);
      }
    } catch (err) {
      console.error('Failed to fetch fragrances:', err);
    } finally {
      setLoading(false);
    }
  }

  const clearFilters = () => {
    setFilters({ gender: '', concentration: '', minPrice: '', maxPrice: '', brand: '' });
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-gradient-gold drop-shadow-xl tracking-tight">
            הקולקציה שלנו
          </h1>
          <p className="text-white/60 text-lg">גלו את אוסף בשמי היוקרה הטובים בעולם</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative flex-1 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-white/40 group-focus-within:text-[#d4af37] transition-colors" />
            <input
              type="text"
              placeholder="חיפוש בשמים, מותגים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-base placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full sm:w-auto px-5 py-4 pr-12 bg-white/5 border border-white/10 rounded-2xl text-base focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all cursor-pointer hover:bg-white/10"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/40 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-medium border transition-all duration-300',
              showFilters || activeFilterCount > 0
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#ffdf73]'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
            )}
          >
            <SlidersHorizontal className="size-5" />
            סינון
            {activeFilterCount > 0 && (
              <span className="size-5 rounded-full bg-[#d4af37] text-black text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">סינון מתקדם</h3>
              <button onClick={clearFilters} className="text-sm text-[#d4af37] hover:text-[#ffdf73] transition-colors">
                נקה הכל
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">מגדר</label>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="" className="bg-[#1a1a1a]">הכל</option>
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value} className="bg-[#1a1a1a]">{g.label}</option>
                  ))}
                </select>
              </div>

              {/* Concentration */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">ריכוז</label>
                <select
                  value={filters.concentration}
                  onChange={(e) => setFilters({ ...filters, concentration: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="" className="bg-[#1a1a1a]">הכל</option>
                  {CONCENTRATIONS.map((c) => (
                    <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">מחיר מינימלי (₪)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] placeholder:text-white/20"
                  dir="ltr"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">מחיר מקסימלי (₪)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  placeholder="5000"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] placeholder:text-white/20"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                <div className="skeleton aspect-square opacity-20" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-1/4 opacity-20" />
                  <div className="skeleton h-5 w-3/4 opacity-20" />
                  <div className="skeleton h-4 w-1/2 opacity-20" />
                </div>
              </div>
            ))}
          </div>
        ) : fragrances.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 stagger-children">
            {fragrances.map((f) => (
              <ProductCard key={f.id} fragrance={f} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/5 border border-white/10 rounded-3xl mt-8">
            <div className="text-6xl mb-6 opacity-80">✨</div>
            <h3 className="text-2xl font-bold text-white mb-3">לא נמצאו בשמים</h3>
            <p className="text-white/50 mb-8 max-w-md mx-auto">לא מצאנו תוצאות שתואמות לחיפוש שלך. נסה לשנות את הסינון כדי לראות עוד אפשרויות.</p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              נקה סינון והצג הכל
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#d4af37] text-xl animate-pulse">טוען קולקציה...</div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
