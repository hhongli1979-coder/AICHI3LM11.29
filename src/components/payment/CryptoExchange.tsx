import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowsDownUp, CurrencyDollar, Lightning } from '@phosphor-icons/react';
import { toast } from 'sonner';

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', price: 2450.00, icon: '⟠' },
  { symbol: 'BTC', name: 'Bitcoin', price: 43500.00, icon: '₿' },
  { symbol: 'USDT', name: 'Tether', price: 1.00, icon: '₮' },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, icon: '$' },
  { symbol: 'BNB', name: 'BNB', price: 315.00, icon: '◆' },
  { symbol: 'MATIC', name: 'Polygon', price: 0.85, icon: '⬡' },
];

const FIAT = [
  { symbol: 'USD', name: 'US Dollar', icon: '$' },
  { symbol: 'CNY', name: '人民币', icon: '¥' },
  { symbol: 'EUR', name: 'Euro', icon: '€' },
  { symbol: 'HKD', name: 'Hong Kong Dollar', icon: 'HK$' },
];

export function CryptoExchange() {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDT');
  const [fromAmount, setFromAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fromTokenData = TOKENS.find(t => t.symbol === fromToken);
  const toTokenData = TOKENS.find(t => t.symbol === toToken);

  const calculateOutput = () => {
    if (!fromAmount || !fromTokenData || !toTokenData) return '0.00';
    const fromValue = parseFloat(fromAmount) * fromTokenData.price;
    const toAmount = fromValue / toTokenData.price;
    return toAmount.toFixed(6);
  };

  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleExchange = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('请输入有效金额');
      return;
    }
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    
    toast.success(`兑换成功! ${fromAmount} ${fromToken} → ${calculateOutput()} ${toToken}`);
    setFromAmount('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowsDownUp size={24} weight="duotone" className="text-primary" />
          加密货币兑换
        </CardTitle>
        <CardDescription>快速兑换各种加密货币，实时汇率</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>支付 (From)</Label>
          <div className="flex gap-2">
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOKENS.map(token => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.icon} {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1"
            />
          </div>
          {fromTokenData && (
            <p className="text-xs text-muted-foreground">
              1 {fromToken} = ${fromTokenData.price.toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" size="icon" onClick={handleSwap}>
            <ArrowsDownUp size={20} />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>获得 (To)</Label>
          <div className="flex gap-2">
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOKENS.map(token => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.icon} {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={calculateOutput()}
              readOnly
              className="flex-1 bg-muted"
            />
          </div>
        </div>

        {fromAmount && parseFloat(fromAmount) > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between text-sm">
              <span>兑换汇率</span>
              <span>1 {fromToken} = {(fromTokenData!.price / toTokenData!.price).toFixed(6)} {toToken}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>手续费</span>
              <span className="text-green-600">0.3%</span>
            </div>
          </div>
        )}

        <Button onClick={handleExchange} disabled={loading} className="w-full gap-2">
          <Lightning size={20} weight="bold" />
          {loading ? '兑换中...' : '立即兑换'}
        </Button>
      </CardContent>
    </Card>
  );
}

export function FiatExchange() {
  const [cryptoToken, setCryptoToken] = useState('USDT');
  const [fiatCurrency, setFiatCurrency] = useState('CNY');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [loading, setLoading] = useState(false);

  const cryptoData = TOKENS.find(t => t.symbol === cryptoToken);
  
  const fiatRates: Record<string, number> = {
    USD: 1,
    CNY: 7.24,
    EUR: 0.92,
    HKD: 7.82,
  };

  const calculateFiat = () => {
    if (!amount || !cryptoData) return '0.00';
    const usdValue = parseFloat(amount) * cryptoData.price;
    const fiatValue = usdValue * fiatRates[fiatCurrency];
    return fiatValue.toFixed(2);
  };

  const handleTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('请输入有效金额');
      return;
    }
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    
    if (mode === 'buy') {
      toast.success(`购买成功! 获得 ${amount} ${cryptoToken}`);
    } else {
      toast.success(`出售成功! 获得 ${calculateFiat()} ${fiatCurrency}`);
    }
    setAmount('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CurrencyDollar size={24} weight="duotone" className="text-green-600" />
          法币兑换
        </CardTitle>
        <CardDescription>支持人民币、美元、欧元、港币</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button
            variant={mode === 'buy' ? 'default' : 'outline'}
            onClick={() => setMode('buy')}
            className="flex-1"
          >
            购买加密货币
          </Button>
          <Button
            variant={mode === 'sell' ? 'default' : 'outline'}
            onClick={() => setMode('sell')}
            className="flex-1"
          >
            出售加密货币
          </Button>
        </div>

        <div className="space-y-2">
          <Label>{mode === 'buy' ? '购买' : '出售'}</Label>
          <div className="flex gap-2">
            <Select value={cryptoToken} onValueChange={setCryptoToken}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOKENS.map(token => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.icon} {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{mode === 'buy' ? '支付' : '获得'}</Label>
          <div className="flex gap-2">
            <Select value={fiatCurrency} onValueChange={setFiatCurrency}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIAT.map(f => (
                  <SelectItem key={f.symbol} value={f.symbol}>
                    {f.icon} {f.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={calculateFiat()}
              readOnly
              className="flex-1 bg-muted"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>支付方式</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="h-16 flex-col">
              <span className="text-lg">💳</span>
              <span className="text-xs">银行卡</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <span className="text-lg">📱</span>
              <span className="text-xs">支付宝</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <span className="text-lg">💬</span>
              <span className="text-xs">微信支付</span>
            </Button>
          </div>
        </div>

        <Button onClick={handleTransaction} disabled={loading} className="w-full">
          {loading ? '处理中...' : mode === 'buy' ? '立即购买' : '立即出售'}
        </Button>
      </CardContent>
    </Card>
  );
}
