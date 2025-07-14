# React TypeScript Project

A basic React project with TypeScript setup using Webpack and Babel.

## Features

- React 18 with TypeScript
- Webpack 5 for bundling
- Babel for transpilation
- Hot reload development server
- Tailwind CSS for styling
- PostCSS for CSS processing

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm start
```

This will start the development server at `http://localhost:3000` and open it in your browser.

### Building for Production

Build the project for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.tsx            # Main App component
│   ├── index.css          # Tailwind CSS imports
│   └── index.tsx          # Entry point
├── .babelrc               # Babel configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
├── webpack.config.js      # Webpack configuration
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests (not configured yet) 