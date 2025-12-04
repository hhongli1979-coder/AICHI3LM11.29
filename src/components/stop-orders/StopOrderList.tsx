import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendDown, 
  TrendUp, 
  ArrowsClockwise,
  CheckCircle, 
  Clock, 
  X,
  Plus,
  Warning
} from '@phosphor-icons/react';
import type { StopOrder, MultiStopStrategy } from '@/lib/types';
import { formatTimeAgo, NETWORKS } from '@/lib/mock-data';
import { CreateStopOrderDialog } from './CreateStopOrderDialog';

interface StopOrderListProps {
  strategies: MultiStopStrategy[];
  stopOrders: StopOrder[];
}

export function StopOrderList({ strategies, stopOrders }: StopOrderListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stop-loss':
        return <TrendDown size={20} weight="fill" className="text-red-500" />;
      case 'take-profit':
        return <TrendUp size={20} weight="fill" className="text-green-500" />;
      case 'trailing-stop':
        return <ArrowsClockwise size={20} weight="fill" className="text-blue-500" />;
      default:
        return <Clock size={20} weight="fill" className="text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock size={16} weight="fill" className="text-yellow-500" />;
      case 'triggered':
        return <CheckCircle size={16} weight="fill" className="text-green-500" />;
      case 'cancelled':
      case 'expired':
        return <X size={16} weight="fill" className="text-red-500" />;
      default:
        return <Clock size={16} weight="fill" className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'triggered': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'expired': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stop-loss': return '止损单';
      case 'take-profit': return '止盈单';
      case 'trailing-stop': return '追踪止损';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'triggered': return '已触发';
      case 'cancelled': return '已取消';
      case 'expired': return '已过期';
      default: return status;
    }
  };

  const calculatePriceDistance = (order: StopOrder) => {
    const current = parseFloat(order.currentPrice);
    const trigger = parseFloat(order.triggerPrice);
    const distance = ((current - trigger) / current) * 100;
    return distance;
  };

  const activeOrders = stopOrders.filter(o => o.status === 'active');
  const triggeredOrders = stopOrders.filter(o => o.status === 'triggered');

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">活跃止损/止盈单</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{triggeredOrders.length}</div>
            <p className="text-xs text-muted-foreground">已触发订单</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{strategies.length}</div>
            <p className="text-xs text-muted-foreground">多停策略</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {strategies.filter(s => s.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">已启用策略</p>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Stop Strategies */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ArrowsClockwise size={24} weight="duotone" />
            多停策略 (Multi-Stop)
          </CardTitle>
          <Button size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <Plus size={16} weight="bold" />
            创建止损单
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategies.map((strategy) => (
              <div 
                key={strategy.id} 
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: NETWORKS[strategy.network]?.color || '#627EEA' }}
                    >
                      {strategy.token.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{strategy.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {strategy.token} • {NETWORKS[strategy.network]?.name || strategy.network}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={strategy.enabled ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-800'}
                  >
                    {strategy.enabled ? '已启用' : '已禁用'}
                  </Badge>
                </div>

                {/* Stop Orders within Strategy */}
                <div className="space-y-2 mt-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    包含 {strategy.stopOrders.length} 个止损/止盈单:
                  </div>
                  {strategy.stopOrders.map((order) => {
                    const distance = calculatePriceDistance(order);
                    const isClose = Math.abs(distance) < 10;
                    
                    return (
                      <div 
                        key={order.id} 
                        className="bg-muted/30 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {getTypeIcon(order.type)}
                          <div>
                            <div className="text-sm font-medium flex items-center gap-2">
                              {getTypeLabel(order.type)}
                              {isClose && order.status === 'active' && (
                                <Warning size={14} className="text-orange-500" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              触发价: ${order.triggerPrice} | 当前: ${order.currentPrice}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {order.amount} {strategy.token} ({order.percentage}%)
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            {getStatusIcon(order.status)}
                            <span className="text-xs text-muted-foreground">
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                  更新于 {formatTimeAgo(strategy.updatedAt)}
                </div>
              </div>
            ))}

            {strategies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                暂无多停策略，点击"创建止损单"开始设置
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Stop Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendDown size={24} weight="duotone" />
            所有止损/止盈单
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stopOrders.map((order) => {
              const distance = calculatePriceDistance(order);
              const progressValue = order.type === 'stop-loss' 
                ? Math.max(0, Math.min(100, (distance + 50) * 2))
                : Math.max(0, Math.min(100, 100 - (distance + 50) * 2));
              
              return (
                <div 
                  key={order.id} 
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(order.type)}
                      <div>
                        <div className="font-medium">{order.token}</div>
                        <div className="text-sm text-muted-foreground">
                          {NETWORKS[order.network]?.name || order.network}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">触发价格</div>
                      <div className="font-medium">${order.triggerPrice}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">当前价格</div>
                      <div className="font-medium">${order.currentPrice}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">数量</div>
                      <div className="font-medium">{order.amount} ({order.percentage}%)</div>
                    </div>
                  </div>

                  {order.status === 'active' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>距离触发</span>
                        <span>{Math.abs(distance).toFixed(2)}%</span>
                      </div>
                      <Progress value={progressValue} className="h-2" />
                    </div>
                  )}

                  {order.description && (
                    <div className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                      {order.description}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      创建于 {formatTimeAgo(order.createdAt)}
                    </span>
                    {order.status === 'active' && (
                      <Button variant="outline" size="sm" className="text-red-600">
                        取消
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {stopOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                暂无止损/止盈单
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateStopOrderDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </div>
  );
}
