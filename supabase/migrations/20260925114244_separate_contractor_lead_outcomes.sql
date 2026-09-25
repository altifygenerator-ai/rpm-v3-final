create table if not exists public.contractor_lead_outcomes (
  lead_id uuid not null references public.leads(id) on delete cascade,
  contractor_id uuid not null references public.contractor_profiles(id) on delete cascade,
  status public.lead_outcome_status not null default 'unknown',
  notes text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (lead_id, contractor_id)
);

create index if not exists contractor_lead_outcomes_contractor_idx
on public.contractor_lead_outcomes(contractor_id, updated_at desc);

alter table public.contractor_lead_outcomes enable row level security;
revoke all on public.contractor_lead_outcomes from anon, authenticated;

drop policy if exists deny_browser_access_contractor_lead_outcomes
on public.contractor_lead_outcomes;

create policy deny_browser_access_contractor_lead_outcomes
on public.contractor_lead_outcomes
for all
to anon, authenticated
using (false)
with check (false);

drop trigger if exists contractor_lead_outcomes_touch_updated_at
on public.contractor_lead_outcomes;

create trigger contractor_lead_outcomes_touch_updated_at
before update on public.contractor_lead_outcomes
for each row execute function private.touch_updated_at();
