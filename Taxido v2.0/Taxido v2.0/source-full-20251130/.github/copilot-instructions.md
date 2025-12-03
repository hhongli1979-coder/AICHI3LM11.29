# OmniCore Wallet — AI Coding Agent Guide

## Project Overview
Enterprise-grade multi-chain crypto wallet SaaS prototype built with React 19, Vite 7, TypeScript, and GitHub Spark. Features multi-signature wallets, DeFi integrations, payment gateway, and OMNI token economy. Frontend-only using realistic mock data.

## Architecture & Key Concepts

### GitHub Spark Framework
- **Critical**: Uses `@github/spark`; required Vite plugins already wired
- Import `"@github/spark/spark"` in `src/main.tsx` (present)
- `sparkPlugin()` and `createIconImportProxy()` exist in `vite.config.ts` — do not remove or reorder
- Spark augments component behaviors and theming; keep default Spark config intact

### Styling System
- **Radix Colors**: Full palette imported in `src/styles/theme.css`
- **CSS Variables**: Colors/spacing via custom properties (e.g., `--color-accent-9`, `--size-4`)
- **Tailwind v4**: Config in `tailwind.config.js`; prefer utilities bound to CSS variables
- **Spacing Scale**: Global `--size-scale` drives proportional spacing
- **Dark Mode**: Use `[data-appearance="dark"]` selector; avoid class-based toggles

### Component Architecture
- **shadcn/ui**: Pre-configured with "new-york" style; components live under `src/components/ui/`
- **Path Alias**: Import with `@/` (maps to `src/` via `tsconfig.json` + Vite)
- **Icons**: Prefer Phosphor (`@phosphor-icons/react`); Lucide only appears in `ErrorFallback.tsx`
- **Toast**: Sonner configured in `src/App.tsx` with `<Toaster position="top-right" />`

### Data Layer Pattern
- **Mock First**: Generators in `src/lib/mock-data.ts` provide realistic data
- **Types**: Import from `src/lib/types.ts` — single source of truth
- **Frontend-only**: No backend calls; integration is future work
- **Additions**: New features require a matching mock generator

## Development Workflows

### Build & Dev Workflows
- `npm run dev`: Start Vite dev server
- `npm run build`: TypeScript project build + Vite production bundle
- `npm run preview`: Preview production build
- `npm run optimize`: Warm Vite dep optimizer if needed
- `npm run lint`: Run ESLint
- `npm run kill`: Free port `5000` if the dev server is stuck

### Adding UI Components
1. Use existing components under `src/components/ui/`; import as `@/components/ui/[name]`
2. Customize locally; do not run shadcn CLI
3. Use Phosphor icons with `weight="duotone"` or `weight="bold"`
4. Keep business logic out of `ui/`; place it under feature folders

### Styling Guidelines
- Tailwind utilities should reference CSS vars: `bg-accent-9`, `text-neutral-11`
- Spacing scale: 4, 8, 12, 16, 24, 32, 48
- Semantic tokens: `primary` (blue), `accent` (teal), `destructive` (red)
- Cards: `hover:shadow-lg transition-shadow`
- Buttons: scale animations (`hover: 102%`, `active: 98%`)

## Project-Specific Conventions

### Multi-Chain Wallet Pattern
- `NETWORKS` in `src/lib/mock-data.ts` defines supported chains (colors/icons)
- Wallets include `network` matching `NETWORKS` keys
- Render network badges with chain colors: `style={{ borderColor: network.color }}`

### Transaction Workflow
- Transactions carry `status`, `signatures[]`, `requiredSignatures`, and `risk`
- Multi-sig: collect signatures before execution; UI in `TransactionSignDialog.tsx`
- Display lists via `TransactionList.tsx`; use `getRiskColor()` from `mock-data.ts`

### Component Organization
```
src/components/
  ui/              # shadcn components (never add business logic here)
  dashboard/       # Dashboard stats (e.g., `DashboardStats.tsx`)
  wallet/          # Wallet cards/forms (`WalletCard.tsx`, `CreateWalletDialog.tsx`)
  defi/            # DeFi positions (`DeFiPositions.tsx`)
  transaction/     # Transaction lists / signing (`TransactionList.tsx`)
  token/           # OMNI token features (`OmniTokenDashboard.tsx`)
```

### File Naming
- React components: PascalCase `.tsx` (e.g., `WalletCard.tsx`)
- Utilities/types: camelCase `.ts` (e.g., `mock-data.ts`)
- CSS: kebab-case (e.g., `theme.css`)

## Critical Implementation Details

### Color System
PRD triadic color scheme (blue/teal/gold):
- Primary: Blue (`--color-accent-*` via Radix Blue)
- Accent: Violet for secondary actions
- Use helpers from `mock-data.ts`: `formatCurrency()`, `formatAddress()`, `getRiskColor()`

### Mock Data Generators
Follow this pattern when creating new features:
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
- `ErrorBoundary` wraps app in `src/main.tsx`
- Dev mode: errors re-thrown for Vite overlay
- Production: custom UI in `src/ErrorFallback.tsx`

## Common Pitfalls to Avoid

1. **Avoid Lucide** for new features — use Phosphor
2. **Never hardcode colors** — use CSS variables or Tailwind tokens
3. **Type imports required** — import from `@/lib/types`
4. **Spacing consistency** — 4px base unit scale
5. **Mock realism** — realistic timestamps and values
6. **Do not modify Spark Vite config** — keep `sparkPlugin()` and `createIconImportProxy()`

## Adding New Features

1. Define strict types in `src/lib/types.ts`
2. Create mock generator in `src/lib/mock-data.ts`
3. Implement component under `src/components/[feature]/`
4. Integrate via tab structure in `src/App.tsx`
5. Use patterns: Card layouts, `Badge` for status, formatters for display

## Key Files Reference

- `PRD.md` — Product requirements and design system
- `src/App.tsx` — Main app shell with tab navigation
- `src/lib/types.ts` — Types: wallets, transactions, DeFi, org
- `src/lib/mock-data.ts` — Mock generators + helpers (formatters, risk color)
- `src/styles/theme.css` — Theming via CSS variables + Radix colors
- `vite.config.ts` — Build config (Spark plugins — do not modify)
- `package.json` — Scripts: dev/build/preview/optimize/lint/kill

## Practical Examples
- **Path alias**: `import { NETWORKS } from '@/lib/mock-data'`
- **Risk color**: `const color = getRiskColor(tx.risk.level)`
- **Badge color**: `style={{ borderColor: NETWORKS[wallet.network].color }}`
- **Toast**: `toast.success('Transaction submitted')` via Sonner

## Debugging Tips
- If dev server fails to start, run `npm run kill` then `npm run dev`
- Use Vite overlay in dev; check `ErrorFallback.tsx` behavior in preview

## Notes for Agents
- Keep changes minimal and aligned with existing patterns
- Prefer adding feature mocks over ad-hoc state within components
- Validate UI in dev and preview modes before proposing refactors
