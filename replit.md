# Prompt Me - Chat Application

## Overview

Prompt Me is a web application designed to help users craft perfect prompts for interacting with OpenAI's models, particularly GPT and o-Series models. The application features a chat interface where users can interact with an AI assistant that guides them in creating effective prompts based on best practices.

This application follows a modern web development architecture with a React frontend and an Express backend. It uses Drizzle ORM for database management, with SQLite as a temporary storage solution (expecting PostgreSQL in production). The application has an email capture feature to collect user emails before providing access to the chat functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture with:

1. **Frontend**: React application with TypeScript, utilizing a component-based architecture with Shadcn UI components
2. **Backend**: Express.js server with TypeScript
3. **Database**: 
   - Uses Drizzle ORM for database management
   - Currently using SQLite for development/demo purposes
   - Designed for PostgreSQL integration (as indicated in .replit modules)
4. **API**: REST-based communication between frontend and backend
5. **Styling**: Tailwind CSS for responsive design and consistent UI components

### Key Design Decisions

- **Monorepo Structure**: The project uses a monorepo approach with client and server code in the same repository, allowing for shared types and easier development
- **TypeScript**: Used throughout to ensure type safety and better developer experience
- **Shadcn UI**: Leveraged for consistent UI components with a modern design aesthetic
- **Drizzle ORM**: Selected for its type-safe, developer-friendly approach to database management
- **Email Capture Flow**: Implemented to gather user emails before providing access to the main functionality

## Key Components

### Frontend

1. **Component Structure**:
   - UI components built with Shadcn UI (based on Radix UI primitives)
   - Page components for different routes
   - Custom hooks for reusable logic

2. **Main Components**:
   - `EmailModal`: Captures user emails before allowing access
   - `ChatContainer`: Manages the chat interface and message display
   - `Header`: Application header with branding and navigation
   - `Footer`: Application footer with links and information

3. **State Management**:
   - React's built-in state and context API
   - TanStack Query for API data fetching and caching

### Backend

1. **Server Setup**:
   - Express.js with TypeScript
   - API routes for chat and email collection
   - Integration with Vite for development

2. **Database Schema**:
   - `users`: For user authentication (id, username, password)
   - `emails`: For storing collected emails (id, email, createdAt)

3. **Services**:
   - Storage service for database operations
   - OpenAI integration for AI responses

## Data Flow

1. **Initial Access**:
   - User visits the application
   - Email capture modal appears for first-time visitors
   - Email is sent to the server and stored in the database
   - Modal is dismissed, and the chat interface is shown

2. **Chat Interaction**:
   - User enters a message in the chat interface
   - Message is sent to the server
   - Server forwards the message to OpenAI API with appropriate context
   - AI response is returned to the client and displayed in the chat

3. **Data Persistence**:
   - User emails are stored in the database
   - Chat messages are not persisted between sessions (stored in client-side state only)

## External Dependencies

1. **UI Components**:
   - Radix UI primitives
   - Shadcn UI components
   - Tailwind CSS for styling

2. **State Management and API**:
   - TanStack Query for API data fetching
   - React Router (wouter) for client-side routing

3. **Database**:
   - Drizzle ORM for database operations
   - Better-SQLite3 for development database

4. **Other Notable Dependencies**:
   - Zod for data validation
   - React Hook Form for form handling
   - React Markdown for rendering markdown content

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Development Mode**:
   - `npm run dev` launches both the client and server in development mode
   - Vite handles hot module replacement for the client
   - Express server runs with development configurations

2. **Production Build**:
   - `npm run build` creates optimized production builds
   - Client-side code is bundled with Vite
   - Server-side code is bundled with esbuild

3. **Database Configuration**:
   - Application is designed to use PostgreSQL in production
   - Database URL is specified via environment variable (DATABASE_URL)

4. **Environment Variables**:
   - DATABASE_URL: Connection string for PostgreSQL
   - OPENAI_API_KEY: For OpenAI API integration

5. **Replit-Specific Configuration**:
   - Replit configuration in .replit file for easy setup
   - Uses Replit's PostgreSQL module for database

## Future Considerations

1. **Authentication**: The schema includes a users table, suggesting plans for full authentication
2. **PostgreSQL Migration**: Current SQLite implementation is temporary, with plans to move to PostgreSQL
3. **Session Management**: The dependencies include connect-pg-simple, indicating plans for session-based authentication