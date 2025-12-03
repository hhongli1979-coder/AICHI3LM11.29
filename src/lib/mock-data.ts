import type { Wallet, Transaction, DeFiPosition, PaymentRequest, DCAStrategy, OmniTokenStats, NotificationItem, TokenBalance, AIMessage, AIMemoryItem, AICapability, AIAssistantState, AIModelConfig, AIModelSettings, CustomEndpoint, SuperAgent, AgentTask, AgentCollaborationSession, AgentEvolutionMetrics, SuperAgentSystemState } from './types';

export const NETWORKS = {
  ethereum: { name: 'Ethereum', color: '#627EEA', icon: '⟠' },
  polygon: { name: 'Polygon', color: '#8247E5', icon: '⬡' },
  bsc: { name: 'BNB Chain', color: '#F3BA2F', icon: '◆' },
  arbitrum: { name: 'Arbitrum', color: '#28A0F0', icon: '◭' },
  optimism: { name: 'Optimism', color: '#FF0420', icon: '◉' },
  avalanche: { name: 'Avalanche', color: '#E84142', icon: '▲' },
};

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

export function formatAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatCurrency(amount: string | number, currency = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

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

export function getRiskColor(level: string): string {
  switch (level) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-orange-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

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

// Super Agent System Mock Data - 超级智能体系统

export function generateMockSuperAgents(): SuperAgent[] {
  return [
    {
      id: 'agent-orchestrator',
      name: '主控智能体',
      role: 'orchestrator',
      status: 'processing',
      capabilities: ['任务分解', '资源调度', '协同协调', '全局监控'],
      currentTask: '协调DeFi策略优化任务',
      performanceScore: 95,
      tasksCompleted: 1250,
      successRate: 98.5,
      avgResponseTime: 120,
      lastActiveAt: Date.now() - 30 * 1000,
      createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'agent-wallet',
      name: '钱包管理专家',
      role: 'specialist',
      status: 'idle',
      capabilities: ['钱包创建', '余额查询', '多签管理', 'Gas优化'],
      performanceScore: 92,
      tasksCompleted: 3420,
      successRate: 99.2,
      avgResponseTime: 85,
      lastActiveAt: Date.now() - 5 * 60 * 1000,
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'agent-defi',
      name: 'DeFi策略专家',
      role: 'specialist',
      status: 'processing',
      capabilities: ['收益分析', '风险评估', '策略执行', 'APY优化'],
      currentTask: '分析Aave V3最优借贷策略',
      performanceScore: 88,
      tasksCompleted: 890,
      successRate: 94.5,
      avgResponseTime: 250,
      lastActiveAt: Date.now() - 2 * 60 * 1000,
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'agent-risk',
      name: '风险分析专家',
      role: 'analyzer',
      status: 'processing',
      capabilities: ['地址风险评估', '交易模式识别', '欺诈检测', '合规检查'],
      currentTask: '评估待处理交易风险',
      performanceScore: 96,
      tasksCompleted: 5680,
      successRate: 99.8,
      avgResponseTime: 150,
      lastActiveAt: Date.now() - 1 * 60 * 1000,
      createdAt: Date.now() - 75 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'agent-executor',
      name: '交易执行器',
      role: 'executor',
      status: 'waiting',
      capabilities: ['交易签名', '广播执行', '状态监控', '重试机制'],
      performanceScore: 94,
      tasksCompleted: 2340,
      successRate: 99.5,
      avgResponseTime: 200,
      lastActiveAt: Date.now() - 10 * 60 * 1000,
      createdAt: Date.now() - 50 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'agent-monitor',
      name: '系统监控器',
      role: 'monitor',
      status: 'processing',
      capabilities: ['性能监控', '异常检测', '告警触发', '日志分析'],
      currentTask: '持续监控系统健康状态',
      performanceScore: 98,
      tasksCompleted: 12500,
      successRate: 99.9,
      avgResponseTime: 50,
      lastActiveAt: Date.now() - 10 * 1000,
      createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockAgentTasks(): AgentTask[] {
  return [
    {
      id: 'task-1',
      name: 'DeFi收益优化',
      description: '分析当前DeFi头寸并提出优化建议',
      priority: 'high',
      complexity: 'complex',
      assignedAgents: ['agent-defi', 'agent-risk'],
      requiredCapabilities: ['收益分析', '风险评估'],
      status: 'in_progress',
      progress: 65,
      estimatedTime: 300,
      createdAt: Date.now() - 10 * 60 * 1000,
      startedAt: Date.now() - 8 * 60 * 1000,
    },
    {
      id: 'task-2',
      name: '交易风险评估',
      description: '评估待处理的大额交易风险',
      priority: 'critical',
      complexity: 'moderate',
      assignedAgents: ['agent-risk'],
      requiredCapabilities: ['地址风险评估', '交易模式识别'],
      status: 'in_progress',
      progress: 85,
      estimatedTime: 120,
      createdAt: Date.now() - 5 * 60 * 1000,
      startedAt: Date.now() - 4 * 60 * 1000,
    },
    {
      id: 'task-3',
      name: 'Gas费用优化',
      description: '分析最佳交易时机以降低Gas费用',
      priority: 'medium',
      complexity: 'simple',
      assignedAgents: ['agent-wallet'],
      requiredCapabilities: ['Gas优化'],
      status: 'completed',
      progress: 100,
      estimatedTime: 60,
      actualTime: 45,
      result: '建议在UTC 4:00-6:00执行交易，预计节省35% Gas费用',
      createdAt: Date.now() - 30 * 60 * 1000,
      startedAt: Date.now() - 28 * 60 * 1000,
      completedAt: Date.now() - 20 * 60 * 1000,
    },
    {
      id: 'task-4',
      name: '多签钱包创建',
      description: '创建新的3/5多签钱包',
      priority: 'low',
      complexity: 'moderate',
      assignedAgents: ['agent-wallet', 'agent-executor'],
      requiredCapabilities: ['钱包创建', '多签管理'],
      status: 'pending',
      progress: 0,
      estimatedTime: 180,
      createdAt: Date.now() - 2 * 60 * 1000,
    },
  ];
}

export function generateMockCollaborationSessions(): AgentCollaborationSession[] {
  return [
    {
      id: 'session-1',
      name: '复杂DeFi策略执行',
      participants: ['agent-orchestrator', 'agent-defi', 'agent-risk', 'agent-executor'],
      orchestratorId: 'agent-orchestrator',
      currentPhase: 'execution',
      tasks: generateMockAgentTasks().slice(0, 2),
      messages: [
        {
          id: 'msg-1',
          senderId: 'agent-orchestrator',
          senderName: '主控智能体',
          content: '启动DeFi策略优化协作会话，分配任务给各专家智能体',
          type: 'instruction',
          timestamp: Date.now() - 10 * 60 * 1000,
        },
        {
          id: 'msg-2',
          senderId: 'agent-risk',
          senderName: '风险分析专家',
          content: '已完成初步风险评估，当前策略整体风险等级：中低',
          type: 'result',
          timestamp: Date.now() - 8 * 60 * 1000,
        },
        {
          id: 'msg-3',
          senderId: 'agent-defi',
          senderName: 'DeFi策略专家',
          content: '正在分析Aave V3与Compound对比数据，预计3分钟完成',
          type: 'status',
          timestamp: Date.now() - 5 * 60 * 1000,
        },
        {
          id: 'msg-4',
          senderId: 'agent-defi',
          senderName: 'DeFi策略专家',
          content: '建议将30%资金从Compound迁移至Aave V3，可提升APY 1.2%',
          type: 'suggestion',
          timestamp: Date.now() - 2 * 60 * 1000,
        },
      ],
      startedAt: Date.now() - 10 * 60 * 1000,
    },
  ];
}

export function generateMockEvolutionMetrics(): AgentEvolutionMetrics[] {
  return [
    {
      id: 'evo-1',
      agentId: 'agent-orchestrator',
      period: 'weekly',
      successRate: 98.5,
      responseTimeImprovement: 12,
      newCapabilitiesLearned: 2,
      collaborationScore: 96,
      userSatisfaction: 94,
      costEfficiency: 88,
      timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'evo-2',
      agentId: 'agent-defi',
      period: 'weekly',
      successRate: 94.5,
      responseTimeImprovement: 18,
      newCapabilitiesLearned: 3,
      collaborationScore: 92,
      userSatisfaction: 91,
      costEfficiency: 85,
      timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'evo-3',
      agentId: 'agent-risk',
      period: 'weekly',
      successRate: 99.8,
      responseTimeImprovement: 8,
      newCapabilitiesLearned: 1,
      collaborationScore: 95,
      userSatisfaction: 97,
      costEfficiency: 92,
      timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockSuperAgentSystemState(): SuperAgentSystemState {
  return {
    agents: generateMockSuperAgents(),
    activeTasks: generateMockAgentTasks(),
    collaborationSessions: generateMockCollaborationSessions(),
    evolutionMetrics: generateMockEvolutionMetrics(),
    systemHealth: {
      cpuUsage: 42,
      memoryUsage: 68,
      activeConnections: 156,
      queuedTasks: 8,
    },
    settings: {
      enableDynamicScheduling: true,
      enableAutoEvolution: true,
      enableFaultTolerance: true,
      maxConcurrentTasks: 10,
      batchProcessingEnabled: true,
    },
  };
}
