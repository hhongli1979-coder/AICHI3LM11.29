import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  Users, 
  PaperPlaneTilt, 
  Copy, 
  QrCode, 
  ArrowsDownUp,
  ChartLine,
  ShieldCheck,
  Plus,
  ArrowUp,
  ArrowDown
} from '@phosphor-icons/react';
import type { Wallet as WalletType } from '@/lib/types';
import { formatAddress, formatCurrency, NETWORKS } from '@/lib/mock-data';
import { toast } from 'sonner';
import { SendTransactionForm } from './SendTransactionForm';

interface HomeWalletPanelProps {
  wallets: WalletType[];
  onCreateWallet: () => void;
}

export function HomeWalletPanel({ wallets, onCreateWallet }: HomeWalletPanelProps) {
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  // Get primary wallets (first 2 for homepage display)
  const primaryWallets = wallets.slice(0, 2);
  
  // Calculate total balance
  const totalBalance = wallets.reduce((sum, wallet) => {
    const balance = parseFloat(wallet.balance.usd.replace(/,/g, ''));
    return sum + balance;
  }, 0);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('地址已复制到剪贴板');
  };

  const handleSend = (wallet: WalletType) => {
    setSelectedWallet(wallet);
    setSendDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">钱包系统</h2>
          <p className="text-sm text-muted-foreground">深度集成的多链钱包管理</p>
        </div>
        <Button onClick={onCreateWallet} className="gap-2">
          <Plus size={16} weight="bold" />
          新建钱包
        </Button>
      </div>

      {/* Total Portfolio Value Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">总资产价值</div>
              <div className="text-4xl font-bold">{formatCurrency(totalBalance)}</div>
              <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                <ArrowUp size={16} weight="bold" />
                <span>+12.5% 本月</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-4 bg-background/60 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-primary">{wallets.length}</div>
                <div className="text-xs text-muted-foreground">活跃钱包</div>
              </div>
              <div className="text-center p-4 bg-background/60 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-accent">
                  {wallets.filter(w => w.type === 'multisig').length}
                </div>
                <div className="text-xs text-muted-foreground">多签钱包</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Wallet Cards - Two Wallet System Display */}
      <div className="grid gap-6 md:grid-cols-2">
        {primaryWallets.map((wallet, index) => {
          const network = NETWORKS[wallet.network];
          const nativeValue = parseFloat(wallet.balance.usd.replace(/,/g, ''));
          
          // Get native token symbol based on network
          const getNativeSymbol = (networkName: string): string => {
            const symbolMap: Record<string, string> = {
              'Ethereum': 'ETH',
              'Polygon': 'MATIC',
              'BNB Chain': 'BNB',
              'Arbitrum': 'ETH',
              'Optimism': 'ETH',
              'Avalanche': 'AVAX'
            };
            return symbolMap[networkName] || 'ETH';
          };
          
          return (
            <Card 
              key={wallet.id} 
              className={`hover:shadow-lg transition-all duration-300 min-h-[320px] flex flex-col ${
                index === 0 
                  ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-transparent' 
                  : 'border-accent/30 bg-gradient-to-br from-accent/5 to-transparent'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        index === 0 ? 'bg-primary/10' : 'bg-accent/10'
                      }`}>
                        {wallet.type === 'multisig' 
                          ? <Users size={20} weight="duotone" className={index === 0 ? 'text-primary' : 'text-accent'} />
                          : <Wallet size={20} weight="duotone" className={index === 0 ? 'text-primary' : 'text-accent'} />
                        }
                      </div>
                      <div>
                        <CardTitle className="text-lg">{wallet.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs text-muted-foreground">
                            {formatAddress(wallet.address)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={() => copyAddress(wallet.address)}
                          >
                            <Copy size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: network.color, color: network.color }}
                      className="text-xs"
                    >
                      {network.icon} {network.name}
                    </Badge>
                    {wallet.type === 'multisig' && (
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                        <ShieldCheck size={12} weight="bold" />
                        {wallet.requiredSignatures}/{wallet.signers?.length} 签名
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Balance Section */}
                <div className="mb-4">
                  <div className="text-3xl font-bold">
                    {formatCurrency(nativeValue)}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{wallet.balance.native}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-muted rounded">
                      {getNativeSymbol(network.name)}
                    </span>
                  </div>
                </div>

                {/* Token Balances */}
                {wallet.tokens.length > 0 && (
                  <div className="border-t pt-3 mb-4 flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-2">代币资产</div>
                    <div className="space-y-2">
                      {wallet.tokens.slice(0, 2).map((token) => (
                        <div key={token.address} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                            }`}>
                              {token.symbol.charAt(0)}
                            </div>
                            <span className="font-medium">{token.symbol}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{parseFloat(token.balance).toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">{formatCurrency(parseFloat(token.valueUsd))}</div>
                          </div>
                        </div>
                      ))}
                      {wallet.tokens.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center pt-1">
                          +{wallet.tokens.length - 2} 更多代币
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Security Status for Multisig */}
                {wallet.type === 'multisig' && (
                  <div className="border-t pt-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">安全等级</span>
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={14} weight="fill" className="text-green-500" />
                        <span className="font-medium text-green-600">企业级</span>
                      </div>
                    </div>
                    <Progress 
                      value={100} 
                      className="h-1 mt-2" 
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto pt-3">
                  <Button 
                    onClick={() => handleSend(wallet)} 
                    className={`flex-1 gap-2 ${index === 0 ? '' : 'bg-accent hover:bg-accent/90'}`}
                    size="sm"
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    发送
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <QrCode size={16} weight="bold" />
                    接收
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowsDownUp size={16} weight="bold" />
                    兑换
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <ArrowDown size={20} weight="duotone" className="text-green-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">本月收入</div>
              <div className="font-bold text-green-600">+$45,230</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <ArrowUp size={20} weight="duotone" className="text-red-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">本月支出</div>
              <div className="font-bold text-red-600">-$12,450</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ChartLine size={20} weight="duotone" className="text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">DeFi收益</div>
              <div className="font-bold">+$3,280</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <ShieldCheck size={20} weight="duotone" className="text-accent" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">待签名交易</div>
              <div className="font-bold">2</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Send Transaction Dialog */}
      {selectedWallet && (
        <SendTransactionForm 
          wallet={selectedWallet}
          open={sendDialogOpen}
          onOpenChange={setSendDialogOpen}
        />
      )}
    </div>
  );
}
