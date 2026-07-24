import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';

export const metadata = {
  title: 'פאנל ניהול',
};

export default async function AdminLayout({ children }) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const isAdmin =
    user.publicMetadata?.role === 'admin' ||
    user.emailAddresses?.[0]?.emailAddress === process.env.ADMIN_EMAIL;

  if (!isAdmin) redirect('/');

  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar />
      <div className="flex-1 lg:mr-64">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
