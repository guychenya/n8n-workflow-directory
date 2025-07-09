# n8n Workflow Directory

## Overview

This application provides an enhanced user interface and experience for workflow visualization and management. The project builds upon open-source foundations while introducing new features for improved usability and functionality.

## Features

* **Interactive Workflow Visualization**: Break down and examine each workflow node in detail
* **JSON Code Inspection**: View and analyze the underlying JSON structure for each component
* **User-Friendly Interface**: Streamlined design for improved accessibility and navigation
* **Enhanced Documentation**: Structured presentation of workflow data
* **Advanced Filtering**: Multi-dimensional filtering by category, services, trigger type, and complexity
* **Responsive Design**: Mobile-friendly interface with collapsible sidebar
* **Visual Workflow Diagrams**: n8n-style node visualization with automatic layout
* **Code Snippet Access**: Click on any node to view its complete configuration
* **Real-time Search**: Full-text search across workflow titles, descriptions, and services

## Attribution

This project incorporates workflows from open-source repositories. Special credit and recognition goes to the original repository owner: **Manthan** ([LinkedIn Profile](https://www.linkedin.com/in/manthan-ank/)).

## Development

The user interface, user experience design, and core application logic were developed using Claude CLI. Key enhancements include:

* **Visualization Concepts**: New approaches to displaying workflow data
* **Node Breakdown Functionality**: Detailed examination capabilities for individual workflow components
* **JSON Code Snippet Integration**: Seamless access to underlying code structures
* **Improved User Experience**: Restructured interface for enhanced usability
* **Intelligent Categorization**: Automated workflow analysis and classification
* **Enhanced Modal System**: Tabbed interface with visual and detailed views
* **Performance Optimization**: Efficient handling of 2,000+ workflows

## Technical Implementation

The application leverages modern development practices and tools to deliver a responsive and intuitive user experience while maintaining the integrity of the original open-source workflows.

### Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom dark theme
- **Visualization**: React Flow with Dagre auto-layout
- **Deployment**: Netlify with continuous deployment
- **Performance**: Optimized workflow processing and categorization

### Key Components

- **Enhanced Workflow Modal**: Comprehensive workflow viewer with tabbed interface
- **Workflow Visualizer**: Interactive node diagrams with click-to-view functionality
- **Node Code Snippet**: Detailed parameter inspection with copy functionality
- **Filter Sidebar**: Amazon-style collapsible filtering system
- **Intelligent Categorization**: Automated service detection and complexity analysis

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ by [Guy Chenya](https://www.guyc.dev)**

Built with appreciation for the open-source community and the foundational work of contributors who make projects like this possible.