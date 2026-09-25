do $$
declare
  t text;
  tables text[] := array[
    'contractor_profiles','contractor_services','contractor_territories',
    'contractor_preferences','leads','lead_matches','lead_purchases',
    'lead_unlocks','house_lead_actions','lead_outcomes','lead_events',
    'reserved_house_accounts','lead_disputes','customer_project_access'
  ];
begin
  foreach t in array tables loop
    execute format('drop policy if exists %I on public.%I', 'deny_browser_access_' || t, t);
    execute format(
      'create policy %I on public.%I for all to anon, authenticated using (false) with check (false)',
      'deny_browser_access_' || t,
      t
    );
  end loop;
end $$;
