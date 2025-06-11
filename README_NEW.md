# GraphDash

A collaborative graph visualization platform built with React 18+ and Vite.

## Features

- **Interactive Graph Editor**: Build node-edge graphs using React Flow
- **Real-time Collaboration**: Share graphs with contacts
- **User Authentication**: Secure login via Supabase Auth
- **Modern UI**: Built with Tailwind CSS and shadcn/ui
- **State Management**: Zustand for efficient state handling

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Graph Visualization**: React Flow
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd graphdash
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   └── ui/        # Base UI components (shadcn/ui)
├── lib/           # Utility functions and configurations
├── store/         # Zustand state management
├── pages/         # Application pages/routes
└── types/         # TypeScript type definitions
```

## Dependencies

### Core Dependencies
- `react` & `react-dom` - React 18+ framework
- `typescript` - TypeScript support
- `vite` - Build tool and dev server

### UI & Styling
- `tailwindcss` - Utility-first CSS framework
- `@tailwindcss/postcss` - PostCSS integration
- `autoprefixer` - CSS vendor prefixing
- `clsx` & `tailwind-merge` - Conditional CSS classes
- `class-variance-authority` - Component variants
- `lucide-react` - Icon library

### Graph Visualization
- `reactflow` - Interactive node-based graph library

### Backend Integration
- `@supabase/supabase-js` - Supabase client library

### State Management
- `zustand` - Lightweight state management

## License

MIT License
