/**
 * DeFi Service - DeFi协议集成服务
 * 
 * 提供DeFi功能:
 * - 协议收益查询
 * - 策略执行
 * - 头寸管理
 * - APY优化
 */

import type { DeFiPosition, BlockchainNetwork } from './types';

// DeFi协议配置
export const DEFI_PROTOCOLS: Record<string, {
  name: string;
  type: 'lending' | 'staking' | 'liquidity' | 'yield';
  networks: BlockchainNetwork[];
  website: string;
  tvl?: number;
}> = {
  'aave-v3': {
    name: 'Aave V3',
    type: 'lending',
    networks: ['ethereum', 'polygon', 'arbitrum', 'optimism', 'avalanche'],
    website: 'https://aave.com',
    tvl: 12500000000,
  },
  'compound-v3': {
    name: 'Compound V3',
    type: 'lending',
    networks: ['ethereum', 'polygon', 'arbitrum'],
    website: 'https://compound.finance',
    tvl: 3200000000,
  },
  'lido': {
    name: 'Lido',
    type: 'staking',
    networks: ['ethereum', 'polygon'],
    website: 'https://lido.fi',
    tvl: 28000000000,
  },
  'uniswap-v3': {
    name: 'Uniswap V3',
    type: 'liquidity',
    networks: ['ethereum', 'polygon', 'arbitrum', 'optimism', 'bsc'],
    website: 'https://uniswap.org',
    tvl: 5800000000,
  },
  'curve': {
    name: 'Curve Finance',
    type: 'liquidity',
    networks: ['ethereum', 'polygon', 'arbitrum', 'avalanche'],
    website: 'https://curve.fi',
    tvl: 2100000000,
  },
  'yearn': {
    name: 'Yearn Finance',
    type: 'yield',
    networks: ['ethereum', 'arbitrum'],
    website: 'https://yearn.finance',
    tvl: 450000000,
  },
};

// APY数据 (实际应从链上或API获取)
const PROTOCOL_APY: Record<string, Record<string, number>> = {
  'aave-v3': {
    'USDC': 5.2,
    'USDT': 4.8,
    'DAI': 4.5,
    'ETH': 2.1,
    'WBTC': 0.5,
  },
  'compound-v3': {
    'USDC': 4.5,
    'ETH': 1.8,
  },
  'lido': {
    'ETH': 3.8,
  },
  'uniswap-v3': {
    'ETH-USDC': 12.5,
    'ETH-USDT': 11.2,
    'WBTC-ETH': 8.5,
  },
  'curve': {
    '3pool': 3.2,
    'stETH': 4.1,
    'tricrypto': 6.8,
  },
  'yearn': {
    'yvUSDC': 6.5,
    'yvETH': 4.2,
  },
};

// DeFi策略接口
export interface DeFiStrategy {
  id: string;
  name: string;
  description: string;
  protocols: string[];
  riskLevel: 'low' | 'medium' | 'high';
  expectedApy: number;
  minInvestment: number;
  assets: string[];
  enabled: boolean;
}

// 预定义策略
const PRESET_STRATEGIES: DeFiStrategy[] = [
  {
    id: 'stable-yield',
    name: '稳定收益策略',
    description: '使用稳定币在顶级借贷协议中获取稳定收益',
    protocols: ['aave-v3', 'compound-v3'],
    riskLevel: 'low',
    expectedApy: 5.0,
    minInvestment: 1000,
    assets: ['USDC', 'USDT', 'DAI'],
    enabled: true,
  },
  {
    id: 'eth-staking',
    name: 'ETH质押策略',
    description: '通过Lido进行ETH流动性质押',
    protocols: ['lido'],
    riskLevel: 'low',
    expectedApy: 3.8,
    minInvestment: 0.1,
    assets: ['ETH'],
    enabled: true,
  },
  {
    id: 'lp-farming',
    name: '流动性挖矿策略',
    description: '在Uniswap V3提供流动性获取交易费用',
    protocols: ['uniswap-v3'],
    riskLevel: 'medium',
    expectedApy: 12.0,
    minInvestment: 5000,
    assets: ['ETH', 'USDC'],
    enabled: true,
  },
  {
    id: 'yield-optimizer',
    name: '收益优化策略',
    description: '使用Yearn自动优化收益',
    protocols: ['yearn'],
    riskLevel: 'medium',
    expectedApy: 6.0,
    minInvestment: 2000,
    assets: ['USDC', 'ETH'],
    enabled: true,
  },
  {
    id: 'multi-protocol',
    name: '多协议组合策略',
    description: '跨多个协议分散投资以平衡风险和收益',
    protocols: ['aave-v3', 'lido', 'curve'],
    riskLevel: 'medium',
    expectedApy: 7.5,
    minInvestment: 10000,
    assets: ['ETH', 'USDC', 'stETH'],
    enabled: true,
  },
];

// DeFi服务类
export class DeFiService {
  private positions: Map<string, DeFiPosition> = new Map();
  private strategies: DeFiStrategy[] = [...PRESET_STRATEGIES];

  // 获取所有支持的协议
  getProtocols() {
    return DEFI_PROTOCOLS;
  }

  // 获取协议APY
  getProtocolApy(protocolId: string, asset: string): number {
    return PROTOCOL_APY[protocolId]?.[asset] || 0;
  }

  // 获取最佳APY
  getBestApy(asset: string): { protocol: string; apy: number } | null {
    let bestProtocol = '';
    let bestApy = 0;

    for (const [protocolId, apys] of Object.entries(PROTOCOL_APY)) {
      const apy = apys[asset];
      if (apy && apy > bestApy) {
        bestApy = apy;
        bestProtocol = protocolId;
      }
    }

    return bestProtocol ? { protocol: bestProtocol, apy: bestApy } : null;
  }

