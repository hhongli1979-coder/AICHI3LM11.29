/**
 * Wallet Service - 钱包服务层
 * 
 * 提供钱包管理功能:
 * - 钱包创建和导入
 * - 余额查询
 * - 交易创建和签名
 * - 多签管理
 */

import type { Wallet, Transaction, BlockchainNetwork } from './types';

// 网络配置
export const NETWORK_CONFIG: Record<BlockchainNetwork, {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
}> = {
  ethereum: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: import.meta.env.VITE_ETH_RPC_URL || 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon.llamarpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  },
  bsc: {
    name: 'BNB Smart Chain',
    chainId: 56,
    rpcUrl: import.meta.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  },
  arbitrum: {
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: import.meta.env.VITE_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  optimism: {
    name: 'Optimism',
    chainId: 10,
    rpcUrl: import.meta.env.VITE_OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  avalanche: {
    name: 'Avalanche C-Chain',
    chainId: 43114,
    rpcUrl: import.meta.env.VITE_AVAX_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  },
};

// 钱包服务类
export class WalletService {
  private wallets: Map<string, Wallet> = new Map();
  private pendingTransactions: Map<string, Transaction> = new Map();

  // 获取所有钱包
  getWallets(): Wallet[] {
    return Array.from(this.wallets.values());
  }

  // 获取单个钱包
  getWallet(id: string): Wallet | undefined {
    return this.wallets.get(id);
  }

  // 创建新钱包
  async createWallet(params: {
    name: string;
    network: BlockchainNetwork;
    type: 'single' | 'multisig';
    signers?: string[];
    requiredSignatures?: number;
  }): Promise<Wallet> {
    // 生成钱包地址 (实际应使用加密库)
    const address = this.generateAddress();
    
    const wallet: Wallet = {
      id: `wallet-${Date.now()}`,
      name: params.name,
      address,
      network: params.network,
      type: params.type,
      signers: params.signers,
      requiredSignatures: params.requiredSignatures,
      balance: { native: '0', usd: '0' },
      tokens: [],
      createdAt: Date.now(),
    };

    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  // 获取钱包余额
  async getBalance(walletId: string): Promise<{ native: string; usd: string }> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const config = NETWORK_CONFIG[wallet.network];
    
    try {
      // 使用JSON-RPC获取余额
      const response = await fetch(config.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [wallet.address, 'latest'],
          id: 1,
        }),
      });

      const data = await response.json();
      const balanceWei = BigInt(data.result || '0');
      const balanceEth = Number(balanceWei) / 1e18;

      // 获取价格 (简化版)
      const price = await this.getTokenPrice(config.nativeCurrency.symbol);
      const balanceUsd = (balanceEth * price).toFixed(2);

      const balance = {
        native: balanceEth.toFixed(4),
        usd: balanceUsd,
      };

      // 更新钱包余额
      wallet.balance = balance;
      this.wallets.set(walletId, wallet);

      return balance;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return wallet.balance;
    }
  }

  // 创建交易
  async createTransaction(params: {
    walletId: string;
    to: string;
    value: string;
    token?: string;
    description?: string;
  }): Promise<Transaction> {
    const wallet = this.wallets.get(params.walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      walletId: params.walletId,
      from: wallet.address,
      to: params.to,
      value: params.value,
      token: params.token,
      network: wallet.network,
      status: 'pending',
      signatures: [],
      requiredSignatures: wallet.requiredSignatures || 1,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天后过期
      description: params.description,
    };

    this.pendingTransactions.set(transaction.id, transaction);
    return transaction;
  }

  // 签署交易
  async signTransaction(transactionId: string, signerAddress: string): Promise<Transaction> {
    const transaction = this.pendingTransactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // 检查是否已签名
    if (transaction.signatures.some(s => s.signer === signerAddress)) {
      throw new Error('Already signed by this address');
    }

    // 添加签名 (实际应使用加密签名)
    transaction.signatures.push({
      signer: signerAddress,
      signature: this.generateSignature(),
      signedAt: Date.now(),
    });

    // 检查是否达到所需签名数
    if (transaction.signatures.length >= transaction.requiredSignatures) {
      transaction.status = 'signed';
    }

    this.pendingTransactions.set(transactionId, transaction);
    return transaction;
  }

  // 广播交易
  async broadcastTransaction(transactionId: string): Promise<Transaction> {
    const transaction = this.pendingTransactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'signed') {
      throw new Error('Transaction not fully signed');
    }

    transaction.status = 'broadcasting';
    this.pendingTransactions.set(transactionId, transaction);

    // 模拟广播延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 生成交易哈希
    transaction.hash = this.generateTxHash();
    transaction.status = 'confirmed';
    transaction.executedAt = Date.now();

    this.pendingTransactions.set(transactionId, transaction);
    return transaction;
  }

  // 获取待处理交易
  getPendingTransactions(): Transaction[] {
    return Array.from(this.pendingTransactions.values())
      .filter(tx => tx.status === 'pending' || tx.status === 'signed');
  }

  // 获取代币价格 (简化版)
  private async getTokenPrice(symbol: string): Promise<number> {
    const prices: Record<string, number> = {
      ETH: 2780,
      MATIC: 0.65,
      BNB: 580,
      AVAX: 35,
    };
    return prices[symbol] || 0;
  }

  // 生成地址 (模拟)
  private generateAddress(): string {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  // 生成签名 (模拟)
  private generateSignature(): string {
    const chars = '0123456789abcdef';
    let sig = '0x';
    for (let i = 0; i < 130; i++) {
      sig += chars[Math.floor(Math.random() * chars.length)];
    }
    return sig;
  }

  // 生成交易哈希 (模拟)
  private generateTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }
}

// 创建默认服务实例
export const walletService = new WalletService();

// 导出便捷函数
export function getWallets(): Wallet[] {
  return walletService.getWallets();
}

export async function createWallet(params: Parameters<WalletService['createWallet']>[0]): Promise<Wallet> {
  return walletService.createWallet(params);
}

export async function getWalletBalance(walletId: string) {
  return walletService.getBalance(walletId);
}

export async function createTransaction(params: Parameters<WalletService['createTransaction']>[0]): Promise<Transaction> {
  return walletService.createTransaction(params);
}

export async function signTransaction(transactionId: string, signerAddress: string): Promise<Transaction> {
  return walletService.signTransaction(transactionId, signerAddress);
}

export async function broadcastTransaction(transactionId: string): Promise<Transaction> {
  return walletService.broadcastTransaction(transactionId);
}

export function getPendingTransactions(): Transaction[] {
  return walletService.getPendingTransactions();
}
