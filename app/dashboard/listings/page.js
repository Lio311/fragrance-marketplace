'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { cn, formatPrice } from '@/app/lib/utils';
import toast from 'react-hot-toast';

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    try {
      const res = await fetch('/api/listings?mine=true');
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  }

  const toggleActive = async (id, currentState) => {
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentState }),
      });
      if (res.ok) {
        setListings(listings.map(l => l.id === id ? { ...l, is_active: !currentState } : l));
        toast.success(currentState ? 'המודעה הושבתה' : 'המודעה הופעלה');
      }
    } catch (err) {
      toast.error('שגיאה בעדכון');
    }
  };

  const deleteListing = async (id) => {
    if (!confirm('בטוח למחוק את המודעה?')) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setListings(listings.filter(l => l.id !== id));
        toast.success('המודעה נמחקה');
      }
    } catch (err) {
      toast.error('שגיאה במחיקה');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-surface-900">המודעות שלי</h1>
        <Link
          href="/dashboard/new-listing"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] transition-colors"
        >
          <Plus className="size-4" />
          מודעה חדשה
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="flex flex-col gap-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className={cn(
                'flex items-center gap-4 p-5 rounded-2xl border transition-all',
                listing.is_active
                  ? 'border-surface-200 bg-white'
                  : 'border-surface-200 bg-surface-50 opacity-60'
              )}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-surface-900 truncate">
                  {listing.fragrance_name || 'בושם'}
                </h3>
                <p className="text-sm text-surface-500">{listing.brand_name || ''}</p>
              </div>
              <span className="text-lg font-bold text-surface-900 price-ltr">
                {formatPrice(listing.price)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleActive(listing.id, listing.is_active)}
                  className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                  title={listing.is_active ? 'השבת' : 'הפעל'}
                >
                  {listing.is_active ? (
                    <Eye className="size-4 text-surface-600" />
                  ) : (
                    <EyeOff className="size-4 text-surface-400" />
                  )}
                </button>
                <button
                  onClick={() => deleteListing(listing.id)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="מחק"
                >
                  <Trash2 className="size-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Package className="size-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-surface-900 mb-2">אין מודעות עדיין</h3>
          <p className="text-surface-500 mb-6">פרסם את הבושם הראשון שלך!</p>
          <Link
            href="/dashboard/new-listing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-[#333] transition-colors"
          >
            <Plus className="size-4" />
            פרסם מודעה
          </Link>
        </div>
      )}
    </div>
  );
}
