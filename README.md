This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

The Next.js `app/` directory routing is organized into Route Groups (folders wrapped in parenthesis) to allow isolated layouts without affecting the URL structure:

- **`app/(landing)`**: Publicly accessible pages.
  - `page.tsx`: The main landing page (default root `/`).
  - `about/page.tsx`: Information about VentureScope (`/about`).
  - `market-insight/page.tsx`: Market trends and insights (`/market-insight`).

- **`app/(auth)`**: Authentication pages, grouped here to share auth-specific layouts.
  - `sign-in/page.tsx`: User login page (`/sign-in`).
  - `register/page.tsx`: New user registration page (`/register`).

- **`app/(dashboard)`**: The protected application area accessible only to authenticated users.
  - `dashboard/page.tsx`: The main user dashboard view (`/dashboard`).

**Other key directories:**
- **`components/`**: Reusable UI components (including global layouts and Shadcn UI components).
- **`lib/`**: Utility functions, including the centralized Axios API client (`api.ts`).
- **`store/`**: Global state management using Zustand (`useAppStore.ts`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
