/**
 * Analytics Service - 数据分析服务
 * 
 * 提供全面的数据分析功能:
 * - 钱包分析
 * - 交易统计
 * - DeFi表现
 * - 智能体效率
 */

import type { Transaction, DeFiPosition, Wallet, BlockchainNetwork } from './types';

// 时间范围
export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

// 聚合周期
export type AggregationPeriod = 'hour' | 'day' | 'week' | 'month';

// 钱包分析数据
export interface WalletAnalytics {
  walletId: string;
  totalBalance: number;
  balanceChange: number;
  balanceChangePercent: number;
  transactionCount: number;
  inflow: number;
  outflow: number;
  topTokens: { symbol: string; value: number; percent: number }[];
  networkDistribution: { network: BlockchainNetwork; value: number; percent: number }[];
}

// 交易统计
export interface TransactionStats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  totalVolume: number;
  averageValue: number;
  byType: { type: string; count: number; volume: number }[];
  byNetwork: { network: BlockchainNetwork; count: number; volume: number }[];
  hourlyDistribution: { hour: number; count: number }[];
}

// DeFi表现
export interface DeFiPerformance {
  totalValue: number;
  totalRewards: number;
  averageApy: number;
  bestPerforming: { protocol: string; asset: string; apy: number; value: number }[];
  worstPerforming: { protocol: string; asset: string; apy: number; value: number }[];
  byProtocol: { protocol: string; value: number; rewards: number; apy: number }[];
  historicalReturns: { date: string; value: number; rewards: number }[];
}

// 智能体效率
export interface AgentEfficiency {
  agentId: string;
  agentName: string;
  tasksCompleted: number;
  successRate: number;
  averageResponseTime: number;
  responseTimeImprovement: number;
  collaborationScore: number;
  topCapabilities: { capability: string; usage: number; successRate: number }[];
}

// 系统概览
export interface SystemOverview {
  totalAssets: number;
  assetChange24h: number;
  activeWallets: number;
  pendingTransactions: number;
  defiPositions: number;
  defiRewards: number;
  activeAgents: number;
  systemHealth: number;
  alerts: { type: string; count: number }[];
}

// 时间序列数据点
export interface TimeSeriesDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

// 分析服务类
export class AnalyticsService {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private cacheDuration = 5 * 60 * 1000; // 5分钟缓存

  // 获取系统概览
  async getSystemOverview(): Promise<SystemOverview> {
    const cacheKey = 'system_overview';
    const cached = this.getFromCache<SystemOverview>(cacheKey);
    if (cached) return cached;

    // 模拟数据计算 (实际应从各服务聚合)
    const overview: SystemOverview = {
      totalAssets: 231690.75 + Math.random() * 10000,
      assetChange24h: (Math.random() - 0.5) * 10,
      activeWallets: 6,
      pendingTransactions: Math.floor(Math.random() * 5),
      defiPositions: 4,
      defiRewards: 1250.50 + Math.random() * 200,
      activeAgents: 4,
      systemHealth: 95 + Math.random() * 5,
      alerts: [
        { type: 'risk', count: Math.floor(Math.random() * 3) },
        { type: 'transaction', count: Math.floor(Math.random() * 5) },
        { type: 'defi', count: Math.floor(Math.random() * 2) },
      ],
    };

    this.setCache(cacheKey, overview);
    return overview;
  }

  // 获取钱包分析
  async getWalletAnalytics(walletId: string, timeRange: TimeRange = '30d'): Promise<WalletAnalytics> {
    const cacheKey = `wallet_${walletId}_${timeRange}`;
    const cached = this.getFromCache<WalletAnalytics>(cacheKey);
    if (cached) return cached;

    const analytics: WalletAnalytics = {
      walletId,
      totalBalance: 50000 + Math.random() * 100000,
      balanceChange: (Math.random() - 0.3) * 10000,
      balanceChangePercent: (Math.random() - 0.3) * 20,
      transactionCount: Math.floor(50 + Math.random() * 200),
      inflow: 20000 + Math.random() * 50000,
      outflow: 15000 + Math.random() * 40000,
      topTokens: [
        { symbol: 'ETH', value: 80000, percent: 45 },
        { symbol: 'USDC', value: 50000, percent: 28 },
        { symbol: 'WBTC', value: 30000, percent: 17 },
        { symbol: 'DAI', value: 18000, percent: 10 },
      ],
      networkDistribution: [
        { network: 'ethereum', value: 120000, percent: 65 },
        { network: 'polygon', value: 35000, percent: 19 },
        { network: 'arbitrum', value: 20000, percent: 11 },
        { network: 'optimism', value: 10000, percent: 5 },
      ],
    };

    this.setCache(cacheKey, analytics);
    return analytics;
  }

