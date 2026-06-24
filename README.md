<div align="center">

# 🎨 ArtHub

### Discover, collect, and sell original artwork online

A modern, responsive art marketplace connecting independent artists with art lovers.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://art-bro-client.vercel.app)

[View Live Website](https://art-bro-client.vercel.app) ·
[Client Repository](https://github.com/Khalid-Sifullah-Siam/ArtBro-client) ·
[Server Repository](https://github.com/Khalid-Sifullah-Siam/ArtBro-server)

</div>

---

## About the Project

ArtHub gives users, artists, and administrators a dedicated experience in one
platform. Art lovers can discover and purchase original artwork, artists can
manage their collections and sales, and administrators can oversee users,
transactions, and marketplace activity.

## Highlights

### For Art Lovers

- Browse featured artwork and discover top artists
- Search, filter, sort, and paginate artwork
- View detailed information about each piece
- Purchase artwork securely with Stripe
- View purchase history and manage profile information
- Comment on purchased artwork

### For Artists

- Create, update, and delete artwork listings
- Upload artwork images using imgBB
- Review sales history
- Access artist-specific dashboard tools

### For Administrators

- Manage users and update account roles
- Manage all artwork and transactions
- View sales and category analytics
- Control the platform from a protected admin dashboard

### Platform Features

- Email/password and Google authentication
- Role-based access and login redirection
- Stripe checkout and subscription upgrades
- Responsive layout and mobile navigation
- Smooth animations with Framer Motion and GSAP
- Custom loading, error, and not-found pages

## Built With

| Frontend | Backend & Services |
| --- | --- |
| Next.js 16 (App Router) | Express.js |
| React 19 | MongoDB |
| Tailwind CSS 4 | Better Auth & JWT |
| Framer Motion | Stripe |
| GSAP | imgBB |
| Google Identity Services | Google Authentication |

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) version 20 or newer
- [Git](https://git-scm.com/)
- The [ArtHub server](https://github.com/Khalid-Sifullah-Siam/ArtBro-server)

### 1. Clone the repository

```bash
git clone https://github.com/Khalid-Sifullah-Siam/ArtBro-client.git
cd ArtBro-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

> [!IMPORTANT]
> Never commit real API keys or secret values to GitHub. For production, replace
> `NEXT_PUBLIC_API_URL` with the deployed server URL.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
The backend server must also be running for authentication, payments, comments,
artwork data, and dashboards to work.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Check the code for linting problems |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |

## User Roles

| Role | Access |
| --- | --- |
| **User** | Browse, purchase, comment, manage profile, and view purchase history |
| **Artist** | All user features plus artwork management and sales history |
| **Admin** | Manage users, roles, artwork, transactions, and analytics |

## Project Structure

```text
src/
├── app/
│   ├── artworks/[id]/       # Artwork details
│   ├── browse/              # Browse artwork
│   ├── dashboard/
│   │   ├── admin/           # Admin dashboard
│   │   ├── artist/          # Artist dashboard
│   │   └── user/            # User dashboard
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   └── page.jsx             # Home page
├── components/              # Reusable interface components
└── lib/                     # API and helper functions

public/
└── images/                  # Project screenshots
```

## Screenshots

### Screenshot 01

![ArtHub Screenshot 01](./public/images/Screenshot%20%28135%29.png)

### Screenshot 02

![ArtHub Screenshot 02](./public/images/Screenshot%20%28136%29.png)

### Screenshot 03

![ArtHub Screenshot 03](./public/images/Screenshot%20%28137%29.png)

### Screenshot 04

![ArtHub Screenshot 04](./public/images/Screenshot%20%28138%29.png)

### Screenshot 05

![ArtHub Screenshot 05](./public/images/Screenshot%20%28139%29.png)

### Screenshot 06

![ArtHub Screenshot 06](./public/images/Screenshot%20%28140%29.png)

### Screenshot 07

![ArtHub Screenshot 07](./public/images/Screenshot%20%28141%29.png)

### Screenshot 08

![ArtHub Screenshot 08](./public/images/Screenshot%20%28142%29.png)

### Screenshot 09

![ArtHub Screenshot 09](./public/images/Screenshot%20%28143%29.png)

### Screenshot 10

![ArtHub Screenshot 10](./public/images/Screenshot%20%28144%29.png)

### Screenshot 11

![ArtHub Screenshot 11](./public/images/Screenshot%20%28145%29.png)

### Screenshot 12

![ArtHub Screenshot 12](./public/images/Screenshot%20%28146%29.png)

### Screenshot 13

![ArtHub Screenshot 13](./public/images/Screenshot%20%28147%29.png)

### Screenshot 14

![ArtHub Screenshot 14](./public/images/Screenshot%20%28148%29.png)

### Screenshot 15

![ArtHub Screenshot 15](./public/images/Screenshot%20%28149%29.png)

### Screenshot 16

![ArtHub Screenshot 16](./public/images/Screenshot%20%28150%29.png)

### Screenshot 17

![ArtHub Screenshot 17](./public/images/Screenshot%20%28151%29.png)

## Beginner Notes

- A `page.jsx` file creates a page in the Next.js App Router.
- Components that use hooks such as `useState` require `"use client"`.
- Public environment variable names begin with `NEXT_PUBLIC_`.
- Reusable interface code belongs in the `components` folder.
- Shared API and helper functions belong in the `lib` folder.
- The client connects to the Express server through `NEXT_PUBLIC_API_URL`.

---

<div align="center">

Made with creativity and code for artists and art lovers.

If you find this project useful, consider giving the repository a ⭐.

</div>
