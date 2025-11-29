# OmniCore Wallet - AI Coding Agent Instructions

## Project Overview
Enterprise-grade multi-chain crypto wallet SaaS platform built with React 19, Vite, TypeScript, and GitHub Spark. Features multi-signature wallets, DeFi integrations, payment gateway, and OMNI token economy. Currently a frontend prototype using mock data.

## Architecture & Key Concepts

### GitHub Spark Framework
- **Critical**: This project uses `@github/spark` framework requiring specific Vite plugins
- Import `"@github/spark/spark"` in main.tsx (already configured)
- `sparkPlugin()` and `createIconImportProxy()` must be in vite.config.ts
- Spark provides enhanced component behaviors and theming system

### Styling System
- **Radix UI Colors**: Uses complete Radix color palette via CSS imports in `src/styles/theme.css`
- **CSS Variables**: All colors/spacing defined as CSS custom properties (e.g., `--color-accent-9`, `--size-4`)
- **Tailwind v4**: Config in `tailwind.config.js` with custom theme extensions
- **Spacing Scale**: Uses `--size-scale` multiplier for proportional scaling across entire app
- **Dark Mode**: Implemented via `[data-appearance="dark"]` selector, not class-based

### Component Architecture
- **shadcn/ui**: Pre-configured with "new-york" style in `components.json`
- **Path Alias**: Use `@/` for imports (maps to `src/` via tsconfig and vite)
- **Icons**: Phosphor icons (`@phosphor-icons/react`) are the primary icon library, not Lucide (except ErrorFallback)
- **Toast**: Uses Sonner library, already configured in App.tsx with `<Toaster position="top-right" />`

### Data Layer Pattern
- **Mock Data First**: All data in `src/lib/mock-data.ts` with generator functions
- **Type Safety**: Strict types in `src/lib/types.ts` - always import from here
- **No Backend**: Currently pure frontend; API integration is future work
- When adding features, create mock generators matching existing pattern

## Development Workflows

### Running the App
```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript + Vite production build
npm run preview      # Preview production build
npm run kill         # Kill process on port 5000 if stuck
```

### Adding UI Components
1. Components are already installed in `src/components/ui/`
2. Import using `@/components/ui/[component-name]`
3. Customize in place - don't reinstall via shadcn CLI
4. Use Phosphor icons with `weight="duotone"` or `weight="bold"` props

### Styling Guidelines
- Use Tailwind utilities referencing CSS variables: `bg-accent-9`, `text-neutral-11`
- Spacing: Use Tailwind's scale (4, 8, 12, 16, 24, 32, 48)
- Colors: `primary` (blue), `accent` (teal), `destructive` (red) semantic tokens
- Cards use `hover:shadow-lg transition-shadow` for interactions
- Buttons: Scale animations (hover: 102%, active: 98%)

## Project-Specific Conventions

### Multi-Chain Wallet Pattern
- `NETWORKS` constant in mock-data.ts defines supported chains with colors/icons
- Each wallet has `network` property matching NETWORKS keys
- Display network badges with chain-specific colors: `style={{ borderColor: network.color }}`

### Transaction Workflow
- All transactions have `status`, `signatures[]`, and `requiredSignatures`
- Multi-sig requires collecting signatures before execution
- Risk assessment embedded in transaction object with `level` and `score`

### Component Organization
```
src/components/
  ui/              # shadcn components (never add business logic here)
  dashboard/       # Dashboard-specific cards and stats
  wallet/          # Wallet cards, lists, forms
  defi/            # DeFi position displays
  transaction/     # Transaction lists, signing UI
  token/           # OMNI token features
```

### File Naming
- React components: PascalCase with `.tsx` (e.g., `WalletCard.tsx`)
- Utilities/types: camelCase with `.ts` (e.g., `mock-data.ts`)
- CSS: kebab-case (e.g., `theme.css`)

## Critical Implementation Details

### Color System
PRD specifies triadic color scheme (blue/teal/gold). Currently:
- Primary: Blue (`--color-accent-*` using Radix Blue scale)
- Accent: Violet for secondary actions
- Use `formatCurrency()`, `formatAddress()`, `getRiskColor()` helpers from mock-data.ts

### Mock Data Generators
Always follow this pattern when creating new features:
```typescript
export function generateMock[Feature](): [Type][] {
  return [{
    id: '[entity]-1',
    // ... realistic data with timestamps
    createdAt: Date.now() - [time offset],
  }];
}
```

### Responsive Design
- Mobile breakpoint: `<768px` (md)
- Tab navigation converts to icon-only on mobile with `<span className="hidden sm:inline">`
- Cards stack vertically on small screens via grid-cols-1

### Error Handling
- `ErrorBoundary` wraps entire app in main.tsx
- Dev mode: Errors are re-thrown for Vite overlay
- Production: Custom error UI in `ErrorFallback.tsx`

## Common Pitfalls to Avoid

1. **Don't import Lucide icons** for new features - use Phosphor instead
2. **Never hardcode colors** - always use CSS variables or Tailwind tokens
3. **Don't skip type imports** - import types from `@/lib/types` to avoid duplication
4. **Spacing consistency** - stick to 4px base unit scale
5. **Mock data realism** - use proper timestamps and realistic values

## Adding New Features

1. Define TypeScript types in `src/lib/types.ts`
2. Create mock data generator in `src/lib/mock-data.ts`
3. Build component in appropriate subdirectory under `src/components/`
4. Integrate into `App.tsx` tab structure or create new tab
5. Use existing patterns: Card layouts, Badge for status, formatters for display

## Key Files Reference

- `PRD.md` - Complete product requirements and design system
- `src/App.tsx` - Main application shell with tab navigation
- `src/lib/types.ts` - Single source of truth for all types
- `src/lib/mock-data.ts` - All mock data and formatting utilities
- `src/styles/theme.css` - Complete theming system with CSS variables
- `vite.config.ts` - Build config (don't modify Spark plugins)
