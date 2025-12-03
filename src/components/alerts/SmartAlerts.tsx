import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  BellRinging,
  Plus,
  Trash,
  TrendUp,
  TrendDown,
  Lightning,
  Newspaper,
  ChartBar,
  Check,
  Clock,
  X,
} from '@phosphor-icons/react';
import { generateMockSmartAlerts, formatTimeAgo } from '@/lib/mock-data';
import type { SmartAlert, AlertType, AlertStatus } from '@/lib/types';
import { toast } from 'sonner';

function getAlertTypeIcon(type: AlertType) {
  switch (type) {
    case 'price':
      return <TrendUp size={18} weight="duotone" className="text-green-500" />;
    case 'whale':
      return <Lightning size={18} weight="duotone" className="text-amber-500" />;
    case 'contract':
      return <ChartBar size={18} weight="duotone" className="text-purple-500" />;
    case 'volume':
      return <ChartBar size={18} weight="duotone" className="text-blue-500" />;
    case 'news':
      return <Newspaper size={18} weight="duotone" className="text-pink-500" />;
    default:
      return <Bell size={18} weight="duotone" />;
  }
}

function getAlertTypeLabel(type: AlertType): string {
  switch (type) {
    case 'price': return '价格提醒';
    case 'whale': return '巨鲸监控';
    case 'contract': return '合约事件';
    case 'volume': return '成交量';
    case 'news': return '新闻资讯';
    default: return type;
  }
}

function getStatusBadge(status: AlertStatus) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-700 border-green-300"><Check size={12} className="mr-1" />运行中</Badge>;
    case 'triggered':
      return <Badge className="bg-amber-100 text-amber-700 border-amber-300"><BellRinging size={12} className="mr-1" />已触发</Badge>;
    case 'expired':
      return <Badge className="bg-gray-100 text-gray-700 border-gray-300"><Clock size={12} className="mr-1" />已过期</Badge>;
    case 'disabled':
      return <Badge className="bg-red-100 text-red-700 border-red-300"><X size={12} className="mr-1" />已禁用</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getConditionText(alert: SmartAlert): string {
  const { operator, value, timeframe } = alert.condition;
  const symbol = alert.symbol || '';
  
  switch (operator) {
    case 'above':
      return `${symbol} 价格 > $${value.toLocaleString()}`;
    case 'below':
      return `${symbol} 价格 < $${value.toLocaleString()}`;
    case 'change_percent':
      return `${symbol} ${timeframe}内涨跌幅 > ${value}%`;
    case 'equals':
      return `${symbol} = $${value.toLocaleString()}`;
    default:
      return `${symbol} ${operator} ${value}`;
  }
}

