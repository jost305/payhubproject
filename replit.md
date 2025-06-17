# PayVidi - Secure File Sharing Platform for Creators

## Overview

PayVidi is a full-stack web application that enables creators (freelancers) to securely share their work with clients, collect feedback, and process payments before delivering final files. The platform features client preview sharing, comment systems, and integrated payment processing.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Payment Integration**: Stripe React components for secure payment processing

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Express sessions with bcrypt password hashing
- **File Storage**: Local file system with multer for uploads
- **Payment Processing**: Stripe API integration
- **Email Service**: Nodemailer for transactional emails

### Database Schema
- **Users**: Freelancers, clients, and admins with role-based access
- **Projects**: Work items with status tracking and client association
- **Comments**: Timeline and position-based feedback system
- **Payments**: Stripe payment tracking with commission calculation
- **Downloads**: Secure file access with expiration and usage limits

## Key Components

### Authentication & Authorization
- Session-based authentication with role-based access control
- Three user roles: admin, freelancer, client
- Protected routes and API endpoints based on user permissions

### Project Management
- Project lifecycle: draft → preview_shared → approved → paid → completed
- File upload system supporting multiple media types (video, audio, images, documents)
- Preview URL generation for client access

### Payment Processing
- Stripe integration for secure payment handling
- Commission-based revenue model
- Automatic file access generation post-payment
- Email notifications with download links

### File Management
- Secure file uploads with type validation and size limits
- Preview file generation for client review
- Final file delivery after payment confirmation
- Time-limited download tokens with usage tracking

## Data Flow

1. **Project Creation**: Freelancer creates project with client details and pricing
2. **File Upload**: Freelancer uploads preview and final files
3. **Client Preview**: Client accesses preview via secure URL with email verification
4. **Feedback Loop**: Client can comment on timeline or specific positions in media
5. **Approval**: Client approves project, triggering payment flow
6. **Payment**: Stripe processes payment with commission calculation
7. **File Delivery**: Download links sent via email with expiration and usage limits

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL serverless)
- **Payment Processing**: Stripe for payment intents and webhooks
- **Email Service**: SMTP provider (Gmail/SendGrid) via Nodemailer
- **File Storage**: Local filesystem (can be extended to cloud storage)

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Production build bundling
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: `npm run dev` - TSX server with Vite dev middleware
- **Production**: `npm run start` - Node.js serving bundled application
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable
- **Stripe**: API keys configured via environment variables

### Hosting Requirements
- Node.js 20+ runtime environment
- PostgreSQL database instance
- SMTP service for email delivery
- SSL certificate for secure payment processing

## Changelog

```
Changelog:
- June 17, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```