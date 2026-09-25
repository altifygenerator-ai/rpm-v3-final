create unique index if not exists lead_unlocks_purchase_unique
on public.lead_unlocks(purchase_id)
where purchase_id is not null;

create table if not exists public.lead_disputes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  contractor_id uuid not null references public.contractor_profiles(id) on delete cascade,
  purchase_id uuid references public.lead_purchases(id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open','approved','denied','credited','refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lead_disputes_contractor_idx on public.lead_disputes(contractor_id, created_at desc);
create index if not exists lead_disputes_status_idx on public.lead_disputes(status, created_at desc);

alter table public.lead_disputes enable row level security;
revoke all on public.lead_disputes from anon, authenticated;

drop trigger if exists lead_disputes_touch_updated_at on public.lead_disputes;
create trigger lead_disputes_touch_updated_at
before update on public.lead_disputes
for each row execute function private.touch_updated_at();
