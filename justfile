# Default recipe to display available commands
default:
    @just --list

# Build the extension
build:
    npm run build

# Watch for changes and rebuild automatically
watch:
    npm run watch

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
