/**
 * Risk Analysis Service - 风险分析服务
 * 
 * 提供全面的风险评估:
 * - 地址风险评估
 * - 交易风险分析
 * - 合规检查
 * - 欺诈检测
 */

import type { Transaction, BlockchainNetwork } from './types';

// 风险等级
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// 风险因素
export interface RiskFactor {
  id: string;
  name: string;
  description: string;
  severity: RiskLevel;
  score: number; // 0-100
}

// 风险评估结果
export interface RiskAssessmentResult {
  overallRisk: RiskLevel;
  overallScore: number; // 0-100, 越高风险越大
  factors: RiskFactor[];
  recommendations: string[];
  flags: string[];
  timestamp: number;
}

// 地址风险数据
export interface AddressRiskData {
  address: string;
  network: BlockchainNetwork;
  riskScore: number;
  riskLevel: RiskLevel;
  labels: string[];
  firstSeen?: number;
  lastActive?: number;
  transactionCount: number;
  totalValue: number;
  isContract: boolean;
  isVerified: boolean;
  associatedEntities: string[];
  flags: string[];
}

// 已知风险地址数据库 (简化版)
const KNOWN_RISKY_ADDRESSES: Record<string, { risk: RiskLevel; labels: string[] }> = {
  // 示例风险地址
  '0x0000000000000000000000000000000000000000': { risk: 'critical', labels: ['null_address'] },
  '0x000000000000000000000000000000000000dead': { risk: 'high', labels: ['burn_address'] },
};

// 风险标签
const RISK_LABELS: Record<string, { severity: RiskLevel; description: string }> = {
  'first_time_recipient': { severity: 'medium', description: '首次收款地址' },
  'large_amount': { severity: 'medium', description: '大额交易' },
  'unusual_time': { severity: 'low', description: '异常交易时间' },
  'frequent_transactions': { severity: 'low', description: '高频交易' },
  'mixer_associated': { severity: 'critical', description: '混币器关联' },
  'sanctioned_entity': { severity: 'critical', description: '受制裁实体' },
  'phishing_reported': { severity: 'critical', description: '钓鱼报告' },
  'scam_reported': { severity: 'critical', description: '诈骗报告' },
  'contract_unverified': { severity: 'medium', description: '未验证合约' },
  'new_address': { severity: 'low', description: '新地址' },
  'high_gas_usage': { severity: 'low', description: '高Gas消耗' },
  'cross_chain_bridge': { severity: 'medium', description: '跨链桥交易' },
};

// 风险分析服务类
export class RiskAnalysisService {
  private addressCache: Map<string, AddressRiskData> = new Map();
  private analysisHistory: Map<string, RiskAssessmentResult> = new Map();

  // 分析地址风险
  async analyzeAddress(address: string, network: BlockchainNetwork): Promise<AddressRiskData> {
    // 检查缓存
    const cacheKey = `${network}:${address.toLowerCase()}`;
    const cached = this.addressCache.get(cacheKey);
    if (cached && Date.now() - (cached.lastActive || 0) < 300000) { // 5分钟缓存
      return cached;
    }

    // 检查已知风险地址
    const knownRisk = KNOWN_RISKY_ADDRESSES[address.toLowerCase()];
    if (knownRisk) {
      const data: AddressRiskData = {
        address,
        network,
        riskScore: knownRisk.risk === 'critical' ? 95 : knownRisk.risk === 'high' ? 75 : 50,
        riskLevel: knownRisk.risk,
        labels: knownRisk.labels,
        transactionCount: 0,
        totalValue: 0,
        isContract: false,
        isVerified: false,
        associatedEntities: [],
        flags: knownRisk.labels.map(l => RISK_LABELS[l]?.description || l),
      };
      this.addressCache.set(cacheKey, data);
      return data;
    }

    // 模拟地址分析 (实际应调用链上数据和第三方API)
    const isContract = address.length === 42 && Math.random() > 0.7;
    const transactionCount = Math.floor(Math.random() * 1000);
    const isNew = transactionCount < 5;

    const labels: string[] = [];
    let riskScore = 10; // 基础分数

    if (isNew) {
      labels.push('new_address');
      riskScore += 10;
    }

    if (isContract) {
      const isVerified = Math.random() > 0.3;
      if (!isVerified) {
        labels.push('contract_unverified');
        riskScore += 20;
      }
    }

    const riskLevel: RiskLevel = 
      riskScore >= 80 ? 'critical' :
      riskScore >= 60 ? 'high' :
      riskScore >= 30 ? 'medium' : 'low';

    const data: AddressRiskData = {
      address,
      network,
      riskScore,
      riskLevel,
      labels,
      firstSeen: Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
      lastActive: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      transactionCount,
      totalValue: Math.random() * 1000000,
      isContract,
      isVerified: isContract ? Math.random() > 0.3 : true,
      associatedEntities: [],
      flags: labels.map(l => RISK_LABELS[l]?.description || l),
    };

    this.addressCache.set(cacheKey, data);
    return data;
  }

