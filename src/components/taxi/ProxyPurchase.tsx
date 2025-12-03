import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, Package, Airplane, CurrencyDollar, 
  MapPin, Clock, CheckCircle, Truck, User, Plus
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface PurchaseOrder {
  id: string;
  item: string;
  store: string;
  country: string;
  price: string;
  fee: string;
  status: 'pending' | 'purchased' | 'shipping' | 'delivered';
  createdAt: string;
}

const mockOrders: PurchaseOrder[] = [
  {
    id: 'order-001',
    item: 'iPhone 15 Pro Max 256GB',
    store: 'Apple Store',
    country: '美国',
    price: '$1,199',
    fee: '¥200',
    status: 'shipping',
    createdAt: '2024-12-01',
  },
  {
    id: 'order-002',
    item: 'SK-II 神仙水 230ml',
    store: '乐天免税店',
    country: '日本',
    price: '¥1,200',
    fee: '¥80',
    status: 'purchased',
    createdAt: '2024-12-02',
  },
  {
    id: 'order-003',
    item: 'Dyson V15 吸尘器',
    store: 'Amazon',
    country: '英国',
    price: '£599',
    fee: '¥150',
    status: 'pending',
    createdAt: '2024-12-03',
  },
];

export function ProxyPurchase() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders);
  const [newOrder, setNewOrder] = useState({
    item: '',
    link: '',
    country: '美国',
  });

  const createOrder = () => {
    if (!newOrder.item) {
      toast.error('请输入商品名称');
      return;
    }

    const order: PurchaseOrder = {
      id: `order-${Date.now()}`,
      item: newOrder.item,
      store: '待确认',
      country: newOrder.country,
      price: '待报价',
      fee: '待报价',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrders([order, ...orders]);
    setNewOrder({ item: '', link: '', country: '美国' });
    toast.success('代购订单已提交！我们会尽快为您报价');
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('代购订单已提交，我们会尽快为您报价');
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const getStatusBadge = (status: PurchaseOrder['status']) => {
    const config = {
      pending: { label: '待处理', variant: 'secondary' as const },
      purchased: { label: '已购买', variant: 'default' as const },
      shipping: { label: '运输中', variant: 'outline' as const },
      delivered: { label: '已送达', variant: 'default' as const },
    };
    return config[status];
  };

  const getStatusIcon = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'purchased': return <ShoppingCart size={16} />;
      case 'shipping': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingCart size={32} weight="duotone" className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">全球代购</h2>
              <p className="text-muted-foreground">美国 · 日本 · 韩国 · 欧洲 · 全球购</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="new" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new" className="gap-2">
            <Plus size={18} />
            发起代购
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <Package size={18} />
            我的订单
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={24} weight="duotone" />
                发起代购
              </CardTitle>
              <CardDescription>告诉我们您想购买的商品，我们帮您全球采购</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">商品名称</label>
                <Input
                  placeholder="例如：iPhone 15 Pro Max"
                  value={newOrder.item}
                  onChange={(e) => setNewOrder({ ...newOrder, item: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">商品链接 (可选)</label>
                <Input
                  placeholder="粘贴商品链接"
                  value={newOrder.link}
                  onChange={(e) => setNewOrder({ ...newOrder, link: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">代购国家/地区</label>
                <div className="flex flex-wrap gap-2">
                  {['美国', '日本', '韩国', '英国', '德国', '澳洲'].map((country) => (
                    <Badge
                      key={country}
                      variant={newOrder.country === country ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setNewOrder({ ...newOrder, country })}
                    >
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Popular Items */}
              <div className="space-y-2">
                <label className="text-sm font-medium">热门代购</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'iPhone 15 Pro', flag: '🇺🇸' },
                    { name: 'SK-II 神仙水', flag: '🇯🇵' },
                    { name: 'Dyson 吹风机', flag: '🇬🇧' },
                    { name: '雪花秀套装', flag: '🇰🇷' },
                  ].map((item) => (
                    <Button
                      key={item.name}
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => setNewOrder({ ...newOrder, item: item.name })}
                    >
                      <span>{item.flag}</span>
                      <span className="truncate">{item.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={createOrder} className="w-full gap-2" size="lg">
                <Airplane size={20} />
                提交代购需求
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                提交后我们会在24小时内为您报价，支持加密货币支付
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={24} weight="duotone" />
                我的代购订单
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusConfig = getStatusBadge(order.status);
                  return (
                    <div key={order.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold">{order.item}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.store} · {order.country}
                          </p>
                        </div>
                        <Badge variant={statusConfig.variant} className="gap-1">
                          {getStatusIcon(order.status)}
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-4">
                          <span>商品价格: <strong>{order.price}</strong></span>
                          <span>代购费: <strong>{order.fee}</strong></span>
                        </div>
                        <span className="text-muted-foreground">{order.createdAt}</span>
                      </div>

                      {order.status === 'shipping' && (
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Truck size={16} className="text-primary" />
                            <span>包裹已从美国发出，预计5-7天到达</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          查看详情
                        </Button>
                        {order.status === 'pending' && (
                          <Button size="sm" className="flex-1 gap-1">
                            <CurrencyDollar size={16} />
                            去支付
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
