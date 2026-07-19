# Admin Dashboard Frontend

A modern, responsive admin dashboard built with React, Vite, and TailwindCSS. This application provides a comprehensive interface for managing and visualizing data with interactive charts and a clean user experience.

## Features

- **Modern UI**: Built with React 19 and TailwindCSS for a sleek, responsive design
- **Data Visualization**: Interactive charts using Chart.js and react-chartjs-2
- **Routing**: Client-side navigation with React Router
- **Icons**: Beautiful icons from Lucide React
- **Fast Development**: Hot Module Replacement (HMR) with Vite
- **Code Quality**: ESLint configuration for consistent code style

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **Chart.js** - Charting library
- **React Chart.js 2** - React wrapper for Chart.js
- **React Router DOM** - Routing library
- **Lucide React** - Icon library

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Server

Start the development server with hot module replacement:
```bash
npm run dev
```

### Build for Production

Create an optimized production build:
```bash
npm run build
```

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Lint Code

Run ESLint to check code quality:
```bash
npm run lint
```

## Project Structure

```
src/
├── components/    # Reusable UI components
├── pages/         # Page components
├── api/           # API integration layer
├── tools/         # Utility tools and helpers
├── assets/        # Static assets
├── App.jsx        # Main application component
├── main.jsx       # Application entry point
├── api.js         # API configuration
└── utils.js       # Utility functions
```

## Environment Variables

Create a `.env` file in the root directory to configure environment variables.

## Deployment

This project includes a `vercel.json` configuration file for easy deployment to Vercel.
