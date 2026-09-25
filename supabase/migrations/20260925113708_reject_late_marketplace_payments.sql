create or replace function public.fulfill_lead_purchase(
  p_purchase_id uuid,
  p_checkout_session_id text,
  p_payment_intent_id text
)
returns table(
  lead_id uuid,
  contractor_id uuid,
  is_test boolean,
  counts_toward_limit boolean,
  newly_fulfilled boolean
)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_purchase public.lead_purchases%rowtype;
  v_lead public.leads%rowtype;
  v_role public.contractor_access_role;
  v_counts boolean;
  v_new_count integer;
  v_inserted uuid;
begin
  select * into v_purchase
  from public.lead_purchases
  where id = p_purchase_id
  for update;

  if not found then
    raise exception 'purchase_not_found';
  end if;

  select * into v_lead
  from public.leads
  where id = v_purchase.lead_id
  for update;

  if not found then
    raise exception 'lead_not_found';
  end if;

  select access_role into v_role
  from public.contractor_profiles
  where id = v_purchase.contractor_id;

  v_counts := coalesce(v_role = 'normal', true);

  select id into v_inserted
  from public.lead_unlocks
  where purchase_id = p_purchase_id
  limit 1;

  if v_inserted is not null then
    return query
      select v_purchase.lead_id, v_purchase.contractor_id, v_purchase.is_test, v_counts, false;
    return;
  end if;

  if v_purchase.status not in ('created','checkout_open') then
    raise exception 'purchase_not_fulfillable';
  end if;

  if v_lead.marketplace_status <> 'available'
     or not v_lead.marketplace_enabled
     or (v_lead.is_test and not v_lead.test_enabled)
     or (v_lead.expires_at is not null and v_lead.expires_at <= now()) then
    raise exception 'lead_not_available';
  end if;

  update public.lead_purchases
  set status = 'paid',
      stripe_checkout_session_id = p_checkout_session_id,
      stripe_payment_intent_id = p_payment_intent_id,
      paid_at = coalesce(paid_at, now()),
      updated_at = now()
  where id = p_purchase_id;

  insert into public.lead_unlocks (
    lead_id, contractor_id, purchase_id, unlock_type, counts_toward_limit
  )
  values (
    v_purchase.lead_id,
    v_purchase.contractor_id,
    p_purchase_id,
    case when v_role = 'house_owner' then 'house' else 'paid' end,
    v_counts
  );

  if v_counts then
    v_new_count := v_lead.paid_unlock_count + 1;

    update public.leads
    set paid_unlock_count = v_new_count,
        marketplace_status = case
          when not v_lead.unlimited_unlocks
           and v_new_count >= coalesce(v_lead.max_paid_unlocks, 2)
          then 'sold_out'::public.lead_marketplace_status
          else marketplace_status
        end,
        marketplace_enabled = case
          when not v_lead.unlimited_unlocks
           and v_new_count >= coalesce(v_lead.max_paid_unlocks, 2)
          then false
          else marketplace_enabled
        end,
        updated_at = now()
    where id = v_purchase.lead_id;
  end if;

  insert into public.lead_events (
    lead_id, contractor_id, event_type, metadata
  )
  values (
    v_purchase.lead_id,
    v_purchase.contractor_id,
    'paid_unlock',
    jsonb_build_object(
      'purchase_id', p_purchase_id,
      'checkout_session_id', p_checkout_session_id,
      'is_test', v_purchase.is_test,
      'counts_toward_limit', v_counts
    )
  );

  return query
    select v_purchase.lead_id, v_purchase.contractor_id, v_purchase.is_test, v_counts, true;
end;
$function$;

revoke all on function public.fulfill_lead_purchase(uuid,text,text) from public, anon, authenticated;
grant execute on function public.fulfill_lead_purchase(uuid,text,text) to service_role;
