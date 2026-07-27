-- ============================================================
-- Zing Dentistry — Database Schema
-- Run this in Supabase: Dashboard -> SQL Editor -> New Query
-- ============================================================

-- 1. PATIENTS (intake info, matches the paper case sheet)
create table patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_no text not null,
  occupation text,
  address text,
  date_of_birth date,
  age int,
  sex text check (sex in ('Male', 'Female', 'Other')),
  medical_history text,
  past_illness_allergy_surgery text,
  previous_dental_treatment text,
  created_at timestamptz default now()
);

-- 2. VISITS (one patient can have many — the case sheet per visit)
create table visits (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  visit_date date not null default current_date,
  chief_complaint text,
  clinical_findings jsonb, -- { calculus, stains, attrition, caries, missing_teeth, periodontal_status, etc. }
  treatment_plan text,
  treatment_done text,
  amount_charged numeric(10,2),
  amount_paid numeric(10,2),
  payment_mode text check (payment_mode in ('Cash', 'Card', 'UPI', 'Insurance', 'Other')),
  consent_given boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- 3. APPOINTMENTS (public booking form writes here)
create table appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile_no text not null,
  preferred_date date not null,
  time_slot text not null check (time_slot in ('Morning 10-1', 'Afternoon 1-4', 'Evening 4-8')),
  reason text,
  is_existing_patient boolean default false,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  patient_id uuid references patients(id), -- linked once matched/created
  created_at timestamptz default now()
);

-- 4. IMAGES (before/after photos, tied to a visit, public/private toggle)
create table images (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  visit_id uuid references visits(id) on delete cascade,
  storage_path text not null, -- path inside the Supabase Storage bucket
  label text check (label in ('before', 'after')),
  is_public boolean default false, -- sister toggles this to show on the public gallery
  created_at timestamptz default now()
);

-- ============================================================
-- Indexes for common lookups
-- ============================================================
create index idx_visits_patient_id on visits(patient_id);
create index idx_images_patient_id on images(patient_id);
create index idx_appointments_date on appointments(preferred_date);
create index idx_appointments_status on appointments(status);

-- ============================================================
-- Row Level Security
-- Public site can only INSERT appointments (booking form) and
-- SELECT images where is_public = true (gallery).
-- Everything else requires an authenticated admin (your sister's login).
-- ============================================================
alter table patients enable row level security;
alter table visits enable row level security;
alter table appointments enable row level security;
alter table images enable row level security;

-- Admin (authenticated) full access
create policy "Admin full access - patients" on patients
  for all using (auth.role() = 'authenticated');
create policy "Admin full access - visits" on visits
  for all using (auth.role() = 'authenticated');
create policy "Admin full access - appointments" on appointments
  for all using (auth.role() = 'authenticated');
create policy "Admin full access - images" on images
  for all using (auth.role() = 'authenticated');

-- Public: anyone can submit an appointment request
create policy "Public can create appointments" on appointments
  for insert with check (true);

-- Public: anyone can view only images marked public (before/after gallery)
create policy "Public can view public images" on images
  for select using (is_public = true);