  // 获取所有策略
  getStrategies(): DeFiStrategy[] {
    return this.strategies;
  }

  // 获取推荐策略
  getRecommendedStrategies(params: {
    riskTolerance: 'low' | 'medium' | 'high';
    investmentAmount: number;
    preferredAssets?: string[];
  }): DeFiStrategy[] {
    return this.strategies.filter(strategy => {
      // 风险匹配
      if (params.riskTolerance === 'low' && strategy.riskLevel !== 'low') {
        return false;
      }
      if (params.riskTolerance === 'medium' && strategy.riskLevel === 'high') {
        return false;
      }

      // 最低投资金额
      if (params.investmentAmount < strategy.minInvestment) {
        return false;
      }

      // 资产偏好
      if (params.preferredAssets && params.preferredAssets.length > 0) {
        const hasPreferredAsset = strategy.assets.some(
          asset => params.preferredAssets!.includes(asset)
        );
        if (!hasPreferredAsset) {
          return false;
        }
      }

      return strategy.enabled;
    }).sort((a, b) => b.expectedApy - a.expectedApy);
  }

  // 创建头寸
  async createPosition(params: {
    protocol: string;
    type: DeFiPosition['type'];
    asset: string;
    amount: string;
    network: BlockchainNetwork;
  }): Promise<DeFiPosition> {
    const protocol = DEFI_PROTOCOLS[params.protocol];
    if (!protocol) {
      throw new Error('Unknown protocol');
    }

    const apy = this.getProtocolApy(params.protocol, params.asset);
    const valueUsd = parseFloat(params.amount) * await this.getAssetPrice(params.asset);

    const position: DeFiPosition = {
      id: `defi-${Date.now()}`,
      protocol: protocol.name,
      type: params.type,
      asset: params.asset,
      amount: params.amount,
      valueUsd: valueUsd.toFixed(2),
      apy,
      rewards: '0',
      network: params.network,
    };

    this.positions.set(position.id, position);
    return position;
  }

  // 获取所有头寸
  getPositions(): DeFiPosition[] {
    return Array.from(this.positions.values());
  }

  // 获取头寸总价值
  getTotalValue(): number {
    return Array.from(this.positions.values()).reduce(
      (sum, pos) => sum + parseFloat(pos.valueUsd),
      0
    );
  }

  // 获取总收益
  getTotalRewards(): number {
    return Array.from(this.positions.values()).reduce(
      (sum, pos) => sum + parseFloat(pos.rewards || '0'),
      0
    );
  }

  // 获取资产价格 (简化版)
  private async getAssetPrice(asset: string): Promise<number> {
    const prices: Record<string, number> = {
      ETH: 2780,
      WBTC: 67500,
      USDC: 1,
      USDT: 1,
      DAI: 1,
      stETH: 2750,
      MATIC: 0.65,
      BNB: 580,
      AVAX: 35,
    };
    return prices[asset] || 1;
  }

  // 执行策略
  async executeStrategy(strategyId: string, investmentAmount: number): Promise<{
    success: boolean;
    positions: DeFiPosition[];
    message: string;
  }> {
    const strategy = this.strategies.find(s => s.id === strategyId);
    if (!strategy) {
      return { success: false, positions: [], message: '策略不存在' };
    }

    if (investmentAmount < strategy.minInvestment) {
      return {
        success: false,
        positions: [],
        message: `最低投资金额为 $${strategy.minInvestment}`,
      };
    }

    // 模拟创建头寸
    const positions: DeFiPosition[] = [];
    const amountPerProtocol = investmentAmount / strategy.protocols.length;

    for (const protocolId of strategy.protocols) {
      const protocol = DEFI_PROTOCOLS[protocolId];
      if (!protocol) continue;

      const asset = strategy.assets[0];
      const position = await this.createPosition({
        protocol: protocolId,
        type: protocol.type,
        asset,
        amount: (amountPerProtocol / await this.getAssetPrice(asset)).toFixed(4),
        network: protocol.networks[0],
      });
      positions.push(position);
    }

    return {
      success: true,
      positions,
      message: `成功执行 "${strategy.name}"，创建了 ${positions.length} 个头寸`,
    };
  }

  // 计算预期收益
  calculateExpectedReturns(investmentAmount: number, strategyId: string, days: number): {
    principal: number;
    interest: number;
    total: number;
    dailyReturns: number;
  } {
    const strategy = this.strategies.find(s => s.id === strategyId);
    if (!strategy) {
      return { principal: investmentAmount, interest: 0, total: investmentAmount, dailyReturns: 0 };
    }

    const dailyRate = strategy.expectedApy / 100 / 365;
    const interest = investmentAmount * dailyRate * days;
    const dailyReturns = investmentAmount * dailyRate;

    return {
      principal: investmentAmount,
      interest: parseFloat(interest.toFixed(2)),
      total: parseFloat((investmentAmount + interest).toFixed(2)),
      dailyReturns: parseFloat(dailyReturns.toFixed(2)),
    };
  }
}

// 创建默认服务实例
export const defiService = new DeFiService();

// 导出便捷函数
export function getDefiProtocols() {
  return defiService.getProtocols();
}

export function getDefiStrategies(): DeFiStrategy[] {
  return defiService.getStrategies();
}

export function getRecommendedDefiStrategies(params: Parameters<DeFiService['getRecommendedStrategies']>[0]) {
  return defiService.getRecommendedStrategies(params);
}

export async function executeDefiStrategy(strategyId: string, amount: number) {
  return defiService.executeStrategy(strategyId, amount);
}

export function calculateDefiReturns(amount: number, strategyId: string, days: number) {
  return defiService.calculateExpectedReturns(amount, strategyId, days);
}
