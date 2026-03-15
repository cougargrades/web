# Contributing to CougarGrades

We welcome contributions! This guide will help you get started with development and submitting changes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Making Changes](#making-changes)
- [Code Style Guidelines](#code-style-guidelines)
- [Common Tasks](#common-tasks)

## Prerequisites

- **Node.js** ≥ 24.0.0
- **pnpm** ≥ 10.28.1

Check your versions:

```bash
node --version
pnpm --version
```

## Installation

```bash
# Clone the repository
git clone https://github.com/cougargrades/web.git
cd web

# Install dependencies
pnpm install
```

## Development

### Running the Full Stack Locally

Start both the API and web app in development mode:

```bash
pnpm dev
```

This runs:

- **Web App**: http://localhost:3000 (with live reload)
- **API**: http://localhost:8787 (Cloudflare Workers local emulation)

⚠️ **Important**: The local API uses sample data in Cloudflare D1. The Firestore database that powers production is **not publicly accessible**. If you're making frontend changes that depend on production data, test against the production API instead.

To allow connections from other machines (useful for testing on mobile):

```bash
pnpm dev:host
```

### Developing With Production API

If you need to test against real production data:

```bash
pnpm dev:prod
```

This points the frontend to https://api.cougargrades.io instead of your local API.

### Building

Build all packages and applications:

```bash
pnpm build
```

This:

1. Compiles TypeScript for each package
2. Bundles the web app with Vite
3. Generates Cloudflare Workers bundle for the API

### Type Checking

Check for TypeScript errors across the entire monorepo:

```bash
pnpm tsc
```

### Testing

Run all tests in the monorepo:

```bash
pnpm test
```

Individual packages can also be tested separately:

```bash
pnpm -C src/packages/atom-feed test
```

### Project Structure Reference

**Apps** (Deployable):

- `src/apps/api/` - Cloudflare Workers API (`@cougargrades/api`)
- `src/apps/web/` - React frontend (`@cougargrades/web`)

**Packages** (Shared Libraries):

- `src/packages/models/` - Data models & Zod schemas
- `src/packages/services/` - API client wrappers
- `src/packages/vendor/` - External service integrations
- `src/packages/utils/` - Shared utilities
- `src/packages/atom-feed/` - Atom feed parsing

**External Dependencies**:

- `@cougargrades/publicdata` - Public datasets (⚠️ **lives in a separate repository**, auto-installed as a dependency)

## Making Changes

### Before You Start

1. **Check Existing Issues**: Look at the issue tracker to see if your idea is already being worked on
2. **Read the Code**: Familiarize yourself with the project structure and existing patterns
3. **Understand the Stack**: Review the [Architecture and Practices sections](README.md#architecture) in the main README

### Workflow

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow the Established Patterns**
   - Use TypeScript with strict type safety
   - Add Zod schemas for new data models in `@cougargrades/models`
   - Create type-safe service wrappers in `@cougargrades/services` for new APIs
   - Use Zod validation in API endpoints

3. **Type Check Your Code**

   ```bash
   pnpm tsc
   ```

4. **Test Your Changes**
   - If adding new packages, add tests using Vitest
   - Test your API endpoints with Swagger UI (http://localhost:8787/)
   - Test the frontend against your API changes

5. **Commit with Clear Messages**

   ```bash
   git commit -m "feat: describe your change"
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request**
   - Link any related issues
   - Describe what changes were made and why
   - Note any breaking changes or new dependencies

## Code Style Guidelines

- **TypeScript**: Always use strict mode, avoid `any` types
- **Naming**: Use clear, descriptive names for variables and functions
- **Comments**: Add comments for non-obvious logic, especially in services
- **Imports**: Use workspace imports (`@cougargrades/*`) for internal packages
- **Dependencies**: Discuss major dependency additions in issues first
- **npm Scripts**: pnpm is configured with [`shellEmulator: true`](https://pnpm.io/cli/run#shellemulator), which means all npm scripts work identically on Windows and macOS/Linux. When modifying scripts in `package.json` files, keep them simple and avoid platform-specific shell syntax. Use only basic POSIX-compatible commands that will work everywhere. You may need to refer to the documentation of [@yarnpkg/shell](https://www.npmjs.com/package/@yarnpkg/shell) for advanced scenarios.

## Common Tasks

### Adding a new data model

1. Create Zod schema in `src/packages/models/src/`
2. Export from `src/packages/models/src/index.ts`
3. Use in API responses and frontend validation

### Adding a new API endpoint

1. Define request/response schemas in models
2. Create route file in `src/apps/api/src/routes/`
3. Use Zod validation middleware
4. Create service wrapper in `@cougargrades/services` for frontend use

### Adding a new external service integration

1. Create wrapper in `src/packages/vendor/src/`
2. Define types and Zod schemas
3. Export from vendor index
4. Use in API via backend-only imports

### API Development Tips

- Add new endpoints to `src/apps/api/src/routes/`
- Create Zod schemas in `src/packages/models/`
- Use Hono's middleware for common concerns (validation, auth, etc.)
- Test endpoints with Swagger UI at http://localhost:8787/
- Remember: The API is deployed to Cloudflare Workers (edge), not a traditional server

### Frontend Development Tips

- Components go in `src/apps/web/src/components/`
- Routes are managed by TanStack Router in `src/apps/web/src/routes/`
- Use TanStack Query for all server state fetching
- Use Material UI for consistent component styling
- Always validate API responses with Zod (even from `services` package)

---

Got questions? Check existing issues or [open a new one](https://github.com/cougargrades/web/issues)!
