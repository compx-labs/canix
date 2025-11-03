# Canix

Hunt for the best yield with Canix

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 19** - Modern UI library
- **Tailwind CSS v3** - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/compx-labs/canix.git
cd canix
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build the production version:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

### Lint

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
canix/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, fonts, etc.
│   ├── App.jsx      # Main application component
│   ├── main.jsx     # Application entry point
│   └── index.css    # Global styles with Tailwind directives
├── index.html       # HTML template
├── vite.config.js   # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Features

- ⚡ Lightning-fast development with Vite HMR
- 🎨 Beautiful UI with Tailwind CSS v3
- 📱 Responsive design
- 🔧 ESLint for code quality

## License

MIT
