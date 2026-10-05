# Zaré Scents. Parfums de Luxe

Luxury perfume e-commerce for [www.zarescents.com](https://www.zarescents.com).

Stack: **Next.js 16 · Supabase · Tailwind · Framer Motion**

## Setup

### 1. Install & env

```bash
npm install
```

`.env.local` is already configured with your Supabase URL + anon key.

### 2. Database (required once)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**
2. Paste and run the full contents of `supabase/schema.sql`
3. This creates tables, RLS, `place_order` RPC, and seed products

### 3. Create admin user

1. Supabase → **Authentication** → **Users** → **Add user**
   - Email + password (this is your admin login)
2. Copy the user **UUID**
3. In SQL Editor run:

```sql
insert into public.admin_profiles (id, email, full_name)
values ('PASTE-USER-UUID-HERE', 'your@email.com', 'Zaré Admin');
```

### 4. Run locally

```bash
npm run dev
```

- Store: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  

## Features

- Luxury storefront (home, shop, product, cart, checkout)
- Guest checkout · Cash on Delivery · PKR · free shipping Rs. 4,000+
- Admin: products CRUD, orders + status, customers from checkouts
- SEO: metadata, OG, sitemap, robots, product JSON-LD
- Custom-generated product imagery in `/public/images`

## Deploy

Connect the repo to Vercel, set the same env vars, point `www.zarescents.com` to the project.
