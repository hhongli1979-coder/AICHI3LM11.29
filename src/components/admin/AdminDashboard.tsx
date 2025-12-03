import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HardDrives, Globe, ChartLine, Wallet, Lightning, 
  ArrowClockwise, Desktop, Code, LinkSimple, Check, Plus,
  CaretRight, CurrencyDollar, Bank, TrendUp, Coins
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { CHAINS, DEFI_ADAPTERS, ChainInfo, switchChain, addChainToMetaMask } from '@/lib/chainlist';

// Format numbers
const formatNumber = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export function AdminDashboard() {
  const [activeChain, setActiveChain] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState({
    api: true,
    yields: true,
    coins: true,
    stablecoins: true,
  });

  // Calculate totals
  const totalChainTVL = CHAINS.reduce((sum, c) => sum + (c.tvl || 0), 0);
  const totalAdapterTVL = DEFI_ADAPTERS.reduce((sum, a) => sum + a.tvl, 0);
  const totalProtocols = CHAINS.reduce((sum, c) => sum + (c.protocols || 0), 0);

  // Handle chain switch
  const handleSwitchChain = async (chain: ChainInfo) => {
    setLoading(true);
    try {
      const success = await switchChain(chain.chainId);
      if (success) {
        setActiveChain(chain.chainId);
        toast.success(`已切换到 ${chain.name}`);
      } else {
        toast.error('切换失败');
      }
    } catch (error) {
      toast.error('切换失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Add chain to wallet
  const handleAddChain = async (chain: ChainInfo) => {
    setLoading(true);
    try {
      const success = await addChainToMetaMask(chain);
      if (success) {
        toast.success(`已添加 ${chain.name} 到钱包`);
      }
    } catch (error) {
      toast.error('添加失败');
    } finally {
      setLoading(false);
    }
  };

  // Refresh server status
  const refreshStatus = async () => {
    setLoading(true);
    toast.info('检查服务器状态...');
    
    const checkEndpoint = async (url: string): Promise<boolean> => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        return res.ok;
      } catch {
        return false;
      }
    };

    const [api, yields, coins, stablecoins] = await Promise.all([
      checkEndpoint('https://api.llama.fi/protocols'),
      checkEndpoint('https://yields.llama.fi/pools'),
      checkEndpoint('https://coins.llama.fi/prices'),
      checkEndpoint('https://stablecoins.llama.fi/stablecoins'),
    ]);

    setServerStatus({ api, yields, coins, stablecoins });
    setLoading(false);
    toast.success('状态已更新');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Desktop size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">DefiLlama 后台管理</h2>
                <p className="text-white/80">TVL · Yields · Chains · Adapters</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={refreshStatus} disabled={loading} className="gap-2">
                <ArrowClockwise size={18} className={loading ? 'animate-spin' : ''} />
                刷新状态
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Server Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrives size={20} />
              <span>API Server</span>
            </div>
            <Badge variant={serverStatus.api ? 'default' : 'destructive'}>
              {serverStatus.api ? '在线' : '离线'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendUp size={20} />
              <span>Yields API</span>
            </div>
            <Badge variant={serverStatus.yields ? 'default' : 'destructive'}>
              {serverStatus.yields ? '在线' : '离线'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins size={20} />
              <span>Coins API</span>
            </div>
            <Badge variant={serverStatus.coins ? 'default' : 'destructive'}>
              {serverStatus.coins ? '在线' : '离线'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CurrencyDollar size={20} />
              <span>Stablecoins</span>
            </div>
            <Badge variant={serverStatus.stablecoins ? 'default' : 'destructive'}>
              {serverStatus.stablecoins ? '在线' : '离线'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">总链 TVL</p>
            <p className="text-2xl font-bold">{formatNumber(totalChainTVL)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">协议 TVL</p>
            <p className="text-2xl font-bold">{formatNumber(totalAdapterTVL)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">支持链数</p>
            <p className="text-2xl font-bold">{CHAINS.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">协议总数</p>
            <p className="text-2xl font-bold">{totalProtocols}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="chains" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chains" className="gap-2">
            <Globe size={18} />
            链管理
          </TabsTrigger>
          <TabsTrigger value="adapters" className="gap-2">
            <Code size={18} />
            协议适配器
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Desktop size={18} />
            API 接口
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2">
            <HardDrives size={18} />
            配置中心
          </TabsTrigger>
        </TabsList>

        {/* Chains Tab */}
        <TabsContent value="chains">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={24} weight="duotone" />
                区块链网络管理
              </CardTitle>
              <CardDescription>
                管理支持的区块链网络，一键添加到钱包
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {CHAINS.map((chain) => (
                  <div
                    key={chain.chainId}
                    className={`p-4 border rounded-lg hover:border-primary transition-colors ${
                      activeChain === chain.chainId ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {chain.nativeCurrency.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <p className="font-bold">{chain.name}</p>
                          <p className="text-xs text-muted-foreground">Chain ID: {chain.chainId}</p>
                        </div>
                      </div>
                      {activeChain === chain.chainId && (
                        <Badge variant="default">当前</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">TVL</span>
                        <span className="font-medium">{formatNumber(chain.tvl || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">协议数</span>
                        <span className="font-medium">{chain.protocols || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RPC</span>
                        <span className="font-medium text-xs truncate max-w-32">{chain.rpc[0]}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1"
                        onClick={() => handleAddChain(chain)}
                        disabled={loading}
                      >
                        <Plus size={14} />
                        添加
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleSwitchChain(chain)}
                        disabled={loading}
                      >
                        <Lightning size={14} />
                        切换
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adapters Tab */}
        <TabsContent value="adapters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code size={24} weight="duotone" />
                DeFi 协议适配器
              </CardTitle>
              <CardDescription>
                DefiLlama-Adapters 协议集成管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEFI_ADAPTERS.map((adapter) => (
                  <div
                    key={adapter.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{adapter.name}</h3>
                          <Badge variant="secondary">{adapter.category}</Badge>
                          {adapter.audits && (
                            <Badge variant="outline" className="gap-1">
                              <Check size={12} />
                              {adapter.audits} 审计
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {adapter.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {adapter.chains.map((chain) => (
                            <Badge key={chain} variant="outline" className="text-xs">
                              {chain}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          {formatNumber(adapter.tvl)}
                        </p>
                        <a
                          href={adapter.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center justify-end gap-1"
                        >
                          访问 <LinkSimple size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Desktop size={24} weight="duotone" />
                DefiLlama API 接口
              </CardTitle>
              <CardDescription>
                defillama-server API 端点管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Get All Protocols', endpoint: '/protocols', method: 'GET', desc: '获取所有协议TVL' },
                  { name: 'Get Protocol TVL', endpoint: '/protocol/{name}', method: 'GET', desc: '获取单个协议历史TVL' },
                  { name: 'Get Chains', endpoint: '/v2/chains', method: 'GET', desc: '获取所有链TVL' },
                  { name: 'Get Historical TVL', endpoint: '/v2/historicalChainTvl', method: 'GET', desc: '获取历史TVL数据' },
                  { name: 'Get Token Prices', endpoint: '/prices/current/{coins}', method: 'GET', desc: '获取代币价格' },
                  { name: 'Get Yield Pools', endpoint: '/pools', method: 'GET', desc: '获取收益池数据' },
                  { name: 'Get Stablecoins', endpoint: '/stablecoins', method: 'GET', desc: '获取稳定币数据' },
                  { name: 'Get DEX Volume', endpoint: '/overview/dexs', method: 'GET', desc: '获取DEX交易量' },
                  { name: 'Get Fees', endpoint: '/overview/fees', method: 'GET', desc: '获取协议费用' },
                  { name: 'Get Bridges', endpoint: '/bridges', method: 'GET', desc: '获取跨链桥数据' },
                ].map((api, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant={api.method === 'GET' ? 'default' : 'secondary'}>
                        {api.method}
                      </Badge>
                      <div>
                        <p className="font-medium">{api.name}</p>
                        <p className="text-sm text-muted-foreground">{api.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {api.endpoint}
                      </code>
                      <Button size="sm" variant="outline" className="gap-1">
                        测试 <CaretRight size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Config Tab */}
        <TabsContent value="config">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>数据源配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Base URL</label>
                  <Input value="https://api.llama.fi" readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Yields API URL</label>
                  <Input value="https://yields.llama.fi" readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Coins API URL</label>
                  <Input value="https://coins.llama.fi" readOnly />
                </div>
                <Button className="w-full">保存配置</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ArrowClockwise size={18} />
                  同步所有协议数据
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <HardDrives size={18} />
                  更新链配置
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <TrendUp size={18} />
                  刷新收益池
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Bank size={18} />
                  重建TVL缓存
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
