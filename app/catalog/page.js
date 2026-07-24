'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">קטלוג בשמים</h1>
        <p className="text-surface-500">כל הבשמים במקום אחד — מצאו את הריח שלכם</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-surface-400" />
          <input
            type="text"
            placeholder="חיפוש בשמים, מותגים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full sm:w-auto px-4 py-3 pr-10 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-surface-400 pointer-events-none" />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-colors',
            showFilters || activeFilterCount > 0
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-surface-50 border-surface-200 text-surface-600 hover:bg-surface-100'
          )}
        >
          <SlidersHorizontal className="size-4" />
          סינון
          {activeFilterCount > 0 && (
            <span className="size-5 rounded-full bg-blue-400 text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 mb-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-surface-900">סינון מתקדם</h3>
            <button onClick={clearFilters} className="text-sm text-blue-500 hover:text-blue-600">
              נקה הכל
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">מגדר</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              >
                <option value="">הכל</option>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            {/* Concentration */}
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">ריכוז</label>
              <select
                value={filters.concentration}
                onChange={(e) => setFilters({ ...filters, concentration: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              >
                <option value="">הכל</option>
                {CONCENTRATIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">מחיר מינימלי (₪)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                dir="ltr"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">מחיר מקסימלי (₪)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="5000"
                className="w-full px-3 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="skeleton aspect-square" />
              <div className="p-3.5 space-y-2">
                <div className="skeleton h-3 w-16" />
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : fragrances.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
          {fragrances.map((f) => (
            <ProductCard key={f.id} fragrance={f} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-surface-900 mb-2">לא נמצאו תוצאות</h3>
          <p className="text-surface-500 mb-6">נסו לשנות את מילות החיפוש או הסינון</p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 bg-surface-100 text-surface-700 rounded-xl text-sm font-medium hover:bg-surface-200 transition-colors"
          >
            נקה סינון
          </button>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center py-20">טוען קטלוג...</div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
