import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import pool from '@/app/lib/db';
import { checkAdmin } from '@/app/lib/admin';

export async function GET(req) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await pool.query(
      `SELECT id, email, full_name, avatar_url, role, seller_status, id_document_url, is_banned, is_verified_seller, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ users: result.rows });
  } catch (err) {
    console.error('Admin Users GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (action === 'approve_seller') {
      // Update our database
      await pool.query(
        `UPDATE users 
         SET role = 'seller', seller_status = 'approved', is_verified_seller = true, updated_at = NOW() 
         WHERE id = $1`,
        [userId]
      );

      // Optionally, update Clerk's metadata so middleware recognizes the role immediately
      try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            role: 'seller'
          }
        });
      } catch (clerkErr) {
        console.error('Failed to update Clerk metadata:', clerkErr);
        // Continue anyway since our DB is the source of truth for many things
      }

      return NextResponse.json({ message: 'Seller approved' });
    }

    if (action === 'reject_seller') {
      await pool.query(
        `UPDATE users 
         SET seller_status = 'rejected', updated_at = NOW() 
         WHERE id = $1`,
        [userId]
      );
      return NextResponse.json({ message: 'Seller rejected' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Admin Users PUT error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
