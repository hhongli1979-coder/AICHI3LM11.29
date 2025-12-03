import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard,
  CheckCircle,
  XCircle,
  Gear,
  Lightning,
  Globe,
  Lock,
  Eye,
  ArrowRight,
  AppleLogo,
  GoogleLogo,
  PaypalLogo,
  ShieldCheck,
  Receipt,
  Wallet,
  QrCode
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface PaymentGateway {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  enabled: boolean;
  configured: boolean;
  fees: string;
  currencies: string[];
  regions: string[];
}

export function GlobalPaymentGateways() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      icon: <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold">S</div>,
      color: '#635BFF',
      enabled: true,
      configured: true,
      fees: '2.9% + $0.30',
      currencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
      regions: ['全球', '美国', '欧洲', '亚太'],
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <PaypalLogo size={32} weight="fill" className="text-blue-600" />,
      color: '#003087',
      enabled: true,
      configured: true,
      fees: '2.9% + $0.30',
      currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      regions: ['全球', '美国', '欧洲'],
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      icon: <AppleLogo size={32} weight="fill" />,
      color: '#000000',
      enabled: true,
      configured: false,
      fees: '0%',
      currencies: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'],
      regions: ['全球'],
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: <GoogleLogo size={32} weight="fill" className="text-blue-500" />,
      color: '#4285F4',
      enabled: false,
      configured: false,
      fees: '0%',
      currencies: ['USD', 'EUR', 'GBP', 'INR'],
      regions: ['全球', '印度'],
    },
    {
      id: 'wise',
      name: 'Wise (TransferWise)',
      icon: <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold">W</div>,
      color: '#00B9A8',
      enabled: false,
      configured: false,
      fees: '0.5% - 2%',
      currencies: ['USD', 'EUR', 'GBP', 'CNY', 'JPY'],
      regions: ['全球'],
    },
    {
      id: 'klarna',
      name: 'Klarna',
      icon: <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center text-white font-bold">K</div>,
      color: '#FFB3C7',
      enabled: false,
      configured: false,
      fees: '3.29% + $0.30',
      currencies: ['USD', 'EUR', 'GBP', 'SEK'],
      regions: ['美国', '欧洲'],
    },
    {
      id: 'affirm',
      name: 'Affirm',
      icon: <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center text-white font-bold">A</div>,
      color: '#0F4B6F',
      enabled: false,
      configured: false,
      fees: '5.99% + $0.30',
      currencies: ['USD', 'CAD'],
      regions: ['美国', '加拿大'],
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center text-white font-bold">R</div>,
      color: '#2D68C4',
      enabled: false,
      configured: false,
      fees: '2% + ₹3',
      currencies: ['INR', 'USD'],
      regions: ['印度'],
    },
  ]);

  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [configMode, setConfigMode] = useState(false);

  const toggleGateway = (id: string) => {
    setGateways(prev => prev.map(g => 
      g.id === id ? { ...g, enabled: !g.enabled } : g
    ));
    const gateway = gateways.find(g => g.id === id);
    toast.success(`${gateway?.name} ${!gateway?.enabled ? '已启用' : '已禁用'}`);
  };

  const enabledCount = gateways.filter(g => g.enabled).length;
  const configuredCount = gateways.filter(g => g.configured).length;

  return (
    <div className="space-y-6">
      {/* 统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{enabledCount}</div>
                <div className="text-xs text-muted-foreground">已启用</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Gear size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{configuredCount}</div>
                <div className="text-xs text-muted-foreground">已配置</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Globe size={24} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-xs text-muted-foreground">支持国家</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <CreditCard size={24} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">20+</div>
                <div className="text-xs text-muted-foreground">货币类型</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 网关列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={24} weight="duotone" className="text-blue-500" />
            全球支付网关
          </CardTitle>
          <CardDescription>一键接入全球主流支付方式</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {gateways.map(gateway => (
              <div 
                key={gateway.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                  gateway.enabled ? 'border-green-200 bg-green-50/50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {gateway.icon}
                    <div>
                      <div className="font-medium">{gateway.name}</div>
                      <div className="text-xs text-muted-foreground">费率: {gateway.fees}</div>
                    </div>
                  </div>
                  <Switch
                    checked={gateway.enabled}
                    onCheckedChange={() => toggleGateway(gateway.id)}
                  />
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {gateway.currencies.slice(0, 4).map(cur => (
                    <Badge key={cur} variant="outline" className="text-xs">{cur}</Badge>
                  ))}
                  {gateway.currencies.length > 4 && (
                    <Badge variant="outline" className="text-xs">+{gateway.currencies.length - 4}</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe size={14} />
                    {gateway.regions.join(' / ')}
                  </div>
                  <div className="flex gap-1">
                    {gateway.configured ? (
                      <Badge variant="default" className="text-xs bg-green-600">已配置</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">未配置</Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => {
                        setSelectedGateway(gateway.id);
                        setConfigMode(true);
                      }}
                    >
                      <Gear size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 配置面板 */}
      {configMode && selectedGateway && (
        <Card>
          <CardHeader>
            <CardTitle>配置 {gateways.find(g => g.id === selectedGateway)?.name}</CardTitle>
            <CardDescription>填写API密钥完成支付网关配置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>API Key (公钥)</Label>
                <Input placeholder="pk_live_xxxxx" />
              </div>
              <div className="space-y-2">
                <Label>API Secret (私钥)</Label>
                <div className="relative">
                  <Input type="password" placeholder="sk_live_xxxxx" />
                  <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                    <Eye size={16} />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input placeholder="https://your-domain.com/webhooks/stripe" />
              </div>
              <div className="space-y-2">
                <Label>Webhook Secret</Label>
                <Input type="password" placeholder="whsec_xxxxx" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">沙箱/测试模式</div>
                <div className="text-sm text-muted-foreground">启用后使用测试环境</div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => {
                toast.success('配置已保存');
                setConfigMode(false);
              }}>
                <CheckCircle size={18} className="mr-2" />
                保存配置
              </Button>
              <Button variant="outline" onClick={() => setConfigMode(false)}>
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 安全提示 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ShieldCheck size={24} className="text-green-600" />
            </div>
            <div>
              <div className="font-medium">安全保障</div>
              <div className="text-sm text-muted-foreground">
                所有支付数据采用 AES-256 加密存储，符合 PCI-DSS 标准
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 收款统计仪表盘
export function PaymentAnalytics() {
  const dailyData = [
    { date: '12/01', amount: 15680, orders: 45 },
    { date: '12/02', amount: 23450, orders: 62 },
    { date: '12/03', amount: 18900, orders: 51 },
    { date: '12/04', amount: 31200, orders: 78 },
    { date: '12/05', amount: 27800, orders: 71 },
    { date: '12/06', amount: 35600, orders: 89 },
    { date: '12/07', amount: 42100, orders: 102 },
  ];

  const channelStats = [
    { channel: '支付宝', amount: 125680, percent: 35, color: '#1677FF' },
    { channel: '微信支付', amount: 98450, percent: 28, color: '#07C160' },
    { channel: '加密货币', amount: 78900, percent: 22, color: '#F7931A' },
    { channel: 'Stripe', amount: 35200, percent: 10, color: '#635BFF' },
    { channel: 'PayPal', amount: 17800, percent: 5, color: '#003087' },
  ];

  const maxAmount = Math.max(...dailyData.map(d => d.amount));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt size={24} weight="duotone" className="text-green-500" />
          收款数据分析
        </CardTitle>
        <CardDescription>实时监控收款情况</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 总览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-sm text-green-700">今日收款</div>
            <div className="text-2xl font-bold text-green-800">¥42,100</div>
            <div className="text-xs text-green-600">+15.2% vs 昨日</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-sm text-blue-700">本周收款</div>
            <div className="text-2xl font-bold text-blue-800">¥194,730</div>
            <div className="text-xs text-blue-600">+8.5% vs 上周</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-sm text-purple-700">本月收款</div>
            <div className="text-2xl font-bold text-purple-800">¥856,030</div>
            <div className="text-xs text-purple-600">+22.3% vs 上月</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="text-sm text-orange-700">订单数</div>
            <div className="text-2xl font-bold text-orange-800">498</div>
            <div className="text-xs text-orange-600">本周累计</div>
          </div>
        </div>

        {/* 简易柱状图 */}
        <div className="space-y-2">
          <Label>每日收款趋势</Label>
          <div className="flex items-end gap-2 h-40 p-4 bg-muted rounded-lg">
            {dailyData.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                  style={{ height: `${(day.amount / maxAmount) * 100}%` }}
                  title={`¥${day.amount.toLocaleString()}`}
                />
                <span className="text-xs text-muted-foreground">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 渠道分布 */}
        <div className="space-y-2">
          <Label>渠道分布</Label>
          <div className="space-y-3">
            {channelStats.map(stat => (
              <div key={stat.channel} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{stat.channel}</span>
                  <span className="font-medium">¥{stat.amount.toLocaleString()} ({stat.percent}%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${stat.percent}%`,
                      backgroundColor: stat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 快速收款组件
export function QuickCollect() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CNY');
  const [method, setMethod] = useState('qrcode');
  const [showQR, setShowQR] = useState(false);

  const quickAmounts = [10, 50, 100, 200, 500, 1000];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightning size={24} weight="duotone" className="text-yellow-500" />
          快速收款
        </CardTitle>
        <CardDescription>一键生成收款码</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map(amt => (
            <Button
              key={amt}
              variant={amount === amt.toString() ? 'default' : 'outline'}
              onClick={() => setAmount(amt.toString())}
            >
              ¥{amt}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="自定义金额"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1"
          />
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CNY">¥ CNY</SelectItem>
              <SelectItem value="USD">$ USD</SelectItem>
              <SelectItem value="USDT">₮ USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'qrcode', label: '扫码', icon: '📱' },
            { id: 'alipay', label: '支付宝', icon: '💙' },
            { id: 'wechat', label: '微信', icon: '💚' },
            { id: 'crypto', label: '加密', icon: '🪙' },
          ].map(m => (
            <Button
              key={m.id}
              variant={method === m.id ? 'default' : 'outline'}
              onClick={() => setMethod(m.id)}
              className="flex-col h-16 gap-1"
            >
              <span className="text-xl">{m.icon}</span>
              <span className="text-xs">{m.label}</span>
            </Button>
          ))}
        </div>

        <Button 
          className="w-full h-12 gap-2"
          onClick={() => {
            if (!amount) {
              toast.error('请输入金额');
              return;
            }
            setShowQR(true);
            toast.success(`已生成 ${amount} ${currency} 收款码`);
          }}
        >
          <QrCode size={24} />
          生成收款码
        </Button>

        {showQR && (
          <div className="p-6 bg-white rounded-lg text-center space-y-3">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=omnicore://pay?amount=${amount}&currency=${currency}`}
              alt="收款码"
              className="mx-auto"
            />
            <div className="text-2xl font-bold">
              {currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : ''}
              {parseFloat(amount).toLocaleString()} {currency}
            </div>
            <Button variant="outline" onClick={() => setShowQR(false)}>
              关闭
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
