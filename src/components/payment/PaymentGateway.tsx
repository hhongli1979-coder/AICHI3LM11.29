/**
 * PaymentGateway Component - 收款系统
 * 
 * A comprehensive payment gateway component for creating and managing payment requests.
 * Supports multiple payment channels: crypto, Alipay, WeChat Pay, UnionPay, and credit cards.
 */

import { useState } from 'react';
import { 
  CreditCard, 
  QrCode, 
  CurrencyCircleDollar,
  Copy,
  Check,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  ArrowSquareOut
} from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { PaymentRequest, PaymentChannel } from '@/lib/types';
import { formatCurrency, formatTimeAgo } from '@/lib/mock-data';

// Payment channel configuration
const PAYMENT_CHANNELS: Record<PaymentChannel, { name: string; nameZh: string; icon: string; color: string }> = {
  crypto: { name: 'Crypto', nameZh: '加密货币', icon: '₿', color: '#F7931A' },
  stripe: { name: 'Credit Card', nameZh: '信用卡', icon: '💳', color: '#6772E5' },
  alipay: { name: 'Alipay', nameZh: '支付宝', icon: '🔵', color: '#1677FF' },
  wechat: { name: 'WeChat Pay', nameZh: '微信支付', icon: '🟢', color: '#07C160' },
  unionpay: { name: 'UnionPay', nameZh: '银联', icon: '🔴', color: '#E21836' },
};

// Currency options
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: '美元' },
  { code: 'CNY', symbol: '¥', name: '人民币' },
  { code: 'EUR', symbol: '€', name: '欧元' },
  { code: 'USDT', symbol: '₮', name: 'USDT' },
  { code: 'ETH', symbol: 'Ξ', name: '以太币' },
  { code: 'BTC', symbol: '₿', name: '比特币' },
];

interface PaymentGatewayProps {
  payments?: PaymentRequest[];
}

