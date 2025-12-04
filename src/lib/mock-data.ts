import type { Wallet, Transaction, DeFiPosition, PaymentRequest, DCAStrategy, OmniTokenStats, NotificationItem, TokenBalance, AIMessage, AIMemoryItem, AICapability, AIAssistantState, AIModelConfig, AIModelSettings, CustomEndpoint, Agent, AgentMessage, AgentTask, AgentCollaboration, A2AProtocolConfig, MultiAgentSystemState } from './types';

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

// Agent-to-Agent (A2A) Communication Mock Data - 智能体间通信

export function generateMockAgents(): Agent[] {
  return [
    {
      id: 'agent-orchestrator',
      name: '中枢调度智能体',
      role: 'orchestrator',
      status: 'active',
      description: '协调所有智能体的任务分配和通信调度',
      capabilities: ['任务分解', '智能路由', '负载均衡', '优先级调度'],
      currentTask: '监控系统状态',
      load: 35,
      lastActiveAt: Date.now() - 2000,
      messageCount: 1256,
      successRate: 0.98,
    },
    {
      id: 'agent-asset',
      name: '资产画像智能体',
      role: 'asset_manager',
      status: 'active',
      description: '多链资产聚合与统一视图管理',
      capabilities: ['资产聚合', '持仓分析', '价值追踪', '历史记录'],
      currentTask: '实时同步资产数据',
      load: 45,
      lastActiveAt: Date.now() - 5000,
      messageCount: 834,
      successRate: 0.96,
    },
    {
      id: 'agent-risk',
      name: '风险监控智能体',
      role: 'risk_monitor',
      status: 'active',
      description: '7x24小时风险预警与主动应对',
      capabilities: ['风险评分', '异常检测', '预警生成', '合规检查'],
      currentTask: '分析待处理交易风险',
      load: 68,
      lastActiveAt: Date.now() - 1000,
      messageCount: 2341,
      successRate: 0.99,
    },
    {
      id: 'agent-yield',
      name: '收益优化智能体',
      role: 'yield_optimizer',
      status: 'busy',
      description: 'DeFi策略生成与自动执行',
      capabilities: ['APY分析', '策略优化', '自动再平衡', '收益预测'],
      currentTask: '优化流动性挖矿策略',
      load: 82,
      lastActiveAt: Date.now() - 3000,
      messageCount: 567,
      successRate: 0.94,
    },
    {
      id: 'agent-compliance',
      name: '合规与风控智能体',
      role: 'compliance_guard',
      status: 'active',
      description: '自动化合规筛查与多签协调',
      capabilities: ['KYC/AML检查', '制裁名单筛查', '多签协调', '审计追踪'],
      currentTask: '验证新交易合规性',
      load: 55,
      lastActiveAt: Date.now() - 8000,
      messageCount: 423,
      successRate: 0.97,
    },
    {
      id: 'agent-payment',
      name: '支付路由智能体',
      role: 'payment_router',
      status: 'idle',
      description: '跨境支付路由与Gas费优化',
      capabilities: ['路径优化', 'Gas预估', '费用比较', '交易模拟'],
      load: 15,
      lastActiveAt: Date.now() - 30000,
      messageCount: 189,
      successRate: 0.95,
    },
    {
      id: 'agent-audit',
      name: '报告与审计智能体',
      role: 'audit_reporter',
      status: 'idle',
      description: '自动生成可追溯的审计报告',
      capabilities: ['报告生成', '合规审计', '操作追溯', '数据导出'],
      load: 10,
      lastActiveAt: Date.now() - 60000,
      messageCount: 78,
      successRate: 0.99,
    },
    {
      id: 'agent-service',
      name: '客户服务智能体',
      role: 'customer_service',
      status: 'active',
      description: '7x24小时个性化客服与商机挖掘',
      capabilities: ['问答服务', '产品推荐', '风险提示', '操作引导'],
      currentTask: '处理用户咨询',
      load: 40,
      lastActiveAt: Date.now() - 4000,
      messageCount: 1567,
      successRate: 0.92,
    },
    {
      id: 'agent-market',
      name: '市场洞察智能体',
      role: 'market_analyst',
      status: 'active',
      description: '宏观趋势与链上数据分析',
      capabilities: ['趋势分析', '数据挖掘', '信号生成', '报告输出'],
      currentTask: '分析市场动态',
      load: 50,
      lastActiveAt: Date.now() - 10000,
      messageCount: 345,
      successRate: 0.91,
    },
    {
      id: 'agent-fusion',
      name: '数据融合智能体',
      role: 'data_fusion',
      status: 'active',
      description: '打破金融与物联网数据孤岛',
      capabilities: ['数据整合', '关联分析', '实时同步', '异构处理'],
      currentTask: '同步外部数据源',
      load: 60,
      lastActiveAt: Date.now() - 6000,
      messageCount: 234,
      successRate: 0.93,
    },
  ];
}

