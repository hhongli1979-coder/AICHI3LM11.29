# OmniCore 钱包 - 二次开发指南

<p align="center">
  <strong>OmniCore 钱包定制与扩展开发指南</strong>
</p>

<p align="center">
  <a href="./DEVELOPMENT-GUIDE.md">🇺🇸 English Version</a>
</p>

---

## 简介

本指南为希望对 OmniCore 钱包平台进行定制、扩展或二次开发（二开）的开发者提供全面的说明。无论您想添加新功能、与您的后端系统集成，还是重新设计平台品牌，本指南都将帮助您快速上手。

---

## 目录

- [环境要求](#环境要求)
- [项目架构](#项目架构)
- [快速开始](#快速开始)
- [定制扩展点](#定制扩展点)
- [添加新功能](#添加新功能)
- [后端集成](#后端集成)
- [主题与品牌定制](#主题与品牌定制)
- [多链扩展](#多链扩展)
- [AI模型集成](#ai模型集成)
- [测试您的更改](#测试您的更改)
- [部署](#部署)
- [常见问题](#常见问题)

---

## 环境要求

在开始二次开发之前，请确保您具备：

- **Node.js 18.x** 或更高版本
- **npm 9.x** 或更高版本
- **React**、**TypeScript** 和 **Tailwind CSS** 的基础知识
- Git 版本控制工具
- （可选）VS Code 及 ESLint、Tailwind CSS IntelliSense 扩展

---

## 项目架构

```
OmniCore Wallet/
├── src/
│   ├── App.tsx                    # 主应用外壳 - 在此添加新标签页
│   ├── main.tsx                   # 应用初始化
│   ├── components/
│   │   ├── ui/                    # 基础 UI 组件 (shadcn/ui)
│   │   ├── dashboard/             # 仪表板组件
│   │   ├── wallet/                # 钱包管理
│   │   ├── transaction/           # 交易处理
│   │   ├── defi/                  # DeFi 集成
│   │   ├── token/                 # 代币管理
│   │   ├── organization/          # 多租户功能
│   │   ├── addressbook/           # 联系人管理
│   │   └── ai-assistant/          # AI 功能
│   ├── lib/
│   │   ├── types.ts               # ⭐ 类型定义 - 在此扩展
│   │   ├── mock-data.ts           # ⭐ 模拟数据 - 替换为 API 调用
│   │   └── utils.ts               # 工具函数
│   ├── hooks/                     # 自定义 React Hooks
│   └── styles/
│       └── theme.css              # ⭐ 主题定制
├── public/                        # 静态资源
├── vite.config.ts                 # 构建配置
└── tailwind.config.js             # Tailwind 配置
```

### 关键扩展点

| 文件 | 用途 | 修改内容 |
|------|------|----------|
| `src/lib/types.ts` | 类型定义 | 添加新实体类型 |
| `src/lib/mock-data.ts` | 模拟数据生成器 | 替换为 API 调用 |
| `src/App.tsx` | 主应用外壳 | 添加新标签页/功能 |
| `src/styles/theme.css` | 主题样式 | 自定义颜色/品牌 |
| `tailwind.config.js` | Tailwind 配置 | 添加自定义工具类 |

---

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/hhongli1979-coder/AICHI3LM11.29.git
cd AICHI3LM11.29

# 2. 安装依赖
npm install --legacy-peer-deps

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器中打开 http://localhost:5000
```

---

## 定制扩展点

### 1. 将模拟数据替换为真实 API

当前实现使用模拟数据。要连接到您的后端：

**步骤 1**：创建 API 服务文件：

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yourservice.com';

export async function fetchWallets(): Promise<Wallet[]> {
  const response = await fetch(`${API_BASE_URL}/wallets`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });
  return response.json();
}

export async function createWallet(config: CreateWalletConfig): Promise<Wallet> {
  const response = await fetch(`${API_BASE_URL}/wallets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(config),
  });
  return response.json();
}
```

**步骤 2**：更新组件使用 API：

```typescript
// 示例：src/App.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchWallets } from '@/lib/api';

function App() {
  const { data: wallets, isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: fetchWallets,
  });
  
  if (isLoading) return <LoadingSpinner />;
  
  // 使用钱包数据...
}
```

### 2. 添加新实体类型

添加新功能时，首先定义类型：

```typescript
// src/lib/types.ts

// 添加您的新类型
export interface CustomFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: number;
}
```

### 3. 创建新组件

遵循现有模式：

```typescript
// src/components/custom/CustomFeatureCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from '@phosphor-icons/react';
import type { CustomFeature } from '@/lib/types';

interface CustomFeatureCardProps {
  feature: CustomFeature;
  onToggle: (id: string) => void;
}

export function CustomFeatureCard({ feature, onToggle }: CustomFeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star size={20} weight="duotone" />
          {feature.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{feature.description}</p>
        <Button 
          variant={feature.enabled ? "default" : "outline"}
          onClick={() => onToggle(feature.id)}
        >
          {feature.enabled ? '已启用' : '启用'}
        </Button>
      </CardContent>
    </Card>
  );
}
```

### 4. 添加新标签页

编辑 `src/App.tsx`：

```typescript
// 添加导入
import { CustomFeatureList } from '@/components/custom/CustomFeatureList';

// 在 TabsList 中添加标签触发器
<TabsTrigger value="custom" className="gap-2">
  <Star size={18} weight="duotone" />
  <span className="hidden sm:inline">自定义</span>
</TabsTrigger>

// 添加标签内容
<TabsContent value="custom" className="space-y-6">
  <CustomFeatureList />
</TabsContent>
```

---

## 后端集成

### 环境变量

创建 `.env` 文件：

```env
VITE_API_BASE_URL=https://api.yourservice.com
VITE_WS_URL=wss://ws.yourservice.com
VITE_CHAIN_RPC_ETHEREUM=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_CHAIN_RPC_POLYGON=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### API 集成模式

```typescript
// src/lib/api.ts
import type { Wallet, Transaction, DeFiPosition } from './types';

class OmniCoreAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API 错误: ${response.status}`);
    }

    return response.json();
  }

  // 钱包 API
  getWallets = () => this.request<Wallet[]>('/api/v1/wallets');
  getWallet = (id: string) => this.request<Wallet>(`/api/v1/wallets/${id}`);
  createWallet = (data: Partial<Wallet>) => 
    this.request<Wallet>('/api/v1/wallets', { method: 'POST', body: JSON.stringify(data) });

  // 交易 API
  getTransactions = (walletId?: string) => 
    this.request<Transaction[]>(`/api/v1/transactions${walletId ? `?walletId=${walletId}` : ''}`);
  createTransaction = (data: Partial<Transaction>) =>
    this.request<Transaction>('/api/v1/transactions', { method: 'POST', body: JSON.stringify(data) });
  signTransaction = (id: string, signature: string) =>
    this.request<Transaction>(`/api/v1/transactions/${id}/sign`, { method: 'POST', body: JSON.stringify({ signature }) });

  // DeFi API
  getDeFiPositions = () => this.request<DeFiPosition[]>('/api/v1/defi/positions');
}

export const api = new OmniCoreAPI(import.meta.env.VITE_API_BASE_URL || '');
```

---

## 主题与品牌定制

### 1. 配色方案

编辑 `src/styles/theme.css`：

```css
:root {
  /* 主品牌颜色 */
  --primary: oklch(0.35 0.08 250);
  --primary-foreground: oklch(0.98 0 0);
  
  /* 强调色 */
  --accent: oklch(0.60 0.15 195);
  --accent-foreground: oklch(0.98 0 0);
  
  /* 您的自定义品牌颜色 */
  --brand-primary: #your-color;
  --brand-secondary: #your-color;
}

[data-appearance="dark"] {
  --background: oklch(0.12 0.01 250);
  --foreground: oklch(0.95 0 0);
  /* 暗色模式覆盖 */
}
```

### 2. Logo 与品牌

在 `src/App.tsx` 中替换 logo：

```typescript
// 替换 logo 部分
<div className="flex items-center gap-3">
  <img src="/your-logo.svg" alt="您的品牌" className="w-10 h-10" />
  <div>
    <h1 className="text-xl font-bold">您的品牌名称</h1>
    <p className="text-xs text-muted-foreground">您的标语</p>
  </div>
</div>
```

### 3. 自定义字体

编辑 `index.html`：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

更新 `tailwind.config.js`：

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Your Font', 'Inter', 'sans-serif'],
      },
    },
  },
}
```

---

## 多链扩展

### 添加新区块链

**步骤 1**：更新类型：

```typescript
// src/lib/types.ts
export type BlockchainNetwork = 
  | 'ethereum' 
  | 'polygon' 
  | 'bsc' 
  | 'arbitrum' 
  | 'optimism' 
  | 'avalanche'
  | 'solana'    // 新链
  | 'cosmos';   // 新链
```

**步骤 2**：更新网络配置：

```typescript
// src/lib/mock-data.ts
export const NETWORKS: Record<BlockchainNetwork, { name: string; color: string; icon: string }> = {
  ethereum: { name: 'Ethereum', color: '#627EEA', icon: '⟠' },
  polygon: { name: 'Polygon', color: '#8247E5', icon: '⬡' },
  bsc: { name: 'BNB Chain', color: '#F3BA2F', icon: '◆' },
  arbitrum: { name: 'Arbitrum', color: '#28A0F0', icon: '◭' },
  optimism: { name: 'Optimism', color: '#FF0420', icon: '◉' },
  avalanche: { name: 'Avalanche', color: '#E84142', icon: '▲' },
  // 添加新链
  solana: { name: 'Solana', color: '#00D18C', icon: '◎' },
  cosmos: { name: 'Cosmos', color: '#2E3148', icon: '⚛' },
};
```

**步骤 3**：实现特定链的处理器：

```typescript
// src/lib/chains/solana.ts
import { Connection, PublicKey } from '@solana/web3.js';

export class SolanaHandler {
  private connection: Connection;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl);
  }

  async getBalance(address: string): Promise<string> {
    const pubKey = new PublicKey(address);
    const balance = await this.connection.getBalance(pubKey);
    return (balance / 1e9).toString(); // 将 lamports 转换为 SOL
  }

  async sendTransaction(/* 参数 */) {
    // 实现
  }
}
```

---

## AI模型集成

### 连接自定义 AI 模型

**步骤 1**：在设置中配置：

```typescript
// src/lib/ai-config.ts
export const AI_MODEL_CONFIGS: AIModelConfig[] = [
  {
    id: 'local-model',
    name: '本地模型',
    provider: 'local',
    modelName: 'omnicore-local',
    apiEndpoint: 'http://localhost:11434/api',
    enabled: true,
    isDefault: true,
    maxTokens: 4096,
    temperature: 0.7,
    systemPrompt: '你是一个有帮助的加密钱包助手。',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'omega-ai',
    name: 'Omega-AI',
    provider: 'omega-ai',
    modelName: 'omega-7b',
    apiEndpoint: 'http://localhost:8080/omega-ai/v1',
    enabled: true,
    isDefault: false,
    maxTokens: 8192,
    temperature: 0.5,
    systemPrompt: '你是一个专注于区块链和 DeFi 的 AI 助手。',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
```

**步骤 2**：实现 AI 服务：

```typescript
// src/lib/ai-service.ts
import type { AIModelConfig, AIMessage } from './types';

export class AIService {
  private config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  async chat(messages: AIMessage[]): Promise<AIMessage> {
    const response = await fetch(`${this.config.apiEndpoint}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify({
        model: this.config.modelName,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    const data = await response.json();
    
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: data.choices[0].message.content,
      timestamp: Date.now(),
    };
  }
}
```

---

## 测试您的更改

### 运行测试

```bash
# 运行代码检查
npm run lint

# 构建项目
npm run build

# 启动开发服务器进行手动测试
npm run dev
```

### 添加单元测试

```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatAddress } from '../mock-data';

describe('formatCurrency', () => {
  it('正确格式化 USD', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});

describe('formatAddress', () => {
  it('缩短以太坊地址', () => {
    const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f16ab1';
    expect(formatAddress(address)).toBe('0x742d...6ab1');
  });
});
```

---

## 部署

### 生产构建

```bash
# 构建优化包
npm run build

# 输出在 /dist 目录
```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建并运行
docker build -t omnicore-wallet .
docker run -p 8080:80 omnicore-wallet
```

---

## 常见问题

### 常见问题解答

| 问题 | 解决方案 |
|------|----------|
| 端口 5000 被占用 | 运行 `npm run kill` 或在 `vite.config.ts` 中更改端口 |
| 依赖冲突 | 使用 `npm install --legacy-peer-deps` |
| 类型错误 | 检查从 `@/lib/types` 导入 |
| 构建失败 | 清除 `node_modules` 并重新安装 |
| 样式未加载 | 确保 Tailwind 配置正确 |

### 获取帮助

- 查看 [GitHub Issues](https://github.com/hhongli1979-coder/AICHI3LM11.29/issues)
- 阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)
- 联系维护者

---

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE)。

---

**祝您开发愉快！🚀**

如果您使用 OmniCore 钱包构建了很棒的项目，我们很乐意听到！
