/**
 * Service Layer Index - 服务层入口
 * 
 * 导出所有服务模块供应用使用
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
}) {
  console.log('🚀 Initializing OmniCore Services...');

  // 配置AI服务
  if (config?.aiApiKey) {
    updateAIConfig({ apiKey: config.aiApiKey });
    console.log('✅ AI Service configured');
  }

  // 启动通知服务
  if (config?.enableNotifications !== false) {
    console.log('✅ Notification Service ready');
  }

  // 初始化智能体系统
  console.log('✅ Super Agent System initialized with', getSuperAgents().length, 'agents');

  // 初始化DeFi服务
  console.log('✅ DeFi Service ready with', Object.keys(DEFI_PROTOCOLS).length, 'protocols');

  console.log('🎉 All services initialized successfully!');

  return {
    ai: aiService,
    wallet: walletService,
    superAgent: superAgentService,
    defi: defiService,
    risk: riskAnalysisService,
    notification: notificationService,
  };
}
