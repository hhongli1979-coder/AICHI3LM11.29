/**
 * OmniCore Wallet - Mock Data Generators
 * 
 * This file contains mock data generators and utility functions for the OmniCore Wallet platform.
 * All mock data is used for frontend prototyping and development purposes.
 * 
 * @module mock-data
 */

import type { Wallet, Transaction, DeFiPosition, PaymentRequest, DCAStrategy, OmniTokenStats, NotificationItem, AIMessage, AIMemoryItem, AICapability, AIAssistantState, AIModelConfig, AIModelSettings, CustomEndpoint, TradingAgent, TradingAgentsConfig, StockAnalysisReport, AgentAnalysisResult } from './types';

// ============================================================================
// Network Configuration
// ============================================================================

/**
 * Supported blockchain networks with display information
 * 
 * @example
 * ```typescript
 * const network = NETWORKS['ethereum'];
 * console.log(network.name); // 'Ethereum'
 * console.log(network.color); // '#627EEA'
 * ```
 */
export const NETWORKS = {
  ethereum: { name: 'Ethereum', color: '#627EEA', icon: '⟠' },
  polygon: { name: 'Polygon', color: '#8247E5', icon: '⬡' },
  bsc: { name: 'BNB Chain', color: '#F3BA2F', icon: '◆' },
  arbitrum: { name: 'Arbitrum', color: '#28A0F0', icon: '◭' },
  optimism: { name: 'Optimism', color: '#FF0420', icon: '◉' },
  avalanche: { name: 'Avalanche', color: '#E84142', icon: '▲' },
};

// ============================================================================
// Wallet Mock Data
// ============================================================================

/**
 * Generate mock wallet data for development
 * 
 * @returns Array of mock Wallet objects
 * 
 * @example
 * ```typescript
 * const wallets = generateMockWallets();
 * console.log(wallets.length); // 3
 * ```
 */