  // 获取交易统计
  async getTransactionStats(timeRange: TimeRange = '30d'): Promise<TransactionStats> {
    const cacheKey = `tx_stats_${timeRange}`;
    const cached = this.getFromCache<TransactionStats>(cacheKey);
    if (cached) return cached;

    const stats: TransactionStats = {
      total: 156,
      pending: 3,
      completed: 150,
      failed: 3,
      totalVolume: 2500000,
      averageValue: 16025,
      byType: [
        { type: 'transfer', count: 80, volume: 1200000 },
        { type: 'swap', count: 45, volume: 800000 },
        { type: 'stake', count: 20, volume: 400000 },
        { type: 'unstake', count: 11, volume: 100000 },
      ],
      byNetwork: [
        { network: 'ethereum', count: 60, volume: 1500000 },
        { network: 'polygon', count: 50, volume: 500000 },
        { network: 'arbitrum', count: 30, volume: 350000 },
        { network: 'bsc', count: 16, volume: 150000 },
      ],
      hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: Math.floor(Math.random() * 20) + (hour >= 9 && hour <= 17 ? 10 : 0),
      })),
    };

    this.setCache(cacheKey, stats);
    return stats;
  }

  // 获取DeFi表现
  async getDeFiPerformance(timeRange: TimeRange = '30d'): Promise<DeFiPerformance> {
    const cacheKey = `defi_perf_${timeRange}`;
    const cached = this.getFromCache<DeFiPerformance>(cacheKey);
    if (cached) return cached;

    const performance: DeFiPerformance = {
      totalValue: 85000,
      totalRewards: 1250.50,
      averageApy: 6.8,
      bestPerforming: [
        { protocol: 'Uniswap V3', asset: 'ETH-USDC', apy: 12.5, value: 25000 },
        { protocol: 'Yearn', asset: 'yvUSDC', apy: 6.5, value: 20000 },
        { protocol: 'Aave V3', asset: 'USDC', apy: 5.2, value: 15000 },
      ],
      worstPerforming: [
        { protocol: 'Compound', asset: 'ETH', apy: 1.8, value: 10000 },
      ],
      byProtocol: [
        { protocol: 'Aave V3', value: 30000, rewards: 450, apy: 5.2 },
        { protocol: 'Uniswap V3', value: 25000, rewards: 520, apy: 12.5 },
        { protocol: 'Yearn', value: 20000, rewards: 180, apy: 6.5 },
        { protocol: 'Lido', value: 10000, rewards: 100, apy: 3.8 },
      ],
      historicalReturns: this.generateHistoricalData(timeRange),
    };

    this.setCache(cacheKey, performance);
    return performance;
  }

  // 获取智能体效率
  async getAgentEfficiency(agentId?: string): Promise<AgentEfficiency[]> {
    const cacheKey = `agent_eff_${agentId || 'all'}`;
    const cached = this.getFromCache<AgentEfficiency[]>(cacheKey);
    if (cached) return cached;

    const agents: AgentEfficiency[] = [
      {
        agentId: 'agent-1',
        agentName: '主控智能体',
        tasksCompleted: 1250,
        successRate: 98.5,
        averageResponseTime: 120,
        responseTimeImprovement: 12,
        collaborationScore: 96,
        topCapabilities: [
          { capability: '任务分解', usage: 500, successRate: 99 },
          { capability: '资源调度', usage: 400, successRate: 98 },
          { capability: '协同协调', usage: 350, successRate: 97 },
        ],
      },
      {
        agentId: 'agent-2',
        agentName: '钱包管理专家',
        tasksCompleted: 3420,
        successRate: 99.2,
        averageResponseTime: 85,
        responseTimeImprovement: 15,
        collaborationScore: 94,
        topCapabilities: [
          { capability: '余额查询', usage: 1500, successRate: 100 },
          { capability: 'Gas优化', usage: 800, successRate: 98 },
          { capability: '多签管理', usage: 600, successRate: 99 },
        ],
      },
      {
        agentId: 'agent-3',
        agentName: 'DeFi策略专家',
        tasksCompleted: 890,
        successRate: 94.5,
        averageResponseTime: 250,
        responseTimeImprovement: 18,
        collaborationScore: 92,
        topCapabilities: [
          { capability: '收益分析', usage: 400, successRate: 95 },
          { capability: '策略执行', usage: 300, successRate: 93 },
          { capability: 'APY优化', usage: 190, successRate: 96 },
        ],
      },
      {
        agentId: 'agent-4',
        agentName: '风险分析专家',
        tasksCompleted: 5680,
        successRate: 99.8,
        averageResponseTime: 150,
        responseTimeImprovement: 8,
        collaborationScore: 95,
        topCapabilities: [
          { capability: '地址风险评估', usage: 2500, successRate: 100 },
          { capability: '交易模式识别', usage: 1800, successRate: 99 },
          { capability: '欺诈检测', usage: 1380, successRate: 100 },
        ],
      },
    ];

    const result = agentId ? agents.filter(a => a.agentId === agentId) : agents;
    this.setCache(cacheKey, result);
    return result;
  }

  // 获取时间序列数据
  async getTimeSeries(
    metric: 'balance' | 'transactions' | 'rewards' | 'apy',
    timeRange: TimeRange = '30d',
    aggregation: AggregationPeriod = 'day'
  ): Promise<TimeSeriesDataPoint[]> {
    const cacheKey = `ts_${metric}_${timeRange}_${aggregation}`;
    const cached = this.getFromCache<TimeSeriesDataPoint[]>(cacheKey);
    if (cached) return cached;

    const data = this.generateHistoricalData(timeRange, metric);
    this.setCache(cacheKey, data);
    return data;
  }

  // 生成历史数据 (模拟)
  private generateHistoricalData(timeRange: TimeRange, metric: string = 'value'): TimeSeriesDataPoint[] {
    const now = Date.now();
    const ranges: Record<TimeRange, number> = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
      'all': 365 * 24 * 60 * 60 * 1000,
    };

    const duration = ranges[timeRange];
    const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    const interval = duration / points;

    const baseValues: Record<string, number> = {
      balance: 200000,
      transactions: 5,
      rewards: 50,
      apy: 6,
      value: 80000,
    };

    const baseValue = baseValues[metric] || 100;
    let currentValue = baseValue;

    return Array.from({ length: points }, (_, i) => {
      const change = (Math.random() - 0.45) * baseValue * 0.05;
      currentValue = Math.max(0, currentValue + change);
      return {
        timestamp: now - duration + interval * i,
        value: parseFloat(currentValue.toFixed(2)),
        label: new Date(now - duration + interval * i).toLocaleDateString(),
      };
    });
  }

  // 缓存管理
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.cacheDuration,
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// 创建默认服务实例
export const analyticsService = new AnalyticsService();

// 导出便捷函数
export function getSystemOverview() {
  return analyticsService.getSystemOverview();
}

export function getWalletAnalytics(walletId: string, timeRange?: TimeRange) {
  return analyticsService.getWalletAnalytics(walletId, timeRange);
}

export function getTransactionStats(timeRange?: TimeRange) {
  return analyticsService.getTransactionStats(timeRange);
}

export function getDeFiPerformance(timeRange?: TimeRange) {
  return analyticsService.getDeFiPerformance(timeRange);
}

export function getAgentEfficiency(agentId?: string) {
  return analyticsService.getAgentEfficiency(agentId);
}

export function getTimeSeries(
  metric: 'balance' | 'transactions' | 'rewards' | 'apy',
  timeRange?: TimeRange,
  aggregation?: AggregationPeriod
) {
  return analyticsService.getTimeSeries(metric, timeRange, aggregation);
}
