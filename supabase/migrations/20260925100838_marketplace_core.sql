create extension if not exists pgcrypto;

do $$ begin
  create type public.contractor_access_role as enum ('normal','house_owner');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.contractor_status as enum ('pending','active','suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_marketplace_status as enum ('new','qualified','available','paused','sold_out','expired','cancelled','invalid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_quality_band as enum ('low','standard','good','excellent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.purchase_status as enum ('created','checkout_open','paid','failed','refunded','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_outcome_status as enum ('unknown','contacted','estimate_scheduled','hired','not_hired','project_cancelled','completed');
exception when duplicate_object then null; end $$;

create table if not exists public.contractor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  email text unique not null,
  business_name text not null,
  slug text unique not null,
  contact_name text,
  phone text,
  website_url text,
  facebook_url text,
  description text,
  logo_url text,
  city text,
  state text not null default 'Arkansas',
  zip text,
  status public.contractor_status not null default 'pending',
  access_role public.contractor_access_role not null default 'normal',
  public_profile_enabled boolean not null default true,
  featured boolean not null default false,
  insurance_verified boolean not null default false,
  license_verified boolean not null default false,
  stripe_customer_id text unique,
  onboarding_completed boolean not null default false,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contractor_services (
  contractor_id uuid not null references public.contractor_profiles(id) on delete cascade,
  service_slug text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (contractor_id, service_slug)
);

create table if not exists public.contractor_territories (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid not null references public.contractor_profiles(id) on delete cascade,
  city text,
  county text,
  zip text,
  radius_miles integer check (radius_miles is null or radius_miles between 1 and 250),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists contractor_territories_contractor_idx on public.contractor_territories(contractor_id);
create index if not exists contractor_territories_city_idx on public.contractor_territories(lower(city)) where city is not null;
create index if not exists contractor_territories_county_idx on public.contractor_territories(lower(county)) where county is not null;

create table if not exists public.contractor_preferences (
  contractor_id uuid primary key references public.contractor_profiles(id) on delete cascade,
  max_lead_price_cents integer check (max_lead_price_cents is null or max_lead_price_cents >= 0),
  min_job_value_cents integer check (min_job_value_cents is null or min_job_value_cents >= 0),
  max_leads_per_week integer check (max_leads_per_week is null or max_leads_per_week between 1 and 100),
  email_notifications boolean not null default true,
  auto_buy_enabled boolean not null default false,
  auto_buy_weekly_budget_cents integer check (auto_buy_weekly_budget_cents is null or auto_buy_weekly_budget_cents >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  public_code text unique not null,
  source text not null default 'website',
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  property_address text,
  area text not null,
  city text,
  county text,
  state text not null default 'Arkansas',
  zip text,
  service_slug text not null,
  original_service text,
  description text not null,
  ai_summary text,
  timeline text,
  property_size text,
  acreage numeric,
  latitude numeric,
  longitude numeric,
  quality_score integer not null default 50 check (quality_score between 0 and 100),
  quality_band public.lead_quality_band not null default 'standard',
  estimated_job_value_min_cents integer,
  estimated_job_value_max_cents integer,
  lead_price_cents integer not null default 1500 check (lead_price_cents >= 0),
  marketplace_status public.lead_marketplace_status not null default 'new',
  marketplace_enabled boolean not null default true,
  max_paid_unlocks integer check (max_paid_unlocks is null or max_paid_unlocks >= 1),
  unlimited_unlocks boolean not null default false,
  paid_unlock_count integer not null default 0 check (paid_unlock_count >= 0),
  expires_at timestamptz,
  is_test boolean not null default false,
  test_enabled boolean not null default false,
  red_dirt_copy_sent_at timestamptz,
  admin_notes text,
  ai_metadata jsonb not null default '{}'::jsonb,
  attribution jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_marketplace_idx on public.leads(marketplace_status, marketplace_enabled, created_at desc);
create index if not exists leads_service_idx on public.leads(service_slug, marketplace_status);
create index if not exists leads_city_idx on public.leads(lower(city)) where city is not null;
create index if not exists leads_county_idx on public.leads(lower(county)) where county is not null;
create index if not exists leads_test_idx on public.leads(is_test, test_enabled);

create table if not exists public.lead_matches (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  contractor_id uuid not null references public.contractor_profiles(id) on delete cascade,
  match_score integer not null default 0 check (match_score between 0 and 100),
  match_reason text,
  notified_at timestamptz,
  hidden_at timestamptz,
  created_at timestamptz not null default now(),
  unique (lead_id, contractor_id)
);

create index if not exists lead_matches_contractor_idx on public.lead_matches(contractor_id, created_at desc);

create table if not exists public.lead_purchases (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete restrict,
  contractor_id uuid not null references public.contractor_profiles(id) on delete restrict,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'usd',
  status public.purchase_status not null default 'created',
  is_test boolean not null default false,
  paid_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lead_purchases_contractor_idx on public.lead_purchases(contractor_id, created_at desc);
create index if not exists lead_purchases_lead_idx on public.lead_purchases(lead_id, created_at desc);

create table if not exists public.lead_unlocks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete restrict,
  contractor_id uuid not null references public.contractor_profiles(id) on delete restrict,
  purchase_id uuid references public.lead_purchases(id) on delete set null,
  unlock_type text not null default 'paid' check (unlock_type in ('paid','manual','house')),
  counts_toward_limit boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists lead_unlocks_contractor_idx on public.lead_unlocks(contractor_id, created_at desc);
create index if not exists lead_unlocks_lead_idx on public.lead_unlocks(lead_id, created_at desc);

create table if not exists public.house_lead_actions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  contractor_id uuid not null references public.contractor_profiles(id) on delete cascade,
  action text not null check (action in ('viewed','saved','claimed','passed','contacted','estimate','won','lost')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists house_lead_actions_lead_idx on public.house_lead_actions(lead_id, created_at desc);

create table if not exists public.lead_outcomes (
  lead_id uuid primary key references public.leads(id) on delete cascade,
  status public.lead_outcome_status not null default 'unknown',
  hired_contractor_id uuid references public.contractor_profiles(id) on delete set null,
  contractor_reported_by uuid references public.contractor_profiles(id) on delete set null,
  customer_confirmed boolean not null default false,
  notes text,
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_events (
  id bigint generated always as identity primary key,
  lead_id uuid references public.leads(id) on delete cascade,
  contractor_id uuid references public.contractor_profiles(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lead_events_lead_idx on public.lead_events(lead_id, created_at desc);

create table if not exists public.reserved_house_accounts (
  email text primary key,
  contractor_id uuid not null references public.contractor_profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon, authenticated;

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contractor_profiles_touch_updated_at on public.contractor_profiles;
create trigger contractor_profiles_touch_updated_at
before update on public.contractor_profiles
for each row execute function private.touch_updated_at();

drop trigger if exists contractor_preferences_touch_updated_at on public.contractor_preferences;
create trigger contractor_preferences_touch_updated_at
before update on public.contractor_preferences
for each row execute function private.touch_updated_at();

drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at
before update on public.leads
for each row execute function private.touch_updated_at();

drop trigger if exists lead_purchases_touch_updated_at on public.lead_purchases;
create trigger lead_purchases_touch_updated_at
before update on public.lead_purchases
for each row execute function private.touch_updated_at();

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  reserved_id uuid;
  generated_slug text;
  desired_name text;
begin
  select contractor_id into reserved_id
  from public.reserved_house_accounts
  where lower(email) = lower(new.email);

  if reserved_id is not null then
    update public.contractor_profiles
      set user_id = new.id,
          status = 'active',
          onboarding_completed = true,
          updated_at = now()
    where id = reserved_id;
    return new;
  end if;

  desired_name := coalesce(nullif(trim(new.raw_user_meta_data->>'business_name'), ''), 'New Arkansas Land Pro');
  generated_slug := lower(regexp_replace(desired_name, '[^a-zA-Z0-9]+', '-', 'g'));
  generated_slug := trim(both '-' from generated_slug) || '-' || substr(replace(new.id::text, '-', ''), 1, 6);

  insert into public.contractor_profiles (
    user_id, email, business_name, slug, contact_name, status, access_role, public_profile_enabled
  )
  values (
    new.id,
    lower(new.email),
    desired_name,
    generated_slug,
    nullif(trim(new.raw_user_meta_data->>'contact_name'), ''),
    'pending',
    'normal',
    true
  )
  on conflict (email) do update
    set user_id = excluded.user_id,
        updated_at = now();

  return new;
end;
$$;

revoke all on function private.handle_new_auth_user() from public;
revoke all on function private.handle_new_auth_user() from anon, authenticated;

drop trigger if exists on_auth_user_created_marketplace on auth.users;
create trigger on_auth_user_created_marketplace
after insert on auth.users
for each row execute function private.handle_new_auth_user();

alter table public.contractor_profiles enable row level security;
alter table public.contractor_services enable row level security;
alter table public.contractor_territories enable row level security;
alter table public.contractor_preferences enable row level security;
alter table public.leads enable row level security;
alter table public.lead_matches enable row level security;
alter table public.lead_purchases enable row level security;
alter table public.lead_unlocks enable row level security;
alter table public.house_lead_actions enable row level security;
alter table public.lead_outcomes enable row level security;
alter table public.lead_events enable row level security;
alter table public.reserved_house_accounts enable row level security;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

insert into public.contractor_profiles (
  id, email, business_name, slug, contact_name, phone, website_url, description,
  city, state, status, access_role, public_profile_enabled, featured,
  onboarding_completed
)
values (
  '2c9939aa-6d43-4af9-8b9c-c3bc04535231',
  'reddirtpropertyservicesar@gmail.com',
  'Red Dirt Property Services',
  'red-dirt-property-services',
  'Jake',
  '870-828-2562',
  'https://reddirtpropertyservicesar.com',
  'Local property services for cleanup, hauling, brush work, dirt work, grading, tree cleanup, light demolition, and rural property projects across Southwest Arkansas and the Hot Springs area.',
  'Amity',
  'Arkansas',
  'active',
  'house_owner',
  true,
  true,
  true
)
on conflict (email) do update set
  business_name = excluded.business_name,
  slug = excluded.slug,
  phone = excluded.phone,
  website_url = excluded.website_url,
  description = excluded.description,
  city = excluded.city,
  status = 'active',
  access_role = 'house_owner',
  public_profile_enabled = true,
  featured = true,
  onboarding_completed = true,
  updated_at = now();

insert into public.reserved_house_accounts (email, contractor_id)
values ('reddirtpropertyservicesar@gmail.com', '2c9939aa-6d43-4af9-8b9c-c3bc04535231')
on conflict (email) do update set contractor_id = excluded.contractor_id;

insert into public.contractor_services (contractor_id, service_slug)
select '2c9939aa-6d43-4af9-8b9c-c3bc04535231', service_slug
from (values
  ('land-clearing'),('brush-clearing'),('dirt-work'),('grading-leveling'),
  ('driveway-repair'),('gravel-driveways'),('culvert-installation'),
  ('drainage-erosion'),('tree-work'),('storm-cleanup'),('cleanup'),
  ('hauling'),('rural-property-prep'),('site-prep'),('light-demolition'),('general')
) v(service_slug)
on conflict (contractor_id, service_slug) do update set enabled = true;

insert into public.contractor_territories (contractor_id, city, notes)
select '2c9939aa-6d43-4af9-8b9c-c3bc04535231', city, 'Red Dirt priority service area'
from (values
  ('Amity'),('Glenwood'),('Hot Springs'),('Hot Springs Village'),('Mount Ida'),
  ('Arkadelphia'),('Malvern'),('Bismarck'),('Royal'),('Pearcy'),('Kirby'),
  ('Norman'),('Bonnerdale'),('Caddo Valley'),('Mountain Pine'),
  ('Murfreesboro'),('Lake Hamilton')
) v(city)
where not exists (
  select 1 from public.contractor_territories t
  where t.contractor_id = '2c9939aa-6d43-4af9-8b9c-c3bc04535231'
    and lower(t.city) = lower(v.city)
);

insert into public.contractor_preferences (
  contractor_id, max_lead_price_cents, max_leads_per_week, email_notifications, auto_buy_enabled
)
values (
  '2c9939aa-6d43-4af9-8b9c-c3bc04535231', null, 100, true, false
)
on conflict (contractor_id) do update set
  max_leads_per_week = 100,
  email_notifications = true;

insert into public.leads (
  id, public_code, source, customer_name, customer_phone, customer_email,
  area, city, county, state, service_slug, original_service, description,
  ai_summary, timeline, property_size, quality_score, quality_band,
  estimated_job_value_min_cents, estimated_job_value_max_cents,
  lead_price_cents, marketplace_status, marketplace_enabled,
  max_paid_unlocks, unlimited_unlocks, paid_unlock_count, is_test, test_enabled,
  admin_notes, ai_metadata
)
values (
  'b3c8ca4d-1f39-4aa5-88ff-ff73cfef2e57',
  'ALP-TEST-001',
  'system-test',
  'Test Customer - Do Not Contact',
  '555-010-0199',
  'test@example.com',
  'Glenwood, Arkansas',
  'Glenwood',
  'Pike',
  'Arkansas',
  'land-clearing',
  'Land Clearing',
  'TEST LEAD ONLY — DO NOT CONTACT. Simulated 3-acre clearing project with heavy brush and smaller trees. This lead exists only to test contractor unlocks, Stripe Checkout, webhook fulfillment, and repeat purchases.',
  'Test-only 3-acre land-clearing lead near Glenwood. Do not contact.',
  'Within a month',
  'About 3 acres',
  95,
  'excellent',
  300000,
  700000,
  100,
  'available',
  true,
  null,
  true,
  0,
  true,
  true,
  'Unlimited $1 marketplace test lead. Toggle test_enabled or marketplace_enabled to hide it.',
  '{"test_lead":true,"purpose":"stripe_webhook_testing"}'::jsonb
)
on conflict (public_code) do update set
  lead_price_cents = 100,
  unlimited_unlocks = true,
  is_test = true,
  test_enabled = true,
  marketplace_enabled = true,
  marketplace_status = 'available',
  updated_at = now();
