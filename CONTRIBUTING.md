# Contributing to OmniCore Wallet

Thank you for your interest in contributing to OmniCore Wallet! This document provides guidelines and information about contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Component Guidelines](#component-guidelines)
- [Styling Guidelines](#styling-guidelines)

---

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/omnicore-wallet.git
   cd omnicore-wallet
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/original-org/omnicore-wallet.git
   ```

---

## Development Setup

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define types in `src/lib/types.ts`
- Always import types using `import type { ... }` syntax
- Avoid using `any` type; use proper typing or `unknown`

### File Naming

- Use PascalCase for React components: `WalletCard.tsx`
- Use camelCase for utility files: `mock-data.ts`
- Use kebab-case for CSS/style files: `theme.css`

### Imports

Use the `@/` path alias for imports:

```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import type { Wallet } from '@/lib/types';

// ❌ Bad
import { Button } from '../../../components/ui/button';
```

### Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line arrays/objects
- Maximum line length of 100 characters

---

## Submitting Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-wallet-export`
- `fix/transaction-status-display`
- `docs/update-readme`

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(wallet): add multi-sig wallet creation dialog
fix(transaction): correct status color for pending state
docs(readme): add Chinese documentation
```

### Pull Request Process

1. Create a new branch from `main`
2. Make your changes
3. Ensure the build passes: `npm run build`
4. Submit a pull request with a clear description
5. Wait for review and address any feedback

---

## Component Guidelines

### Creating New Components

1. Place business components in the appropriate directory:
   - `components/wallet/` - Wallet-related components
   - `components/transaction/` - Transaction components
   - `components/defi/` - DeFi components
   - etc.

2. Use the existing UI components from `components/ui/`:
   ```typescript
   import { Button } from '@/components/ui/button';
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
   ```

3. Follow the component structure:
   ```typescript
   import { ComponentType } from 'react';
   import { SomeIcon } from '@phosphor-icons/react';
   import type { SomeType } from '@/lib/types';

   interface ComponentProps {
     prop1: string;
     prop2?: number;
   }

   export function ComponentName({ prop1, prop2 }: ComponentProps) {
     return (
       // JSX
     );
   }
   ```

### Mock Data

When adding new features, create mock data generators in `src/lib/mock-data.ts`:

```typescript
export function generateMock[Feature](): Type[] {
  return [
    {
      id: '[entity]-1',
      createdAt: Date.now() - 24 * 60 * 60 * 1000,
      // other fields...
    },
  ];
}
```

### Icons

**Only use Phosphor Icons** (`@phosphor-icons/react`):

```typescript
import { Wallet, ArrowsLeftRight, ChartLine } from '@phosphor-icons/react';

// Use duotone or bold weight
<Wallet size={24} weight="duotone" />
<ChartLine size={18} weight="bold" />
```

❌ **Do NOT use Lucide icons** (except in `ErrorFallback.tsx`)

---

## Styling Guidelines

### Tailwind CSS

- Use Tailwind classes for styling
- Use CSS variables for colors (defined in `theme.css`)
- Never hardcode color values

```typescript
// ✅ Good
<div className="bg-card text-foreground border-muted">

// ❌ Bad
<div style={{ backgroundColor: '#ffffff' }}>
```

### Semantic Tokens

Use semantic color tokens:
- `bg-background`, `bg-card`, `bg-muted`
- `text-foreground`, `text-muted-foreground`
- `border-border`, `border-muted`
- `bg-accent-9`, `text-neutral-11` (Radix colors)

### Responsive Design

- Mobile-first approach
- Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Grid layouts should stack on mobile (`<768px`)

```typescript
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
```

### Animations

- Cards: `hover:shadow-lg transition-shadow`
- Buttons: `hover:scale-[1.02] active:scale-[0.98] transition-transform`
- Use smooth transitions: `transition-all duration-200`

---

## Questions?

If you have questions or need help, please:
1. Check existing issues on GitHub
2. Create a new issue with the `question` label
3. Reach out to the maintainers

Thank you for contributing! 🎉
