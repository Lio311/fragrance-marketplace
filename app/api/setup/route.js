import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { checkAdmin } from '@/app/lib/admin';

export async function POST() {
  try {
    // Only allow admin or dev
    if (process.env.NODE_ENV === 'production') {
      const isAdmin = await checkAdmin();
      if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        full_name TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'user',
        is_verified_seller BOOLEAN DEFAULT FALSE,
        is_banned BOOLEAN DEFAULT FALSE,
        avg_rating DECIMAL(3,2) DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        total_sales INTEGER DEFAULT 0,
        bio TEXT,
        phone TEXT,
        city TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        last_active_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS fragrances (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name_he TEXT NOT NULL,
        name_en TEXT,
        brand_he TEXT NOT NULL,
        brand_en TEXT,
        description_he TEXT,
        description_en TEXT,
        image_url TEXT,
        concentration TEXT,
        gender TEXT DEFAULT 'unisex',
        top_notes TEXT[],
        heart_notes TEXT[],
        base_notes TEXT[],
        year_released INTEGER,
        perfumer TEXT,
        size_ml INTEGER,
        status TEXT DEFAULT 'pending',
        submitted_by TEXT REFERENCES users(id),
        approved_by TEXT REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        fragrance_id INTEGER REFERENCES fragrances(id) ON DELETE CASCADE,
        seller_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        price DECIMAL(10,2) NOT NULL,
        condition TEXT DEFAULT 'used',
        fill_level INTEGER DEFAULT 100,
        bottle_size_ml INTEGER,
        seller_photo_url TEXT,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        is_moderated BOOLEAN DEFAULT FALSE,
        views_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER REFERENCES listings(id),
        fragrance_id INTEGER REFERENCES fragrances(id),
        buyer_id TEXT REFERENCES users(id),
        seller_id TEXT REFERENCES users(id),
        price DECIMAL(10,2),
        status TEXT DEFAULT 'pending',
        buyer_confirmed BOOLEAN DEFAULT FALSE,
        seller_confirmed BOOLEAN DEFAULT FALSE,
        dispute_reason TEXT,
        dispute_resolved_at TIMESTAMPTZ,
        resolved_by TEXT REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        transaction_id INTEGER REFERENCES transactions(id),
        reviewer_id TEXT REFERENCES users(id),
        seller_id TEXT REFERENCES users(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS fragrance_submissions (
        id SERIAL PRIMARY KEY,
        name_he TEXT NOT NULL,
        brand_he TEXT NOT NULL,
        submitted_by TEXT REFERENCES users(id),
        photo_url TEXT,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        linked_fragrance_id INTEGER REFERENCES fragrances(id),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value JSONB
      );

      CREATE INDEX IF NOT EXISTS idx_listings_fragrance ON listings(fragrance_id) WHERE is_active = TRUE;
      CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_id);
      CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price) WHERE is_active = TRUE;
      CREATE INDEX IF NOT EXISTS idx_fragrances_slug ON fragrances(slug);
      CREATE INDEX IF NOT EXISTS idx_fragrances_status ON fragrances(status);
      CREATE INDEX IF NOT EXISTS idx_reviews_seller ON reviews(seller_id);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);

    return NextResponse.json({ message: 'Database schema created successfully' });
  } catch (err) {
    console.error('Setup error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
