# OmniCore Wallet – AI Agent Guide

Concise playbook for contributing with React 19 + Vite + TypeScript + GitHub Spark. This repo is a frontend prototype using mock data (no backend).

## Architecture
- Spark: Import `"@github/spark/spark"` in `src/main.tsx`; keep `sparkPlugin()` and `createIconImportProxy()` in `vite.config.ts`.
- Path alias: Use `@/` → `src/` (see `vite.config.ts`).
- UI shell: Tabs and cards in `src/App.tsx`; global `<Toaster position="top-right" />` from Sonner.
- Components: Headless shadcn in `src/components/ui/`; business UI under `dashboard/`, `wallet/`, `defi/`, `transaction/`, `token/`, `organization/`, `ai-assistant/`.

## Data & Types
- Types: Single source in `src/lib/types.ts` (e.g., `Wallet`, `Transaction`, `DeFiPosition`). Always import types—don’t redefine.
- Mock generators: `src/lib/mock-data.ts` provides `generateMockWallets/Transactions/DeFi…` and helpers `formatCurrency`, `formatAddress`, `getRiskColor`, `getStatusColor`, `formatTimeAgo`.
- Networks: `NETWORKS` defines chain name/color/icon; wallets use `wallet.network` to match these keys.
- Pattern for new mocks:
  ```ts
  export function generateMock[Feature](): Type[] {
    return [{ id: '[entity]-1', createdAt: Date.now() - N }]
  }
  ```

## UI & Styling
- Tailwind v4 + CSS variables; don’t hardcode colors. Use tokens like `bg-accent-9`, `text-neutral-11`, semantic `text-muted-foreground`.
- Radix color imports live in `src/styles/theme.css`; dark mode via `[data-appearance="dark"]` (not class-based).
- Phosphor icons (`@phosphor-icons/react`) only; prefer `weight="duotone"|"bold"`. Note: `ErrorFallback.tsx` uses Lucide—don’t add new Lucide usage elsewhere.
- Cards: `hover:shadow-lg transition-shadow`; Buttons: hover scale 102%, active 98%.
- Mobile: `<768px` stacks grids; tab labels hide via `<span className="hidden sm:inline">`.

## Dev Workflow
```bash
npm run dev       # Vite dev server
npm run build     # tsc -b --noCheck && vite build
npm run preview   # Preview production build
npm run kill      # Free port 5000 if stuck
```
- Linting: `npm run lint` (ESLint 9). Do not modify Spark plugins in `vite.config.ts`.

## Implementation Patterns
- New feature flow: define types → add mock generator → build component → wire into `App.tsx` tabs.
- Example imports: `import { WalletCard } from '@/components/wallet/WalletCard'`.
- Network badge color: `style={{ borderColor: NETWORKS[wallet.network].color }}`.
- Multi-sig: `Transaction` carries `signatures[]` and `requiredSignatures`; show progress with `Progress`/`Badge` from `ui/`.

## Pitfalls
- Don’t reinstall shadcn CLI; customize existing `src/components/ui/*` only.
- Don’t use Lucide (except in `ErrorFallback.tsx`).
- Don’t duplicate types—import from `@/lib/types`.
- Don’t hardcode colors; stick to CSS vars/Tailwind tokens.
- Keep mock data realistic with timestamps and USD formatting via helpers.

## Key Files
- `src/App.tsx` – App shell and tabs.
- `src/main.tsx` – Spark init + ErrorBoundary.
- `src/lib/types.ts`, `src/lib/mock-data.ts` – Types, mocks, formatters.
- `src/styles/theme.css` – Theme + Radix colors.
- `vite.config.ts` – Spark + icon proxy + alias.
- `PRD.md` – Product/design direction and color system.

Questions or gaps? Comment in PRs or ping to clarify missing conventions.