  // 分析交易风险
  async analyzeTransaction(transaction: Partial<Transaction>): Promise<RiskAssessmentResult> {
    const factors: RiskFactor[] = [];
    const recommendations: string[] = [];
    const flags: string[] = [];
    let totalScore = 0;

    // 1. 分析收款地址
    if (transaction.to) {
      const recipientRisk = await this.analyzeAddress(
        transaction.to,
        transaction.network || 'ethereum'
      );

      if (recipientRisk.riskLevel !== 'low') {
        factors.push({
          id: 'recipient_risk',
          name: '收款地址风险',
          description: `收款地址风险等级: ${recipientRisk.riskLevel}`,
          severity: recipientRisk.riskLevel,
          score: recipientRisk.riskScore,
        });
        totalScore += recipientRisk.riskScore * 0.4;
        flags.push(...recipientRisk.flags);
      }

      if (recipientRisk.labels.includes('new_address')) {
        recommendations.push('建议验证收款方身份');
      }
    }

    // 2. 分析交易金额
    const value = parseFloat(transaction.value || '0');
    if (value > 10000) {
      factors.push({
        id: 'large_amount',
        name: '大额交易',
        description: `交易金额 $${value.toLocaleString()} 超过阈值`,
        severity: value > 100000 ? 'high' : 'medium',
        score: value > 100000 ? 60 : 40,
      });
      totalScore += value > 100000 ? 24 : 16;
      flags.push('大额交易');
      recommendations.push('建议分批次转账');
      recommendations.push('确认收款方信息无误');
    }

    // 3. 检查首次交易
    if (transaction.to) {
      const isFirstTime = Math.random() > 0.7; // 模拟
      if (isFirstTime) {
        factors.push({
          id: 'first_time',
          name: '首次收款地址',
          description: '从未向该地址发送过交易',
          severity: 'medium',
          score: 35,
        });
        totalScore += 14;
        flags.push('首次收款地址');
        recommendations.push('首次向该地址转账，请仔细核对');
      }
    }

    // 4. 检查时间异常
    const hour = new Date().getHours();
    if (hour < 6 || hour > 23) {
      factors.push({
        id: 'unusual_time',
        name: '异常交易时间',
        description: '在非常规时间发起交易',
        severity: 'low',
        score: 15,
      });
      totalScore += 6;
      flags.push('异常时间');
    }

    // 5. 合规检查
    if (value > 50000) {
      recommendations.push('大额交易可能需要额外合规审查');
    }

    // 计算总体风险
    const overallScore = Math.min(100, Math.round(totalScore));
    const overallRisk: RiskLevel = 
      overallScore >= 70 ? 'critical' :
      overallScore >= 50 ? 'high' :
      overallScore >= 25 ? 'medium' : 'low';

    // 添加默认建议
    if (recommendations.length === 0) {
      recommendations.push('交易风险较低，建议正常处理');
    }

    const result: RiskAssessmentResult = {
      overallRisk,
      overallScore,
      factors,
      recommendations,
      flags,
      timestamp: Date.now(),
    };

    // 缓存分析结果
    if (transaction.id) {
      this.analysisHistory.set(transaction.id, result);
    }

    return result;
  }

  // 批量分析
  async batchAnalyze(transactions: Partial<Transaction>[]): Promise<Map<string, RiskAssessmentResult>> {
    const results = new Map<string, RiskAssessmentResult>();
    
    for (const tx of transactions) {
      if (tx.id) {
        const result = await this.analyzeTransaction(tx);
        results.set(tx.id, result);
      }
    }

    return results;
  }

  // 获取风险报告
  generateRiskReport(results: RiskAssessmentResult[]): {
    summary: {
      total: number;
      lowRisk: number;
      mediumRisk: number;
      highRisk: number;
      criticalRisk: number;
    };
    averageScore: number;
    topRisks: RiskFactor[];
    allRecommendations: string[];
  } {
    const summary = {
      total: results.length,
      lowRisk: results.filter(r => r.overallRisk === 'low').length,
      mediumRisk: results.filter(r => r.overallRisk === 'medium').length,
      highRisk: results.filter(r => r.overallRisk === 'high').length,
      criticalRisk: results.filter(r => r.overallRisk === 'critical').length,
    };

    const averageScore = results.length > 0
      ? results.reduce((sum, r) => sum + r.overallScore, 0) / results.length
      : 0;

    const allFactors = results.flatMap(r => r.factors);
    const topRisks = allFactors
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const allRecommendations = [...new Set(results.flatMap(r => r.recommendations))];

    return {
      summary,
      averageScore: Math.round(averageScore),
      topRisks,
      allRecommendations,
    };
  }

  // 检查地址是否在黑名单
  isBlacklisted(address: string): boolean {
    const lowerAddress = address.toLowerCase();
    const knownRisk = KNOWN_RISKY_ADDRESSES[lowerAddress];
    return knownRisk?.risk === 'critical';
  }

  // 获取风险等级颜色
  getRiskColor(level: RiskLevel): string {
    const colors: Record<RiskLevel, string> = {
      low: '#10B981', // green
      medium: '#F59E0B', // amber
      high: '#F97316', // orange
      critical: '#EF4444', // red
    };
    return colors[level];
  }

  // 获取风险等级标签
  getRiskLabel(level: RiskLevel): string {
    const labels: Record<RiskLevel, string> = {
      low: '低风险',
      medium: '中等风险',
      high: '高风险',
      critical: '极高风险',
    };
    return labels[level];
  }
}

// 创建默认服务实例
export const riskAnalysisService = new RiskAnalysisService();

// 导出便捷函数
export async function analyzeAddressRisk(address: string, network: BlockchainNetwork = 'ethereum') {
  return riskAnalysisService.analyzeAddress(address, network);
}

export async function analyzeTransactionRisk(transaction: Partial<Transaction>) {
  return riskAnalysisService.analyzeTransaction(transaction);
}

export function isAddressBlacklisted(address: string): boolean {
  return riskAnalysisService.isBlacklisted(address);
}

export function getRiskLevelColor(level: RiskLevel): string {
  return riskAnalysisService.getRiskColor(level);
}

export function getRiskLevelLabel(level: RiskLevel): string {
  return riskAnalysisService.getRiskLabel(level);
}
