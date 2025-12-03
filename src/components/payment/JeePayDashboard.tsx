import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard,
  Gear,
  Power,
  ChartBar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowClockwise,
  Eye,
  Trash,
  PencilSimple,
  Plus,
  Lightning,
  CurrencyDollar,
  Percent,
  Users,
  Receipt
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
  jeepayAPI,
  formatAmount,
  getStatusColor,
  getStatusText,
  getChannelIcon,
  type PaymentChannelConfig,
  type PaymentOrder,
  type PaymentChannel,
  type OrderStatus,
} from '@/lib/jeepay';

export function JeePayDashboard() {
  const [channels, setChannels] = useState<PaymentChannelConfig[]>([]);
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [stats, setStats] = useState(jeepayAPI.getStatistics());
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannelConfig | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState<{ channel?: PaymentChannel; status?: OrderStatus }>({});

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setChannels(jeepayAPI.getChannels());
    setOrders(jeepayAPI.getOrders(orderFilter).orders);
    setStats(jeepayAPI.getStatistics());
  };

  const handleToggleChannel = (channelId: string, enabled: boolean) => {
    const channel = jeepayAPI.toggleChannel(channelId, enabled);
    if (channel) {
      toast.success(`${channel.name} ${enabled ? '已启用' : '已禁用'}`);
      refreshData();
    }
  };

  const handleConfigChannel = (channel: PaymentChannelConfig) => {
    setSelectedChannel(channel);
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = () => {
    if (selectedChannel) {
      toast.success(`${selectedChannel.name} 配置已保存`);
      setConfigDialogOpen(false);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">JeePay 支付管理</h2>
          <p className="text-muted-foreground">第三方支付渠道配置与订单管理</p>
        </div>
        <Button onClick={refreshData} variant="outline" className="gap-2">
          <ArrowClockwise size={18} />
          刷新数据
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CreditCard size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.enabledChannels}/{stats.totalChannels}</div>
                <div className="text-xs text-muted-foreground">支付渠道</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Receipt size={24} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <div className="text-xs text-muted-foreground">总订单数</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CurrencyDollar size={24} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">¥{(stats.totalAmount / 10000).toFixed(1)}万</div>
                <div className="text-xs text-muted-foreground">总交易额</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Percent size={24} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">成功率</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Lightning size={24} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.todayOrders}</div>
                <div className="text-xs text-muted-foreground">今日订单</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                <ChartBar size={24} className="text-cyan-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">¥{stats.todayAmount.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground">今日交易额</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="channels" className="space-y-6">
        <TabsList>
          <TabsTrigger value="channels" className="gap-2">
            <CreditCard size={18} />
            支付渠道
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <Receipt size={18} />
            订单管理
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Gear size={18} />
            系统设置
          </TabsTrigger>
        </TabsList>

        {/* Payment Channels */}
        <TabsContent value="channels" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map(channel => (
              <Card key={channel.id} className={`transition-all ${channel.enabled ? 'ring-2 ring-green-500' : 'opacity-75'}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{channel.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <CardDescription>优先级: {channel.priority}</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={channel.enabled}
                      onCheckedChange={(checked) => handleToggleChannel(channel.id, checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {channel.methods.map(method => (
                      <Badge key={method} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-muted rounded">
                      <div className="text-muted-foreground">费率</div>
                      <div className="font-bold">{channel.fees.rate}%</div>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <div className="text-muted-foreground">成功率</div>
                      <div className="font-bold text-green-600">{channel.statistics.successRate}%</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div>限额: ¥{channel.limits.minAmount} - ¥{channel.limits.maxAmount.toLocaleString()}</div>
                    <div>订单数: {channel.statistics.totalOrders.toLocaleString()}</div>
                    <div>交易额: ¥{(channel.statistics.totalAmount / 10000).toFixed(1)}万</div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1"
                      onClick={() => handleConfigChannel(channel)}
                    >
                      <Gear size={16} />
                      配置
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Eye size={16} />
                      详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex gap-4 flex-wrap">
            <Select 
              value={orderFilter.channel || 'all'} 
              onValueChange={(v) => {
                setOrderFilter({ ...orderFilter, channel: v === 'all' ? undefined : v as PaymentChannel });
                setTimeout(refreshData, 0);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="选择渠道" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部渠道</SelectItem>
                <SelectItem value="alipay">支付宝</SelectItem>
                <SelectItem value="wxpay">微信支付</SelectItem>
                <SelectItem value="unionpay">云闪付</SelectItem>
                <SelectItem value="crypto">加密货币</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={orderFilter.status || 'all'} 
              onValueChange={(v) => {
                setOrderFilter({ ...orderFilter, status: v === 'all' ? undefined : v as OrderStatus });
                setTimeout(refreshData, 0);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待支付</SelectItem>
                <SelectItem value="paid">已支付</SelectItem>
                <SelectItem value="failed">支付失败</SelectItem>
                <SelectItem value="refunded">已退款</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">订单号</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">渠道</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">金额</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">商品</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">时间</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm font-mono">{order.orderNo}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="text-lg mr-2">{getChannelIcon(order.channel)}</span>
                          {order.method}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold">{formatAmount(order.amount, order.currency)}</td>
                        <td className="px-4 py-3 text-sm">{order.subject}</td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString('zh-CN')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye size={16} />
                            </Button>
                            {order.status === 'paid' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-blue-600"
                                onClick={async () => {
                                  await jeepayAPI.refund(order.orderNo);
                                  toast.success('退款成功');
                                  refreshData();
                                }}
                              >
                                <ArrowClockwise size={16} />
                              </Button>
                            )}
                            {order.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-600"
                                onClick={async () => {
                                  await jeepayAPI.cancelOrder(order.orderNo);
                                  toast.success('订单已取消');
                                  refreshData();
                                }}
                              >
                                <XCircle size={16} />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>全局设置</CardTitle>
              <CardDescription>配置支付系统的全局参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>默认货币</Label>
                  <Select defaultValue="CNY">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNY">人民币 (CNY)</SelectItem>
                      <SelectItem value="USD">美元 (USD)</SelectItem>
                      <SelectItem value="EUR">欧元 (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>订单过期时间 (分钟)</Label>
                  <Input type="number" defaultValue={30} />
                </div>

                <div className="space-y-2">
                  <Label>异步通知URL</Label>
                  <Input placeholder="https://your-domain.com/api/notify" />
                </div>

                <div className="space-y-2">
                  <Label>同步跳转URL</Label>
                  <Input placeholder="https://your-domain.com/payment/success" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">沙箱模式</div>
                  <div className="text-sm text-muted-foreground">启用后所有支付将在测试环境进行</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">自动退款</div>
                  <div className="text-sm text-muted-foreground">超时订单自动退款</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">订单通知</div>
                  <div className="text-sm text-muted-foreground">支付成功后发送通知</div>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="gap-2">
                <CheckCircle size={18} />
                保存设置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Channel Config Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedChannel?.icon}</span>
              {selectedChannel?.name} 配置
            </DialogTitle>
            <DialogDescription>
              配置支付渠道的API参数
            </DialogDescription>
          </DialogHeader>

          {selectedChannel && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>App ID</Label>
                <Input 
                  placeholder="输入App ID" 
                  defaultValue={selectedChannel.config.appId}
                />
              </div>

              <div className="space-y-2">
                <Label>商户号 (Mch ID)</Label>
                <Input 
                  placeholder="输入商户号" 
                  defaultValue={selectedChannel.config.mchId}
                />
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <Input 
                  type="password"
                  placeholder="输入API密钥" 
                  defaultValue={selectedChannel.config.apiKey}
                />
              </div>

              <div className="space-y-2">
                <Label>API Secret</Label>
                <Input 
                  type="password"
                  placeholder="输入API Secret" 
                  defaultValue={selectedChannel.config.apiSecret}
                />
              </div>

              <div className="space-y-2">
                <Label>异步通知URL</Label>
                <Input 
                  placeholder="https://..." 
                  defaultValue={selectedChannel.config.notifyUrl}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">沙箱模式</div>
                  <div className="text-sm text-muted-foreground">使用测试环境</div>
                </div>
                <Switch defaultChecked={selectedChannel.config.sandbox} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveConfig}>保存配置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
