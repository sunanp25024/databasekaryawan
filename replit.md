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

The current implementation supports both localStorage and Supabase database storage:

### Storage Modes
- **localStorage Mode (Default)**: Data stored in browser, good for demo and development
- **Supabase Database Mode**: Data stored in cloud PostgreSQL, persistent and multi-device

### Recent Updates (July 13, 2025)
- ✅ **Supabase Integration**: Complete database integration with real-time PostgreSQL
- ✅ **Dual Storage Support**: Toggle between localStorage and database modes
- ✅ **Migration System**: One-click migration from localStorage to database
- ✅ **Improved CSV Import**: Better parsing for complex data with quotes and commas
- ✅ **Vercel Deployment**: Fixed deployment configuration for proper static hosting
- ✅ **Database Schema**: Full employee management schema with JSONB support
- ✅ **Fixed Edit Form Bug**: Form fields now populate correctly with existing employee data
- ✅ **Input Type Optimization**: Changed Area, Cabang, Source to text inputs with auto-suggestions
- ✅ **Data Mapping**: Smart conversion for dates, status, gender, and education values
- ✅ **Schema Restructuring**: Removed "updateBank" and "updateNoRekening" fields, added "namaPenerima"
- ✅ **Form Layout Optimization**: Reorganized form into 6 color-coded sections with better spacing
- ✅ **Template Updates**: All CSV templates and import/export functions updated to new schema

### Recent Updates (July 14, 2025)
- ✅ **Status Calculation Fix**: Fixed dashboard calculations for Indonesian status terms
- ✅ **Status Normalization**: System now properly recognizes AKTIF/RESIGN/TERMINATED
- ✅ **Dashboard Enhancement**: Added breakdown showing active employees by contract type
- ✅ **Total Area Counter**: Added unique area counter in dashboard statistics
- ✅ **Consistent Status Format**: All forms and calculations use Indonesian status terms
- ✅ **Debug Enhancement**: Added comprehensive status debugging for troubleshooting

### Recent Updates (August 14, 2025)
- ✅ **Client Logo Integration**: Successfully integrated ADIRA, MEGAFINANCE, SMS FINANCE logos
- ✅ **Logo File Management**: Fixed PNG format issues and server static file serving
- ✅ **Express Static Middleware**: Proper Content-Type headers for logo files
- ✅ **Project Cleanup**: Removed unused APK files, documentation, and test assets
- ✅ **Resource Optimization**: Cleaned attached_assets from 5MB+ to 56KB
- ✅ **File Structure**: Logos properly placed in public/ and client/public/ directories
- ✅ **Import Optimization**: Comprehensive import refactoring across all components
  - Removed unused React imports from 15+ components
  - Optimized lucide-react imports to only necessary icons
  - Structured imports by category (hooks, components, types, data)
  - Fixed React.FormEvent/ChangeEvent to modern imports
  - Improved build performance and bundle size

### Previous Updates (August 3, 2025)
- ✅ **PWA Install System**: Complete PWA installation with device-specific instructions
- ✅ **Smart Install Detection**: Detects iOS, Android, and Desktop with appropriate steps
- ✅ **One-Click Install**: Native browser install prompt integration for Chrome/Edge
- ✅ **Manual Instructions**: Detailed step-by-step guides for all platforms
- ✅ **Install Benefits**: Clear explanation of PWA advantages vs APK
- ✅ **Removed APK Focus**: Simplified to PWA-only approach for easier installation
- ✅ **Animated Install Button**: Prominent blue-green gradient button with pulse animation

### Previous Updates (July 14, 2025 - Evening)
- ✅ **Deployment Ready**: Application prepared for Vercel deployment
- ✅ **Production Build**: Optimized build configuration for static hosting
- ✅ **Frontend-Only Mode**: Configured for client-side operation with localStorage
- ✅ **Theme System Removed**: Cleaned up theme implementation per user request
- ✅ **Vercel Configuration**: Complete deployment guide and configuration files
- ✅ **Documentation**: Added comprehensive deployment instructions

# SWA DATA - Employee Management System

A comprehensive employee management system built with React, TypeScript, and PostgreSQL. Features real-time data synchronization, advanced filtering, and modern UI/UX design.

## Features

### 🎯 Core Functionality
- **Employee Management**: Complete CRUD operations for employee data
- **Advanced Filtering**: Filter by client, status, area, and custom criteria
- **Real-time Search**: Instant search across all employee fields
- **Data Import/Export**: Excel/CSV import and export capabilities
- **Responsive Design**: Mobile-first design that works on all devices

### 📊 Dashboard & Analytics
- **Interactive Dashboard**: Real-time statistics and data visualization
- **Employee Status Tracking**: Active, resigned, terminated status management
- **Client-based Organization**: Multi-client support (ADIRA, MACF, SMSF)
- **Area Management**: Geographic area-based employee organization

### 🔐 Data Management
- **PostgreSQL Database**: Robust data storage with Drizzle ORM
- **Type Safety**: Full TypeScript implementation
- **Data Validation**: Comprehensive input validation and error handling
- **Backup & Recovery**: Automated data backup capabilities

### 📱 Modern UI/UX
- **Tailwind CSS**: Modern, responsive design system
- **Progressive Web App**: PWA support with install button and service worker
- **APK Download**: Android APK generation for native-like installation
- **Mobile Optimized**: Responsive design with mobile-first approach
- **Accessibility**: WCAG compliant interface design

## Technical Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast development and build tooling
- **Lucide React**: Modern icon system

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database
- **Drizzle ORM**: Type-safe database operations

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Hot Module Replacement**: Fast development iterations

## Recent Updates

### Latest Updates (January 2025)
- ✅ **PostgreSQL Integration**: Migrated from memory storage to PostgreSQL
- ✅ **Drizzle ORM Setup**: Type-safe database operations
- ✅ **Full-stack TypeScript**: End-to-end type safety
- ✅ **Database Performance**: Optimized queries and indexing
- ✅ **Production Ready**: Deployment-ready configuration

### Previous Updates (July 2025)
- ✅ **Status Calculation Fix**: Fixed dashboard calculations for Indonesian status terms
- ✅ **Status Normalization**: System properly recognizes AKTIF/RESIGN/TERMINATED
- ✅ **Dashboard Enhancement**: Added breakdown showing active employees by contract type
- ✅ **Total Area Counter**: Added unique area counter in dashboard statistics
- ✅ **Consistent Status Format**: All forms and calculations use Indonesian status terms

## Database Configuration
- **Database**: PostgreSQL (Neon serverless or Replit integrated)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive employee and user schemas
- **Security**: Proper data validation and sanitization
- **Performance**: Indexed searches and optimized queries

The application is designed to be easily deployed on Replit with minimal configuration.