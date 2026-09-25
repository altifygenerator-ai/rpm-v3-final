alter type public.lead_outcome_status add value if not exists 'still_looking';
alter type public.lead_outcome_status add value if not exists 'on_hold';

create table if not exists public.lead_customer_access (
  lead_id uuid primary key references public.leads(id) on delete cascade,
  token_hash text unique not null,
  customer_email text,
  expires_at timestamptz not null default (now() + interval '180 days'),
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists lead_customer_access_token_idx
on public.lead_customer_access(token_hash);

alter table public.lead_customer_access enable row level security;
revoke all on public.lead_customer_access from anon, authenticated;

create index if not exists lead_unlocks_contractor_lead_idx
on public.lead_unlocks(contractor_id, lead_id);

create index if not exists lead_purchases_status_idx
on public.lead_purchases(status, created_at desc);
