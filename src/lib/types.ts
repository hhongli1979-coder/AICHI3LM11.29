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

// Super Agent System Types - 超级智能体系统类型

export type AgentRole = 'orchestrator' | 'executor' | 'analyzer' | 'specialist' | 'monitor';

export type AgentStatus = 'idle' | 'processing' | 'waiting' | 'error' | 'learning';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskComplexity = 'simple' | 'moderate' | 'complex' | 'expert';

export interface SuperAgent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  capabilities: string[];
  currentTask?: string;
  performanceScore: number;
  tasksCompleted: number;
  successRate: number;
  avgResponseTime: number;
  lastActiveAt: number;
  createdAt: number;
}

export interface AgentTask {
  id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  complexity: TaskComplexity;
  assignedAgents: string[];
  requiredCapabilities: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  estimatedTime: number;
  actualTime?: number;
  result?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

export interface AgentCollaborationSession {
  id: string;
  name: string;
  participants: string[];
  orchestratorId: string;
  currentPhase: 'planning' | 'execution' | 'validation' | 'complete';
  tasks: AgentTask[];
  messages: CollaborationMessage[];
  startedAt: number;
  completedAt?: number;
}

export interface CollaborationMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'instruction' | 'status' | 'result' | 'error' | 'suggestion';
  timestamp: number;
}

export interface AgentEvolutionMetrics {
  id: string;
  agentId: string;
  period: 'daily' | 'weekly' | 'monthly';
  successRate: number;
  responseTimeImprovement: number;
  newCapabilitiesLearned: number;
  collaborationScore: number;
  userSatisfaction: number;
  costEfficiency: number;
  timestamp: number;
}

export interface SuperAgentSystemState {
  agents: SuperAgent[];
  activeTasks: AgentTask[];
  collaborationSessions: AgentCollaborationSession[];
  evolutionMetrics: AgentEvolutionMetrics[];
  systemHealth: {
    cpuUsage: number;
    memoryUsage: number;
    activeConnections: number;
    queuedTasks: number;
  };
  settings: {
    enableDynamicScheduling: boolean;
    enableAutoEvolution: boolean;
    enableFaultTolerance: boolean;
    maxConcurrentTasks: number;
    batchProcessingEnabled: boolean;
  };
}