export function generateMockAgentMessages(): AgentMessage[] {
  return [
    {
      id: 'msg-a2a-1',
      fromAgentId: 'agent-risk',
      toAgentId: 'agent-orchestrator',
      type: 'alert',
      priority: 'high',
      subject: '高风险交易预警',
      content: '检测到待处理交易 tx-3 风险评分为 85，建议立即审核',
      payload: { transactionId: 'tx-3', riskScore: 85, factors: ['首次收款方', '大额转账'] },
      status: 'processed',
      createdAt: Date.now() - 5 * 60 * 1000,
      processedAt: Date.now() - 4 * 60 * 1000,
    },
    {
      id: 'msg-a2a-2',
      fromAgentId: 'agent-orchestrator',
      toAgentId: 'agent-compliance',
      type: 'request',
      priority: 'high',
      subject: '请求合规审核',
      content: '请对交易 tx-3 进行紧急合规审核',
      payload: { transactionId: 'tx-3', urgency: 'immediate' },
      status: 'processed',
      createdAt: Date.now() - 4 * 60 * 1000,
      processedAt: Date.now() - 3 * 60 * 1000,
      parentMessageId: 'msg-a2a-1',
    },
    {
      id: 'msg-a2a-3',
      fromAgentId: 'agent-compliance',
      toAgentId: 'agent-orchestrator',
      type: 'response',
      priority: 'high',
      subject: '合规审核完成',
      content: '交易 tx-3 合规检查完成：收款地址未在制裁名单中，但建议验证收款方身份',
      payload: { transactionId: 'tx-3', compliant: true, recommendation: '验证收款方身份' },
      status: 'processed',
      createdAt: Date.now() - 3 * 60 * 1000,
      processedAt: Date.now() - 2 * 60 * 1000,
      parentMessageId: 'msg-a2a-2',
    },
    {
      id: 'msg-a2a-4',
      fromAgentId: 'agent-yield',
      toAgentId: 'agent-asset',
      type: 'request',
      priority: 'normal',
      subject: '请求资产状态',
      content: '需要获取DeFi钱包当前资产状态以优化收益策略',
      payload: { walletId: 'wallet-3', dataType: 'positions' },
      status: 'processed',
      createdAt: Date.now() - 10 * 60 * 1000,
      processedAt: Date.now() - 9 * 60 * 1000,
    },
    {
      id: 'msg-a2a-5',
      fromAgentId: 'agent-asset',
      toAgentId: 'agent-yield',
      type: 'response',
      priority: 'normal',
      subject: '资产状态数据',
      content: 'DeFi Strategy Wallet 当前持仓：ETH 2.89，已部署 Aave 和 Lido',
      payload: { walletId: 'wallet-3', positions: ['defi-1', 'defi-2', 'defi-3'] },
      status: 'processed',
      createdAt: Date.now() - 9 * 60 * 1000,
      processedAt: Date.now() - 8 * 60 * 1000,
      parentMessageId: 'msg-a2a-4',
    },
    {
      id: 'msg-a2a-6',
      fromAgentId: 'agent-market',
      toAgentId: 'broadcast',
      type: 'broadcast',
      priority: 'normal',
      subject: '市场动态更新',
      content: 'ETH 价格24小时上涨3.2%，建议关注DeFi策略调整机会',
      payload: { asset: 'ETH', change24h: 0.032, trend: 'bullish' },
      status: 'delivered',
      createdAt: Date.now() - 15 * 60 * 1000,
    },
    {
      id: 'msg-a2a-7',
      fromAgentId: 'agent-service',
      toAgentId: 'agent-orchestrator',
      type: 'handoff',
      priority: 'normal',
      subject: '任务交接：复杂风险查询',
      content: '用户询问高风险交易详情，需要风险智能体协助',
      payload: { userId: 'user-1', queryType: 'risk_details', transactionId: 'tx-3' },
      status: 'pending',
      createdAt: Date.now() - 1 * 60 * 1000,
    },
    {
      id: 'msg-a2a-8',
      fromAgentId: 'agent-fusion',
      toAgentId: 'agent-risk',
      type: 'sync',
      priority: 'low',
      subject: '外部数据同步',
      content: '已同步最新链上分析数据，包含地址标签和风险评分更新',
      payload: { dataSource: 'chain_analysis', updateCount: 1524, timestamp: Date.now() },
      status: 'processed',
      createdAt: Date.now() - 20 * 60 * 1000,
      processedAt: Date.now() - 19 * 60 * 1000,
    },
  ];
}