interface AlertCardProps {
  alert: SmartAlert;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function AlertCard({ alert, onToggle, onDelete }: AlertCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${alert.status === 'triggered' ? 'ring-2 ring-amber-400' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted">
              {getAlertTypeIcon(alert.type)}
            </div>
            <div>
              <div className="font-medium">{alert.name}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {getConditionText(alert)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(alert.status)}
                <Badge variant="outline" className="text-xs">
                  {getAlertTypeLabel(alert.type)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Switch
              checked={alert.status === 'active'}
              onCheckedChange={() => onToggle(alert.id)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(alert.id)}
              className="text-destructive hover:text-destructive h-8 w-8 p-0"
            >
              <Trash size={14} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 pt-3 border-t text-xs text-muted-foreground">
          <span>通知: {alert.notificationChannels.join(', ')}</span>
          <span>创建于: {formatTimeAgo(alert.createdAt)}</span>
          {alert.triggeredAt && (
            <span className="text-amber-600">触发于: {formatTimeAgo(alert.triggeredAt)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface CreateAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (alert: Omit<SmartAlert, 'id' | 'createdAt' | 'lastCheckedAt'>) => void;
}

function CreateAlertDialog({ open, onOpenChange, onAdd }: CreateAlertDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'price' as AlertType,
    symbol: 'BTC',
    operator: 'above' as 'above' | 'below' | 'equals' | 'change_percent',
    value: 0,
    timeframe: '1h',
    notificationChannels: ['push'] as string[],
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.value) {
      toast.error('请填写完整信息');
      return;
    }
    
    onAdd({
      name: formData.name,
      type: formData.type,
      symbol: formData.symbol,
      condition: {
        operator: formData.operator,
        value: formData.value,
        timeframe: formData.operator === 'change_percent' ? formData.timeframe : undefined,
      },
      status: 'active',
      notificationChannels: formData.notificationChannels,
    });
    
    onOpenChange(false);
    setFormData({
      name: '',
      type: 'price',
      symbol: 'BTC',
      operator: 'above',
      value: 0,
      timeframe: '1h',
      notificationChannels: ['push'],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell size={20} weight="duotone" />
            创建智能提醒
          </DialogTitle>
          <DialogDescription>
            设置价格、巨鲸动向或市场事件提醒
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">提醒名称</Label>
            <Input
              id="name"
              placeholder="例如：BTC突破5万美元"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>提醒类型</Label>
              <Select
                value={formData.type}
                onValueChange={(value: AlertType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">价格提醒</SelectItem>
                  <SelectItem value="whale">巨鲸监控</SelectItem>
                  <SelectItem value="volume">成交量</SelectItem>
                  <SelectItem value="news">新闻资讯</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>代币</Label>
              <Select
                value={formData.symbol}
                onValueChange={(value) => setFormData({ ...formData, symbol: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BNB">BNB</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="OMNI">OMNI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>条件</Label>
              <Select
                value={formData.operator}
                onValueChange={(value: 'above' | 'below' | 'equals' | 'change_percent') => 
                  setFormData({ ...formData, operator: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">高于</SelectItem>
                  <SelectItem value="below">低于</SelectItem>
                  <SelectItem value="change_percent">涨跌幅</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>数值 {formData.operator === 'change_percent' ? '(%)' : '($)'}</Label>
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          {formData.operator === 'change_percent' && (
            <div className="space-y-2">
              <Label>时间范围</Label>
              <Select
                value={formData.timeframe}
                onValueChange={(value) => setFormData({ ...formData, timeframe: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15分钟</SelectItem>
                  <SelectItem value="1h">1小时</SelectItem>
                  <SelectItem value="4h">4小时</SelectItem>
                  <SelectItem value="24h">24小时</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Plus size={16} />
            创建提醒
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SmartAlerts() {
  const [alerts, setAlerts] = useState(generateMockSmartAlerts);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleToggle = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id
          ? { ...alert, status: alert.status === 'active' ? 'disabled' : 'active' as AlertStatus }
          : alert
      )
    );
    toast.success('提醒状态已更新');
  };

  const handleDelete = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    toast.success('提醒已删除');
  };

  const handleAdd = (alertData: Omit<SmartAlert, 'id' | 'createdAt' | 'lastCheckedAt'>) => {
    const newAlert: SmartAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: Date.now(),
      lastCheckedAt: Date.now(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    toast.success('提醒创建成功');
  };

  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const triggeredCount = alerts.filter((a) => a.status === 'triggered').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
            <BellRinging size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">智能提醒</h2>
            <p className="text-muted-foreground">
              设置价格、巨鲸和市场事件自动提醒
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus size={18} weight="bold" />
          创建提醒
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">总提醒数</div>
            <div className="text-2xl font-bold mt-1">{alerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">运行中</div>
            <div className="text-2xl font-bold mt-1 text-green-600">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">已触发</div>
            <div className="text-2xl font-bold mt-1 text-amber-600">{triggeredCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell size={20} weight="duotone" className="text-primary" />
            我的提醒
          </CardTitle>
          <CardDescription>
            管理您设置的所有智能提醒
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
              <p>暂无提醒，点击"创建提醒"添加</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </CardContent>
      </Card>

      <CreateAlertDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onAdd={handleAdd}
      />
    </div>
  );
}
