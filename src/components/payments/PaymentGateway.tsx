import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  CurrencyBtc,
  QrCode,
  Plus,
  Copy,
  CheckCircle,
  Clock,
  X,
  TrendUp,
  ChartLine,
  Lightning,
  ShoppingCart,
  Link,
  ArrowRight,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatCurrency, formatTimeAgo } from '@/lib/mock-data';
import type { PaymentChannel } from '@/lib/types';

interface PaymentLink {
  id: string;
  name: string;
  amount: number;
  currency: string;
  channels: PaymentChannel[];
  status: 'active' | 'expired' | 'completed';
  views: number;
  conversions: number;
  url: string;
  createdAt: number;
  expiresAt?: number;
}

interface PaymentTransaction {
  id: string;
  linkId?: string;
  amount: number;
  currency: string;
  channel: PaymentChannel;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  customerEmail?: string;
  createdAt: number;
  completedAt?: number;
}

const MOCK_PAYMENT_LINKS: PaymentLink[] = [
  {
    id: 'link-1',
    name: 'Enterprise Plan Annual',
    amount: 999,
    currency: 'USD',
    channels: ['stripe', 'crypto'],
    status: 'active',
    views: 156,
    conversions: 12,
    url: 'https://pay.omnicore.io/link-1',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'link-2',
    name: 'API Credits Package',
    amount: 500,
    currency: 'USD',
    channels: ['crypto', 'alipay', 'wechat'],
    status: 'active',
    views: 89,
    conversions: 5,
    url: 'https://pay.omnicore.io/link-2',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'link-3',
    name: 'Consulting Service',
    amount: 2500,
    currency: 'USD',
    channels: ['stripe'],
    status: 'completed',
    views: 23,
    conversions: 1,
    url: 'https://pay.omnicore.io/link-3',
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    expiresAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
];

const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'pay-tx-1',
    linkId: 'link-1',
    amount: 999,
    currency: 'USD',
    channel: 'stripe',
    status: 'completed',
    customerEmail: 'customer1@example.com',
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    completedAt: Date.now() - 2 * 60 * 60 * 1000 + 300000,
  },
  {
    id: 'pay-tx-2',
    linkId: 'link-2',
    amount: 500,
    currency: 'USD',
    channel: 'crypto',
    status: 'completed',
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    completedAt: Date.now() - 5 * 60 * 60 * 1000 + 600000,
  },
  {
    id: 'pay-tx-3',
    linkId: 'link-1',
    amount: 999,
    currency: 'USD',
    channel: 'alipay',
    status: 'pending',
    customerEmail: 'customer3@example.com',
    createdAt: Date.now() - 30 * 60 * 1000,
  },
  {
    id: 'pay-tx-4',
    amount: 150,
    currency: 'USD',
    channel: 'crypto',
    status: 'failed',
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
  },
];

function getChannelIcon(channel: PaymentChannel) {
  switch (channel) {
    case 'crypto':
      return <CurrencyBtc size={16} weight="fill" className="text-orange-500" />;
    case 'stripe':
      return <CreditCard size={16} weight="fill" className="text-indigo-500" />;
    case 'alipay':
      return <span className="text-blue-500 text-xs font-bold">支</span>;
    case 'wechat':
      return <span className="text-green-500 text-xs font-bold">微</span>;
    case 'unionpay':
      return <span className="text-red-500 text-xs font-bold">银</span>;
    default:
      return <CreditCard size={16} />;
  }
}

