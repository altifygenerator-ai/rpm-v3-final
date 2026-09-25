alter table public.customer_project_access
  add column if not exists customer_email text,
  add column if not exists expires_at timestamptz not null default (now() + interval '180 days');

drop table if exists public.lead_customer_access;

create or replace function public.customer_update_project_status(
  p_token_hash text,
  p_status text,
  p_hired_contractor_id uuid default null
)
returns table (
  lead_id uuid,
  outcome_status public.lead_outcome_status,
  marketplace_status public.lead_marketplace_status
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lead_id uuid;
  v_current public.leads%rowtype;
  v_hired uuid;
  v_outcome public.lead_outcome_status;
  v_market public.lead_marketplace_status;
  v_house boolean := false;
begin
  select a.lead_id into v_lead_id
  from public.customer_project_access a
  where a.token_hash = p_token_hash
    and a.expires_at > now()
  for update;

  if v_lead_id is null then raise exception 'invalid_project_token'; end if;

  select * into v_current
  from public.leads
  where id = v_lead_id
  for update;

  if p_status = 'hired' then
    if p_hired_contractor_id is not null then
      select exists (
        select 1 from public.contractor_profiles p
        where p.id = p_hired_contractor_id
          and p.access_role = 'house_owner'
          and p.status = 'active'
      ) into v_house;

      if v_house then
        v_hired := p_hired_contractor_id;
      else
        select u.contractor_id into v_hired
        from public.lead_unlocks u
        where u.lead_id = v_lead_id
          and u.contractor_id = p_hired_contractor_id
        limit 1;
      end if;

      if v_hired is null then raise exception 'contractor_not_connected'; end if;
    end if;

    v_outcome := 'hired';
    v_market := 'sold_out';

    insert into public.lead_outcomes (lead_id,status,hired_contractor_id,customer_confirmed,updated_at)
    values (v_lead_id,'hired',v_hired,true,now())
    on conflict (lead_id) do update
      set status='hired',
          hired_contractor_id=excluded.hired_contractor_id,
          customer_confirmed=true,
          updated_at=now();

    update public.leads
    set marketplace_enabled=false,
        marketplace_status='sold_out',
        updated_at=now()
    where id=v_lead_id;

  elsif p_status = 'project_cancelled' then
    v_outcome := 'project_cancelled';
    v_market := 'cancelled';

    insert into public.lead_outcomes (lead_id,status,hired_contractor_id,customer_confirmed,updated_at)
    values (v_lead_id,'project_cancelled',null,true,now())
    on conflict (lead_id) do update
      set status='project_cancelled',
          hired_contractor_id=null,
          customer_confirmed=true,
          updated_at=now();

    update public.leads
    set marketplace_enabled=false,
        marketplace_status='cancelled',
        updated_at=now()
    where id=v_lead_id;

  elsif p_status = 'on_hold' then
    v_outcome := 'on_hold';
    v_market := 'paused';

    insert into public.lead_outcomes (lead_id,status,hired_contractor_id,customer_confirmed,updated_at)
    values (v_lead_id,'on_hold',null,true,now())
    on conflict (lead_id) do update
      set status='on_hold',
          hired_contractor_id=null,
          customer_confirmed=true,
          updated_at=now();

    update public.leads
    set marketplace_enabled=false,
        marketplace_status='paused',
        updated_at=now()
    where id=v_lead_id;

  elsif p_status = 'still_looking' then
    v_outcome := 'still_looking';

    insert into public.lead_outcomes (lead_id,status,hired_contractor_id,customer_confirmed,updated_at)
    values (v_lead_id,'still_looking',null,true,now())
    on conflict (lead_id) do update
      set status='still_looking',
          hired_contractor_id=null,
          customer_confirmed=true,
          updated_at=now();

    if v_current.unlimited_unlocks
       or v_current.paid_unlock_count < coalesce(v_current.max_paid_unlocks, 2) then
      v_market := 'available';
      update public.leads
      set marketplace_enabled=true,
          marketplace_status='available',
          expires_at=greatest(coalesce(expires_at,now()), now()+interval '7 days'),
          updated_at=now()
      where id=v_lead_id;
    else
      v_market := 'sold_out';
    end if;
  else
    raise exception 'invalid_project_status';
  end if;

  update public.customer_project_access
  set last_used_at=now()
  where lead_id=v_lead_id;

  insert into public.lead_events (lead_id,contractor_id,event_type,metadata)
  values (
    v_lead_id,
    v_hired,
    'customer_status_update',
    jsonb_build_object(
      'status',p_status,
      'hired_contractor_id',v_hired,
      'customer_confirmed',true
    )
  );

  return query select v_lead_id,v_outcome,v_market;
end;
$$;

revoke all on function public.customer_update_project_status(text,text,uuid) from public,anon,authenticated;
grant execute on function public.customer_update_project_status(text,text,uuid) to service_role;
