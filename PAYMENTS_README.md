Setup Stripe integration

Required environment variables (add to .env):

- STRIPE_SECRET_KEY: your platform secret key
- STRIPE_WEBHOOK_SECRET: your webhook signing secret (optional but recommended)
- STRIPE_ONBOARDING_RETURN_URL: onboarding return URL
- STRIPE_ONBOARDING_REFRESH_URL: onboarding refresh URL

Install dependencies:

```bash
npm install
# or only stripe if you prefer
npm install stripe
```

API endpoints added:

- `POST /api/payments/create-payment` { bookingId }
- `POST /api/payments/confirm` { bookingId, role }
- `POST /api/payments/webhook` (Stripe webhook)
- `POST /api/payments/connect/create-account` { coachId }

Notes:

- Session payments use 10% commission by default, 5% if `CoachProfile.ambassador` is true.
- The current flow: create PaymentIntent -> store Payment -> user completes payment client-side -> webhook updates Payment status -> coach and user confirm -> platform transfers funds to coach and records Commission.
