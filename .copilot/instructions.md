# QuickAsk Chrome Extension - Copilot Instructions

## Project Overview

QuickAsk is a Chrome extension that allows users to ask questions to various LLM providers directly from the browser's address bar using the omnibox keyword "ask". The extension supports multiple LLM providers including OpenAI, Anthropic, LM Studio, and Ollama.

## Architecture

### Core Technologies
- **TypeScript**: Primary language for all source code
- **Chrome Extension Manifest V3**: Using service workers and modern extension APIs
- **ES Modules**: Modern module system with `.js` imports in TypeScript

### Project Structure

```
src/
├── background/          # Service worker for extension background tasks
├── components/          # Reusable UI components
│   ├── error-display/   # Error handling UI component
│   └── loading-spinner/ # Loading state component
├── config/             # Configuration and constants
├── pages/              # Extension UI pages
│   ├── popup/          # Extension popup interface
│   └── response/       # Response display page
├── services/           # Core business logic
│   └── strategies/     # LLM provider implementations
├── shared/             # Shared styles and utilities
└── utils/              # Utility functions
```

## Key Features

### LLM Provider Support
The extension uses a **Strategy Pattern** to support multiple LLM providers:
- **OpenAI**: GPT models via OpenAI API
- **Anthropic**: Claude models via Anthropic API
- **LM Studio**: Local LLM hosting via localhost:1234
- **Ollama**: Local LLM hosting via localhost:11434

### Omnibox Integration
- Users type "ask" in the address bar followed by their question
- Questions are processed by the selected LLM provider
- Responses are displayed in a dedicated response page

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ES modules pattern with `.js` extensions in imports
- Maintain consistent file naming: kebab-case for files, PascalCase for classes
- Use JSDoc comments for public APIs and complex functions

### Architecture Patterns
1. **Strategy Pattern**: Used for LLM provider implementations
   - All providers implement `LLMProviderStrategy` interface
   - Factory pattern used for provider instantiation
   - Easy to add new providers by creating new strategy classes

2. **Service Layer**: Business logic separated into services
   - `api-service.ts`: HTTP request handling
   - `config-service.ts`: Configuration management
   - `error-service.ts`: Error handling and reporting

3. **Component-Based UI**: Reusable components with encapsulated styles
   - Each component has its own directory with `.ts` and `.css` files
   - Use vanilla TypeScript with DOM manipulation utilities

### File Organization
- Keep related files together (component + styles)
- Separate concerns: UI, business logic, configuration
- Use barrel exports (`index.ts`) for clean imports
- Maintain consistent import paths with `.js` extensions

### Chrome Extension Specifics
- **Manifest V3**: Use service workers, not background pages
- **Permissions**: Request minimal permissions needed
- **CSP**: Content Security Policy configured for extension pages
- **Host Permissions**: Configured for LLM provider APIs and local servers

### Adding New LLM Providers
1. Create new strategy class implementing `LLMProviderStrategy`
2. Add provider configuration to `constants.ts`
3. Register provider in `llm-strategy-factory.ts`
4. Update manifest.json host_permissions if needed
5. Add provider selection to popup UI

### Testing and Quality
- Run `npm run check` before committing (runs lint, format check, and build)
- Use `npm run dev` for development with watch mode
- Follow TypeScript strict mode guidelines
- Handle errors gracefully with user-friendly messages

### Browser Extension Best Practices
- Store sensitive data (API keys) in chrome.storage
- Use chrome.runtime for background communication
- Handle network errors and offline states
- Provide clear user feedback for all actions
- Respect user privacy and data handling

## Common Tasks

### Adding a New Component
1. Create directory in `src/components/`
2. Add TypeScript file with component logic
3. Add CSS file for component styles
4. Export component from directory's index.ts if needed

### Adding Configuration Options
1. Update `constants.ts` with new configuration values
2. Modify popup UI to allow user configuration
3. Use `config-service.ts` for persistent storage
4. Update TypeScript types as needed

### Debugging Extension
- Use Chrome DevTools for popup and content scripts
- Use chrome://extensions/ developer mode for service worker debugging
- Check console for error messages
- Use chrome.storage inspection for configuration issues

## Dependencies

### Runtime Dependencies
- None (vanilla TypeScript/JavaScript)

### Development Dependencies
- TypeScript compiler and type definitions
- ESLint with Prettier for code formatting
- Chrome extension type definitions

## Build and Deployment
- `npm run build`: Compile TypeScript to JavaScript
- `npm run watch`: Development mode with auto-compilation
- `npm run lint`: Check code style and potential issues
- Output goes to `dist/` directory for extension loading

## Important Notes
- Keep this file up to date as you make relevant changes
- Always use `.js` extensions in TypeScript imports (ES modules requirement)
- Test with different LLM providers to ensure compatibility
- Handle API rate limits and error responses gracefully
- Keep extension lightweight and responsive
- Follow Chrome Web Store policies for extension distribution