export function PaymentGateway({ payments: initialPayments = [] }: PaymentGatewayProps) {
  const [payments, setPayments] = useState<PaymentRequest[]>(initialPayments);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Form state for creating new payment
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'CNY',
    channel: 'alipay' as PaymentChannel,
    description: '',
    expiresInMinutes: '30',
  });

  const handleCopyLink = (paymentId: string, paymentUrl?: string) => {
    const url = paymentUrl || `https://pay.omnicore.io/${paymentId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(paymentId);
    toast.success('支付链接已复制');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreatePayment = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('请输入有效金额');
      return;
    }

    const newPayment: PaymentRequest = {
      id: `pay-${Date.now()}`,
      merchantId: 'merchant-1',
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      channel: formData.channel,
      status: 'pending',
      description: formData.description || '收款请求',
      paymentUrl: `https://pay.omnicore.io/pay-${Date.now()}`,
      qrCode: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#fff" width="100" height="100"/><text x="50" y="55" text-anchor="middle" font-size="12">QR Code</text></svg>`)}`,
      createdAt: Date.now(),
      expiresAt: Date.now() + parseInt(formData.expiresInMinutes) * 60 * 1000,
    };

    setPayments([newPayment, ...payments]);
    setIsCreateOpen(false);
    setFormData({
      amount: '',
      currency: 'CNY',
      channel: 'alipay',
      description: '',
      expiresInMinutes: '30',
    });
    toast.success('收款链接创建成功！');
  };

  const getStatusBadge = (status: PaymentRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="gap-1"><Clock size={14} /> 待支付</Badge>;
      case 'completed':
        return <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle size={14} /> 已完成</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="gap-1"><XCircle size={14} /> 失败</Badge>;
      case 'expired':
        return <Badge variant="secondary" className="gap-1"><Clock size={14} /> 已过期</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const currencyInfo = CURRENCIES.find(c => c.code === currency);
    if (currencyInfo) {
      return `${currencyInfo.symbol}${amount.toLocaleString()}`;
    }
    return formatCurrency(amount, currency);
  };

  // Calculate statistics
  const totalReceived = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const todayPayments = payments.filter(p => {
    const today = new Date();
    const paymentDate = new Date(p.createdAt);
    return paymentDate.toDateString() === today.toDateString();
  });

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">收款系统</h2>
          <p className="text-muted-foreground mt-1">创建收款链接，支持多种支付方式</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} weight="bold" />
              创建收款
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>创建收款链接</DialogTitle>
              <DialogDescription>
                填写收款信息，生成支付链接和二维码
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">金额</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">货币</Label>
                  <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择货币" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name} ({currency.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>支付方式</Label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(PAYMENT_CHANNELS).map(([key, channel]) => (
                    <Button
                      key={key}
                      type="button"
                      variant={formData.channel === key ? 'default' : 'outline'}
                      className="h-16 flex-col gap-1"
                      onClick={() => setFormData({ ...formData, channel: key as PaymentChannel })}
                    >
                      <span className="text-xl">{channel.icon}</span>
                      <span className="text-xs">{channel.nameZh}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">备注说明</Label>
                <Textarea
                  id="description"
                  placeholder="输入收款说明（可选）"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expires">有效期</Label>
                <Select value={formData.expiresInMinutes} onValueChange={(v) => setFormData({ ...formData, expiresInMinutes: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择有效期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 分钟</SelectItem>
                    <SelectItem value="30">30 分钟</SelectItem>
                    <SelectItem value="60">1 小时</SelectItem>
                    <SelectItem value="1440">24 小时</SelectItem>
                    <SelectItem value="10080">7 天</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>取消</Button>
              <Button onClick={handleCreatePayment}>创建收款链接</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总收款金额</CardTitle>
            <CurrencyCircleDollar size={20} weight="duotone" className="text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{totalReceived.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">已完成收款</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待收款</CardTitle>
            <Clock size={20} weight="duotone" className="text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments.length}</div>
            <p className="text-xs text-muted-foreground">等待支付</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日收款</CardTitle>
            <CheckCircle size={20} weight="duotone" className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayPayments.length}</div>
            <p className="text-xs text-muted-foreground">笔交易</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">支持渠道</CardTitle>
            <CreditCard size={20} weight="duotone" className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(PAYMENT_CHANNELS).length}</div>
            <p className="text-xs text-muted-foreground">支付方式</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list" className="gap-2">
            <CreditCard size={16} weight="duotone" />
            收款记录
          </TabsTrigger>
          <TabsTrigger value="channels" className="gap-2">
            <QrCode size={16} weight="duotone" />
            支付渠道
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {payments.length === 0 ? (
            <Card className="p-12 text-center">
              <CreditCard size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">暂无收款记录</h3>
              <p className="text-muted-foreground mb-4">点击"创建收款"开始接收付款</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus size={18} className="mr-2" />
                创建收款
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <Card key={payment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${PAYMENT_CHANNELS[payment.channel]?.color}20` }}
                        >
                          {PAYMENT_CHANNELS[payment.channel]?.icon}
                        </div>
                        <div>
                          <div className="font-semibold">{payment.description}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>{PAYMENT_CHANNELS[payment.channel]?.nameZh}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(payment.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatAmount(payment.amount, payment.currency)}</div>
                          {getStatusBadge(payment.status)}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(payment.id, payment.paymentUrl)}
                          >
                            {copiedId === payment.id ? <Check size={16} /> : <Copy size={16} />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(PAYMENT_CHANNELS).map(([key, channel]) => (
              <Card key={key} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${channel.color}20` }}
                    >
                      {channel.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{channel.nameZh}</CardTitle>
                      <CardDescription>{channel.name}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-green-600">已启用</Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      配置 <ArrowSquareOut size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>收款详情</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-3xl font-bold mb-2">
                  {formatAmount(selectedPayment.amount, selectedPayment.currency)}
                </div>
                {getStatusBadge(selectedPayment.status)}
              </div>
              
              <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
                <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center">
                  <QrCode size={120} weight="duotone" className="text-primary" />
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">支付方式</span>
                  <span>{PAYMENT_CHANNELS[selectedPayment.channel]?.nameZh}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">创建时间</span>
                  <span>{new Date(selectedPayment.createdAt).toLocaleString('zh-CN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">过期时间</span>
                  <span>{new Date(selectedPayment.expiresAt).toLocaleString('zh-CN')}</span>
                </div>
                {selectedPayment.description && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">备注</span>
                    <span>{selectedPayment.description}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 gap-2" 
                  onClick={() => handleCopyLink(selectedPayment.id, selectedPayment.paymentUrl)}
                >
                  {copiedId === selectedPayment.id ? <Check size={16} /> : <Copy size={16} />}
                  复制链接
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <QrCode size={16} />
                  下载二维码
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
