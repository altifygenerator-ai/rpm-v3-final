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

`Arkansas Land Pros <leads@hometownwebservicesar.cc>`

## Required staging environment variables

Copy `.env.example` into the environment configuration and set:

- `RESEND_API_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL` when a final/staging canonical URL is known

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

When the new domain is selected, set `NEXT_PUBLIC_SITE_URL`. The old Richards domain can then be pointed to the same deployment and page-for-page redirects/canonical migration can be finalized without changing the core content architecture.
