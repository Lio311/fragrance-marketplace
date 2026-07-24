import { currentUser } from '@clerk/nextjs/server';

export async function checkAdmin() {
  const user = await currentUser();
  if (!user) return false;

  const email = user.emailAddresses?.[0]?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (email === adminEmail) return true;

  const role = user.publicMetadata?.role;
  if (role === 'admin') return true;

  return false;
}

export async function checkCronOrAdmin(req) {
  if (process.env.NODE_ENV !== 'production') return true;

  const authHeader = req.headers?.get?.('authorization');
  const isCronSecretValid =
    process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (isCronSecretValid) return true;

  try {
    const isAdmin = await checkAdmin();
    if (isAdmin) return true;
  } catch (e) {
    console.error('checkCronOrAdmin error:', e);
  }

  return false;
}
