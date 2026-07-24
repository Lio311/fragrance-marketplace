import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, Eye, Star, TrendingUp, Plus, Settings } from 'lucide-react';

export const metadata = {
  title: 'לוח בקרה',
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">לוח בקרה</h1>
          <p className="text-surface-500 mt-1">שלום, {user.firstName || 'מוכר'}! 👋</p>
        </div>
        <Link
          href="/dashboard/new-listing"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] transition-colors"
        >
          <Plus className="size-4" />
          מודעה חדשה
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Package, label: 'מודעות פעילות', value: '0', color: 'text-blue-500 bg-blue-50' },
          { icon: Eye, label: 'סה"כ צפיות', value: '0', color: 'text-purple-500 bg-purple-50' },
          { icon: Star, label: 'דירוג ממוצע', value: '—', color: 'text-amber-500 bg-amber-50' },
          { icon: TrendingUp, label: 'סה"כ מכירות', value: '0', color: 'text-emerald-500 bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-surface-200 rounded-2xl p-5">
            <div className={`size-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="size-5" />
            </div>
            <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
            <p className="text-sm text-surface-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/listings"
          className="flex items-center gap-4 p-6 bg-white border border-surface-200 rounded-2xl hover:border-gold-300 hover:shadow-card-hover transition-all group"
        >
          <div className="size-12 rounded-xl bg-surface-50 flex items-center justify-center group-hover:bg-gold-50 transition-colors">
            <Package className="size-6 text-surface-600 group-hover:text-gold-500 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-surface-900">המודעות שלי</h3>
            <p className="text-sm text-surface-500">נהל, ערוך ועדכן את המודעות שלך</p>
          </div>
        </Link>

        <Link
          href="/dashboard/new-listing"
          className="flex items-center gap-4 p-6 bg-white border border-surface-200 rounded-2xl hover:border-gold-300 hover:shadow-card-hover transition-all group"
        >
          <div className="size-12 rounded-xl bg-surface-50 flex items-center justify-center group-hover:bg-gold-50 transition-colors">
            <Plus className="size-6 text-surface-600 group-hover:text-gold-500 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-surface-900">פרסם מודעה חדשה</h3>
            <p className="text-sm text-surface-500">הוסף בושם חדש למכירה</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