function getChannelName(channel: PaymentChannel): string {
  switch (channel) {
    case 'crypto': return 'Crypto';
    case 'stripe': return 'Credit Card';
    case 'alipay': return 'Alipay';
    case 'wechat': return 'WeChat Pay';
    case 'unionpay': return 'UnionPay';
    default: return channel;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
    case 'completed':
      return <Badge variant="default" className="bg-green-100 text-green-700">{status}</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">{status}</Badge>;
    case 'expired':
    case 'failed':
      return <Badge variant="destructive">{status}</Badge>;
    case 'refunded':
      return <Badge variant="outline">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export function PaymentGateway() {
  const [links] = useState<PaymentLink[]>(MOCK_PAYMENT_LINKS);
  const [transactions] = useState<PaymentTransaction[]>(MOCK_TRANSACTIONS);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkAmount, setNewLinkAmount] = useState('');
  const [newLinkCurrency, setNewLinkCurrency] = useState('USD');

  // Calculate stats
  const totalRevenue = transactions
    .filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const pendingAmount = transactions
    .filter(tx => tx.status === 'pending')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalTransactions = transactions.length;
  const successRate = Math.round(
    (transactions.filter(tx => tx.status === 'completed').length / totalTransactions) * 100
  );

  const handleCreateLink = () => {
    if (!newLinkName || !newLinkAmount) {
      toast.error('请填写必填字段');
      return;
    }
    
    toast.success('支付链接创建成功', {
      description: '您可以分享此链接给客户进行支付'
    });
    
    setNewLinkName('');
    setNewLinkAmount('');
    setCreateDialogOpen(false);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('链接已复制到剪贴板');
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总收入</CardTitle>
            <TrendUp size={20} weight="duotone" className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">本月收入</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理</CardTitle>
            <Clock size={20} weight="duotone" className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">等待确认</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">交易数</CardTitle>
            <ChartLine size={20} weight="duotone" className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">本月交易</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
            <Lightning size={20} weight="duotone" className="text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <Progress value={successRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="links" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="links" className="gap-2">
              <Link size={16} weight="duotone" />
              支付链接
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <ShoppingCart size={16} weight="duotone" />
              交易记录
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <CreditCard size={16} weight="duotone" />
              支付设置
            </TabsTrigger>
          </TabsList>
          
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} weight="bold" />
                创建支付链接
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建支付链接</DialogTitle>
                <DialogDescription>
                  创建一个新的支付链接，分享给客户进行支付
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="linkName">链接名称 *</Label>
                  <Input
                    id="linkName"
                    placeholder="例如：产品购买"
                    value={newLinkName}
                    onChange={(e) => setNewLinkName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">金额 *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newLinkAmount}
                      onChange={(e) => setNewLinkAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">货币</Label>
                    <Select value={newLinkCurrency} onValueChange={setNewLinkCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - 美元</SelectItem>
                        <SelectItem value="EUR">EUR - 欧元</SelectItem>
                        <SelectItem value="CNY">CNY - 人民币</SelectItem>
                        <SelectItem value="USDC">USDC - 稳定币</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCreateDialogOpen(false)}>
                    取消
                  </Button>
                  <Button className="flex-1" onClick={handleCreateLink}>
                    创建链接
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Payment Links Tab */}
        <TabsContent value="links" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <Card key={link.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{link.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {formatCurrency(link.amount, link.currency)}
                      </CardDescription>
                    </div>
                    {getStatusBadge(link.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {link.channels.map((channel) => (
                      <Badge key={channel} variant="outline" className="gap-1">
                        {getChannelIcon(channel)}
                        {getChannelName(channel)}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">访问量</div>
                      <div className="font-semibold">{link.views}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">转化数</div>
                      <div className="font-semibold text-green-600">{link.conversions}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    创建于 {formatTimeAgo(link.createdAt)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => handleCopyLink(link.url)}
                    >
                      <Copy size={14} />
                      复制链接
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <QrCode size={14} />
                      二维码
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>最近交易</CardTitle>
              <CardDescription>查看所有支付交易记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        {getChannelIcon(tx.channel)}
                      </div>
                      <div>
                        <div className="font-medium">{formatCurrency(tx.amount, tx.currency)}</div>
                        <div className="text-sm text-muted-foreground">
                          {getChannelName(tx.channel)}
                          {tx.customerEmail && ` • ${tx.customerEmail}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {formatTimeAgo(tx.createdAt)}
                        </div>
                        {tx.completedAt && (
                          <div className="text-xs text-muted-foreground">
                            完成于 {formatTimeAgo(tx.completedAt)}
                          </div>
                        )}
                      </div>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={20} weight="duotone" className="text-indigo-500" />
                  信用卡支付
                </CardTitle>
                <CardDescription>
                  通过 Stripe 接受 Visa, Mastercard 等信用卡支付
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} weight="fill" className="text-green-500" />
                    <span className="font-medium">已连接</span>
                  </div>
                  <Badge variant="outline">Stripe</Badge>
                </div>
                <Button variant="outline" className="w-full">管理设置</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CurrencyBtc size={20} weight="duotone" className="text-orange-500" />
                  加密货币支付
                </CardTitle>
                <CardDescription>
                  接受 BTC, ETH, USDC 等加密货币支付
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} weight="fill" className="text-green-500" />
                    <span className="font-medium">已启用</span>
                  </div>
                  <Badge variant="outline">多链支持</Badge>
                </div>
                <Button variant="outline" className="w-full">配置钱包</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-blue-500 text-lg font-bold">支</span>
                  支付宝
                </CardTitle>
                <CardDescription>
                  面向中国用户的支付解决方案
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Clock size={18} weight="fill" className="text-yellow-500" />
                    <span className="font-medium">待配置</span>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <ArrowRight size={16} />
                  开始配置
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-green-500 text-lg font-bold">微</span>
                  微信支付
                </CardTitle>
                <CardDescription>
                  面向中国用户的移动支付解决方案
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <X size={18} weight="fill" className="text-red-500" />
                    <span className="font-medium">未启用</span>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <ArrowRight size={16} />
                  开始配置
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
