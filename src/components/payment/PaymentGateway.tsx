import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Plus, 
  Copy, 
  QrCode, 
  Link as LinkIcon, 
  CheckCircle, 
  Clock,
  XCircle,
  CurrencyBtc,
  CurrencyDollar,
  Wallet,
  ChartLine,
  Export,
  CaretRight
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatCurrency, formatTimeAgo, generateMockPayments } from '@/lib/mock-data';
import type { PaymentRequest, PaymentChannel } from '@/lib/types';

// Configuration - In production, these would come from environment variables or API
const PAYMENT_BASE_URL = 'https://payment.omnicore.io';

interface PaymentGatewayProps {
  payments?: PaymentRequest[];
  merchantId?: string;
}

/**
 * Generate a unique payment ID using crypto.randomUUID
 */
function generatePaymentId(): string {
  return `pay-${crypto.randomUUID()}`;
}

export function PaymentGateway({ payments: initialPayments, merchantId = 'merchant-default' }: PaymentGatewayProps) {
  const [payments, setPayments] = useState<PaymentRequest[]>(initialPayments || generateMockPayments());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  
  // Form state for creating payment link
  const [formAmount, setFormAmount] = useState('');
  const [formCurrency, setFormCurrency] = useState('USD');
  const [formChannel, setFormChannel] = useState<PaymentChannel>('crypto');
  const [formDescription, setFormDescription] = useState('');

  const getChannelIcon = (channel: PaymentChannel) => {
    switch (channel) {
      case 'crypto': return <CurrencyBtc size={16} weight="fill" className="text-orange-500" />;
      case 'stripe': return <CreditCard size={16} weight="fill" className="text-purple-600" />;
      case 'alipay': return <Wallet size={16} weight="fill" className="text-blue-500" />;
      case 'wechat': return <Wallet size={16} weight="fill" className="text-green-500" />;
      case 'unionpay': return <CreditCard size={16} weight="fill" className="text-red-600" />;
      default: return <CurrencyDollar size={16} weight="fill" />;
    }
  };

  const getChannelName = (channel: PaymentChannel) => {
    switch (channel) {
      case 'crypto': return '加密货币';
      case 'stripe': return '信用卡/借记卡';
      case 'alipay': return '支付宝';
      case 'wechat': return '微信支付';
      case 'unionpay': return '银联支付';
      default: return channel;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} weight="fill" className="text-green-600" />;
      case 'pending': return <Clock size={16} weight="fill" className="text-yellow-600" />;
      case 'failed':
      case 'expired': return <XCircle size={16} weight="fill" className="text-red-600" />;
      default: return null;
    }
  };

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed':
      case 'expired': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'pending': return '待支付';
      case 'failed': return '失败';
      case 'expired': return '已过期';
      default: return status;
    }
  };

  const handleCreatePaymentLink = () => {
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0) {
      toast.error('请输入有效的金额');
      return;
    }

    if (!formDescription) {
      toast.error('请输入付款描述');
      return;
    }

    const paymentId = generatePaymentId();
    const paymentUrl = `${PAYMENT_BASE_URL}/${paymentId}`;
    
    const newPayment: PaymentRequest = {
      id: paymentId,
      merchantId,
      amount,
      currency: formCurrency,
      channel: formChannel,
      status: 'pending',
      description: formDescription,
      paymentUrl,
      // QR code placeholder - in production, use a QR code library to generate actual QR codes
      qrCode: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff"/><text x="50" y="50" text-anchor="middle" font-size="8" fill="#000">QR: ${paymentId.slice(-8)}</text></svg>`)}`,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
    };

    setPayments([newPayment, ...payments]);
    setCreateDialogOpen(false);
    setFormAmount('');
    setFormDescription('');
    
    toast.success('支付链接已创建', {
      description: `金额: ${formatCurrency(amount, formCurrency)}`
    });
  };

  const handleCopyLink = (paymentUrl?: string) => {
    if (paymentUrl) {
      navigator.clipboard.writeText(paymentUrl);
      toast.success('链接已复制到剪贴板');
    }
  };

  const handleShowQR = (payment: PaymentRequest) => {
    setSelectedPayment(payment);
    setQrDialogOpen(true);
  };

  // Calculate statistics
  const totalCompleted = payments.filter(p => p.status === 'completed').length;
  const totalPending = payments.filter(p => p.status === 'pending').length;
  const totalAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const conversionRate = payments.length > 0 ? (totalCompleted / payments.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">收款系统</h2>
          <p className="text-muted-foreground mt-1">
            创建和管理支付链接，支持多渠道收款
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} weight="bold" />
              创建收款链接
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>创建收款链接</DialogTitle>
              <DialogDescription>
                生成支付链接和二维码，支持多种支付渠道
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">金额</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">货币</Label>
                  <Select value={formCurrency} onValueChange={setFormCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - 美元</SelectItem>
                      <SelectItem value="CNY">CNY - 人民币</SelectItem>
                      <SelectItem value="EUR">EUR - 欧元</SelectItem>
                      <SelectItem value="USDT">USDT - 泰达币</SelectItem>
                      <SelectItem value="ETH">ETH - 以太坊</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">支付渠道</Label>
                <Select value={formChannel} onValueChange={(v) => setFormChannel(v as PaymentChannel)}>
                  <SelectTrigger id="channel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crypto">
                      <div className="flex items-center gap-2">
                        <CurrencyBtc size={16} weight="fill" className="text-orange-500" />
                        加密货币
                      </div>
                    </SelectItem>
                    <SelectItem value="stripe">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} weight="fill" className="text-purple-600" />
                        信用卡/借记卡
                      </div>
                    </SelectItem>
                    <SelectItem value="alipay">
                      <div className="flex items-center gap-2">
                        <Wallet size={16} weight="fill" className="text-blue-500" />
                        支付宝
                      </div>
                    </SelectItem>
                    <SelectItem value="wechat">
                      <div className="flex items-center gap-2">
                        <Wallet size={16} weight="fill" className="text-green-500" />
                        微信支付
                      </div>
                    </SelectItem>
                    <SelectItem value="unionpay">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} weight="fill" className="text-red-600" />
                        银联支付
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">付款描述</Label>
                <Input
                  id="description"
                  placeholder="商品或服务描述"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button className="flex-1 gap-2" onClick={handleCreatePaymentLink}>
                  <LinkIcon size={16} weight="bold" />
                  生成链接
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CurrencyDollar size={24} weight="duotone" className="text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">总收款额</div>
                <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <CheckCircle size={24} weight="duotone" className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">已完成</div>
                <div className="text-2xl font-bold">{totalCompleted}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Clock size={24} weight="duotone" className="text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">待支付</div>
                <div className="text-2xl font-bold">{totalPending}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <ChartLine size={24} weight="duotone" className="text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">转化率</div>
                <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Channels Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={20} weight="duotone" />
            支持的支付渠道
          </CardTitle>
          <CardDescription>
            一站式多渠道收款，覆盖全球主流支付方式
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <CurrencyBtc size={32} weight="duotone" className="mx-auto text-orange-500 mb-2" />
              <div className="font-medium">加密货币</div>
              <div className="text-xs text-muted-foreground mt-1">BTC, ETH, USDT 等</div>
            </div>
            <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <CreditCard size={32} weight="duotone" className="mx-auto text-purple-600 mb-2" />
              <div className="font-medium">信用卡</div>
              <div className="text-xs text-muted-foreground mt-1">Visa, Mastercard</div>
            </div>
            <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 mx-auto bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold mb-2">
                支
              </div>
              <div className="font-medium">支付宝</div>
              <div className="text-xs text-muted-foreground mt-1">Alipay</div>
            </div>
            <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 mx-auto bg-green-500 rounded-lg flex items-center justify-center text-white font-bold mb-2">
                微
              </div>
              <div className="font-medium">微信支付</div>
              <div className="text-xs text-muted-foreground mt-1">WeChat Pay</div>
            </div>
            <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-8 h-8 mx-auto bg-red-600 rounded-lg flex items-center justify-center text-white font-bold mb-2">
                银
              </div>
              <div className="font-medium">银联</div>
              <div className="text-xs text-muted-foreground mt-1">UnionPay</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Links Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>收款记录</CardTitle>
              <CardDescription>查看和管理所有收款链接</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Export size={16} />
              导出
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>描述</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>渠道</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      暂无收款记录，点击"创建收款链接"开始收款
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-medium">{payment.description}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {payment.paymentUrl}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getChannelIcon(payment.channel)}
                          <span className="text-sm">{getChannelName(payment.channel)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(payment.status)} className="gap-1.5">
                          {getStatusIcon(payment.status)}
                          {getStatusText(payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimeAgo(payment.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyLink(payment.paymentUrl)}
                          >
                            <Copy size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleShowQR(payment)}
                          >
                            <QrCode size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <CaretRight size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>收款二维码</DialogTitle>
            <DialogDescription>
              {selectedPayment?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 pt-4">
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                  <QrCode size={100} weight="duotone" className="text-muted-foreground" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-2">
                  {getChannelIcon(selectedPayment.channel)}
                  {getChannelName(selectedPayment.channel)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => handleCopyLink(selectedPayment.paymentUrl)}
                >
                  <Copy size={16} />
                  复制链接
                </Button>
                <Button className="flex-1 gap-2">
                  <Export size={16} />
                  下载二维码
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Setup Guide */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">快速上手指南</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
            <div>
              <div className="font-medium">创建收款链接</div>
              <div className="text-muted-foreground">设置金额、选择支付渠道，生成专属收款链接</div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
            <div>
              <div className="font-medium">分享给客户</div>
              <div className="text-muted-foreground">通过链接或二维码分享给付款方</div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
            <div>
              <div className="font-medium">实时收款</div>
              <div className="text-muted-foreground">客户支付后，资金即时到账，系统自动通知</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
