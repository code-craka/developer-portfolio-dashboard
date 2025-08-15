# Developer Portfolio Dashboard

A modern, full-stack developer portfolio with an integrated admin dashboard built with Next.js 15.2.3, TypeScript, TailwindCSS, and NeonDB PostgreSQL.

## Features

- 🎨 Modern dark theme with glassmorphism design
- ⚡ Electric blue accents and smooth animations
- 📱 Fully responsive design
- 🔐 Secure admin authentication with Clerk
- 📊 Admin dashboard for content management
- 🖼️ Image upload and optimization
- 🎭 Framer Motion animations
- 🚀 Optimized for performance and SEO
- 🗄️ PostgreSQL database with NeonDB
- 🔄 Database migrations and health monitoring
- 🛡️ Rate limiting and security features

## Tech Stack

- **Frontend**: Next.js 15.2.3, React 18, TypeScript
- **Styling**: TailwindCSS with custom dark theme
- **Animations**: Framer Motion
- **Database**: NeonDB (PostgreSQL) with connection pooling
- **Authentication**: Clerk Authentication
- **ORM**: Custom TypeScript services with raw SQL
- **Image Optimization**: Next.js Image component
- **Rate Limiting**: Custom rate limiting implementation

## Getting Started

### Prerequisites

- Node.js 18+ 
- NeonDB PostgreSQL database (or compatible PostgreSQL)
- Clerk account for authentication
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
   Update the values in `.env.local` with your configuration:
   - `DATABASE_URL`: Your NeonDB connection string
   - Clerk authentication keys
   - Other configuration options

4. Initialize the database:
   ```bash
   npm run init-db
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (admin)/          # Admin route group
│   ├── api/              # API routes
│   │   └── health/       # Health check endpoints
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── sections/     # Page sections
│   │   └── admin/        # Admin-specific components
│   ├── lib/              # Utility functions and configurations
│   │   ├── db.ts         # Database connection utility
│   │   ├── database-utils.ts # CRUD service classes
│   │   ├── migrations.ts # Database migration system
│   │   ├── db-health.ts  # Database health monitoring
│   │   ├── types.ts      # TypeScript interfaces
│   │   ├── rate-limit.ts # Rate limiting utilities
│   │   └── utils.ts      # General utility functions
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── docs/
│   └── DATABASE_SETUP.md # Database setup guide
├── scripts/
│   └── init-db.ts        # Database initialization script
├── public/
│   └── uploads/          # File uploads
├── .kiro/
│   └── specs/            # Feature specifications
├── middleware.ts         # Route protection
├── CHANGELOG.md          # Project changelog
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run init-db` - Initialize database tables and indexes
- `npm run reset-db` - Reset database (development only)

## Environment Variables

See `.env.example` for all required environment variables. Key variables include:

- `DATABASE_URL` - NeonDB PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Clerk webhook secret for user sync

## Database Setup

This project uses NeonDB (PostgreSQL) for data storage. See [Database Setup Guide](./docs/DATABASE_SETUP.md) for detailed instructions.

### Quick Database Setup

1. Create a NeonDB account at [neon.tech](https://neon.tech)
2. Create a new project and copy the connection string
3. Add the connection string to your `.env.local` file
4. Run `npm run init-db` to create tables and indexes

### Database Health Check

Visit `/api/health/db` to check database connectivity and table status.

## License

MIT