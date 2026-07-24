import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/app/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const gender = searchParams.get('gender') || '';
    const concentration = searchParams.get('concentration') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'price_asc';

    let query = `
      SELECT 
        f.id, f.slug, f.name_he, f.brand_he, f.image_url, 
        f.concentration, f.gender,
        MIN(l.price) as lowest_price,
        COUNT(DISTINCT l.seller_id) as sellers_count,
        COALESCE(AVG(u.avg_rating), 0) as avg_rating
      FROM fragrances f
      LEFT JOIN listings l ON l.fragrance_id = f.id AND l.is_active = true
      LEFT JOIN users u ON u.id = l.seller_id
      WHERE f.status = 'approved'
    `;
    const params = [];
    let paramIndex = 1;

    if (q) {
      query += ` AND (f.name_he ILIKE $${paramIndex} OR f.brand_he ILIKE $${paramIndex} OR f.name_en ILIKE $${paramIndex} OR f.brand_en ILIKE $${paramIndex})`;
      params.push(`%${q}%`);
      paramIndex++;
    }
    if (gender) {
      query += ` AND f.gender = $${paramIndex}`;
      params.push(gender);
      paramIndex++;
    }
    if (concentration) {
      query += ` AND f.concentration = $${paramIndex}`;
      params.push(concentration);
      paramIndex++;
    }

    query += ` GROUP BY f.id`;

    if (minPrice) {
      query += ` HAVING MIN(l.price) >= $${paramIndex}`;
      params.push(parseFloat(minPrice));
      paramIndex++;
    }
    if (maxPrice) {
      query += ` ${minPrice ? 'AND' : 'HAVING'} MIN(l.price) <= $${paramIndex}`;
      params.push(parseFloat(maxPrice));
      paramIndex++;
    }

    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY lowest_price ASC NULLS LAST';
        break;
      case 'price_desc':
        query += ' ORDER BY lowest_price DESC NULLS LAST';
        break;
      case 'rating':
        query += ' ORDER BY avg_rating DESC';
        break;
      case 'newest':
        query += ' ORDER BY f.created_at DESC';
        break;
      case 'sellers':
        query += ' ORDER BY sellers_count DESC';
        break;
      default:
        query += ' ORDER BY f.created_at DESC';
    }

    query += ' LIMIT 50';

    const result = await pool.query(query, params);
    return NextResponse.json({ fragrances: result.rows });
  } catch (err) {
    console.error('Products API error:', err);
    return NextResponse.json({ fragrances: [] });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name_he, brand_he, description_he, concentration, gender } = body;

    if (!name_he || !brand_he) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO fragrance_submissions (name_he, brand_he, submitted_by, notes, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id`,
      [name_he, brand_he, userId, description_he || '']
    );

    return NextResponse.json({ id: result.rows[0].id, message: 'Submission received' });
  } catch (err) {
    console.error('Products POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
