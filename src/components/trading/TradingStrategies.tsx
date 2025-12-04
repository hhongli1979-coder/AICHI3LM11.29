import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
  Robot,
  Plus,
  Trash,
  PencilSimple,
  Play,
  Pause,
  ChartLine,
  TrendUp,
  TrendDown,
  Lightning,
  Target,
  ArrowsClockwise,
  Gear,
} from '@phosphor-icons/react';
import { generateMockTradingStrategies, formatCurrency, formatTimeAgo } from '@/lib/mock-data';
import type { TradingStrategy, TradingStrategyType } from '@/lib/types';
import { toast } from 'sonner';

function getStrategyTypeIcon(type: TradingStrategyType) {
  switch (type) {
    case 'grid':
      return <ChartLine size={18} weight="duotone" className="text-blue-500" />;
    case 'dca':
      return <ArrowsClockwise size={18} weight="duotone" className="text-green-500" />;
    case 'momentum':
      return <TrendUp size={18} weight="duotone" className="text-purple-500" />;
    case 'arbitrage':
      return <Lightning size={18} weight="duotone" className="text-amber-500" />;
    case 'rebalance':
      return <Target size={18} weight="duotone" className="text-pink-500" />;
    default:
      return <Robot size={18} weight="duotone" />;
  }
}

function getStrategyTypeLabel(type: TradingStrategyType): string {
  switch (type) {
    case 'grid': return '网格交易';
    case 'dca': return '定投策略';
    case 'momentum': return '动量交易';
    case 'arbitrage': return '套利策略';
    case 'rebalance': return '再平衡';
    default: return type;
  }
}

