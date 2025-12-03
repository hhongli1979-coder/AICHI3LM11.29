# OmniCore 钱包 - 企业级多链智能钱包平台

<p align="center">
  <strong>融合传统金融与 Web3 的企业级数字资产管理平台</strong>
</p>

<p align="center">
  <a href="#核心功能">核心功能</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#技术架构">技术架构</a> •
  <a href="#项目结构">项目结构</a> •
  <a href="#开发指南">开发指南</a>
</p>

---

## 项目简介

OmniCore 钱包是一个企业级 SaaS 平台，专为企业数字资产管理而设计。平台提供多链加密资产管理、多签钱包、全球支付处理以及 DeFi 集成等功能，并内置原生 OMNI 代币经济体系。

### 设计理念

- **专业信任** - 通过强大的安全机制、完整的审计追踪和机构级控制，让企业用户放心托管重要资产
- **智能简洁** - 将复杂的区块链操作抽象为熟悉的金融工作流程，让传统金融团队也能轻松上手 Web3
- **主动智能** - AI 驱动的风险分析、自动化 DeFi 策略和实时洞察，将被动管理转变为战略资产优化

---

## 核心功能

### 1. 多签钱包管理
创建和管理跨多条区块链的多签名钱包，支持自定义审批阈值（如 2/3、3/5 等配置）。

### 2. 交易审批工作流
多级审批系统，支持基于金额、收款方和时间锁的自定义规则，实现企业财务政策的治理控制。

### 3. 全球支付网关
支持加密货币、信用卡、支付宝、微信支付、银联等多渠道支付，统一结算管理。

### 4. DeFi 资金自动化
自动化收益耕作、质押和定投（DCA）策略，最大化闲置资产收益。

### 5. OMNI 代币经济
原生平台代币，提供手续费折扣、治理投票和质押收益分享。

### 6. AI 风险智能
使用机器学习和威胁情报 API 进行实时交易风险分析，防范欺诈并确保合规。

### 7. 组织与团队管理
多租户 SaaS 架构，支持角色权限、团队邀请和分层访问控制。

### 8. 实时仪表板与分析
统一视图展示所有资产、交易、DeFi 头寸和跨链绩效指标。

---

## 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/your-org/omnicore-wallet.git
cd omnicore-wallet

# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 可用命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | TypeScript 编译并构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 运行 ESLint 代码检查 |
| `npm run kill` | 释放 5000 端口（如被占用） |

---

## 技术架构

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.0 | UI 框架 |
| TypeScript | 5.7 | 类型安全 |
| Vite | 7.x | 构建工具 |
| Tailwind CSS | 4.x | 样式框架 |
| Radix UI | 最新 | 无头 UI 组件 |
| Phosphor Icons | 2.x | 图标库 |
| Sonner | 2.x | Toast 通知 |
| Framer Motion | 12.x | 动画库 |
| TanStack Query | 5.x | 数据获取 |
| Zod | 3.x | 数据验证 |

### GitHub Spark 集成

项目使用 GitHub Spark 框架，需要在 `vite.config.ts` 中保持 `sparkPlugin()` 和 `createIconImportProxy()` 配置。

---

## 项目结构

```
src/
├── App.tsx                    # 应用入口和标签页容器
├── main.tsx                   # Spark 初始化 + ErrorBoundary
├── ErrorFallback.tsx          # 错误回退组件
├── components/
│   ├── ui/                    # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── dashboard/             # 仪表板组件
│   │   └── DashboardStats.tsx
│   ├── wallet/                # 钱包管理组件
│   │   ├── WalletCard.tsx
│   │   ├── CreateWalletDialog.tsx
│   │   └── SendTransactionForm.tsx
│   ├── transaction/           # 交易组件
│   │   ├── TransactionList.tsx
│   │   └── TransactionSignDialog.tsx
│   ├── defi/                  # DeFi 组件
│   │   └── DeFiPositions.tsx
│   ├── token/                 # 代币组件
│   │   └── OmniTokenDashboard.tsx
│   ├── organization/          # 组织管理组件
│   │   └── OrganizationSettings.tsx
│   ├── addressbook/           # 地址簿组件
│   │   └── AddressBook.tsx
│   └── ai-assistant/          # AI 助手组件
│       ├── AIAssistant.tsx
│       └── AIModelSettings.tsx
├── lib/
│   ├── types.ts               # TypeScript 类型定义
│   ├── mock-data.ts           # 模拟数据生成器
│   └── utils.ts               # 工具函数
├── hooks/                     # 自定义 React Hooks
├── styles/
│   └── theme.css              # 主题和 Radix 颜色
└── index.css                  # 全局样式
```

