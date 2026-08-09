# TierpensionPro Frontend Clickdummy V2

## Project Overview

**TierpensionPro Frontend Clickdummy V2** is a Vue 3 clickdummy application for a pet boarding management SaaS system. The application is being built incrementally, starting with core UI structure and gradually adding features and interactivity.

This is a prototype/exploration project to test design ideas and UX flows before full production implementation. An in-memory mock data model will be created to enable realistic interactions across all pages.

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** (strict mode)
- **Vite** as build tool
- **PrimeVue** for UI components
- **Vue Router** for navigation
- **Pinia** for state management (if needed)
- In-memory mock data (no backend connection)

## Project Purpose

This is a clickable prototype for demonstrating UI/UX flows and gathering feedback before full implementation.

**Content Vision:** See `content/content-vision.md` for detailed feature specifications, navigation structure, and application concept.

## UI/UX Design Guidelines

Design specifications are located in `ui_ux_design/`:

- **`design-allgemein.md`** - General design principles
- **`usability-allgemein.md`** - General usability guidelines
- **`charakter.md`** - Brand character and tone
- **`framework.md`** - Framework and technology choices
- **`light-theme.md`** - Light theme color palette and tokens
- **`ui-elemente.md`** - UI component specifications
- **`app-shell-frontend.md`** - App shell structure for authenticated SaaS area
- **`app-shell-landing-page.md`** - Landing page structure

### Key Design Principles

- Max content width: 1280px with horizontal centering
- Persistent navigation with clear active state indicators
- Command Palette (Cmd+K / Ctrl+K) for power users
- Mobile-first responsive approach with touch targets ≥44px
- Keyboard accessibility for all core functions
