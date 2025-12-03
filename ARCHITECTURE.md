# OmniCore Wallet 技术架构文档

## 目录

- [概述](#概述)
- [技术架构](#技术架构)
- [组件架构](#组件架构)
- [数据流程](#数据流程)
- [类型系统](#类型系统)
- [样式系统](#样式系统)
- [开发规范](#开发规范)

---

## 概述

OmniCore Wallet 是一个基于 React 19 + TypeScript + Vite 构建的企业级多链智能钱包平台前端原型。项目采用现代化的前端技术栈，使用模拟数据展示完整的用户界面和交互流程。

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.0 | UI 框架 |
| TypeScript | 5.7 | 类型安全 |
| Vite | 7.x | 构建工具 |
| Tailwind CSS | 4.x | 样式框架 |
| GitHub Spark | 0.42 | 平台框架 |
| Radix UI | Latest | 无头 UI 组件 |
| Phosphor Icons | 2.x | 图标库 |
| Sonner | 2.x | Toast 通知 |

---

## 技术架构

### 项目结构

```
omnicore-wallet/
├── src/
│   ├── App.tsx                    # 应用入口和标签页容器
│   ├── main.tsx                   # Spark 初始化 + ErrorBoundary
│   ├── ErrorFallback.tsx          # 错误回退组件
│   ├── components/                # 组件目录
│   │   ├── ui/                    # 基础 UI 组件 (shadcn/ui)
│   │   ├── dashboard/             # 仪表板组件
│   │   ├── wallet/                # 钱包管理组件
│   │   ├── transaction/           # 交易组件
│   │   ├── defi/                  # DeFi 组件
│   │   ├── token/                 # 代币组件
│   │   ├── organization/          # 组织管理组件
│   │   ├── addressbook/           # 地址簿组件
│   │   └── ai-assistant/          # AI 助手组件
│   ├── lib/
│   │   ├── types.ts               # TypeScript 类型定义
│   │   ├── mock-data.ts           # 模拟数据生成器
│   │   └── utils.ts               # 工具函数
│   ├── hooks/                     # 自定义 React Hooks
│   └── styles/
│       └── theme.css              # 主题和 Radix 颜色
├── vite.config.ts                 # Vite 配置 (含 Spark 插件)
├── tailwind.config.js             # Tailwind 配置
└── tsconfig.json                  # TypeScript 配置
```

### 路径别名

项目使用 `@/` 别名指向 `src/` 目录，在 `vite.config.ts` 和 `tsconfig.json` 中配置：

```typescript
// 正确用法
import { WalletCard } from '@/components/wallet/WalletCard';
import type { Wallet } from '@/lib/types';

// 避免使用相对路径
import { WalletCard } from '../../../components/wallet/WalletCard'; // ❌
```

### GitHub Spark 集成

项目集成了 GitHub Spark 框架，需要在 `vite.config.ts` 中保持以下配置：

```typescript
import { sparkPlugin, createIconImportProxy } from '@anthropic/spark-vite-plugin';

export default defineConfig({
  plugins: [
    sparkPlugin(),
    createIconImportProxy(),
    // 其他插件...
  ],
});
```

**注意**：不要修改 Spark 相关配置。

---

## 组件架构

### 组件层次

```
App.tsx (根组件)
├── Header (页面头部)
│   ├── Logo
│   ├── Notifications (通知弹出框)
│   └── UserMenu (用户菜单)
├── Tabs (标签页容器)
│   ├── Overview (概览)
│   │   ├── DashboardStats
│   │   ├── WalletCard[]
│   │   ├── TransactionList
│   │   └── DeFiPositions
│   ├── Wallets (钱包管理)
│   │   ├── CreateWalletDialog
│   │   └── WalletCard[]
│   ├── Transactions (交易列表)
│   │   ├── TransactionList
│   │   └── TransactionSignDialog
│   ├── DeFi (DeFi 仓位)
│   │   └── DeFiPositions
│   ├── Payments (支付网关)
│   ├── OMNI (代币仪表板)
│   │   └── OmniTokenDashboard
│   ├── AI Assistant (AI 助手)
│   │   ├── AIAssistant
│   │   └── AIModelSettings
│   ├── AddressBook (地址簿)
│   │   └── AddressBook
│   └── Settings (设置)
│       └── OrganizationSettings
└── Footer (页面底部)
```

### 组件分类

#### 1. 基础 UI 组件 (`components/ui/`)

基于 shadcn/ui 的无头组件，提供基础样式和交互：

- `button.tsx` - 按钮组件
- `card.tsx` - 卡片组件
- `dialog.tsx` - 对话框组件
- `tabs.tsx` - 标签页组件
- `badge.tsx` - 徽章组件
- `input.tsx` - 输入框组件
- `select.tsx` - 选择框组件
- `progress.tsx` - 进度条组件
- `popover.tsx` - 弹出框组件

#### 2. 业务组件

| 目录 | 描述 | 主要组件 |
|------|------|----------|
| `dashboard/` | 仪表板统计 | DashboardStats |
| `wallet/` | 钱包管理 | WalletCard, CreateWalletDialog, SendTransactionForm |
| `transaction/` | 交易处理 | TransactionList, TransactionSignDialog |
| `defi/` | DeFi 仓位 | DeFiPositions |
| `token/` | OMNI 代币 | OmniTokenDashboard |
| `organization/` | 组织设置 | OrganizationSettings |
| `addressbook/` | 地址簿 | AddressBook |
| `ai-assistant/` | AI 助手 | AIAssistant, AIModelSettings |

### 组件开发规范

```typescript
// 组件模板
import { SomeIcon } from '@phosphor-icons/react';
import type { SomeType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComponentNameProps {
  data: SomeType;
  onAction?: () => void;
}

export function ComponentName({ data, onAction }: ComponentNameProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SomeIcon size={20} weight="duotone" />
          {data.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 组件内容 */}
      </CardContent>
    </Card>
  );
}
```

---

## 数据流程

### 模拟数据架构

项目使用模拟数据展示 UI，所有数据生成器位于 `src/lib/mock-data.ts`：

```typescript
// 数据生成器
import {
  generateMockWallets,        // 生成钱包数据
  generateMockTransactions,   // 生成交易数据
  generateMockDeFiPositions,  // 生成 DeFi 仓位
  generateMockOmniStats,      // 生成 OMNI 代币统计
  generateMockNotifications,  // 生成通知数据
} from '@/lib/mock-data';

// 格式化工具
import {
  formatCurrency,    // 格式化货币 ($1,234.56)
  formatAddress,     // 格式化地址 (0x1234...5678)
  formatTimeAgo,     // 格式化时间 (2 hours ago)
  getRiskColor,      // 获取风险等级颜色
  getStatusColor,    // 获取状态颜色
} from '@/lib/mock-data';
```

### 网络配置

支持的区块链网络定义在 `mock-data.ts` 中：

```typescript
export const NETWORKS = {
  ethereum: { name: 'Ethereum', color: '#627EEA', icon: '⟠' },
  polygon: { name: 'Polygon', color: '#8247E5', icon: '⬡' },
  bsc: { name: 'BNB Chain', color: '#F0B90B', icon: '◆' },
  arbitrum: { name: 'Arbitrum', color: '#28A0F0', icon: '◭' },
  optimism: { name: 'Optimism', color: '#FF0420', icon: '◉' },
  avalanche: { name: 'Avalanche', color: '#E84142', icon: '▲' },
};
```

### 添加新功能的数据流程

1. **定义类型** (`src/lib/types.ts`)
2. **创建模拟数据生成器** (`src/lib/mock-data.ts`)
3. **构建组件** (`src/components/[feature]/`)
4. **集成到 App.tsx**

---

## 类型系统

### 核心类型定义

所有类型定义集中在 `src/lib/types.ts`，按模块分类：

#### 区块链类型

```typescript
export type BlockchainNetwork = 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'optimism' | 'avalanche';
export type TransactionStatus = 'pending' | 'signed' | 'broadcasting' | 'confirmed' | 'failed' | 'expired';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
```

#### 钱包类型

```typescript
export interface Wallet {
  id: string;
  name: string;
  address: string;
  network: BlockchainNetwork;
  type: 'single' | 'multisig';
  signers?: string[];
  requiredSignatures?: number;
  balance: { native: string; usd: string; };
  tokens: TokenBalance[];
  createdAt: number;
}
```

#### 交易类型

```typescript
export interface Transaction {
  id: string;
  walletId: string;
  from: string;
  to: string;
  value: string;
  token?: string;
  network: BlockchainNetwork;
  status: TransactionStatus;
  hash?: string;
  signatures: Signature[];
  requiredSignatures: number;
  createdAt: number;
  executedAt?: number;
  expiresAt: number;
  riskAssessment?: RiskAssessment;
}
```

#### AI 助手类型

```typescript
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  action?: AIAction;
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'ollama' | 'custom' | 'local';
  modelName: string;
  apiEndpoint: string;
  enabled: boolean;
  isDefault: boolean;
}
```

### 类型导入规范

始终使用 `import type` 语法导入类型：

```typescript
// ✅ 正确
import type { Wallet, Transaction } from '@/lib/types';

// ❌ 避免
import { Wallet, Transaction } from '@/lib/types';
```

---

## 样式系统

### Tailwind CSS + CSS 变量

项目使用 Tailwind CSS v4 配合 CSS 变量实现主题化：

```css
/* src/styles/theme.css */
:root {
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.20 0.01 250);
  --card: oklch(0.96 0.01 250);
  --primary: oklch(0.35 0.08 250);
  --accent: oklch(0.60 0.15 195);
  --muted-foreground: oklch(0.45 0.02 250);
}

[data-appearance="dark"] {
  --background: oklch(0.15 0.01 250);
  --foreground: oklch(0.95 0 0);
  /* ... */
}
```

### 颜色使用规范

**始终使用语义化 Token，不要硬编码颜色：**

```typescript
// ✅ 正确
<div className="bg-card text-foreground border-muted" />
<div className="bg-accent-9 text-neutral-11" />

// ❌ 避免
<div style={{ backgroundColor: '#ffffff' }} />
```

### 常用样式模式

```typescript
// 卡片悬停效果
<Card className="hover:shadow-lg transition-shadow" />

// 按钮缩放效果
<Button className="hover:scale-[1.02] active:scale-[0.98] transition-transform" />

// 响应式网格
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />

// 隐藏移动端文字
<span className="hidden sm:inline">Label</span>
```

### 暗色模式

暗色模式通过 `[data-appearance="dark"]` 选择器实现，由 Spark 框架管理：

```css
[data-appearance="dark"] .my-component {
  /* 暗色模式样式 */
}
```

---

## 开发规范

### 图标使用

**仅使用 Phosphor Icons**：

```typescript
import { Wallet, ChartLine, ShieldCheck } from '@phosphor-icons/react';

// 使用 duotone 或 bold 样式
<Wallet size={24} weight="duotone" />
<ChartLine size={18} weight="bold" />
```

**注意**：除 `ErrorFallback.tsx` 外，不要使用 Lucide 图标。

### 代码风格

- 使用 2 空格缩进
- 使用单引号
- 多行数组/对象使用尾逗号
- 最大行宽 100 字符

### 提交规范

遵循 Conventional Commits：

```
feat(wallet): add multi-sig wallet creation
fix(transaction): correct status color
docs(readme): update installation guide
```

### 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 构建生产版本
npm run preview   # 预览生产构建
npm run lint      # 运行 ESLint
npm run kill      # 释放 5000 端口
```

---

## 常见问题

### 端口占用

```bash
npm run kill
```

### 依赖冲突

```bash
npm install --legacy-peer-deps
```

### TypeScript 错误

确保所有类型从 `@/lib/types` 导入，不要重复定义类型。

---

## 参考链接

- [README.md](./README.md) - 英文文档
- [README-zh.md](./README-zh.md) - 中文文档
- [PRD.md](./PRD.md) - 产品需求文档
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南

---

*最后更新：2025年12月*
