# Vite Setup for QuickAsk Chrome Extension

## Overview
This project has been migrated from TypeScript compiler (tsc) to Vite for improved development experience and faster builds.

## Key Components

### Build Configuration
- **vite.config.ts**: Main Vite configuration with Chrome extension support
- **@crxjs/vite-plugin**: Chrome extension plugin for Vite
- **Multiple entry points**: popup, response page, and background script

### Development Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run preview`: Preview production build

### Features
- ✅ TypeScript support out of the box
- ✅ Hot module replacement (HMR)
- ✅ Path aliases (@, @components, @services, etc.)
- ✅ Asset handling for icons and static files
- ✅ Chrome extension manifest processing
- ✅ Multiple HTML entry points support

### Development Workflow
1. Run `npm run dev` to start development server
2. Load `dist` folder as unpacked extension in Chrome
3. Changes to source files will trigger automatic recompilation
4. Reload extension in Chrome to see changes

### Build Output
The build creates a `dist` folder with:
- Processed manifest.json
- Compiled JavaScript bundles
- Optimized assets and HTML files
- Chrome extension-ready structure

## Next Steps
- Phase 2: Tailwind CSS integration
- Phase 3: React migration for popup page
- Phase 4: React migration for response page
