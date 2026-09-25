# Arkansas Land Pros staging rebuild

This branch rebuilds the former RPM site into **Arkansas Land Pros**, an Arkansas land-service lead and referral property.

## Lead delivery

All accepted quote-form and job-intake-chat submissions post to `/api/leads`.

The endpoint:

- verifies Cloudflare Turnstile server-side;
- uses a honeypot, minimum-fill-time check, input validation, spam heuristics, and lightweight per-instance rate limiting;
- creates a lead reference ID;
- captures landing page, referrer, and UTM fields;
- emails the lead through Resend to `LEAD_TO_EMAIL`.

Current fallback destination:

`reddirtpropertyservicesar@gmail.com`

Current fallback sender:

`Arkansas Land Pros <leads@arkansaslandpros.com>`

## Marketplace production environment variables

The production marketplace uses the ALP Supabase project, Stripe Checkout, Resend, Turnstile, OpenAI lead classification, and Vercel Cron. Copy the exact variable set from `.env.example` into Vercel. Prefer the new Supabase `SUPABASE_SECRET_KEY`; the code also accepts the legacy `SUPABASE_SERVICE_ROLE_KEY` as a fallback.

## SEO migration

The rebuild intentionally preserves the existing high-value service slugs where possible, including:

- `/services/land-clearing`
- `/services/tree-work`
- `/services/drainage-erosion`
- `/services/retaining-walls`
- `/services/cleanup`
- `/services/hauling`
- `/services/airbnb`
- `/services/water-features`
- `/services/outdoor-builds`
- `/services/general`
- `/services/welding`

The production canonical domain is `https://www.arkansaslandpros.com`. Keep `NEXT_PUBLIC_SITE_URL` set to that exact value in Vercel production. The old Richards domain can later be pointed to the migration setup and page-for-page redirects can be finalized without changing the core content architecture.


## Conversational project assistant

The floating project assistant uses the OpenAI Responses API to have a natural intake conversation and extract a structured lead draft. It does not submit anything automatically: the visitor reviews the collected details, completes Turnstile verification, and explicitly presses **Send this request** before the existing lead-delivery endpoint is called.

The API route is `/api/chat`. It uses `OPENAI_API_KEY` server-side only and defaults to `gpt-6-luna` unless `OPENAI_CHAT_MODEL` is set.


## Contractor marketplace

Contractors can join at `/pros/join`, create a public profile, choose services and service areas, preview matching leads, and unlock selected leads through Stripe Checkout. Full homeowner contact details are revealed only after webhook-confirmed payment.

The Red Dirt account is pre-seeded for `reddirtpropertyservicesar@gmail.com`. Its private `house_owner` permission is attached automatically on the first magic-link sign-in and is never rendered on the public Red Dirt profile. House access to leads does not increment the paid unlock count.

The test lead `ALP-TEST-001` is priced at $1.00, permits unlimited purchases, and can be enabled or disabled from the Red Dirt-only lead control page.

Homeowners who supply an email receive a private project-status link. They can mark the project still looking, on hold, hired, or cancelled; a confirmed hire/cancellation removes the lead from sale.

Standard leads default to two paid unlocks. The hourly Vercel Cron retires leads after their freshness window.
