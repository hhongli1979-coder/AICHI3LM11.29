# Fiat24 集成指南

欢迎阅读 Fiat24 集成指南！

探索使用 Fiat24 构建应用所需的一切——从智能合约到 RESTful API。借助我们的工具和教程，开发者可以无缝集成，立即释放 Fiat24 平台的全部强大功能！

---

## 目录

- [第一部分：智能合约集成](#第一部分智能合约集成)
- [第二部分：RESTful API](#第二部分restful-api)
- [第三部分：客户注册流程集成](#第三部分客户注册流程集成)
- [第四部分：Dune 报告模板（可选）](#第四部分dune-报告模板可选)
- [第五部分：客户服务模块（可选）](#第五部分客户服务模块可选)

---

## 第一部分：智能合约集成

本部分详细介绍 Solidity 开发人员如何在 Arbitrum 区块链中与 Fiat24 智能合约进行通信。

### 概述

Fiat24 智能合约部署在 Arbitrum 区块链上，提供去中心化的银行和支付基础设施。您可以通过这些合约直接与 Fiat24 协议交互。

### 合约地址

> **注意：** 以下为示例格式，实际合约地址请参考 [Fiat24 官方文档](https://docs.fiat24.com)。

| 合约名称 | 网络 | 地址 |
|---------|------|------|
| Fiat24Token | Arbitrum One | `0x...`（示例） |
| Fiat24Account | Arbitrum One | `0x...`（示例） |
| Fiat24Gateway | Arbitrum One | `0x...`（示例） |

### 接口定义

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFiat24Account {
    /// @notice 获取账户状态
    /// @param accountId 账户ID
    /// @return status 账户状态
    function getAccountStatus(uint256 accountId) external view returns (uint8 status);
    
    /// @notice 获取账户余额
    /// @param accountId 账户ID
    /// @param currency 货币代码
    /// @return balance 账户余额
    function getBalance(uint256 accountId, string calldata currency) external view returns (uint256 balance);
    
    /// @notice 转账
    /// @param fromAccount 发送方账户ID
    /// @param toAccount 接收方账户ID
    /// @param amount 转账金额
    /// @param currency 货币代码
    function transfer(
        uint256 fromAccount,
        uint256 toAccount,
        uint256 amount,
        string calldata currency
    ) external;
}
```

### 集成示例

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IFiat24Account.sol";

contract MyPaymentApp {
    IFiat24Account public fiat24Account;
    
    constructor(address _fiat24AccountAddress) {
        fiat24Account = IFiat24Account(_fiat24AccountAddress);
    }
    
    function checkAccountBalance(uint256 accountId) external view returns (uint256) {
        return fiat24Account.getBalance(accountId, "EUR");
    }
    
    function makePayment(
        uint256 fromAccount,
        uint256 toAccount,
        uint256 amount
    ) external {
        fiat24Account.transfer(fromAccount, toAccount, amount, "EUR");
    }
}
```

### 事件监听

```javascript
// 使用 ethers.js 监听 Fiat24 事件
// 兼容 ethers v5 和 v6
// v5: new ethers.providers.JsonRpcProvider(url)
// v6: new ethers.JsonRpcProvider(url)
const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
const fiat24Contract = new ethers.Contract(FIAT24_ADDRESS, FIAT24_ABI, provider);

fiat24Contract.on("Transfer", (from, to, amount, currency, event) => {
    console.log(`Transfer: ${from} -> ${to}, Amount: ${amount} ${currency}`);
});
```

---

## 第二部分：RESTful API

本部分包含各种 RESTful API，使您能够安全地访问和管理链下客户帐户和数据，设计和定制您的支付、卡和 Fiat24 帐户流程，并利用我们的支付和银行基础设施。

### API 基础信息

| 环境 | 基础 URL |
|------|---------|
| 生产环境 | `https://api.fiat24.com/v1` |
| 测试环境 | `https://sandbox.api.fiat24.com/v1` |

### 认证

所有 API 请求需要在 Header 中包含认证信息：

```http
Authorization: Bearer <your-api-key>
Content-Type: application/json
```

### 账户管理 API

#### 获取账户信息

```http
GET /accounts/{accountId}
```

**响应示例：**

```json
{
  "accountId": "12345",
  "status": "active",
  "balances": [
    {
      "currency": "EUR",
      "available": "1000.00",
      "pending": "50.00"
    },
    {
      "currency": "CHF",
      "available": "500.00",
      "pending": "0.00"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### 创建账户

```http
POST /accounts
```

**请求体：**

```json
{
  "type": "individual",
  "email": "user@example.com",
  "kyc": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "nationality": "CH"
  }
}
```

### 支付 API

#### 发起转账

```http
POST /payments/transfer
```

**请求体：**

```json
{
  "fromAccountId": "12345",
  "toAccountId": "67890",
  "amount": "100.00",
  "currency": "EUR",
  "reference": "Invoice #001"
}
```

#### 获取交易历史

```http
GET /accounts/{accountId}/transactions?limit=20&offset=0
```

**响应示例：**

```json
{
  "transactions": [
    {
      "id": "tx-001",
      "type": "transfer",
      "amount": "100.00",
      "currency": "EUR",
      "status": "completed",
      "createdAt": "2024-01-20T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0
  }
}
```

### 卡管理 API

#### 获取卡片列表

```http
GET /accounts/{accountId}/cards
```

#### 创建虚拟卡

```http
POST /accounts/{accountId}/cards
```

**请求体：**

```json
{
  "type": "virtual",
  "currency": "EUR",
  "spendingLimit": {
    "daily": "1000.00",
    "monthly": "5000.00"
  }
}
```

### 错误处理

所有 API 错误响应遵循统一格式：

```json
{
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Account balance is insufficient for this transaction",
    "details": {
      "requiredAmount": "100.00",
      "availableBalance": "50.00"
    }
  }
}
```

### 常见错误代码

| 错误代码 | 描述 |
|---------|------|
| `INVALID_REQUEST` | 请求格式无效 |
| `UNAUTHORIZED` | 认证失败 |
| `ACCOUNT_NOT_FOUND` | 账户不存在 |
| `INSUFFICIENT_FUNDS` | 余额不足 |
| `RATE_LIMIT_EXCEEDED` | 请求频率超限 |

---

## 第三部分：客户注册流程集成

本部分介绍如何将客户注册流程与外部应用程序集成。我们还提供配色方案，方便用户自定义外观和风格。

### 嵌入式注册流程

您可以通过 iframe 或重定向方式将 Fiat24 注册流程嵌入到您的应用中：

```html
<!-- iframe 嵌入方式 -->
<iframe
  src="https://onboarding.fiat24.com/register?partner_id=YOUR_PARTNER_ID"
  width="100%"
  height="600"
  frameborder="0"
>
</iframe>
```

### 重定向方式

```javascript
// 重定向到 Fiat24 注册页面
const onboardingUrl = new URL('https://onboarding.fiat24.com/register');
onboardingUrl.searchParams.set('partner_id', 'YOUR_PARTNER_ID');
onboardingUrl.searchParams.set('redirect_uri', 'https://your-app.com/callback');
onboardingUrl.searchParams.set('state', 'unique-state-token');

window.location.href = onboardingUrl.toString();
```

### 配色方案定制

您可以通过 URL 参数自定义注册页面的外观：

```javascript
const onboardingUrl = new URL('https://onboarding.fiat24.com/register');

// 配色参数
onboardingUrl.searchParams.set('primary_color', '#1a73e8');     // 主色调
onboardingUrl.searchParams.set('secondary_color', '#4285f4');   // 次色调
onboardingUrl.searchParams.set('accent_color', '#34a853');      // 强调色
onboardingUrl.searchParams.set('background_color', '#ffffff');  // 背景色
onboardingUrl.searchParams.set('text_color', '#202124');        // 文字颜色
onboardingUrl.searchParams.set('border_radius', '8');           // 圆角大小（px）
```

### 可用配色参数

| 参数 | 描述 | 默认值 |
|-----|------|-------|
| `primary_color` | 主按钮和链接颜色 | `#1a73e8` |
| `secondary_color` | 次要元素颜色 | `#4285f4` |
| `accent_color` | 强调和成功状态颜色 | `#34a853` |
| `background_color` | 页面背景颜色 | `#ffffff` |
| `text_color` | 主要文字颜色 | `#202124` |
| `border_radius` | 元素圆角大小 | `8` |
| `font_family` | 字体系列 | `Inter, sans-serif` |

### 回调处理

注册完成后，用户将被重定向回您指定的 `redirect_uri`，并附带以下参数：

```
https://your-app.com/callback?
  status=success&
  account_id=12345&
  state=unique-state-token
```

**回调处理示例：**

```javascript
// 处理回调
const urlParams = new URLSearchParams(window.location.search);
const status = urlParams.get('status');
const accountId = urlParams.get('account_id');
const state = urlParams.get('state');

if (status === 'success') {
  // 验证 state 参数
  if (state === storedState) {
    // 注册成功，保存账户ID
    await saveAccountId(accountId);
  }
} else {
  // 处理注册失败或取消
  const error = urlParams.get('error');
  console.error('Registration failed:', error);
}
```

### Webhook 通知

您可以配置 Webhook 接收注册状态更新：

```http
POST https://your-app.com/webhooks/fiat24
```

**Webhook 请求体：**

```json
{
  "event": "account.created",
  "data": {
    "accountId": "12345",
    "status": "active",
    "email": "user@example.com"
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "signature": "sha256=..."
}
```

---

## 第四部分：Dune 报告模板（可选）

项目可以轻松使用我们的 Dune 报告模板来构建自己的统计数据。

### 概述

Fiat24 在 Dune Analytics 上提供了预建的报告模板，帮助您快速分析和可视化链上数据。

### 可用模板

> **注意：** 以下链接为示例格式，实际 Dune 仪表板链接请访问 [Fiat24 Dune 主页](https://dune.com/fiat24)。

| 模板名称 | 描述 | Dune 链接 |
|---------|------|----------|
| 交易量分析 | 每日/每月交易量统计 | [查看模板](https://dune.com/fiat24/transactions)（示例） |
| 账户增长 | 新账户注册趋势 | [查看模板](https://dune.com/fiat24/accounts)（示例） |
| 货币分布 | 各货币使用占比 | [查看模板](https://dune.com/fiat24/currencies)（示例） |
| 用户活跃度 | 活跃用户和留存率 | [查看模板](https://dune.com/fiat24/activity)（示例） |

### 自定义查询示例

```sql
-- 获取过去30天的日交易量
SELECT
  DATE_TRUNC('day', block_time) AS date,
  COUNT(*) AS transaction_count,
  SUM(amount) AS total_volume
FROM fiat24.transactions
WHERE block_time > NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1 DESC;
```

```sql
-- 账户余额分布
SELECT
  CASE
    WHEN balance < 100 THEN '0-100'
    WHEN balance < 1000 THEN '100-1000'
    WHEN balance < 10000 THEN '1000-10000'
    ELSE '10000+'
  END AS balance_range,
  COUNT(*) AS account_count
FROM fiat24.accounts
GROUP BY 1
ORDER BY account_count DESC;
```

### 嵌入仪表板

您可以将 Dune 仪表板嵌入到您的应用中：

```html
<iframe
  src="https://dune.com/embeds/YOUR_DASHBOARD_ID"
  width="100%"
  height="500"
  frameborder="0"
>
</iframe>
```

---

## 第五部分：客户服务模块（可选）

您可以轻松地将客户服务模块集成到您的项目中。

### 概述

Fiat24 提供可嵌入的客户服务组件，包括在线聊天、帮助中心和工单系统。

### 聊天组件集成

```html
<!-- 添加 Fiat24 客服脚本 -->
<script>
  window.fiat24SupportConfig = {
    partnerId: 'YOUR_PARTNER_ID',
    language: 'zh',
    position: 'bottom-right',
    theme: {
      primaryColor: '#1a73e8',
      headerText: '客户支持'
    }
  };
</script>
<script src="https://support.fiat24.com/widget.js" async></script>
```

### React 组件

> **注意：** 以下为示例代码，实际包名和 API 请参考 Fiat24 官方 SDK 文档。

```jsx
// 示例：假设 Fiat24 提供官方 React SDK
// 实际包名请参考 Fiat24 开发者文档
import { Fiat24Support } from '@fiat24/support-react';

function App() {
  return (
    <div>
      {/* 您的应用内容 */}
      <Fiat24Support
        partnerId="YOUR_PARTNER_ID"
        language="zh"
        position="bottom-right"
        theme={{
          primaryColor: '#1a73e8',
          headerText: '客户支持'
        }}
      />
    </div>
  );
}
```

### 帮助中心嵌入

```html
<iframe
  src="https://help.fiat24.com/embed?partner_id=YOUR_PARTNER_ID&lang=zh"
  width="100%"
  height="600"
  frameborder="0"
>
</iframe>
```

### 工单 API

#### 创建工单

```http
POST /support/tickets
```

**请求体：**

```json
{
  "accountId": "12345",
  "subject": "交易问题",
  "description": "我的转账未到账",
  "priority": "high",
  "category": "transactions"
}
```

#### 获取工单状态

```http
GET /support/tickets/{ticketId}
```

**响应示例：**

```json
{
  "ticketId": "TKT-001",
  "status": "in_progress",
  "subject": "交易问题",
  "messages": [
    {
      "from": "customer",
      "content": "我的转账未到账",
      "timestamp": "2024-01-20T14:30:00Z"
    },
    {
      "from": "support",
      "content": "我们正在查看您的问题，请稍候",
      "timestamp": "2024-01-20T15:00:00Z"
    }
  ]
}
```

### 配置选项

| 选项 | 描述 | 类型 |
|-----|------|------|
| `partnerId` | 合作伙伴ID | `string` |
| `language` | 界面语言 (`zh`, `en`, `de`) | `string` |
| `position` | 组件位置 (`bottom-right`, `bottom-left`) | `string` |
| `theme.primaryColor` | 主题颜色 | `string` |
| `theme.headerText` | 头部文字 | `string` |
| `autoOpen` | 是否自动打开 | `boolean` |
| `hideOnMobile` | 移动端是否隐藏 | `boolean` |

---

## 权限说明

要与 Fiat24 集成，您无需向我们注册。所有接口都完全无需权限，支持深度集成。

## 支持

如有任何问题，请通过以下方式联系我们：

- 文档：[https://docs.fiat24.com](https://docs.fiat24.com)
- 邮箱：developers@fiat24.com
- Discord：[Fiat24 开发者社区](https://discord.gg/fiat24)

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|-----|------|---------|
| 1.0.0 | 2024-01 | 初始版本发布 |

---

*本指南持续更新中，如有建议请提交 Issue 或 Pull Request。*
