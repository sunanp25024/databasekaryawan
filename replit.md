# Employee Database Management System - Replit Guide

## Overview

This is a full-stack TypeScript application for managing employee data, built with React frontend and Express backend. The application provides a comprehensive employee management system with features for adding, editing, viewing, and filtering employee records across different clients (ADIRA, MACF, SMSF).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with local storage persistence
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Storage**: PostgreSQL-based sessions (connect-pg-simple)
- **Development**: Hot reload with Vite dev server integration

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **Client Storage**: localStorage for frontend data persistence

## Key Components

### Frontend Components
- **App.tsx**: Main application component with state management
- **Dashboard**: Statistics and overview cards
- **EmployeeTable**: Data table with CRUD operations
- **EmployeeForm**: Form for adding/editing employees with validation
- **EmployeeDetail**: Detailed view of employee information
- **FilterBar**: Advanced filtering and search functionality
- **Sidebar**: Client-based navigation and employee counts
- **SPManager**: Surat Peringatan (warning letter) management

### Backend Components
- **server/index.ts**: Express server setup with middleware
- **server/routes.ts**: API route definitions (currently minimal)
- **server/storage.ts**: Data access layer with memory storage fallback
- **server/vite.ts**: Vite development server integration

### Shared Components
- **shared/schema.ts**: Database schema definitions with Zod validation
- **types/Employee.ts**: TypeScript interfaces for employee data

## Data Flow

1. **Frontend State Management**: React hooks manage local state with localStorage persistence
2. **API Layer**: Express routes handle HTTP requests (currently using memory storage)
3. **Database Layer**: Drizzle ORM provides type-safe database operations
4. **Schema Validation**: Zod schemas ensure data integrity across frontend and backend

### Current Data Structure
- Employee records with comprehensive fields (personal info, employment details, banking info)
- Surat Peringatan (warning letters) as nested objects
- Client-based organization (ADIRA, MACF, SMSF)
- Status tracking (Active/Resigned, Permanent/Contract/Probation)

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with comprehensive Radix UI components
- **Styling**: Tailwind CSS with custom theme
- **Forms**: React Hook Form with Zod resolvers
- **State**: TanStack Query for server state management
- **Utilities**: date-fns for date manipulation, clsx for conditional classes

### Backend Dependencies
- **Database**: Neon Database serverless PostgreSQL
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session**: connect-pg-simple for PostgreSQL session store
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build**: Vite with React plugin and custom configurations
- **TypeScript**: Strict configuration with path aliases
- **Database**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations run via `db:push` command

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **REPL_ID**: Replit-specific environment detection

### Production Setup
- Express server serves static files from `dist/public`
- Database migrations must be run before deployment
- Session storage uses PostgreSQL for persistence

### Development Workflow
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run db:push`: Push database schema changes
- `npm run check`: TypeScript type checking

## Architecture Decisions

### Frontend Decisions
- **React over Vue/Angular**: Chosen for component ecosystem and TypeScript support
- **Shadcn/ui**: Provides consistent, accessible components with Tailwind integration
- **localStorage**: Simple persistence solution for prototype/demo purposes
- **Monolithic structure**: All components in single app for simplicity

### Backend Decisions
- **Express.js**: Lightweight, familiar Node.js framework
- **Drizzle ORM**: Type-safe ORM with good PostgreSQL support
- **Memory storage fallback**: Allows development without database setup
- **Vite integration**: Seamless development experience with frontend

### Database Decisions
- **PostgreSQL**: Robust relational database for structured employee data
- **Neon Database**: Serverless PostgreSQL for easy deployment
- **Schema-first approach**: Drizzle schema defines both database and TypeScript types

The current implementation uses memory storage for development but is configured for PostgreSQL production use. The application is designed to be easily deployed on Replit with minimal configuration.