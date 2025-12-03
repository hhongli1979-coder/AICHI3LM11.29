import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChartLine, CurrencyDollar, TrendUp, TrendDown, Bank, 
  Coins, ArrowsDownUp, MagnifyingGlass, ArrowClockwise,
  HardDrives, Globe, Lightning, Wallet
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { 
  mockProtocols, mockChains, mockYieldPools,
  Protocol, Chain, YieldPool 
} from '@/lib/defillama';

// Format large numbers
const formatTVL = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export function DefiLlamaDashboard() {
  const [protocols, setProtocols] = useState<Protocol[]>(mockProtocols);
  const [chains, setChains] = useState<Chain[]>(mockChains);
  const [yieldPools, setYieldPools] = useState<YieldPool[]>(mockYieldPools);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calculate totals
  const totalTVL = protocols.reduce((sum, p) => sum + p.tvl, 0);
  const totalChainTVL = chains.reduce((sum, c) => sum + c.tvl, 0);
  const avgAPY = yieldPools.reduce((sum, p) => sum + p.apy, 0) / yieldPools.length;

  // Get unique categories
  const categories = ['all', ...new Set(protocols.map(p => p.category))];

  // Filter protocols
  const filteredProtocols = protocols.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Fetch real data from DefiLlama API
  const fetchData = async () => {
    setLoading(true);
    toast.info('正在从 DefiLlama 获取数据...');
    
    try {
      // Fetch protocols
      const protocolsRes = await fetch('https://api.llama.fi/protocols');
      if (protocolsRes.ok) {
        const data = await protocolsRes.json();
        setProtocols(data.slice(0, 50).map((p: Record<string, unknown>) => ({
          id: p.slug,
          name: p.name,
          symbol: p.symbol || '',
          chain: p.chain || 'Multi-Chain',
          tvl: p.tvl || 0,
          change_1d: p.change_1d || 0,
          change_7d: p.change_7d || 0,
          category: p.category || 'Other',
          logo: p.logo || '',
          url: p.url || '',
        })));
      }

      // Fetch chains
      const chainsRes = await fetch('https://api.llama.fi/v2/chains');
      if (chainsRes.ok) {
        const data = await chainsRes.json();
        setChains(data.slice(0, 20));
      }

      // Fetch yield pools
      const yieldsRes = await fetch('https://yields.llama.fi/pools');
      if (yieldsRes.ok) {
        const data = await yieldsRes.json();
        setYieldPools(data.data?.slice(0, 30) || []);
      }

      toast.success('数据更新成功！');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('获取数据失败，使用缓存数据');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <HardDrives size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">DefiLlama 数据中心</h2>
                <p className="text-muted-foreground">DeFi TVL · Yield APY · 链上数据</p>
              </div>
            </div>
            <Button onClick={fetchData} disabled={loading} className="gap-2">
              <ArrowClockwise size={18} className={loading ? 'animate-spin' : ''} />
              {loading ? '更新中...' : '刷新数据'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CurrencyDollar size={16} />
              <span className="text-sm">总 TVL</span>
            </div>
            <p className="text-2xl font-bold">{formatTVL(totalTVL)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Globe size={16} />
              <span className="text-sm">链 TVL</span>
            </div>
            <p className="text-2xl font-bold">{formatTVL(totalChainTVL)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Bank size={16} />
              <span className="text-sm">协议数量</span>
            </div>
            <p className="text-2xl font-bold">{protocols.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Lightning size={16} />
              <span className="text-sm">平均 APY</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{avgAPY.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="protocols" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="protocols" className="gap-2">
            <Bank size={18} />
            协议 TVL
          </TabsTrigger>
          <TabsTrigger value="chains" className="gap-2">
            <Globe size={18} />
            链数据
          </TabsTrigger>
          <TabsTrigger value="yields" className="gap-2">
            <TrendUp size={18} />
            收益池
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <ChartLine size={18} />
            分析
          </TabsTrigger>
        </TabsList>

        {/* Protocols Tab */}
        <TabsContent value="protocols">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bank size={24} weight="duotone" />
                  DeFi 协议排名
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="搜索协议..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-48"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'all' ? '全部' : cat}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredProtocols.map((protocol, index) => (
                  <div
                    key={protocol.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-muted-foreground w-8">
                        #{index + 1}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {protocol.logo ? (
                          <img src={protocol.logo} alt={protocol.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <Coins size={20} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{protocol.name}</p>
                          <Badge variant="secondary">{protocol.symbol}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{protocol.chain}</span>
                          <span>•</span>
                          <span>{protocol.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatTVL(protocol.tvl)}</p>
                      <div className="flex items-center justify-end gap-2 text-sm">
                        <span className={protocol.change_1d >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {protocol.change_1d >= 0 ? '+' : ''}{protocol.change_1d?.toFixed(2)}% (1d)
                        </span>
                        <span className={protocol.change_7d >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {protocol.change_7d >= 0 ? '+' : ''}{protocol.change_7d?.toFixed(2)}% (7d)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chains Tab */}
        <TabsContent value="chains">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={24} weight="duotone" />
                区块链 TVL 排名
              </CardTitle>
              <CardDescription>各链锁仓量数据</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chains.map((chain, index) => (
                  <div
                    key={chain.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-muted-foreground w-8">
                        #{index + 1}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {chain.tokenSymbol?.slice(0, 2) || chain.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold">{chain.name}</p>
                        <p className="text-sm text-muted-foreground">{chain.tokenSymbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatTVL(chain.tvl)}</p>
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(chain.tvl / (chains[0]?.tvl || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Yields Tab */}
        <TabsContent value="yields">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp size={24} weight="duotone" />
                高收益池 (Yield Pools)
              </CardTitle>
              <CardDescription>DefiLlama Yield Server 数据</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {yieldPools.map((pool, index) => (
                  <div
                    key={pool.pool}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-muted-foreground w-8">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{pool.symbol}</p>
                          {pool.stablecoin && (
                            <Badge variant="secondary">稳定币</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{pool.project}</span>
                          <span>•</span>
                          <span>{pool.chain}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{pool.apy?.toFixed(2)}% APY</p>
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                        <span>Base: {pool.apyBase?.toFixed(2)}%</span>
                        {pool.apyReward > 0 && (
                          <span>+奖励: {pool.apyReward?.toFixed(2)}%</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        TVL: {formatTVL(pool.tvlUsd)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine size={24} weight="duotone" />
                  TVL 分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.filter(c => c !== 'all').slice(0, 6).map((cat) => {
                    const catTVL = protocols
                      .filter(p => p.category === cat)
                      .reduce((sum, p) => sum + p.tvl, 0);
                    const percentage = (catTVL / totalTVL) * 100;
                    return (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{cat}</span>
                          <span className="font-medium">{formatTVL(catTVL)} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet size={24} weight="duotone" />
                  快速操作
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <ArrowsDownUp size={18} />
                  一键投资高APY池
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <TrendUp size={18} />
                  自动复投策略
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Lightning size={18} />
                  跨链资产转移
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Bank size={18} />
                  协议风险评估
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
