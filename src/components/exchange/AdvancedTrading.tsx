import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  ChartLine, 
  ArrowUp, 
  ArrowDown, 
  Lightning, 
  Gear,
  TrendUp,
  TrendDown,
  Timer,
  Coins,
  ArrowsCounterClockwise,
  Path,
  Cube,
  Robot,
  ChartBar,
  Stack
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatNumber } from '@/lib/binance';

// 期权交易组件
export function OptionsTrading() {
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [expiryDate, setExpiryDate] = useState('2025-01-17');
  const [strikePrice, setStrikePrice] = useState('100000');
  const [premium, setPremium] = useState('');
  const [quantity, setQuantity] = useState('');

  const options = [
    { strike: 95000, callPremium: 8500, putPremium: 2100, delta: 0.72, iv: 68.5 },
    { strike: 100000, callPremium: 5200, putPremium: 3800, delta: 0.52, iv: 65.2 },
    { strike: 105000, callPremium: 2800, putPremium: 6100, delta: 0.35, iv: 63.8 },
    { strike: 110000, callPremium: 1400, putPremium: 9200, delta: 0.22, iv: 62.1 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stack size={24} weight="duotone" className="text-indigo-500" />
          期权交易
        </CardTitle>
        <CardDescription>BTC 欧式期权，支持看涨/看跌</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button
            variant={optionType === 'call' ? 'default' : 'outline'}
            onClick={() => setOptionType('call')}
            className={`flex-1 ${optionType === 'call' ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            <ArrowUp size={20} className="mr-2" />
            看涨期权 (Call)
          </Button>
          <Button
            variant={optionType === 'put' ? 'default' : 'outline'}
            onClick={() => setOptionType('put')}
            className={`flex-1 ${optionType === 'put' ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            <ArrowDown size={20} className="mr-2" />
            看跌期权 (Put)
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>到期日</Label>
            <Input 
              type="date" 
              value={expiryDate} 
              onChange={(e) => setExpiryDate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>行权价</Label>
            <Select value={strikePrice} onValueChange={setStrikePrice}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map(opt => (
                  <SelectItem key={opt.strike} value={opt.strike.toString()}>
                    ${formatNumber(opt.strike)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left">行权价</th>
                <th className="px-3 py-2 text-right text-green-600">Call</th>
                <th className="px-3 py-2 text-right text-red-600">Put</th>
                <th className="px-3 py-2 text-right">Delta</th>
                <th className="px-3 py-2 text-right">IV</th>
              </tr>
            </thead>
            <tbody>
              {options.map(opt => (
                <tr 
                  key={opt.strike} 
                  className={`border-t hover:bg-muted/50 cursor-pointer ${strikePrice === opt.strike.toString() ? 'bg-primary/10' : ''}`}
                  onClick={() => setStrikePrice(opt.strike.toString())}
                >
                  <td className="px-3 py-2 font-medium">${formatNumber(opt.strike)}</td>
                  <td className="px-3 py-2 text-right text-green-600">${formatNumber(opt.callPremium)}</td>
                  <td className="px-3 py-2 text-right text-red-600">${formatNumber(opt.putPremium)}</td>
                  <td className="px-3 py-2 text-right">{opt.delta}</td>
                  <td className="px-3 py-2 text-right">{opt.iv}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>期权金 (USDT)</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>合约数量</Label>
            <Input
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>最大盈利</span>
            <span className="font-bold text-green-600">无限 (看涨) / ${formatNumber(parseFloat(strikePrice) || 0)} (看跌)</span>
          </div>
          <div className="flex justify-between">
            <span>最大亏损</span>
            <span className="font-bold text-red-600">期权金</span>
          </div>
        </div>

        <Button 
          className={`w-full h-12 ${optionType === 'call' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          onClick={() => toast.success(`已买入 ${quantity} 份 ${optionType === 'call' ? '看涨' : '看跌'}期权`)}
        >
          <Lightning size={24} weight="bold" className="mr-2" />
          买入{optionType === 'call' ? '看涨' : '看跌'}期权
        </Button>
      </CardContent>
    </Card>
  );
}

// 网格交易组件
export function GridTrading() {
  const [gridMode, setGridMode] = useState<'arithmetic' | 'geometric'>('arithmetic');
  const [upperPrice, setUpperPrice] = useState('110000');
  const [lowerPrice, setLowerPrice] = useState('90000');
  const [gridCount, setGridCount] = useState('10');
  const [investment, setInvestment] = useState('10000');
  const [isRunning, setIsRunning] = useState(false);

  const grids = [
    { id: 1, pair: 'BTC/USDT', upper: 115000, lower: 85000, grids: 15, profit: 2340.50, status: 'running' },
    { id: 2, pair: 'ETH/USDT', upper: 4200, lower: 3000, grids: 12, profit: 890.20, status: 'running' },
    { id: 3, pair: 'BNB/USDT', upper: 350, lower: 250, grids: 8, profit: -120.30, status: 'stopped' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cube size={24} weight="duotone" className="text-blue-500" />
          网格交易机器人
        </CardTitle>
        <CardDescription>自动低买高卖，震荡行情盈利利器</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button
            variant={gridMode === 'arithmetic' ? 'default' : 'outline'}
            onClick={() => setGridMode('arithmetic')}
            className="flex-1"
          >
            等差网格
          </Button>
          <Button
            variant={gridMode === 'geometric' ? 'default' : 'outline'}
            onClick={() => setGridMode('geometric')}
            className="flex-1"
          >
            等比网格
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>价格上限</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={upperPrice}
              onChange={(e) => setUpperPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>价格下限</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={lowerPrice}
              onChange={(e) => setLowerPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>网格数量</Label>
            <Input
              type="number"
              placeholder="10"
              value={gridCount}
              onChange={(e) => setGridCount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>投资金额 (USDT)</Label>
            <Input
              type="number"
              placeholder="1000"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg space-y-3">
          <div className="flex justify-between">
            <span>每格价差</span>
            <span className="font-bold">
              ${formatNumber((parseFloat(upperPrice) - parseFloat(lowerPrice)) / parseInt(gridCount || '1'))}
            </span>
          </div>
          <div className="flex justify-between">
            <span>每格利润率</span>
            <span className="font-bold text-green-600">
              {(((parseFloat(upperPrice) - parseFloat(lowerPrice)) / parseInt(gridCount || '1')) / parseFloat(lowerPrice || '1') * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>预估年化</span>
            <span className="font-bold text-green-600">
              {((((parseFloat(upperPrice) - parseFloat(lowerPrice)) / parseInt(gridCount || '1')) / parseFloat(lowerPrice || '1') * 100) * 365 * 0.3).toFixed(1)}%
            </span>
          </div>
        </div>

        <Button 
          className="w-full h-12 gap-2"
          onClick={() => {
            setIsRunning(!isRunning);
            toast.success(isRunning ? '网格已停止' : '网格已启动');
          }}
        >
          <Robot size={24} weight="bold" />
          {isRunning ? '停止网格' : '启动网格'}
        </Button>

        <div className="space-y-3">
          <Label>运行中的网格</Label>
          {grids.map(grid => (
            <div key={grid.id} className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <div className="font-medium">{grid.pair}</div>
                <div className="text-xs text-muted-foreground">
                  ${formatNumber(grid.lower)} - ${formatNumber(grid.upper)} | {grid.grids}格
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${grid.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {grid.profit >= 0 ? '+' : ''}{formatNumber(grid.profit)} USDT
                </div>
                <Badge variant={grid.status === 'running' ? 'default' : 'secondary'}>
                  {grid.status === 'running' ? '运行中' : '已停止'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 跨链桥组件
export function CrossChainBridge() {
  const [fromChain, setFromChain] = useState('ethereum');
  const [toChain, setToChain] = useState('polygon');
  const [token, setToken] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [bridging, setBridging] = useState(false);

  const chains = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠', color: '#627EEA' },
    { id: 'polygon', name: 'Polygon', icon: '⬡', color: '#8247E5' },
    { id: 'bsc', name: 'BSC', icon: '◆', color: '#F3BA2F' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '◈', color: '#28A0F0' },
    { id: 'optimism', name: 'Optimism', icon: '◎', color: '#FF0420' },
    { id: 'avalanche', name: 'Avalanche', icon: '▲', color: '#E84142' },
    { id: 'base', name: 'Base', icon: '◉', color: '#0052FF' },
    { id: 'zksync', name: 'zkSync', icon: '◇', color: '#8C8DFC' },
  ];

  const recentBridges = [
    { from: 'Ethereum', to: 'Arbitrum', token: 'ETH', amount: '0.5', time: '5分钟前', status: 'completed' },
    { from: 'Polygon', to: 'BSC', token: 'USDT', amount: '1000', time: '15分钟前', status: 'completed' },
    { from: 'BSC', to: 'Ethereum', token: 'BNB', amount: '2.5', time: '1小时前', status: 'completed' },
  ];

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('请输入有效金额');
      return;
    }
    setBridging(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setBridging(false);
    toast.success(`成功跨链 ${amount} ${token} 从 ${fromChain} 到 ${toChain}`);
    setAmount('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Path size={24} weight="duotone" className="text-purple-500" />
          跨链桥
        </CardTitle>
        <CardDescription>快速安全地在不同区块链间转移资产</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-5 gap-4 items-center">
          <div className="col-span-2 space-y-2">
            <Label>源链</Label>
            <Select value={fromChain} onValueChange={setFromChain}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chains.filter(c => c.id !== toChain).map(chain => (
                  <SelectItem key={chain.id} value={chain.id}>
                    <span className="mr-2">{chain.icon}</span>
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                const temp = fromChain;
                setFromChain(toChain);
                setToChain(temp);
              }}
            >
              <ArrowsCounterClockwise size={24} className="text-muted-foreground" />
            </Button>
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label>目标链</Label>
            <Select value={toChain} onValueChange={setToChain}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chains.filter(c => c.id !== fromChain).map(chain => (
                  <SelectItem key={chain.id} value={chain.id}>
                    <span className="mr-2">{chain.icon}</span>
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>代币</Label>
            <Select value={token} onValueChange={setToken}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="WBTC">WBTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>金额</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>预计到账时间</span>
            <span className="font-bold">~2-5 分钟</span>
          </div>
          <div className="flex justify-between">
            <span>跨链费用</span>
            <span className="font-bold">~$2.50</span>
          </div>
          <div className="flex justify-between">
            <span>到账金额</span>
            <span className="font-bold text-green-600">
              {amount ? (parseFloat(amount) - 2.5).toFixed(4) : '0.00'} {token}
            </span>
          </div>
        </div>

        <Button 
          className="w-full h-12 gap-2"
          onClick={handleBridge}
          disabled={bridging}
        >
          <Path size={24} weight="bold" />
          {bridging ? '跨链中...' : '开始跨链'}
        </Button>

        <div className="space-y-3">
          <Label>最近跨链记录</Label>
          {recentBridges.map((bridge, idx) => (
            <div key={idx} className="p-3 border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xs">
                  <div className="font-medium">{bridge.from} → {bridge.to}</div>
                  <div className="text-muted-foreground">{bridge.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{bridge.amount} {bridge.token}</div>
                <Badge variant="outline" className="text-green-600">完成</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 量化策略组件
export function QuantStrategy() {
  const [selectedStrategy, setSelectedStrategy] = useState('dca');
  const [isActive, setIsActive] = useState(false);

  const strategies = [
    {
      id: 'dca',
      name: 'DCA定投',
      description: '定期定额买入，平滑成本',
      apy: 25.6,
      risk: 'low',
      minInvestment: 100,
    },
    {
      id: 'momentum',
      name: '动量策略',
      description: '追踪趋势，突破买入',
      apy: 45.2,
      risk: 'medium',
      minInvestment: 1000,
    },
    {
      id: 'arbitrage',
      name: '套利策略',
      description: '利用价差获利',
      apy: 18.5,
      risk: 'low',
      minInvestment: 5000,
    },
    {
      id: 'ml',
      name: 'AI机器学习',
      description: '基于AI预测交易',
      apy: 68.3,
      risk: 'high',
      minInvestment: 10000,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Robot size={24} weight="duotone" className="text-cyan-500" />
          量化策略
        </CardTitle>
        <CardDescription>专业量化策略，自动执行交易</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {strategies.map(strategy => (
          <div 
            key={strategy.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedStrategy === strategy.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
            onClick={() => setSelectedStrategy(strategy.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  strategy.risk === 'low' ? 'bg-green-100 text-green-600' :
                  strategy.risk === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <ChartLine size={24} weight="duotone" />
                </div>
                <div>
                  <div className="font-medium">{strategy.name}</div>
                  <div className="text-sm text-muted-foreground">{strategy.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">{strategy.apy}% APY</div>
                <Badge variant={strategy.risk === 'low' ? 'outline' : strategy.risk === 'medium' ? 'secondary' : 'destructive'}>
                  {strategy.risk === 'low' ? '低风险' : strategy.risk === 'medium' ? '中风险' : '高风险'}
                </Badge>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              最低投资: ${strategy.minInvestment.toLocaleString()} USDT
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">自动交易</div>
            <div className="text-sm text-muted-foreground">启用后自动执行策略</div>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => {
              setIsActive(checked);
              toast.success(checked ? '量化策略已启动' : '量化策略已停止');
            }}
          />
        </div>

        <Button 
          className="w-full h-12 gap-2"
          onClick={() => toast.success(`已选择 ${strategies.find(s => s.id === selectedStrategy)?.name} 策略`)}
        >
          <Lightning size={24} weight="bold" />
          开始量化交易
        </Button>
      </CardContent>
    </Card>
  );
}
