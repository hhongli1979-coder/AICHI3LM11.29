import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  QrCode, 
  Link as LinkIcon, 
  CheckCircle, 
  Clock, 
  X,
  Copy,
  Plus,
  ChartLine,
  ArrowDown,
  CurrencyCircleDollar
} from '@phosphor-icons/react';
import type { PaymentRequest } from '@/lib/types';
import { formatCurrency, formatTimeAgo, getStatusColor } from '@/lib/mock-data';
import { CreatePaymentDialog } from './CreatePaymentDialog';
import { toast } from 'sonner';

interface PaymentGatewayProps {
  payments: PaymentRequest[];
}

export function PaymentGateway({ payments }: PaymentGatewayProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // 计算统计数据
  const completedPayments = payments.filter(p => p.status === 'completed');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalReceived = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} weight="fill" className="text-green-600" />;
      case 'pending':
        return <Clock size={16} weight="fill" className="text-yellow-600 animate-pulse" />;
      case 'failed':
      case 'expired':
        return <X size={16} weight="fill" className="text-red-600" />;
      default:
        return <Clock size={16} weight="fill" className="text-gray-600" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'crypto':
        return '₿';
      case 'alipay':
        return '支';
      case 'wechat':
        return '微';
      case 'unionpay':
        return '银';
      case 'stripe':
        return '💳';
      default:
        return '💰';
    }
  };

  const getChannelName = (channel: string) => {
    switch (channel) {
      case 'crypto':
        return '加密货币';
      case 'alipay':
        return '支付宝';
      case 'wechat':
        return '微信支付';
      case 'unionpay':
        return '银联';
      case 'stripe':
        return '信用卡';
      default:
        return channel;
    }
  };

  const handleCopyLink = (paymentUrl?: string) => {
    if (paymentUrl) {
      navigator.clipboard.writeText(paymentUrl);
      toast.success('链接已复制到剪贴板');
    }
  };

  return (
    <div className="space-y-6">
      {/* 头部统计 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowDown size={20} weight="bold" className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已收款总额</p>
                <p className="text-2xl font-bold">{formatCurrency(totalReceived)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock size={20} weight="bold" className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">待收款金额</p>
                <p className="text-2xl font-bold">{formatCurrency(pendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <LinkIcon size={20} weight="bold" className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">收款链接数</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <ChartLine size={20} weight="bold" className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">成功率</p>
                <p className="text-2xl font-bold">
                  {payments.length > 0 
                    ? `${((completedPayments.length / payments.length) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主体内容 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={24} weight="duotone" className="text-primary" />
              收款系统
            </CardTitle>
            <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
              <Plus size={16} weight="bold" />
              创建收款链接
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="gap-2">
                <CurrencyCircleDollar size={16} weight="duotone" />
                收款记录
              </TabsTrigger>
              <TabsTrigger value="links" className="gap-2">
                <LinkIcon size={16} weight="duotone" />
                收款链接
              </TabsTrigger>
              <TabsTrigger value="qrcode" className="gap-2">
                <QrCode size={16} weight="duotone" />
                收款码
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                            {getChannelIcon(payment.channel)}
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium">{payment.description}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{getChannelName(payment.channel)}</Badge>
                              <span>•</span>
                              <span>{formatTimeAgo(payment.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-bold text-lg">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(payment.status)} flex items-center gap-1`}
                          >
                            {getStatusIcon(payment.status)}
                            {payment.status === 'completed' ? '已收款' : 
                             payment.status === 'pending' ? '待支付' :
                             payment.status === 'failed' ? '失败' : '已过期'}
                          </Badge>
                        </div>
                      </div>

                      {payment.status === 'pending' && payment.paymentUrl && (
                        <div className="flex gap-2 mt-3 pt-3 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleCopyLink(payment.paymentUrl)}
                          >
                            <Copy size={14} />
                            复制链接
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                          >
                            <QrCode size={14} />
                            显示二维码
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard size={48} weight="duotone" className="mx-auto mb-4 text-primary/40" />
                  <p className="font-medium">暂无收款记录</p>
                  <p className="text-sm mt-1">创建收款链接开始接收付款</p>
                  <Button className="mt-4 gap-2" onClick={() => setCreateDialogOpen(true)}>
                    <Plus size={16} weight="bold" />
                    创建收款链接
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="links" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* 支持的支付渠道 */}
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">支持的支付渠道</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <span className="text-xl">₿</span>
                        <div>
                          <div className="font-medium text-sm">加密货币</div>
                          <div className="text-xs text-muted-foreground">BTC, ETH, USDT</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <span className="text-xl text-blue-500">支</span>
                        <div>
                          <div className="font-medium text-sm">支付宝</div>
                          <div className="text-xs text-muted-foreground">扫码/H5支付</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <span className="text-xl text-green-500">微</span>
                        <div>
                          <div className="font-medium text-sm">微信支付</div>
                          <div className="text-xs text-muted-foreground">扫码/JSAPI</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <span className="text-xl text-red-500">银</span>
                        <div>
                          <div className="font-medium text-sm">银联支付</div>
                          <div className="text-xs text-muted-foreground">云闪付/刷卡</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 快速创建 */}
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">快速创建收款链接</h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        <CurrencyCircleDollar size={18} className="text-blue-500" />
                        创建固定金额收款
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        <LinkIcon size={18} className="text-green-500" />
                        创建自定义金额收款
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        <QrCode size={18} className="text-purple-500" />
                        生成永久收款码
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="qrcode" className="space-y-4 mt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* 永久收款码示例 */}
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                      <QrCode size={120} weight="duotone" className="text-primary/30" />
                    </div>
                    <h3 className="font-semibold">主账户收款码</h3>
                    <p className="text-sm text-muted-foreground mt-1">支持微信/支付宝扫码</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Copy size={14} />
                        复制
                      </Button>
                      <Button size="sm" className="flex-1 gap-1">
                        下载
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 添加新收款码 */}
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Plus size={32} weight="bold" className="text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold">创建新收款码</h3>
                    <p className="text-sm text-muted-foreground mt-1">为不同场景创建专属收款码</p>
                    <Button className="mt-4 gap-2" onClick={() => setCreateDialogOpen(true)}>
                      <Plus size={16} weight="bold" />
                      创建收款码
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreatePaymentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
