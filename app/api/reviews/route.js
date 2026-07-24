import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/app/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('seller_id');

    if (!sellerId) return NextResponse.json({ reviews: [] });

    const result = await pool.query(
      `SELECT r.*, u.full_name as reviewer_name, u.avatar_url as reviewer_avatar
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       WHERE r.seller_id = $1
       ORDER BY r.created_at DESC
       LIMIT 50`,
      [sellerId]
    );

    return NextResponse.json({ reviews: result.rows });
  } catch (err) {
    console.error('Reviews GET error:', err);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { transactionId, sellerId, rating, comment } = await req.json();

    if (!sellerId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid review data' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO reviews (transaction_id, reviewer_id, seller_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)`,
      [transactionId || null, userId, sellerId, rating, comment || '']
    );

    // Update seller's average rating
    await pool.query(
      `UPDATE users SET
        avg_rating = (SELECT AVG(rating) FROM reviews WHERE seller_id = $1),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE seller_id = $1),
        updated_at = NOW()
       WHERE id = $1`,
      [sellerId]
    );

    return NextResponse.json({ message: 'Review submitted' });
  } catch (err) {
    console.error('Reviews POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
