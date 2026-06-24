# ArtHub Client

ArtHub is an online art marketplace where buyers discover and purchase original artworks, artists manage their uploaded work, and admins oversee users, artworks, transactions, and analytics.

## Live URLs

- Client: add deployed client URL here
- Server: add deployed server URL here

## Key Features

- Responsive landing page with animated art hero, featured artworks, top artists, and category links.
- Public artwork browsing with search, category filter, price filter, sorting, loading states, empty states, and pagination.
- Artwork details page with Stripe checkout, owner controls, and purchased-user comment workflow.
- JWT authentication with email/password and Google sign-in handoff.
- Role-based dashboards at `/dashboard/user`, `/dashboard/artist`, and `/dashboard/admin`.
- User profile management, password update, purchase history, and subscription upgrade.
- Artist artwork CRUD with imgBB upload and sales history.
- Admin user role management, all artwork management, all transactions, analytics cards, sales chart, and category chart.
- Custom loading, error, and not-found pages.

## Packages Used

- `next`
- `react`
- `react-dom`
- `tailwindcss`
- `@tailwindcss/postcss`
- `eslint`
- `eslint-config-next`

## Environment Variables

Create `.env.local` from `.env.example`.

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=replace-with-imgbb-api-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=replace-with-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_replace_me
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Notes

- Configure the deployed server URL in `NEXT_PUBLIC_API_URL`.
- Configure the backend `CLIENT_URL` to match the deployed client.
- Keep all secret keys on the backend only.
