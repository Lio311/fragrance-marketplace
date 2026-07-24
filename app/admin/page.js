import { Package, Users, ArrowLeftRight, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-surface-900 mb-2">לוח ניהול</h1>
      <p className="text-surface-500 mb-8">סקירה כללית של הפלטפורמה</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Users, label: 'סה"כ משתמשים', value: '0', change: '+0', color: 'text-blue-500 bg-blue-50' },
          { icon: Package, label: 'מודעות פעילות', value: '0', change: '+0', color: 'text-purple-500 bg-purple-50' },
          { icon: ArrowLeftRight, label: 'עסקאות שהושלמו', value: '0', change: '+0', color: 'text-emerald-500 bg-emerald-50' },
          { icon: AlertTriangle, label: 'סכסוכים פתוחים', value: '0', change: '0', color: 'text-slate-500 bg-slate-50' },
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

      {/* Recent Activity */}
      <div className="bg-white border border-surface-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2">
          <Activity className="size-5" />
          פעילות אחרונה
        </h2>
        <div className="text-center py-12">
          <p className="text-surface-400">אין פעילות עדיין — הפלטפורמה מוכנה לפעולה!</p>
        </div>
      </div>
    </div>
  );
}
