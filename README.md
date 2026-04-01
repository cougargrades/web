
# CougarGrades Monorepo

[![License: GPLv2](https://img.shields.io/badge/License-GPLv2-yellow.svg)](LICENSE)
![Node.js](https://img.shields.io/badge/Node.js->24.0-green)
![pnpm](https://img.shields.io/badge/pnpm->=10-blue)

**CougarGrades** is a comprehensive tool that helps students explore course evaluations, instructor ratings, historical GPA trends, and academic data for the University of Houston. This monorepo contains the complete full-stack application-frontend, backend API, shared packages, and data services.

## 📖 Table of Contents

- [What is included?](#what-is-included)
- [What isn't included?](#what-isnt-included)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Practices](#practices)
- [Contributing](#contributing)
- [Resources](#resources)
- [License](#license)

## What is included?

The monorepo includes:
- **Web App** (`@cougargrades/web`) - A static React application deployed to Cloudflare Pages
- **API** (`@cougargrades/api`) - An HTTP API (Cloudflare Workers with Hono) that powers the web app and serves third-party data
- **Shared Packages** - Core models, services, utilities, and vendor integrations used across the stack

## What isn't included?

⚠️ **None of the following are included in this monorepo**:
- The [web scraping](https://en.wikipedia.org/wiki/Web_scraping) scripts and source data acquired from the University of Houston.
  - That can be found in the **@cougargrades/publicdata** repository linked below.
  - https://github.com/cougargrades/publicdata/tree/master/documents
- The scripts used to combine and transform the source data into a CougarGrades-specific NoSQL database
  - That can be found in the **@cougargrades/publicdata** repository linked below.
  - https://github.com/cougargrades/publicdata/tree/master/bundler
  - https://github.com/cougargrades/publicdata/tree/master/mock-database
- Direct access to the production [Firestore](https://firebase.google.com/docs/firestore) database that is populated based on data in the **@cougargrades/publicdata** project.
- The Firestore REST API client that is compatible with the Cloudflare Workers runtime.
  - That can be found in the **@cougargrades/firebase-rest-firestore** repository linked below.
  - https://github.com/cougargrades/firebase-rest-firestore
  - It is a fork of the package developed by [@nabettu](https://github.com/nabettu/firebase-rest-firestore)

## Architecture

```
cougargrades-monorepo/
├── src/
│   ├── apps/                     # Deployable applications
│   │   ├── api/                  # Cloudflare Workers backend (Hono + D1)
│   │   └── web/                  # React frontend (Vite + TanStack)
│   │
│   └── packages/                 # Shared libraries
│       ├── models/               # Zod schemas & data models
│       ├── services/             # Type-safe API clients
│       ├── vendor/               # External service wrappers (RMP, GitHub, etc.)
│       ├── utils/                # Common utilities & helpers
│       └── atom-feed/            # Atom feed parser (used for checking blog and posting messages on the site)
```

**Data Flow**:
1. Frontend (React) fetches data from the API using `@cougargrades/services`
2. API (Hono) retrieves data from Firestore, Cloudflare D1, or vendor services
3. All responses validated with Zod schemas from `@cougargrades/models`
4. Shared logic in `@cougargrades/utils` and `@cougargrades/vendor`

## Tech Stack

**Deployable applications**
- [**Frontend** (`@cougargrades/web`)](src/apps/web/README.md)
- [**Backend** (`@cougargrades/api`)](src/apps/api/README.md)

**Shared Libraries**
- [**Models** (`@cougargrades/models`)](src/packages/models/README.md) - Zod schemas for type safety and validation
- [**Services** (`@cougargrades/services`)](src/packages/services/README.md) - Type-safe API client libraries
- [**Vendor** (`@cougargrades/vendor`)](src/packages/services/README.md) - External service integrations
- [**Utils** (`@cougargrades/utils`)](src/packages/utils/README.md) - Shared utility functions
- [**Atom Feed** (`@cougargrades/atom-feed`)](src/packages/atom-feed/README.md) - Atom feed parser

**Core**
- **Language**: TypeScript with strict mode
- **Package Manager**: pnpm (monorepo workspaces)
- **Deployment**: Cloudflare (Workers + Pages)

## Practices

### TypeScript & Type Safety
- **Strict Mode Enabled**: All TSConfig files use `"strict": true`
- **Zod Validation**: Runtime validation with Zod schemas ensures data integrity at API boundaries
- **No Implicit Any**: Type inference is preferred over `any` types
- **ES Module System**: Modern `"type": "module"` throughout

### Code Organization
- **Monorepo with pnpm Workspaces**: Separate `apps/` for deployable projects and `packages/` for shared libraries
- **Clear Dependency Boundaries**: Apps depend on packages; packages can depend on other packages but not apps
- **Consistent Naming**: `@cougargrades/` scoped package names

### Testing
- **Vitest**: Lightning-fast unit testing (used in `atom-feed` package)
- **Test Patterns**: Focused on critical paths and data validation

## Contributing

We welcome contributions from the community! Whether you're interested in fixing bugs, adding features, or improving documentation, check out [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions.

## Resources

- **Live Site**: https://cougargrades.io/
- **API Documentation**: https://api.cougargrades.io/
- **License**: MIT (see [LICENSE](LICENSE))