function getStrategyTypeBadgeColor(type: TradingStrategyType): string {
  switch (type) {
    case 'grid': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'dca': return 'bg-green-100 text-green-700 border-green-300';
    case 'momentum': return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'arbitrage': return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'rebalance': return 'bg-pink-100 text-pink-700 border-pink-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

interface StrategyCardProps {
  strategy: TradingStrategy;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (strategy: TradingStrategy) => void;
}

function StrategyCard({ strategy, onToggle, onDelete, onEdit }: StrategyCardProps) {
  const isProfitable = strategy.performance.totalPnl >= 0;
  
  return (
    <Card className={`hover:shadow-lg transition-shadow ${strategy.enabled ? 'ring-2 ring-green-400/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getStrategyTypeBadgeColor(strategy.type)}`}>
              {getStrategyTypeIcon(strategy.type)}
            </div>
            <div>
              <div className="font-medium flex items-center gap-2">
                {strategy.name}
                {strategy.enabled && (
                  <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                    <Play size={10} className="mr-1" />运行中
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {strategy.config.pair} • {formatCurrency(strategy.config.investmentAmount)}
              </div>
              <Badge className={`mt-2 ${getStrategyTypeBadgeColor(strategy.type)}`}>
                {getStrategyTypeLabel(strategy.type)}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Switch
              checked={strategy.enabled}
              onCheckedChange={() => onToggle(strategy.id)}
            />
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(strategy)}
                className="h-8 w-8 p-0"
              >
                <PencilSimple size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(strategy.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash size={14} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">策略表现</div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted">
              <div className="text-xs text-muted-foreground">总交易</div>
              <div className="font-bold">{strategy.performance.totalTrades}</div>
            </div>
            <div className="p-2 rounded-lg bg-muted">
              <div className="text-xs text-muted-foreground">胜率</div>
              <div className="font-bold text-green-600">{strategy.performance.winRate}%</div>
            </div>
            <div className="p-2 rounded-lg bg-muted">
              <div className="text-xs text-muted-foreground">总盈亏</div>
              <div className={`font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                {isProfitable ? '+' : ''}{formatCurrency(strategy.performance.totalPnl)}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-muted">
              <div className="text-xs text-muted-foreground">运行天数</div>
              <div className="font-bold">{strategy.performance.runningDays}</div>
            </div>
          </div>
          
          {strategy.performance.winRate > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>胜率</span>
                <span>{strategy.performance.winRate}%</span>
              </div>
              <Progress value={strategy.performance.winRate} className="h-2" />
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground flex justify-between">
          <span>创建于: {formatTimeAgo(strategy.createdAt)}</span>
          {strategy.lastExecutedAt && (
            <span>最后执行: {formatTimeAgo(strategy.lastExecutedAt)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface CreateStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (strategy: Omit<TradingStrategy, 'id' | 'createdAt' | 'performance'>) => void;
  editingStrategy?: TradingStrategy | null;
}

function CreateStrategyDialog({ open, onOpenChange, onAdd, editingStrategy }: CreateStrategyDialogProps) {
  const [formData, setFormData] = useState({
    name: editingStrategy?.name || '',
    type: editingStrategy?.type || 'grid' as TradingStrategyType,
    pair: editingStrategy?.config.pair || 'ETH/USDC',
    investmentAmount: editingStrategy?.config.investmentAmount || 1000,
    maxPositionSize: editingStrategy?.config.maxPositionSize || 5000,
    stopLoss: editingStrategy?.config.stopLoss || 15,
    takeProfit: editingStrategy?.config.takeProfit || 30,
    gridLevels: editingStrategy?.config.gridLevels || 10,
    intervalHours: editingStrategy?.config.intervalHours || 168,
    rebalanceThreshold: editingStrategy?.config.rebalanceThreshold || 5,
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.pair || !formData.investmentAmount) {
      toast.error('请填写完整信息');
      return;
    }
    
    onAdd({
      name: formData.name,
      type: formData.type,
      enabled: false,
      config: {
        pair: formData.pair,
        investmentAmount: formData.investmentAmount,
        maxPositionSize: formData.maxPositionSize,
        stopLoss: formData.type !== 'dca' ? formData.stopLoss : undefined,
        takeProfit: formData.type !== 'dca' ? formData.takeProfit : undefined,
        gridLevels: formData.type === 'grid' ? formData.gridLevels : undefined,
        intervalHours: formData.type === 'dca' ? formData.intervalHours : undefined,
        rebalanceThreshold: formData.type === 'rebalance' ? formData.rebalanceThreshold : undefined,
      },
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Robot size={20} weight="duotone" />
            {editingStrategy ? '编辑策略' : '创建自动交易策略'}
          </DialogTitle>
          <DialogDescription>
            配置自动交易策略，让AI帮您执行交易
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">策略名称</Label>
            <Input
              id="name"
              placeholder="例如：ETH网格交易"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>策略类型</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TradingStrategyType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">网格交易</SelectItem>
                  <SelectItem value="dca">定投策略</SelectItem>
                  <SelectItem value="momentum">动量交易</SelectItem>
                  <SelectItem value="arbitrage">套利策略</SelectItem>
                  <SelectItem value="rebalance">再平衡</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>交易对</Label>
              <Select
                value={formData.pair}
                onValueChange={(value) => setFormData({ ...formData, pair: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC/USDC">BTC/USDC</SelectItem>
                  <SelectItem value="ETH/USDC">ETH/USDC</SelectItem>
                  <SelectItem value="SOL/USDC">SOL/USDC</SelectItem>
                  <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>投资金额 ($)</Label>
              <Input
                type="number"
                value={formData.investmentAmount}
                onChange={(e) => setFormData({ ...formData, investmentAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>最大持仓 ($)</Label>
              <Input
                type="number"
                value={formData.maxPositionSize}
                onChange={(e) => setFormData({ ...formData, maxPositionSize: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          {formData.type === 'grid' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>网格层数</Label>
                <Input
                  type="number"
                  value={formData.gridLevels}
                  onChange={(e) => setFormData({ ...formData, gridLevels: parseInt(e.target.value) || 10 })}
                />
              </div>
              <div className="space-y-2">
                <Label>止损 (%)</Label>
                <Input
                  type="number"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData({ ...formData, stopLoss: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>止盈 (%)</Label>
                <Input
                  type="number"
                  value={formData.takeProfit}
                  onChange={(e) => setFormData({ ...formData, takeProfit: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}
          
          {formData.type === 'dca' && (
            <div className="space-y-2">
              <Label>定投周期 (小时)</Label>
              <Select
                value={formData.intervalHours.toString()}
                onValueChange={(value) => setFormData({ ...formData, intervalHours: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">每天</SelectItem>
                  <SelectItem value="168">每周</SelectItem>
                  <SelectItem value="336">每两周</SelectItem>
                  <SelectItem value="720">每月</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {formData.type === 'rebalance' && (
            <div className="space-y-2">
              <Label>再平衡阈值 (%)</Label>
              <Input
                type="number"
                value={formData.rebalanceThreshold}
                onChange={(e) => setFormData({ ...formData, rebalanceThreshold: parseFloat(e.target.value) || 5 })}
              />
              <p className="text-xs text-muted-foreground">
                当资产配置偏离目标超过此比例时触发再平衡
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Plus size={16} />
            {editingStrategy ? '保存更改' : '创建策略'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TradingStrategies() {
  const [strategies, setStrategies] = useState(generateMockTradingStrategies);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<TradingStrategy | null>(null);

  const handleToggle = (id: string) => {
    const strategy = strategies.find(s => s.id === id);
    const willBeEnabled = !strategy?.enabled;
    setStrategies((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, enabled: !s.enabled }
          : s
      )
    );
    toast.success(willBeEnabled ? '策略已启动' : '策略已暂停');
  };

  const handleDelete = (id: string) => {
    setStrategies((prev) => prev.filter((strategy) => strategy.id !== id));
    toast.success('策略已删除');
  };

  const handleEdit = (strategy: TradingStrategy) => {
    setEditingStrategy(strategy);
    setCreateDialogOpen(true);
  };

  const handleAdd = (strategyData: Omit<TradingStrategy, 'id' | 'createdAt' | 'performance'>) => {
    const newStrategy: TradingStrategy = {
      ...strategyData,
      id: `strategy-${Date.now()}`,
      createdAt: Date.now(),
      performance: {
        totalTrades: 0,
        winRate: 0,
        totalPnl: 0,
        averagePnl: 0,
        runningDays: 0,
      },
    };
    setStrategies((prev) => [newStrategy, ...prev]);
    toast.success('策略创建成功');
  };

  const activeCount = strategies.filter((s) => s.enabled).length;
  const totalPnl = strategies.reduce((sum, s) => sum + s.performance.totalPnl, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Robot size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">自动交易策略</h2>
            <p className="text-muted-foreground">
              配置和管理AI驱动的自动交易策略
            </p>
          </div>
        </div>
        <Button onClick={() => {
          setEditingStrategy(null);
          setCreateDialogOpen(true);
        }} className="gap-2">
          <Plus size={18} weight="bold" />
          创建策略
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">总策略数</div>
            <div className="text-2xl font-bold mt-1">{strategies.length}</div>
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
            <div className="text-sm text-muted-foreground">总盈亏</div>
            <div className={`text-2xl font-bold mt-1 ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gear size={20} weight="duotone" className="text-primary" />
            我的策略
          </CardTitle>
          <CardDescription>
            管理您配置的所有自动交易策略
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {strategies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Robot size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
              <p>暂无策略，点击"创建策略"开始</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {strategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateStrategyDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditingStrategy(null);
        }}
        onAdd={handleAdd}
        editingStrategy={editingStrategy}
      />
    </div>
  );
}
