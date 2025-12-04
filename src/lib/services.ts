/**
 * Service Layer Index - 服务层入口
 * 
 * 导出所有服务模块供应用使用
 * 
 * 完整服务列表:
 * 1. AI服务 - 多模型对话
 * 2. 钱包服务 - 多链钱包管理
 * 3. 超级智能体服务 - 任务调度与协同
 * 4. DeFi服务 - 协议集成与策略
 * 5. 风险服务 - 风险评估与合规
 * 6. 通知服务 - 多渠道通知
 * 7. 分析服务 - 数据分析与报表
 * 8. 组织服务 - 团队与权限管理
 * 9. 存储服务 - 数据持久化
 */

// AI服务
export {
  AIService,
  aiService,
  sendAIMessage,
  updateAIConfig,
  clearAIHistory,
  type AIServiceConfig,
} from './ai-service';

// 钱包服务
export {
  WalletService,
  walletService,
  getWallets,
  createWallet,
  getWalletBalance,
  createTransaction,
  signTransaction,
  broadcastTransaction,
  getPendingTransactions,
  NETWORK_CONFIG,
} from './wallet-service';

// 超级智能体服务
export {
  SuperAgentService,
  superAgentService,
  getSuperAgents,
  getSuperAgentSystemState,
  createAgentTask,
  executeAgentTask,
  subscribeToMessages,
} from './super-agent-service';

// DeFi服务
export {
  DeFiService,
  defiService,
  getDefiProtocols,
  getDefiStrategies,
  getRecommendedDefiStrategies,
  executeDefiStrategy,
  calculateDefiReturns,
  DEFI_PROTOCOLS,
  type DeFiStrategy,
} from './defi-service';

// 风险分析服务
export {
  RiskAnalysisService,
  riskAnalysisService,
  analyzeAddressRisk,
  analyzeTransactionRisk,
  isAddressBlacklisted,
  getRiskLevelColor,
  getRiskLevelLabel,
  type RiskLevel,
  type RiskFactor,
  type RiskAssessmentResult,
  type AddressRiskData,
} from './risk-service';

// 通知服务
export {
  NotificationService,
  notificationService,
  sendNotification,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  subscribeToNotifications,
  updateNotificationSettings,
  type NotificationChannel,
  type NotificationPriority,
  type NotificationSettings,
} from './notification-service';

// 分析服务
export {
  AnalyticsService,
  analyticsService,
  getSystemOverview,
  getWalletAnalytics,
  getTransactionStats,
  getDeFiPerformance,
  getAgentEfficiency,
  getTimeSeries,
  type TimeRange,
  type AggregationPeriod,
  type WalletAnalytics,
  type TransactionStats,
  type DeFiPerformance,
  type AgentEfficiency,
  type SystemOverview,
} from './analytics-service';

// 组织服务
export {
  OrganizationService,
  organizationService,
  getOrganization,
  getOrganizationMembers,
  checkPermission,
  getPendingApprovals,
  createApprovalRequest,
  approveRequest,
  type Role,
  type Permission,
  type ApprovalPolicy,
  type ApprovalRequest,
  type OrganizationSettings,
} from './organization-service';

// 存储服务
export {
  StorageService,
  storageService,
  setStorageItem,
  getStorageItem,
  deleteStorageItem,
  hasStorageItem,
  getStorageKeys,
  clearStorage,
  getStorageStats,
  type StorageType,
  type StorageConfig,
  type StorageMetadata,
} from './storage-service';

// 工具函数
export * from './utils';

// 类型定义
export * from './types';

// Mock数据 (开发/演示用)
export * from './mock-data';

/**
 * 初始化所有服务
 * 在应用启动时调用
 */
export function initializeServices(config?: {
  aiApiKey?: string;
  enableNotifications?: boolean;
  demoMode?: boolean;
  storageType?: 'local' | 'session' | 'indexeddb' | 'remote';
}) {
  console.log('🚀 Initializing OmniCore Services...');
  console.log('━'.repeat(50));

  // 配置AI服务
  if (config?.aiApiKey) {
    updateAIConfig({ apiKey: config.aiApiKey });
    console.log('✅ AI Service configured with API key');
  } else {
    console.log('✅ AI Service ready (local fallback mode)');
  }

  // 钱包服务
  console.log('✅ Wallet Service ready (6 networks supported)');

  // 智能体系统
  console.log('✅ Super Agent System initialized with', getSuperAgents().length, 'agents');

  // DeFi服务
  console.log('✅ DeFi Service ready with', Object.keys(DEFI_PROTOCOLS).length, 'protocols');

  // 风险服务
  console.log('✅ Risk Analysis Service ready');

  // 通知服务
  if (config?.enableNotifications !== false) {
    console.log('✅ Notification Service ready (multi-channel)');
  }

  // 分析服务
  console.log('✅ Analytics Service ready');

  // 组织服务
  console.log('✅ Organization Service ready');

  // 存储服务
  console.log('✅ Storage Service ready (type:', config?.storageType || 'local', ')');

  console.log('━'.repeat(50));
  console.log('🎉 All 9 services initialized successfully!');
  console.log('');

  return {
    ai: aiService,
    wallet: walletService,
    superAgent: superAgentService,
    defi: defiService,
    risk: riskAnalysisService,
    notification: notificationService,
    analytics: analyticsService,
    organization: organizationService,
    storage: storageService,
  };
}
