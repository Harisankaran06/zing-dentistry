# Zing Dentistry — Project Setup (Component 1 + 3)

This is the foundation: Next.js + Tailwind scaffold, wired to Supabase, with the
full database schema ready to run.

## What's in this drop

- Next.js app (App Router) with Tailwind configured to the purple/pink brand palette
- Supabase client (`lib/supabaseClient.js`)
- `supabase/schema.sql` — the 4 core tables: `patients`, `visits`, `appointments`, `images`, with Row Level Security policies already set up
- `.env.local.example` — template for your keys

## Steps to get this running

### 1. Install dependencies
```
npm install
```

### 2. Create your Supabase project
- Go to https://supabase.com → New Project (free tier is enough)
- Once created, go to **Settings → API** and copy:
  - Project URL
  - `anon` public key

### 3. Run the database schema
- In Supabase: **SQL Editor → New Query**
- Paste the entire contents of `supabase/schema.sql`
- Click **Run** — this creates all 4 tables with the correct relationships and security rules

### 4. Create the Storage bucket (for before/after photos)
- In Supabase: **Storage → New Bucket**
- Name it `patient-images`
- Keep it **private** (the app controls what's public via the `is_public` flag in the `images` table, not the bucket itself)

### 5. Set up your admin login
- In Supabase: **Authentication → Users → Add User**
- Add your sister's email + a password — this becomes the single admin login

### 6. Add your environment variables
- Copy `.env.local.example` to `.env.local`
- Fill in the Supabase URL + anon key from step 2
- (Resend API key can be added later, once we build the email component)

### 7. Run the dev server
```
npm run dev
```
Visit `http://localhost:3000` — you should see the Zing Dentistry placeholder home page in the brand colors.

---

## Brand tokens (already wired into `tailwind.config.js`)

| Token | Hex | Use |
|---|---|---|
| `brand-plum` | `#5B2A86` | Headings, primary buttons |
| `brand-orchid` | `#9B4FCE` | Accents, hover states |
| `brand-bloom` | `#E85D9C` | Secondary accent, highlights |
| `brand-petal` | `#FDEBF3` | Pale section backgrounds |
| `brand-mist` | `#F7F3FA` | Alt section backgrounds |
| `brand-ink` | `#2B1B3D` | Body text |

Fonts: **Fraunces** (display/headings) + **Inter** (body) — already loaded in `app/layout.js`.

## Next component
Once you've confirmed this runs and the Supabase tables show up correctly,
next up is **Component 5 + 6: the shared layout (header/nav/footer) and the Home page**.
