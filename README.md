# Pri-re

A Next.js application configured with Vercel Web Analytics.

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Vercel Web Analytics

This project includes [Vercel Web Analytics](https://vercel.com/docs/analytics) for tracking page views and user interactions.

### Configuration

The Analytics component is integrated in `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Enabling Analytics on Vercel

1. Deploy this project to Vercel
2. Navigate to your project's Analytics section in the Vercel dashboard
3. Click the "Enable" button
4. Analytics will be active after your next deployment

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Deploy on Vercel](https://vercel.com/docs/deployments/overview)