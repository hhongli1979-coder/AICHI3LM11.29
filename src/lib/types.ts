export type BlockchainNetwork = 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'optimism' | 'avalanche';

export type PaymentChannel = 'crypto' | 'stripe' | 'alipay' | 'wechat' | 'unionpay';

export type TransactionStatus = 'pending' | 'signed' | 'broadcasting' | 'confirmed' | 'failed' | 'expired';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type UserRole = 'owner' | 'admin' | 'signer' | 'viewer';

export interface Wallet {
  id: string;
  name: string;
  address: string;
  network: BlockchainNetwork;
  type: 'single' | 'multisig';
  signers?: string[];
  requiredSignatures?: number;
  balance: {
    native: string;
    usd: string;
  };
  tokens: TokenBalance[];
  createdAt: number;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  decimals: number;
  priceUsd: string;
  valueUsd: string;
  logo?: string;
}

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
  description?: string;
  riskAssessment?: RiskAssessment;
}

export interface Signature {
  signer: string;
  signature: string;
  signedAt: number;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: string[];
  recommendations: string[];
}

export interface PaymentRequest {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  channel: PaymentChannel;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  description: string;
  paymentUrl?: string;
  qrCode?: string;
  expiresAt: number;
  createdAt: number;
  completedAt?: number;
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  type: 'lending' | 'staking' | 'liquidity' | 'farming';
  asset: string;
  amount: string;
  valueUsd: string;
  apy: number;
  rewards: string;
  healthFactor?: number;
  network: BlockchainNetwork;
}

export interface DCAStrategy {
  id: string;
  name: string;
  sourceToken: string;
  targetToken: string;
  amountPerInterval: string;
  intervalHours: number;
  lastExecutedAt?: number;
  nextExecutionAt: number;
  totalInvested: string;
  totalReceived: string;
  enabled: boolean;
}

export interface Organization {
  id: string;
  name: string;
  plan: 'starter' | 'professional' | 'enterprise';
  members: OrganizationMember[];
  wallets: string[];
  createdAt: number;
}

export interface OrganizationMember {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  joinedAt: number;
}

export interface OmniTokenStats {
  price: number;
  marketCap: number;
  totalSupply: string;
  circulatingSupply: string;
  stakedAmount: string;
  stakingApy: number;
  yourBalance: string;
  yourStaked: string;
  yourRewards: string;
}

export interface NotificationItem {
  id: string;
  type: 'transaction' | 'approval' | 'payment' | 'risk' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  actionUrl?: string;
}

// AI Assistant Types - Memory, NLP, and Control

export type AIMessageRole = 'user' | 'assistant' | 'system';

export type AIActionType = 
  | 'wallet_query'
  | 'transaction_create'
  | 'defi_manage'
  | 'payment_process'
  | 'risk_analyze'
  | 'settings_update'
  | 'general_chat';

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  timestamp: number;
  action?: AIAction;
}

export interface AIAction {
  type: AIActionType;
  target?: string;
  parameters?: Record<string, unknown>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: string;
}

export interface AIMemoryItem {
  id: string;
  type: 'preference' | 'transaction_pattern' | 'contact' | 'insight';
  key: string;
  value: string;
  confidence: number;
  learnedAt: number;
  usageCount: number;
}

export interface AIAssistantState {
  isActive: boolean;
  currentConversation: AIMessage[];
  memories: AIMemoryItem[];
  capabilities: AICapability[];
  lastActiveAt: number;
}

export interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  category: 'memory' | 'language' | 'control';
}

// Native AI Model Configuration Types - 原生态大模型配置

export type AIModelProvider = 'openai' | 'anthropic' | 'ollama' | 'custom' | 'local';

export interface AIModelConfig {
  id: string;
  name: string;
  provider: AIModelProvider;
  modelName: string;
  apiEndpoint: string;
  apiKey?: string;
  enabled: boolean;
  isDefault: boolean;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
  createdAt: number;
  updatedAt: number;
}

export interface AIModelSettings {
  models: AIModelConfig[];
  defaultModelId: string | null;
  enableLocalProcessing: boolean;
  enableSecondaryDevelopment: boolean;
  customEndpoints: CustomEndpoint[];
}

export interface CustomEndpoint {
  id: string;
  name: string;
  url: string;
  headers: Record<string, string>;
  enabled: boolean;
}

// Agent-to-Agent (A2A) Communication Types - 智能体间通信协议

export type AgentRole = 
  | 'asset_manager'      // 资产画像智能体
  | 'risk_monitor'       // 风险监控智能体
  | 'yield_optimizer'    // 收益优化智能体
  | 'compliance_guard'   // 合规与风控智能体
  | 'payment_router'     // 支付路由智能体
  | 'audit_reporter'     // 报告与审计智能体
  | 'customer_service'   // 客户服务智能体
  | 'market_analyst'     // 市场洞察智能体
  | 'data_fusion'        // 数据融合智能体
  | 'orchestrator';      // 中枢调度智能体

export type AgentStatus = 'idle' | 'active' | 'busy' | 'error' | 'offline';

export type MessagePriority = 'low' | 'normal' | 'high' | 'critical';

export type MessageType = 
  | 'request'            // 请求消息
  | 'response'           // 响应消息
  | 'broadcast'          // 广播消息
  | 'handoff'            // 任务交接
  | 'sync'               // 状态同步
  | 'alert';             // 警报消息

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  description: string;
  capabilities: string[];
  currentTask?: string;
  load: number;          // 0-100 工作负载
  lastActiveAt: number;
  messageCount: number;
  successRate: number;   // 0-1 成功率
}

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId: string | 'broadcast';
  type: MessageType;
  priority: MessagePriority;
  subject: string;
  content: string;
  payload?: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'processed' | 'failed';
  createdAt: number;
  processedAt?: number;
  parentMessageId?: string;  // 用于消息链追踪
}

export interface AgentTask {
  id: string;
  name: string;
  description: string;
  assignedAgents: string[];
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  priority: MessagePriority;
  progress: number;      // 0-100
  result?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  messages: string[];    // 相关消息ID列表
}

export interface AgentCollaboration {
  id: string;
  name: string;
  description: string;
  participatingAgents: string[];
  coordinatorAgentId: string;
  tasks: AgentTask[];
  status: 'planning' | 'executing' | 'reviewing' | 'completed';
  startedAt: number;
  completedAt?: number;
}

export interface A2AProtocolConfig {
  maxRetries: number;
  timeoutMs: number;
  enableEncryption: boolean;
  enableLogging: boolean;
  broadcastThrottleMs: number;
  priorityQueueEnabled: boolean;
}

export interface MultiAgentSystemState {
  agents: Agent[];
  messages: AgentMessage[];
  tasks: AgentTask[];
  collaborations: AgentCollaboration[];
  protocolConfig: A2AProtocolConfig;
  isRunning: boolean;
  totalMessagesProcessed: number;
  averageResponseTimeMs: number;
}