export function generateMockWallets(): Wallet[] {
  return [
    {
      id: 'wallet-1',
      name: 'Treasury Vault',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      network: 'ethereum',
      type: 'multisig',
      signers: ['0x1234...5678', '0x8765...4321', '0xabcd...efgh'],
      requiredSignatures: 2,
      balance: {
        native: '45.2341',
        usd: '125,432.18',
      },
      tokens: [
        {
          symbol: 'USDC',
          name: 'USD Coin',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          balance: '50000.00',
          decimals: 6,
          priceUsd: '1.00',
          valueUsd: '50000.00',
        },
        {
          symbol: 'OMNI',
          name: 'Omni Token',
          address: '0x1234567890abcdef',
          balance: '10000.00',
          decimals: 18,
          priceUsd: '2.45',
          valueUsd: '24500.00',
        },
      ],
      createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'wallet-2',
      name: 'Operating Account',
      address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      network: 'polygon',
      type: 'multisig',
      signers: ['0x1234...5678', '0x8765...4321'],
      requiredSignatures: 1,
      balance: {
        native: '12500.8834',
        usd: '8,234.42',
      },
      tokens: [
        {
          symbol: 'USDT',
          name: 'Tether USD',
          address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
          balance: '15000.00',
          decimals: 6,
          priceUsd: '1.00',
          valueUsd: '15000.00',
        },
      ],
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'wallet-3',
      name: 'DeFi Strategy Wallet',
      address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
      network: 'arbitrum',
      type: 'single',
      balance: {
        native: '2.8934',
        usd: '8,024.15',
      },
      tokens: [],
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
  ];
}

/**
 * Generate mock transaction data for development
 * 
 * @returns Array of mock Transaction objects
 */
export function generateMockTransactions(): Transaction[] {
  return [
    {
      id: 'tx-1',
      walletId: 'wallet-1',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      to: '0x9876543210fedcba',
      value: '5000.00',
      token: 'USDC',
      network: 'ethereum',
      status: 'pending',
      signatures: [
        {
          signer: '0x1234...5678',
          signature: '0xabcdef...',
          signedAt: Date.now() - 2 * 60 * 60 * 1000,
        },
      ],
      requiredSignatures: 2,
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      expiresAt: Date.now() + 4 * 24 * 60 * 60 * 1000,
      description: 'Supplier payment for Q4 services',
      riskAssessment: {
        level: 'low',
        score: 15,
        factors: ['Known counterparty', 'Regular transaction pattern'],
        recommendations: [],
      },
    },
    {
      id: 'tx-2',
      walletId: 'wallet-1',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      to: '0x1234567890abcdef',
      value: '1.5',
      network: 'ethereum',
      status: 'confirmed',
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      signatures: [
        {
          signer: '0x1234...5678',
          signature: '0xabcdef...',
          signedAt: Date.now() - 5 * 60 * 60 * 1000,
        },
        {
          signer: '0x8765...4321',
          signature: '0x123456...',
          signedAt: Date.now() - 4 * 60 * 60 * 1000,
        },
      ],
      requiredSignatures: 2,
      createdAt: Date.now() - 6 * 60 * 60 * 1000,
      executedAt: Date.now() - 4 * 60 * 60 * 1000,
      expiresAt: Date.now() + 1 * 24 * 60 * 60 * 1000,
      description: 'Employee bonus payout',
      riskAssessment: {
        level: 'low',
        score: 10,
        factors: ['Internal transfer', 'Below threshold'],
        recommendations: [],
      },
    },
    {
      id: 'tx-3',
      walletId: 'wallet-2',
      from: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      to: '0xhighriskabc123',
      value: '25000.00',
      token: 'USDT',
      network: 'polygon',
      status: 'pending',
      signatures: [],
      requiredSignatures: 1,
      createdAt: Date.now() - 1 * 60 * 60 * 1000,
      expiresAt: Date.now() + 6 * 24 * 60 * 60 * 1000,
      description: 'Large transfer to new address',
      riskAssessment: {
        level: 'high',
        score: 85,
        factors: ['First-time recipient', 'Large amount', 'Address flagged by threat intelligence'],
        recommendations: ['Verify recipient identity', 'Consider splitting transaction', 'Enable time lock'],
      },
    },
  ];
}

/**
 * Generate mock DeFi positions for development
 * 
 * @returns Array of mock DeFiPosition objects
 */
export function generateMockDeFiPositions(): DeFiPosition[] {
  return [
    {
      id: 'defi-1',
      protocol: 'Aave V3',
      type: 'lending',
      asset: 'USDC',
      amount: '25000.00',
      valueUsd: '25000.00',
      apy: 5.2,
      rewards: '1.42',
      healthFactor: 2.5,
      network: 'ethereum',
    },
    {
      id: 'defi-2',
      protocol: 'Lido',
      type: 'staking',
      asset: 'ETH',
      amount: '10.5',
      valueUsd: '29,115.00',
      apy: 3.8,
      rewards: '0.045',
      network: 'ethereum',
    },
    {
      id: 'defi-3',
      protocol: 'Uniswap V3',
      type: 'liquidity',
      asset: 'ETH-USDC',
      amount: '50000.00',
      valueUsd: '50000.00',
      apy: 12.5,
      rewards: '68.50',
      network: 'ethereum',
    },
  ];
}

/**
 * Generate mock payment requests for development
 * 
 * @returns Array of mock PaymentRequest objects
 */
export function generateMockPayments(): PaymentRequest[] {
  return [
    {
      id: 'pay-1',
      merchantId: 'merchant-1',
      amount: 299.99,
      currency: 'USD',
      channel: 'stripe',
      status: 'completed',
      description: 'Enterprise Plan - Annual',
      completedAt: Date.now() - 2 * 60 * 60 * 1000,
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    },
    {
      id: 'pay-2',
      merchantId: 'merchant-1',
      amount: 5000,
      currency: 'CNY',
      channel: 'alipay',
      status: 'pending',
      description: 'Product Purchase Order #12345',
      paymentUrl: 'https://payment.omnicore.io/pay-2',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
      createdAt: Date.now() - 30 * 60 * 1000,
      expiresAt: Date.now() + 30 * 60 * 1000,
    },
  ];
}

/**
 * Generate mock DCA strategies for development
 * 
 * @returns Array of mock DCAStrategy objects
 */
export function generateMockDCAStrategies(): DCAStrategy[] {
  return [
    {
      id: 'dca-1',
      name: 'ETH Accumulation',
      sourceToken: 'USDC',
      targetToken: 'ETH',
      amountPerInterval: '1000.00',
      intervalHours: 168,
      lastExecutedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      nextExecutionAt: Date.now() + 2 * 24 * 60 * 60 * 1000,
      totalInvested: '12000.00',
      totalReceived: '4.523',
      enabled: true,
    },
    {
      id: 'dca-2',
      name: 'BTC Monthly Buy',
      sourceToken: 'USDT',
      targetToken: 'WBTC',
      amountPerInterval: '2500.00',
      intervalHours: 720,
      lastExecutedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      nextExecutionAt: Date.now() + 15 * 24 * 60 * 60 * 1000,
      totalInvested: '25000.00',
      totalReceived: '0.285',
      enabled: true,
    },
  ];
}

/**
 * Generate mock OMNI token statistics
 * 
 * @returns Mock OmniTokenStats object
 */
export function generateMockOmniStats(): OmniTokenStats {
  return {
    price: 2.45,
    marketCap: 245000000,
    totalSupply: '1000000000',
    circulatingSupply: '400000000',
    stakedAmount: '150000000',
    stakingApy: 8.5,
    yourBalance: '10000.00',
    yourStaked: '5000.00',
    yourRewards: '42.50',
  };
}

/**
 * Generate mock notification data
 * 
 * @returns Array of mock NotificationItem objects
 */
export function generateMockNotifications(): NotificationItem[] {
  return [
    {
      id: 'notif-1',
      type: 'approval',
      title: 'Signature Required',
      message: 'Treasury Vault transaction needs your approval (5000 USDC to supplier)',
      read: false,
      createdAt: Date.now() - 30 * 60 * 1000,
      actionUrl: '/transactions/tx-1',
    },
    {
      id: 'notif-2',
      type: 'risk',
      title: 'High Risk Transaction Detected',
      message: 'Large transfer to flagged address - immediate review recommended',
      read: false,
      createdAt: Date.now() - 15 * 60 * 1000,
      actionUrl: '/transactions/tx-3',
    },
    {
      id: 'notif-3',
      type: 'transaction',
      title: 'Transaction Confirmed',
      message: 'Employee bonus payout completed successfully',
      read: true,
      createdAt: Date.now() - 4 * 60 * 60 * 1000,
      actionUrl: '/transactions/tx-2',
    },
    {
      id: 'notif-4',
      type: 'payment',
      title: 'Payment Received',
      message: 'Enterprise Plan subscription renewed - $299.99',
      read: true,
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
    },
  ];
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format a blockchain address for display (truncated)
 * 
 * @param address - Full blockchain address
 * @param chars - Number of characters to show at start/end (default: 4)
 * @returns Truncated address string (e.g., "0x1234...5678")
 * 
 * @example
 * ```typescript
 * formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
 * // Returns: "0x742d...0bEb"
 * ```
 */
export function formatAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a number as currency
 * 
 * @param amount - Amount to format (string or number)
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string (e.g., "$1,234.56")
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56); // Returns: "$1,234.56"
 * formatCurrency('1000', 'EUR'); // Returns: "€1,000.00"
 * ```
 */
export function formatCurrency(amount: string | number, currency = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format a large number with K/M/B suffix
 * 
 * @param num - Number to format
 * @returns Formatted string with suffix (e.g., "1.23M")
 * 
 * @example
 * ```typescript
 * formatLargeNumber(1234567); // Returns: "1.23M"
 * formatLargeNumber(1500); // Returns: "1.50K"
 * ```
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

/**
 * Format a timestamp as relative time
 * 
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Human-readable relative time (e.g., "5m ago", "2h ago")
 * 
 * @example
 * ```typescript
 * formatTimeAgo(Date.now() - 300000); // Returns: "5m ago"
 * formatTimeAgo(Date.now() - 86400000); // Returns: "1d ago"
 * ```
 */
export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Get Tailwind CSS color class for risk level
 * 
 * @param level - Risk level string
 * @returns Tailwind CSS text color class
 * 
 * @example
 * ```typescript
 * getRiskColor('high'); // Returns: "text-orange-600"
 * ```
 */
export function getRiskColor(level: string): string {
  switch (level) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-orange-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

/**
 * Get Tailwind CSS color class for transaction status
 * 
 * @param status - Transaction status string
 * @returns Tailwind CSS text color class
 * 
 * @example
 * ```typescript
 * getStatusColor('confirmed'); // Returns: "text-green-600"
 * getStatusColor('pending'); // Returns: "text-yellow-600"
 * ```
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
    case 'completed': return 'text-green-600';
    case 'pending':
    case 'signed': return 'text-yellow-600';
    case 'broadcasting': return 'text-blue-600';
    case 'failed':
    case 'expired': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

// AI Assistant Mock Data

export function generateMockAICapabilities(): AICapability[] {
  return [
    {
      id: 'cap-1',
      name: '对话记忆',
      description: '记住用户偏好和历史交互，提供个性化服务',
      icon: 'Brain',
      enabled: true,
      category: 'memory',
    },
    {
      id: 'cap-2',
      name: '交易模式学习',
      description: '分析并学习用户的交易习惯和模式',
      icon: 'ChartLine',
      enabled: true,
      category: 'memory',
    },
    {
      id: 'cap-3',
      name: '自然语言理解',
      description: '理解多语言输入，解析用户意图',
      icon: 'ChatCircle',
      enabled: true,
      category: 'language',
    },
    {
      id: 'cap-4',
      name: '智能回复生成',
      description: '生成上下文相关的智能回复',
      icon: 'Robot',
      enabled: true,
      category: 'language',
    },
    {
      id: 'cap-5',
      name: '钱包管理',
      description: '创建、查询和管理加密钱包',
      icon: 'Wallet',
      enabled: true,
      category: 'control',
    },
    {
      id: 'cap-6',
      name: '交易执行',
      description: '发起和签署交易操作',
      icon: 'ArrowsLeftRight',
      enabled: true,
      category: 'control',
    },
    {
      id: 'cap-7',
      name: 'DeFi策略',
      description: '管理DeFi头寸和收益策略',
      icon: 'ChartLine',
      enabled: true,
      category: 'control',
    },
    {
      id: 'cap-8',
      name: '风险分析',
      description: '实时评估交易和地址风险',
      icon: 'ShieldCheck',
      enabled: true,
      category: 'control',
    },
  ];
}

export function generateMockAIMemories(): AIMemoryItem[] {
  return [
    {
      id: 'mem-1',
      type: 'preference',
      key: '首选网络',
      value: 'Ethereum 和 Polygon',
      confidence: 0.95,
      learnedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      usageCount: 45,
    },
    {
      id: 'mem-2',
      type: 'transaction_pattern',
      key: '常用交易金额',
      value: '通常在 $1,000 - $10,000 范围内',
      confidence: 0.88,
      learnedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
      usageCount: 23,
    },
    {
      id: 'mem-3',
      type: 'contact',
      key: '常用收款地址',
      value: '供应商钱包 0x9876...3210',
      confidence: 0.92,
      learnedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      usageCount: 12,
    },
    {
      id: 'mem-4',
      type: 'insight',
      key: '风险偏好',
      value: '倾向于低风险DeFi策略，APY < 15%',
      confidence: 0.85,
      learnedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      usageCount: 8,
    },
    {
      id: 'mem-5',
      type: 'preference',
      key: '语言偏好',
      value: '中文优先，英文备选',
      confidence: 0.98,
      learnedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
      usageCount: 156,
    },
  ];
}

export function generateMockAIConversation(): AIMessage[] {
  return [
    {
      id: 'msg-1',
      role: 'assistant',
      content: '您好！我是 OmniCore 智能助手。我可以帮助您管理钱包、执行交易、分析风险，并根据您的历史操作提供个性化建议。请问有什么可以帮到您？',
      timestamp: Date.now() - 10 * 60 * 1000,
    },
    {
      id: 'msg-2',
      role: 'user',
      content: '帮我查看一下我的钱包余额',
      timestamp: Date.now() - 9 * 60 * 1000,
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: '根据我的记录，您有3个活跃钱包：\n\n📊 **Treasury Vault** (Ethereum)\n- ETH: 45.23 ($125,432.18)\n- USDC: 50,000\n- OMNI: 10,000\n\n📊 **Operating Account** (Polygon)\n- MATIC: 12,500.88 ($8,234.42)\n- USDT: 15,000\n\n📊 **DeFi Strategy Wallet** (Arbitrum)\n- ETH: 2.89 ($8,024.15)\n\n💰 **总资产价值**: ~$231,690.75\n\n需要我帮您执行任何操作吗？',
      timestamp: Date.now() - 8 * 60 * 1000,
      action: {
        type: 'wallet_query',
        status: 'completed',
        result: '成功检索钱包信息',
      },
    },
    {
      id: 'msg-4',
      role: 'user',
      content: '有什么好的DeFi策略推荐吗？',
      timestamp: Date.now() - 5 * 60 * 1000,
    },
    {
      id: 'msg-5',
      role: 'assistant',
      content: '根据您的风险偏好（低风险，APY < 15%），我推荐以下策略：\n\n1. **Aave V3 稳定币借贷** ⭐\n   - 资产: USDC\n   - 预期 APY: 5.2%\n   - 风险等级: 低\n   - 当前您已存入 $25,000\n\n2. **Lido ETH 质押**\n   - 资产: ETH\n   - 预期 APY: 3.8%\n   - 风险等级: 低\n   - 当前您已质押 10.5 ETH\n\n3. **新推荐: Compound V3 USDT**\n   - 预期 APY: 4.5%\n   - 风险等级: 低\n   - 推荐投入: $10,000\n\n需要我帮您设置自动投资策略吗？',
      timestamp: Date.now() - 4 * 60 * 1000,
      action: {
        type: 'defi_manage',
        status: 'completed',
        result: '分析完成，生成个性化推荐',
      },
    },
  ];
}

export function generateMockAIAssistantState(): AIAssistantState {
  return {
    isActive: true,
    currentConversation: generateMockAIConversation(),
    memories: generateMockAIMemories(),
    capabilities: generateMockAICapabilities(),
    lastActiveAt: Date.now() - 4 * 60 * 1000,
  };
}

// Native AI Model Configuration Mock Data - 原生态大模型配置

export function generateMockAIModelConfigs(): AIModelConfig[] {
  return [
    {
      id: 'model-1',
      name: 'OmniCore 本地模型',
      provider: 'local',
      modelName: 'omnicore-7b',
      apiEndpoint: 'http://localhost:11434/api/generate',
      enabled: true,
      isDefault: true,
      maxTokens: 4096,
      temperature: 0.7,
      systemPrompt: '你是 OmniCore 钱包的智能助手，专注于加密货币钱包管理、DeFi 策略和风险分析。请用专业且友好的方式回答用户问题。',
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'model-2',
      name: 'Ollama Llama3',
      provider: 'ollama',
      modelName: 'llama3:8b',
      apiEndpoint: 'http://localhost:11434/api/generate',
      enabled: true,
      isDefault: false,
      maxTokens: 8192,
      temperature: 0.8,
      systemPrompt: '你是一个专业的加密货币和区块链顾问。',
      createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'model-3',
      name: '自定义模型接口',
      provider: 'custom',
      modelName: 'custom-finance-llm',
      apiEndpoint: 'https://api.your-company.com/v1/chat',
      apiKey: 'sk-***',
      enabled: false,
      isDefault: false,
      maxTokens: 2048,
      temperature: 0.5,
      systemPrompt: '你是金融科技领域的专家助手。',
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'model-4',
      name: 'Omega-AI 深度学习引擎',
      provider: 'omega-ai',
      modelName: 'omega-ai-transformer',
      apiEndpoint: 'http://localhost:8080/api/inference',
      enabled: true,
      isDefault: false,
      maxTokens: 4096,
      temperature: 0.6,
      systemPrompt: '你是基于Omega-AI深度学习框架的智能助手，专注于金融风险分析和智能决策。支持自动求导、多GPU训练和CUDA/CUDNN加速。',
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now(),
    },
  ];
}

export function generateMockCustomEndpoints(): CustomEndpoint[] {
  return [
    {
      id: 'endpoint-1',
      name: '企业内部API',
      url: 'https://internal-ai.company.com/v1/completions',
      headers: {
        'Authorization': 'Bearer ***',
        'Content-Type': 'application/json',
      },
      enabled: true,
    },
    {
      id: 'endpoint-2',
      name: '测试环境',
      url: 'http://192.168.1.100:8080/api/generate',
      headers: {},
      enabled: false,
    },
  ];
}

export function generateMockAIModelSettings(): AIModelSettings {
  const models = generateMockAIModelConfigs();
  return {
    models,
    defaultModelId: models[0].id,
    enableLocalProcessing: true,
    enableSecondaryDevelopment: true,
    customEndpoints: generateMockCustomEndpoints(),
  };
}

// ============================================================================
// TradingAgents Mock Data - 多智能体交易分析
// Based on TradingAgents-CN framework: https://github.com/hsliuping/TradingAgents-CN
// ============================================================================

/**
 * Generate mock trading agents configuration
 * 
 * @returns Array of mock TradingAgent objects
 */
export function generateMockTradingAgents(): TradingAgent[] {
  return [
    {
      id: 'agent-market',
      type: 'market_analyst',
      name: '市场分析师',
      description: '技术指标分析、K线形态识别、趋势判断',
      icon: 'ChartLine',
      enabled: true,
      modelId: 'model-1',
    },
    {
      id: 'agent-fundamental',
      type: 'fundamental_analyst',
      name: '基本面分析师',
      description: 'PE/PB估值、财务指标、盈利能力分析',
      icon: 'Calculator',
      enabled: true,
      modelId: 'model-1',
    },
    {
      id: 'agent-news',
      type: 'news_analyst',
      name: '新闻分析师',
      description: '新闻舆情分析、市场情绪判断、热点追踪',
      icon: 'Newspaper',
      enabled: true,
      modelId: 'model-2',
    },
    {
      id: 'agent-risk',
      type: 'risk_analyst',
      name: '风险分析师',
      description: '风险评估、止损建议、仓位管理',
      icon: 'ShieldCheck',
      enabled: true,
      modelId: 'model-1',
    },
    {
      id: 'agent-strategy',
      type: 'strategy_analyst',
      name: '策略分析师',
      description: '综合多智能体分析结果，给出最终投资建议',
      icon: 'Lightbulb',
      enabled: true,
      modelId: 'model-1',
    },
  ];
}

/**
 * Generate mock TradingAgents configuration
 * 
 * @returns Mock TradingAgentsConfig object
 */
export function generateMockTradingAgentsConfig(): TradingAgentsConfig {
  return {
    agents: generateMockTradingAgents(),
    defaultMarket: 'A',
    autoRefreshInterval: 0,
    enableNewsAnalysis: true,
    enableAIInsights: true,
  };
}

/**
 * Generate mock stock analysis report
 * 
 * @param symbol - Stock symbol
 * @param name - Stock name
 * @param market - Stock market
 * @returns Mock StockAnalysisReport object
 */
export function generateMockStockAnalysisReport(
  symbol: string = '600519',
  name: string = '贵州茅台',
  market: 'A' | 'HK' | 'US' = 'A'
): StockAnalysisReport {
  const agentResults: AgentAnalysisResult[] = [
    {
      agentType: 'market_analyst',
      agentName: '市场分析师',
      summary: '股价处于上升趋势，MACD金叉形成，RSI处于中性区间',
      details: [
        '股价站稳20日均线，短期趋势向好',
        'MACD在零轴上方金叉，买入信号明确',
        '成交量温和放大，资金持续流入',
        'KDJ指标金叉，短期仍有上涨空间',
      ],
      indicators: [
        { name: 'RSI(14)', value: '55.2', signal: 'neutral', description: '处于中性区间' },
        { name: 'MACD', value: '12.5', signal: 'bullish', description: '金叉形成' },
        { name: 'KDJ', value: '68.3', signal: 'bullish', description: '金叉向上' },
        { name: '布林带', value: '中轨', signal: 'neutral', description: '价格沿中轨运行' },
      ],
      recommendation: 'buy',
      confidence: 75,
      timestamp: Date.now() - 5 * 60 * 1000,
    },
    {
      agentType: 'fundamental_analyst',
      agentName: '基本面分析师',
      summary: '公司基本面优秀，估值处于历史中位数水平',
      details: [
        'PE(TTM) 32.5倍，低于行业平均35倍',
        'ROE 25.8%，盈利能力优秀',
        '毛利率 91.2%，护城河深厚',
        '现金流充裕，分红稳定',
      ],
      indicators: [
        { name: 'PE(TTM)', value: '32.5', signal: 'neutral', description: '估值合理' },
        { name: 'PB', value: '8.2', signal: 'neutral', description: '行业中位' },
        { name: 'ROE', value: '25.8%', signal: 'bullish', description: '盈利能力强' },
        { name: '毛利率', value: '91.2%', signal: 'bullish', description: '行业领先' },
      ],
      recommendation: 'buy',
      confidence: 82,
      timestamp: Date.now() - 4 * 60 * 1000,
    },
    {
      agentType: 'news_analyst',
      agentName: '新闻分析师',
      summary: '市场情绪偏暖，近期无重大负面新闻',
      details: [
        '公司发布三季度业绩预告，符合预期',
        '行业政策持续利好消费升级',
        '机构调研频繁，关注度提升',
        '社交媒体情绪指数为正向',
      ],
      indicators: [
        { name: '情绪指数', value: '68', signal: 'bullish', description: '偏乐观' },
        { name: '关注度', value: '高', signal: 'bullish', description: '机构关注' },
        { name: '新闻热度', value: '中等', signal: 'neutral', description: '正常水平' },
      ],
      recommendation: 'hold',
      confidence: 70,
      timestamp: Date.now() - 3 * 60 * 1000,
    },
    {
      agentType: 'risk_analyst',
      agentName: '风险分析师',
      summary: '当前风险可控，但需关注市场系统性风险',
      details: [
        '个股波动率处于中等水平',
        '流动性良好，日均成交额充足',
        '需关注宏观经济下行风险',
        '建议设置5%止损位',
      ],
      indicators: [
        { name: '波动率', value: '18.5%', signal: 'neutral', description: '中等波动' },
        { name: 'Beta', value: '0.85', signal: 'bullish', description: '低于大盘' },
        { name: '夏普比率', value: '1.25', signal: 'bullish', description: '风险调整收益好' },
      ],
      recommendation: 'buy',
      confidence: 72,
      timestamp: Date.now() - 2 * 60 * 1000,
    },
    {
      agentType: 'strategy_analyst',
      agentName: '策略分析师',
      summary: '综合分析后建议逢低买入，目标收益15-20%',
      details: [
        '技术面：上升趋势确立，支撑位明确',
        '基本面：估值合理，业绩稳健',
        '情绪面：市场情绪偏暖',
        '建议分批建仓，控制仓位在20%以内',
      ],
      indicators: [
        { name: '综合评分', value: '78/100', signal: 'bullish', description: '推荐买入' },
        { name: '目标收益', value: '15-20%', signal: 'bullish', description: '中期目标' },
        { name: '风险等级', value: '中等', signal: 'neutral', description: '可控范围' },
      ],
      recommendation: 'buy',
      confidence: 78,
      timestamp: Date.now() - 1 * 60 * 1000,
    },
  ];

  return {
    id: `report-${Date.now()}`,
    symbol,
    name,
    market,
    status: 'completed',
    agentResults,
    finalRecommendation: 'buy',
    overallConfidence: 76,
    executiveSummary: `基于多智能体综合分析，${name}(${symbol})当前处于上升趋势，技术面和基本面均支持看多观点。建议在当前价位逢低建仓，设置5%止损位，目标收益15-20%。`,
    riskFactors: [
      '宏观经济下行风险',
      '行业竞争加剧',
      '估值处于历史中位，上涨空间有限',
    ],
    opportunities: [
      '消费升级政策持续利好',
      '品牌护城河深厚',
      '机构持续加仓',
    ],
    targetPrice: '1,980.00',
    stopLoss: '1,650.00',
    requestedAt: Date.now() - 10 * 60 * 1000,
    completedAt: Date.now(),
  };
}

/**
 * Generate sample stock reports for demonstration
 * 
 * @returns Array of mock StockAnalysisReport objects
 */
export function generateMockStockReports(): StockAnalysisReport[] {
  return [
    generateMockStockAnalysisReport('600519', '贵州茅台', 'A'),
    {
      ...generateMockStockAnalysisReport('000858', '五粮液', 'A'),
      id: `report-${Date.now() - 1}`,
      finalRecommendation: 'hold',
      overallConfidence: 65,
      executiveSummary: '五粮液(000858)估值合理，但短期技术面偏弱，建议持有观望。',
      requestedAt: Date.now() - 30 * 60 * 1000,
      completedAt: Date.now() - 25 * 60 * 1000,
    },
    {
      ...generateMockStockAnalysisReport('AAPL', '苹果公司', 'US'),
      id: `report-${Date.now() - 2}`,
      finalRecommendation: 'strong_buy',
      overallConfidence: 85,
      executiveSummary: '苹果公司(AAPL)新品发布在即，技术面突破历史新高，建议积极买入。',
      targetPrice: '220.00',
      stopLoss: '180.00',
      requestedAt: Date.now() - 60 * 60 * 1000,
      completedAt: Date.now() - 55 * 60 * 1000,
    },
  ];
}

/**
 * Get recommendation display text
 * 
 * @param recommendation - Trading recommendation
 * @returns Display text in Chinese
 */
export function getRecommendationText(recommendation: string): string {
  switch (recommendation) {
    case 'strong_buy': return '强烈买入';
    case 'buy': return '买入';
    case 'hold': return '持有';
    case 'sell': return '卖出';
    case 'strong_sell': return '强烈卖出';
    default: return '未知';
  }
}

/**
 * Get recommendation color class
 * 
 * @param recommendation - Trading recommendation
 * @returns Tailwind CSS color class
 */
export function getRecommendationColor(recommendation: string): string {
  switch (recommendation) {
    case 'strong_buy': return 'text-green-600 bg-green-50 border-green-200';
    case 'buy': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'hold': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'sell': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'strong_sell': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Get signal color class
 * 
 * @param signal - Trading signal
 * @returns Tailwind CSS color class
 */
export function getSignalColor(signal: string): string {
  switch (signal) {
    case 'bullish': return 'text-green-600';
    case 'bearish': return 'text-red-600';
    case 'neutral': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
}

/**
 * Get market display name
 * 
 * @param market - Market code
 * @returns Display name in Chinese
 */
export function getMarketName(market: string): string {
  switch (market) {
    case 'A': return 'A股';
    case 'HK': return '港股';
    case 'US': return '美股';
    default: return market;
  }
}
