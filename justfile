# Default recipe to display available commands
default:
    @just --list

# Build the extension
build:
    npm run build

# Start development server with hot reload
dev:
    npm run dev

# Clean build artifacts
clean:
    npm run clean

# Lint TypeScript files
lint:
    npm run lint

# Lint and automatically fix issues
lint-fix:
    npm run lint:fix

# Format all source files
format:
    npm run format

# Run all checks (lint, format, build)
check:
    npm run check
