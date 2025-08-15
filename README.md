# Developer Portfolio Dashboard

A modern, full-stack developer portfolio with an integrated admin dashboard built with Next.js 15.0.1, TypeScript, TailwindCSS, and MongoDB.

## Features

- 🎨 Modern dark theme with glassmorphism design
- ⚡ Electric blue accents and smooth animations
- 📱 Fully responsive design
- 🔐 Secure admin authentication with JWT
- 📊 Admin dashboard for content management
- 🖼️ Image upload and optimization
- 🎭 Framer Motion animations
- 🚀 Optimized for performance and SEO

## Tech Stack

- **Frontend**: Next.js 15.0.1, React 18, TypeScript
- **Styling**: TailwindCSS with custom dark theme
- **Animations**: Framer Motion
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies
- **Password Hashing**: bcryptjs
- **Image Optimization**: Next.js Image component

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update the values in `.env.local` with your configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (admin)/          # Admin route group
│   ├── api/              # API routes
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── sections/     # Page sections
│   │   └── admin/        # Admin-specific components
│   ├── lib/              # Utility functions and configurations
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── public/
│   └── uploads/          # File uploads
├── middleware.ts         # Route protection
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT