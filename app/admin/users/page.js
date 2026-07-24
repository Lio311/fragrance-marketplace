'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Search, ShieldAlert, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending_sellers, sellers, users

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSellerApproval = async (userId, action) => {
    try {
      const res = await fetch(`/api/admin/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }), // action: 'approve_seller' or 'reject_seller'
      });
      if (res.ok) {
        toast.success(action === 'approve_seller' ? 'המוכר אושר' : 'בקשת המוכר נדחתה');
        fetchUsers();
      } else {
        toast.error('שגיאה בעדכון המשתמש');
      }
    } catch (err) {
      toast.error('שגיאה בעדכון המשתמש');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === 'pending_sellers' && u.seller_status !== 'pending') return false;
    if (filter === 'sellers' && u.role !== 'seller') return false;
    if (filter === 'users' && u.role !== 'user') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-surface-900 mb-2">ניהול משתמשים</h1>
      <p className="text-surface-500 mb-8">אישור מוכרים, חסימות וניהול הרשאות</p>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-surface-400" />
          <input
            type="text"
            placeholder="חיפוש משתמש (שם, אימייל, ID)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30"
        >
          <option value="all">כל המשתמשים</option>
          <option value="pending_sellers">ממתינים לאישור מוכר</option>
          <option value="sellers">מוכרים פעילים</option>
          <option value="users">משתמשים רגילים</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-surface-50 text-surface-500 font-medium border-b border-surface-200">
              <tr>
                <th className="px-6 py-4">משתמש</th>
                <th className="px-6 py-4">תפקיד</th>
                <th className="px-6 py-4">סטטוס מוכר</th>
                <th className="px-6 py-4">תעודת זהות</th>
                <th className="px-6 py-4">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-surface-500">
                    טוען משתמשים...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-surface-200 flex items-center justify-center overflow-hidden shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="size-full object-cover" />
                          ) : (
                            <User className="size-4 text-surface-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-surface-900">{user.full_name || 'ללא שם'}</p>
                          <p className="text-xs text-surface-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        user.role === 'seller' ? 'bg-gold-50 text-gold-700 border-gold-200' :
                        'bg-surface-100 text-surface-600 border-surface-200'
                      )}>
                        {user.role === 'admin' ? <ShieldAlert className="size-3" /> :
                         user.role === 'seller' ? <ShieldCheck className="size-3" /> :
                         <Shield className="size-3" />}
                        {user.role === 'admin' ? 'מנהל' : user.role === 'seller' ? 'מוכר' : 'משתמש'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.seller_status === 'pending' ? (
                        <span className="text-amber-600 font-medium text-xs">ממתין לאישור</span>
                      ) : user.seller_status === 'approved' ? (
                        <span className="text-emerald-600 font-medium text-xs">מאושר</span>
                      ) : user.seller_status === 'rejected' ? (
                        <span className="text-red-600 font-medium text-xs">נדחה</span>
                      ) : (
                        <span className="text-surface-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.id_document_url ? (
                        <a 
                          href={user.id_document_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          צפה בתעודה
                        </a>
                      ) : (
                        <span className="text-surface-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.seller_status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSellerApproval(user.id, 'approve_seller')}
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="אשר מוכר"
                          >
                            <Check className="size-4" />
                          </button>
                          <button
                            onClick={() => handleSellerApproval(user.id, 'reject_seller')}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="דחה בקשה"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-surface-500">
                    לא נמצאו משתמשים.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
