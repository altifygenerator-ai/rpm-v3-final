create or replace function public.reserve_lead_purchase(
  p_lead_id uuid,
  p_contractor_id uuid,
  p_amount_cents integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_lead public.leads%rowtype;
  v_role public.contractor_access_role;
  v_pending integer;
  v_existing integer;
  v_purchase_id uuid;
  v_max integer;
begin
  select * into v_lead
  from public.leads
  where id = p_lead_id
  for update;

  if not found then raise exception 'lead_not_found'; end if;

  select access_role into v_role
  from public.contractor_profiles
  where id = p_contractor_id and status = 'active';

  if v_role is null then raise exception 'contractor_not_active'; end if;

  if v_lead.marketplace_status <> 'available'
     or not v_lead.marketplace_enabled
     or (v_lead.is_test and not v_lead.test_enabled)
     or (v_lead.expires_at is not null and v_lead.expires_at <= now()) then
    raise exception 'lead_not_available';
  end if;

  if p_amount_cents <> v_lead.lead_price_cents then
    raise exception 'lead_price_changed';
  end if;

  if not v_lead.is_test and v_role = 'normal' then
    select count(*) into v_existing
    from public.lead_unlocks
    where lead_id = p_lead_id
      and contractor_id = p_contractor_id
      and counts_toward_limit = true;

    if v_existing > 0 then raise exception 'lead_already_unlocked'; end if;

    select count(*) into v_existing
    from public.lead_purchases
    where lead_id = p_lead_id
      and contractor_id = p_contractor_id
      and status in ('created','checkout_open')
      and created_at > now() - interval '35 minutes';

    if v_existing > 0 then raise exception 'lead_already_reserved'; end if;
  end if;

  if not v_lead.unlimited_unlocks and v_role = 'normal' then
    v_max := coalesce(v_lead.max_paid_unlocks, 2);

    select count(*) into v_pending
    from public.lead_purchases
    where lead_id = p_lead_id
      and status in ('created','checkout_open')
      and created_at > now() - interval '35 minutes';

    if v_lead.paid_unlock_count + v_pending >= v_max then
      raise exception 'lead_sold_out';
    end if;
  end if;

  insert into public.lead_purchases (
    lead_id, contractor_id, amount_cents, status, is_test
  )
  values (
    p_lead_id, p_contractor_id, p_amount_cents, 'created', v_lead.is_test
  )
  returning id into v_purchase_id;

  return v_purchase_id;
end;
$function$;

revoke all on function public.reserve_lead_purchase(uuid,uuid,integer)
from public, anon, authenticated;

grant execute on function public.reserve_lead_purchase(uuid,uuid,integer)
to service_role;
