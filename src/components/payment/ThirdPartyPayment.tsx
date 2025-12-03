import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { QrCode, Copy, Check, Link, Share, CurrencyDollar, Clock, CheckCircle } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface PaymentLink {
  id: string;
  amount: string;
  currency: string;
  description: string;
  status: 'pending' | 'paid' | 'expired';
  createdAt: number;
  link: string;
}

export function ThirdPartyPayment() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDT');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([
    {
      id: 'pay-001',
      amount: '100.00',
      currency: 'USDT',
      description: '商品订单 #12345',
      status: 'paid',
      createdAt: Date.now() - 3600000,
      link: 'https://pay.omnicore.io/p/abc123',
    },
    {
      id: 'pay-002',
      amount: '500.00',
      currency: 'USDC',
      description: '服务费用',
      status: 'pending',
      createdAt: Date.now() - 1800000,
      link: 'https://pay.omnicore.io/p/def456',
    },
  ]);

  const currencies = [
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BTC', name: 'Bitcoin' },
  ];

  const generatePaymentLink = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('请输入有效金额');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    const newLink: PaymentLink = {
      id: `pay-${Date.now()}`,
      amount,
      currency,
      description: description || '收款',
      status: 'pending',
      createdAt: Date.now(),
      link: `https://pay.omnicore.io/p/${Math.random().toString(36).slice(2, 10)}`,
    };

    setPaymentLinks([newLink, ...paymentLinks]);
    setLoading(false);
    setAmount('');
    setDescription('');
    toast.success('收款链接已生成!');
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('链接已复制!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return `${Math.floor(diff / 86400000)}天前`;
  };

  return (
    <div className="space-y-6">
      {/* Create Payment Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode size={24} weight="duotone" className="text-primary" />
            创建收款链接
          </CardTitle>
          <CardDescription>生成收款链接，支持扫码支付、链接支付</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>金额</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>币种</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c.symbol} value={c.symbol}>
                      {c.symbol} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>备注 (可选)</Label>
            <Input
              placeholder="例如：商品订单 #12345"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button onClick={generatePaymentLink} disabled={loading} className="w-full gap-2">
            <Link size={20} weight="bold" />
            {loading ? '生成中...' : '生成收款链接'}
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {paymentLinks.length > 0 && paymentLinks[0].status === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode size={24} weight="duotone" />
              扫码支付
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-white p-4 rounded-lg border-2">
              {/* Simulated QR Code */}
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 rounded flex items-center justify-center">
                <QrCode size={120} className="text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{paymentLinks[0].amount} {paymentLinks[0].currency}</p>
              <p className="text-muted-foreground">{paymentLinks[0].description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => copyLink(paymentLinks[0].link)} className="gap-2">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                复制链接
              </Button>
              <Button variant="outline" className="gap-2">
                <Share size={16} />
                分享
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrencyDollar size={24} weight="duotone" />
            收款记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentLinks.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-600' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {payment.status === 'paid' ? <CheckCircle size={24} /> :
                     payment.status === 'pending' ? <Clock size={24} /> :
                     <Clock size={24} />}
                  </div>
                  <div>
                    <p className="font-medium">{payment.amount} {payment.currency}</p>
                    <p className="text-sm text-muted-foreground">{payment.description}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(payment.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    payment.status === 'paid' ? 'default' :
                    payment.status === 'pending' ? 'secondary' : 'outline'
                  }>
                    {payment.status === 'paid' ? '已收款' :
                     payment.status === 'pending' ? '待支付' : '已过期'}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => copyLink(payment.link)}>
                    <Copy size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
