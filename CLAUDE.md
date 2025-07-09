# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Environment Setup

- Set `GEMINI_API_KEY` in `.env.local` for Gemini API access
- The app uses Vite for bundling and development

## High-Level Architecture

This is a client-side React application that serves as an advanced directory for n8n workflows with intelligent categorization and Amazon-style filtering. The architecture follows a component-based structure with automated workflow analysis.

### Core Components Structure
- **App.tsx**: Main application component managing advanced filtering state and layout with sidebar
- **components/**: Contains all UI components
  - `Header.tsx`: Application header with title and description
  - `FilterSidebar.tsx`: Amazon-style left sidebar with collapsible filter sections
  - `FilterControls.tsx`: Legacy category filter buttons (kept for mobile quick filters)
  - `WorkflowGrid.tsx`: Grid layout for workflow cards
  - `WorkflowCard.tsx`: Enhanced workflow card with visual categorization, complexity indicators, and service tags
  - `icons.tsx`: SVG icon components

### Data Management & Intelligence
- **data/workflows.ts**: Automatically categorized workflow metadata with rich classification
- **utils/categorizeWorkflows.ts**: Intelligent workflow analysis system that extracts:
  - Service categories (Communication, E-commerce, CRM, etc.)
  - Trigger types (Manual, Webhook, Scheduled, Event, HTTP)
  - Operation types (Create, Update, Send, Automation, etc.)
  - Complexity levels (Simple, Advanced, Multi-step)
  - Service detection and tagging
- **types.ts**: Enhanced TypeScript interfaces including `FilterState` and `ServiceCategory`
- **workflows/**: Directory containing 700+ actual n8n workflow JSON files

### Advanced Filtering System
- **Multi-dimensional filtering**: Category, services, trigger type, operation, complexity
- **Search functionality**: Full-text search across titles, descriptions, services, and tags
- **Dynamic filter options**: Filter values generated from actual workflow data
- **Collapsible sections**: Amazon-style expandable filter groups
- **Active filter management**: Visual indicators and easy filter removal
- **Mobile-responsive**: Sidebar overlay for mobile devices

### Enhanced Workflow Cards
- **Color-coded categories**: Visual category identification with distinct colors
- **Complexity indicators**: Simple/Advanced/Multi-step badges
- **Service tags**: Display of integrated services with overflow handling
- **Trigger type icons**: Visual indicators for workflow trigger methods
- **Enhanced download experience**: Improved button styling and user feedback

### Naming Convention Strategy
The system automatically analyzes workflow filenames following the pattern:
```
{number}_{service1}_{service2}_{operation}_{trigger}.json
```
And intelligently categorizes based on:
- **Service Mapping**: 200+ recognized services mapped to 10 primary categories
- **Trigger Detection**: Automatic identification of trigger types
- **Operation Classification**: Recognition of workflow operations
- **Complexity Analysis**: Based on number of services and workflow structure

### Technology Stack
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS with custom design system (dark theme, brand colors)
- Intelligent workflow parsing and categorization
- Static file serving for workflow JSON downloads

### File Organization
- Components use named exports with enhanced TypeScript interfaces
- Utility functions for workflow analysis and categorization
- TypeScript strict mode enabled with comprehensive type safety
- Path alias `@/*` points to project root
- Automated workflow processing from filename patterns

The application provides an intelligent, fast, and user-friendly workflow browser with advanced filtering capabilities, making it easy to discover relevant workflows from a large collection without requiring any server-side dependencies.