---

## 开发指南

### 类型定义

所有类型定义集中在 `src/lib/types.ts`，始终从此文件导入类型，避免重复定义。

```typescript
import type { Wallet, Transaction, DeFiPosition } from '@/lib/types';
```

### 路径别名

使用 `@/` 别名指向 `src/` 目录：

```typescript
import { WalletCard } from '@/components/wallet/WalletCard';
import { formatCurrency } from '@/lib/mock-data';
```

### 模拟数据

模拟数据生成器位于 `src/lib/mock-data.ts`：

```typescript
import {
  generateMockWallets,
  generateMockTransactions,
  generateMockDeFiPositions,
  formatCurrency,
  formatAddress,
  formatTimeAgo,
} from '@/lib/mock-data';
```

### 图标使用

仅使用 Phosphor Icons（`@phosphor-icons/react`），推荐 `weight="duotone"` 或 `weight="bold"`：

```typescript
import { Wallet, ChartLine, ShieldCheck } from '@phosphor-icons/react';

<Wallet size={24} weight="duotone" />
```

### 样式规范

- 使用 Tailwind CSS 类和 CSS 变量，不要硬编码颜色
- 使用语义化 token 如 `bg-accent-9`、`text-neutral-11`、`text-muted-foreground`
- 暗色模式通过 `[data-appearance="dark"]` 选择器实现
- 卡片使用 `hover:shadow-lg transition-shadow`
- 按钮悬停缩放 102%，点击缩放 98%

### 响应式设计

- `<768px` 布局改为垂直堆叠
- 标签文字通过 `<span className="hidden sm:inline">` 隐藏

---

## 支持的区块链网络

| 网络 | 代号 | 图标 |
|------|------|------|
| Ethereum | `ethereum` | ⟠ |
| Polygon | `polygon` | ⬡ |
| BNB Chain | `bsc` | ◆ |
| Arbitrum | `arbitrum` | ◭ |
| Optimism | `optimism` | ◉ |
| Avalanche | `avalanche` | ▲ |

---

## OpenMLDB 实时特征平台

OmniCore 钱包的 AI 风险智能模块采用 [OpenMLDB](https://openmldb.ai/) 进行实时特征工程。OpenMLDB 是一个开源的机器学习数据库，为模型训练和推理提供一致、快速、生产就绪的特征计算能力。

### 核心特性

| 特性 | 描述 |
|------|------|
| **SQL 驱动的特征工程** | 使用 SQL 开发特征脚本，无需切换编程语言 |
| **实时计算** | 毫秒级超低延迟，支持时间序列和窗口操作 |
| **线上线下一致性** | 统一执行引擎确保训练和推理阶段特征一致 |
| **企业级可靠性** | 自动故障恢复、无缝扩展、全面监控 |

### 在 OmniCore 钱包中的应用场景

- **交易风险分析**：实时特征计算用于欺诈检测和风险评分
- **地址风险评估**：对区块链地址行为进行模式识别
- **市场预测**：DeFi 资金自动化的时间序列分析
- **AML/KYC 合规**：监管合规检查的特征工程

### 集成示例

```typescript
// 交易风险分析的特征计算
// 注意：查询前请验证 senderAddress 格式（如：0x 前缀的十六进制字符串）
const riskFeatures = await openmldb.computeFeatures(`
  SELECT 
    COUNT(*) OVER (PARTITION BY sender ORDER BY timestamp 
      RANGE BETWEEN 3600 PRECEDING AND CURRENT ROW) AS tx_count_1h,
    SUM(amount) OVER (PARTITION BY sender ORDER BY timestamp 
      RANGE BETWEEN 86400 PRECEDING AND CURRENT ROW) AS total_amount_24h,
    AVG(amount) OVER (PARTITION BY sender ORDER BY timestamp 
      RANGE BETWEEN 604800 PRECEDING AND CURRENT ROW) AS avg_amount_7d
  FROM transactions
  WHERE sender = ?
`, [senderAddress]);
```

> 📚 **参考资料**：[OpenMLDB 仓库](https://gitee.com/paradigm4/OpenMLDB) | [官方文档](https://openmldb.ai/docs/) | 已测试版本 OpenMLDB v0.9+

---

## 常见问题

### 端口被占用

如果 5000 端口被占用，运行：

```bash
npm run kill
```

### 依赖冲突

如遇依赖冲突，使用 `--legacy-peer-deps` 安装：

```bash
npm install --legacy-peer-deps
```

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## 贡献

欢迎提交 Issues 和 Pull Requests。详细贡献指南请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。