export function generateMockAgentTasks(): AgentTask[] {
  return [
    {
      id: 'task-1',
      name: '高风险交易审核',
      description: '对 tx-3 进行全面风险评估和合规审核',
      assignedAgents: ['agent-risk', 'agent-compliance', 'agent-orchestrator'],
      status: 'in_progress',
      priority: 'high',
      progress: 75,
      createdAt: Date.now() - 5 * 60 * 1000,
      startedAt: Date.now() - 4 * 60 * 1000,
      messages: ['msg-a2a-1', 'msg-a2a-2', 'msg-a2a-3'],
    },
    {
      id: 'task-2',
      name: 'DeFi策略优化',
      description: '根据当前市场条件优化收益策略',
      assignedAgents: ['agent-yield', 'agent-asset', 'agent-market'],
      status: 'in_progress',
      priority: 'normal',
      progress: 40,
      createdAt: Date.now() - 15 * 60 * 1000,
      startedAt: Date.now() - 12 * 60 * 1000,
      messages: ['msg-a2a-4', 'msg-a2a-5', 'msg-a2a-6'],
    },
    {
      id: 'task-3',
      name: '每日资产报告生成',
      description: '汇总所有钱包资产状态并生成报告',
      assignedAgents: ['agent-asset', 'agent-audit'],
      status: 'completed',
      priority: 'low',
      progress: 100,
      result: '报告已生成并发送至管理员邮箱',
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
      startedAt: Date.now() - 2 * 60 * 60 * 1000 + 5000,
      completedAt: Date.now() - 1 * 60 * 60 * 1000,
      messages: [],
    },
    {
      id: 'task-4',
      name: '支付路由优化',
      description: '为跨境支付计算最优路径',
      assignedAgents: ['agent-payment'],
      status: 'queued',
      priority: 'normal',
      progress: 0,
      createdAt: Date.now() - 30 * 1000,
      messages: [],
    },
  ];
}

export function generateMockAgentCollaborations(): AgentCollaboration[] {
  return [
    {
      id: 'collab-1',
      name: '实时风险监控协作',
      description: '多智能体协同进行7x24小时风险监控和响应',
      participatingAgents: ['agent-risk', 'agent-compliance', 'agent-fusion', 'agent-orchestrator'],
      coordinatorAgentId: 'agent-orchestrator',
      tasks: generateMockAgentTasks().filter(t => t.id === 'task-1'),
      status: 'executing',
      startedAt: Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      id: 'collab-2',
      name: '智能收益优化协作',
      description: '资产、市场和收益智能体协同优化DeFi策略',
      participatingAgents: ['agent-asset', 'agent-yield', 'agent-market'],
      coordinatorAgentId: 'agent-yield',
      tasks: generateMockAgentTasks().filter(t => t.id === 'task-2'),
      status: 'executing',
      startedAt: Date.now() - 12 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockA2AConfig(): A2AProtocolConfig {
  return {
    maxRetries: 3,
    timeoutMs: 30000,
    enableEncryption: true,
    enableLogging: true,
    broadcastThrottleMs: 5000,
    priorityQueueEnabled: true,
  };
}

export function generateMockMultiAgentState(): MultiAgentSystemState {
  return {
    agents: generateMockAgents(),
    messages: generateMockAgentMessages(),
    tasks: generateMockAgentTasks(),
    collaborations: generateMockAgentCollaborations(),
    protocolConfig: generateMockA2AConfig(),
    isRunning: true,
    totalMessagesProcessed: 15678,
    averageResponseTimeMs: 245,
  };
}
