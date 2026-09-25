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
- `OPENAI_API_KEY`
- `OPENAI_CHAT_MODEL` (defaults to `gpt-6-luna`)
- `NEXT_PUBLIC_SITE_URL=https://www.arkansaslandpros.com`

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
