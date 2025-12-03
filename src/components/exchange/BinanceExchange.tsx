import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChartLine, 
  ArrowUp, 
  ArrowDown, 
  Lightning, 
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  TrendUp,
  TrendDown,
  CurrencyDollar,
  ArrowsLeftRight,
  ChartBar,
  Users
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
  TRADING_PAIRS,
  MOCK_PRICES,
  getAccountBalances,
  getTradeHistory,
  placeOrder,
  formatNumber,
  formatLargeNumber,
  type OrderSide,
  type OrderType,
} from '@/lib/binance';

export function BinanceExchange() {
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [orderSide, setOrderSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('LIMIT');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [balances] = useState(getAccountBalances());
  const [trades] = useState(getTradeHistory());

  const pairData = TRADING_PAIRS.find(p => p.symbol === selectedPair);
  const marketData = MOCK_PRICES[selectedPair];

  useEffect(() => {
    if (marketData) {
      setPrice(marketData.price.toString());
    }
  }, [selectedPair]);

  const calculateTotal = () => {
    const p = parseFloat(price) || 0;
    const q = parseFloat(quantity) || 0;
    return (p * q).toFixed(2);
  };

  const handleSubmitOrder = async () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error('请输入有效数量');
      return;
    }
    if (orderType === 'LIMIT' && (!price || parseFloat(price) <= 0)) {
      toast.error('请输入有效价格');
      return;
    }

    setLoading(true);
    try {
      const order = await placeOrder(
        selectedPair,
        orderSide,
        orderType,
        parseFloat(quantity),
        orderType === 'LIMIT' ? parseFloat(price) : undefined
      );
      
      toast.success(
        `${orderSide === 'BUY' ? '买入' : '卖出'}订单已提交!\n` +
        `${pairData?.base} ${quantity} @ ${orderType === 'MARKET' ? '市价' : price}`
      );
      setQuantity('');
    } catch (error) {
      toast.error('订单提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {TRADING_PAIRS.slice(0, 5).map(pair => {
          const data = MOCK_PRICES[pair.symbol];
          return (
            <Card 
              key={pair.symbol} 
              className={`cursor-pointer transition-all hover:shadow-md ${selectedPair === pair.symbol ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedPair(pair.symbol)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{pair.base}</span>
                  <Badge variant={data.change24h >= 0 ? 'default' : 'destructive'} className="text-xs">
                    {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                  </Badge>
                </div>
                <div className="text-xl font-bold">${formatNumber(data.price)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Vol: ${formatLargeNumber(data.volume24h)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Trading Panel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine size={24} weight="duotone" className="text-yellow-500" />
                  币安交易 - {pairData?.name}
                </CardTitle>
                <CardDescription>
                  {pairData?.base}/{pairData?.quote} 现货交易
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${formatNumber(marketData?.price || 0)}</div>
                <div className={`flex items-center gap-1 text-sm ${marketData?.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData?.change24h >= 0 ? <TrendUp size={16} /> : <TrendDown size={16} />}
                  {marketData?.change24h >= 0 ? '+' : ''}{marketData?.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trading Pair Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>交易对</Label>
                <Select value={selectedPair} onValueChange={setSelectedPair}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRADING_PAIRS.map(pair => (
                      <SelectItem key={pair.symbol} value={pair.symbol}>
                        {pair.base}/{pair.quote} - {pair.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>订单类型</Label>
                <Select value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LIMIT">限价单</SelectItem>
                    <SelectItem value="MARKET">市价单</SelectItem>
                    <SelectItem value="STOP_LOSS">止损单</SelectItem>
                    <SelectItem value="TAKE_PROFIT">止盈单</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Buy/Sell Tabs */}
            <div className="flex gap-2">
              <Button
                variant={orderSide === 'BUY' ? 'default' : 'outline'}
                onClick={() => setOrderSide('BUY')}
                className={`flex-1 ${orderSide === 'BUY' ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                <ArrowUp size={20} className="mr-2" />
                买入 {pairData?.base}
              </Button>
              <Button
                variant={orderSide === 'SELL' ? 'default' : 'outline'}
                onClick={() => setOrderSide('SELL')}
                className={`flex-1 ${orderSide === 'SELL' ? 'bg-red-600 hover:bg-red-700' : ''}`}
              >
                <ArrowDown size={20} className="mr-2" />
                卖出 {pairData?.base}
              </Button>
            </div>

            {/* Price & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>价格 ({pairData?.quote})</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={orderType === 'MARKET'}
                />
                {orderType === 'MARKET' && (
                  <p className="text-xs text-muted-foreground">市价单将以最优价格成交</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>数量 ({pairData?.base})</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[25, 50, 75, 100].map(pct => (
                <Button
                  key={pct}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const available = orderSide === 'BUY' 
                      ? balances.USDT?.free || 0 
                      : balances[pairData?.base || '']?.free || 0;
                    if (orderSide === 'BUY') {
                      const p = parseFloat(price) || marketData?.price || 1;
                      setQuantity(((available * pct / 100) / p).toFixed(6));
                    } else {
                      setQuantity((available * pct / 100).toFixed(6));
                    }
                  }}
                >
                  {pct}%
                </Button>
              ))}
            </div>

            {/* Order Summary */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>可用余额</span>
                <span>
                  {orderSide === 'BUY' 
                    ? `${formatNumber(balances.USDT?.free || 0)} USDT`
                    : `${formatNumber(balances[pairData?.base || '']?.free || 0, 4)} ${pairData?.base}`
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>订单金额</span>
                <span>{calculateTotal()} USDT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>手续费 (0.1%)</span>
                <span>{(parseFloat(calculateTotal()) * 0.001).toFixed(4)} USDT</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmitOrder} 
              disabled={loading}
              className={`w-full h-12 text-lg ${orderSide === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              <Lightning size={24} weight="bold" className="mr-2" />
              {loading ? '提交中...' : `${orderSide === 'BUY' ? '买入' : '卖出'} ${pairData?.base}`}
            </Button>
          </CardContent>
        </Card>

        {/* Account & Orders */}
        <div className="space-y-6">
          {/* Account Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet size={20} weight="duotone" />
                账户资产
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(balances).slice(0, 5).map(([asset, balance]) => (
                <div key={asset} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{asset}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      (锁定: {formatNumber(balance.locked, 4)})
                    </span>
                  </div>
                  <span className="font-mono">{formatNumber(balance.free, asset === 'USDT' ? 2 : 4)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock size={20} weight="duotone" />
                最近成交
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trades.map(trade => (
                <div key={trade.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant={trade.side === 'BUY' ? 'default' : 'destructive'} className="text-xs">
                      {trade.side === 'BUY' ? '买' : '卖'}
                    </Badge>
                    <span>{trade.symbol.replace('USDT', '')}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">{trade.quantity} @ ${formatNumber(trade.price)}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleString('zh-CN')}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Market Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar size={24} weight="duotone" />
            24小时市场数据 - {pairData?.base}/{pairData?.quote}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">24h 最高</div>
              <div className="text-xl font-bold text-green-600">${formatNumber(marketData?.high24h || 0)}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">24h 最低</div>
              <div className="text-xl font-bold text-red-600">${formatNumber(marketData?.low24h || 0)}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">24h 成交量</div>
              <div className="text-xl font-bold">${formatLargeNumber(marketData?.volume24h || 0)}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">24h 涨跌幅</div>
              <div className={`text-xl font-bold ${(marketData?.change24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(marketData?.change24h || 0) >= 0 ? '+' : ''}{marketData?.change24h.toFixed(2)}%
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">当前价格</div>
              <div className="text-xl font-bold">${formatNumber(marketData?.price || 0)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// P2P Trading Component
export function P2PTrading() {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT');
  const [fiat, setFiat] = useState('CNY');
  const [amount, setAmount] = useState('');

  const merchants = [
    { name: '星辰商家', orders: 1234, rate: 99.8, price: 7.24, minAmount: 100, maxAmount: 50000 },
    { name: '金牌认证', orders: 856, rate: 99.5, price: 7.23, minAmount: 500, maxAmount: 100000 },
    { name: '快速交易', orders: 2341, rate: 99.9, price: 7.25, minAmount: 200, maxAmount: 80000 },
    { name: '信誉商家', orders: 567, rate: 98.9, price: 7.22, minAmount: 100, maxAmount: 30000 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={24} weight="duotone" className="text-yellow-500" />
          C2C/P2P 交易
        </CardTitle>
        <CardDescription>与认证商家直接交易，支持多种支付方式</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button
            variant={mode === 'buy' ? 'default' : 'outline'}
            onClick={() => setMode('buy')}
            className={`flex-1 ${mode === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            我要买入
          </Button>
          <Button
            variant={mode === 'sell' ? 'default' : 'outline'}
            onClick={() => setMode('sell')}
            className={`flex-1 ${mode === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            我要卖出
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>加密货币</Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="BNB">BNB</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>法币</Label>
            <Select value={fiat} onValueChange={setFiat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CNY">CNY 人民币</SelectItem>
                <SelectItem value="USD">USD 美元</SelectItem>
                <SelectItem value="EUR">EUR 欧元</SelectItem>
                <SelectItem value="HKD">HKD 港币</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>金额 ({fiat})</Label>
            <Input
              type="number"
              placeholder="输入金额"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>商家列表</Label>
          {merchants.map((merchant, idx) => (
            <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                    {merchant.name[0]}
                  </div>
                  <div>
                    <div className="font-medium">{merchant.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {merchant.orders} 笔订单 | {merchant.rate}% 完成率
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">¥{merchant.price.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    限额 ¥{merchant.minAmount} - ¥{merchant.maxAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">支付宝</Badge>
                <Badge variant="outline">微信</Badge>
                <Badge variant="outline">银行卡</Badge>
              </div>
              <Button 
                className={`w-full mt-3 ${mode === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={() => toast.success(`已向 ${merchant.name} 发起${mode === 'buy' ? '买入' : '卖出'}请求`)}
              >
                {mode === 'buy' ? '买入' : '卖出'} {selectedCrypto}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Futures Trading Component
export function FuturesTrading() {
  const [leverage, setLeverage] = useState(10);
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [margin, setMargin] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendUp size={24} weight="duotone" className="text-purple-500" />
          合约交易
        </CardTitle>
        <CardDescription>永续合约，支持最高125倍杠杆</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <span className="text-lg">⚠️</span>
            <span className="text-sm font-medium">风险提示：合约交易风险极高，请谨慎操作</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={position === 'long' ? 'default' : 'outline'}
            onClick={() => setPosition('long')}
            className={`flex-1 ${position === 'long' ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            <TrendUp size={20} className="mr-2" />
            做多 (Long)
          </Button>
          <Button
            variant={position === 'short' ? 'default' : 'outline'}
            onClick={() => setPosition('short')}
            className={`flex-1 ${position === 'short' ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            <TrendDown size={20} className="mr-2" />
            做空 (Short)
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>杠杆倍数</Label>
            <span className="font-bold text-lg">{leverage}x</span>
          </div>
          <Input
            type="range"
            min="1"
            max="125"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1x</span>
            <span>25x</span>
            <span>50x</span>
            <span>75x</span>
            <span>100x</span>
            <span>125x</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>保证金 (USDT)</Label>
          <Input
            type="number"
            placeholder="输入保证金金额"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
          />
        </div>

        {margin && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>开仓金额</span>
              <span className="font-bold">${formatNumber(parseFloat(margin) * leverage)}</span>
            </div>
            <div className="flex justify-between">
              <span>预计强平价格</span>
              <span className="text-red-600">
                ${formatNumber(MOCK_PRICES.BTCUSDT.price * (position === 'long' ? 0.9 : 1.1))}
              </span>
            </div>
          </div>
        )}

        <Button 
          className={`w-full h-12 ${position === 'long' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          onClick={() => toast.success(`已开启 ${leverage}x ${position === 'long' ? '多' : '空'}仓`)}
        >
          <Lightning size={24} weight="bold" className="mr-2" />
          开{position === 'long' ? '多' : '空'} {leverage}x
        </Button>
      </CardContent>
    </Card>
  );
}
