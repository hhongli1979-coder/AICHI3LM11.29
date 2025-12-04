import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Clock,
  Plus,
  Play,
  Pause,
  Trash,
  TrendUp,
  TrendDown,
  ArrowsClockwise,
  CurrencyDollar,
  Coins,
  ChartLine,
  CalendarBlank,
  Lightning,
  Sparkle,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatCurrency, generateMockDCAStrategies } from '@/lib/mock-data';
import type { DCAStrategy } from '@/lib/types';

interface StrategyFormData {
  name: string;
  sourceToken: string;
  targetToken: string;
  amountPerInterval: string;
  intervalHours: number;
}

const TOKENS = [
  { value: 'USDC', label: 'USDC', type: 'stable' },
  { value: 'USDT', label: 'USDT', type: 'stable' },
  { value: 'DAI', label: 'DAI', type: 'stable' },
  { value: 'ETH', label: 'ETH', type: 'crypto' },
  { value: 'WBTC', label: 'WBTC', type: 'crypto' },
  { value: 'WETH', label: 'WETH', type: 'crypto' },
  { value: 'LINK', label: 'LINK', type: 'crypto' },
  { value: 'UNI', label: 'UNI', type: 'crypto' },
];

const INTERVALS = [
  { value: 1, label: 'Every Hour' },
  { value: 24, label: 'Daily' },
  { value: 168, label: 'Weekly' },
  { value: 336, label: 'Bi-weekly' },
  { value: 720, label: 'Monthly' },
];

function formatTimeRemaining(nextExecution: number): string {
  const diff = nextExecution - Date.now();
  if (diff <= 0) return 'Due now';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  return `${hours}h`;
}

function getPerformance(invested: string, received: string, currentPrice: number): { percentage: number; value: number } {
  const investedNum = parseFloat(invested);
  const receivedNum = parseFloat(received);
  const currentValue = receivedNum * currentPrice;
  const percentage = ((currentValue - investedNum) / investedNum) * 100;
  return { percentage, value: currentValue - investedNum };
}

function StrategyStats({ strategies }: { strategies: DCAStrategy[] }) {
  const activeStrategies = strategies.filter(s => s.enabled).length;
  const totalInvested = strategies.reduce((sum, s) => sum + parseFloat(s.totalInvested), 0);
  const monthlyCommitment = strategies
    .filter(s => s.enabled)
    .reduce((sum, s) => {
      const monthlyMultiplier = 720 / s.intervalHours;
      return sum + (parseFloat(s.amountPerInterval) * monthlyMultiplier);
    }, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Lightning size={18} weight="duotone" />
            Active Strategies
          </div>
          <div className="text-2xl font-bold">{activeStrategies}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <CurrencyDollar size={18} weight="duotone" />
            Total Invested
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <CalendarBlank size={18} weight="duotone" />
            Monthly Commitment
          </div>
          <div className="text-2xl font-bold">{formatCurrency(monthlyCommitment)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <TrendUp size={18} weight="duotone" />
            Est. Annual
          </div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(monthlyCommitment * 12)}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateStrategyDialog({ onCreateStrategy }: { onCreateStrategy: (data: StrategyFormData) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<StrategyFormData>({
    name: '',
    sourceToken: 'USDC',
    targetToken: 'ETH',
    amountPerInterval: '',
    intervalHours: 168,
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.amountPerInterval) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.sourceToken === formData.targetToken) {
      toast.error('Source and target tokens must be different');
      return;
    }
    onCreateStrategy(formData);
    setOpen(false);
    setFormData({
      name: '',
      sourceToken: 'USDC',
      targetToken: 'ETH',
      amountPerInterval: '',
      intervalHours: 168,
    });
    toast.success('DCA Strategy created successfully!');
  };

  const interval = INTERVALS.find(i => i.value === formData.intervalHours);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={18} weight="bold" />
          New Strategy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create DCA Strategy</DialogTitle>
          <DialogDescription>
            Set up automated dollar-cost averaging for your portfolio
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Strategy Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Weekly ETH Accumulation"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From (Source)</Label>
              <Select
                value={formData.sourceToken}
                onValueChange={(v) => setFormData({ ...formData, sourceToken: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TOKENS.filter(t => t.type === 'stable').map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>To (Target)</Label>
              <Select
                value={formData.targetToken}
                onValueChange={(v) => setFormData({ ...formData, targetToken: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TOKENS.filter(t => t.type === 'crypto').map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount per Interval ({formData.sourceToken}) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={formData.amountPerInterval}
              onChange={(e) => setFormData({ ...formData, amountPerInterval: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <Label>Investment Frequency</Label>
            <div className="grid grid-cols-5 gap-2">
              {INTERVALS.map((int) => (
                <button
                  key={int.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, intervalHours: int.value })}
                  className={`p-2 rounded-lg border text-center transition-all text-xs ${
                    formData.intervalHours === int.value
                      ? 'border-primary bg-primary/10 font-medium'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {int.label}
                </button>
              ))}
            </div>
          </div>

          {formData.amountPerInterval && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkle size={16} weight="fill" className="text-amber-500" />
                Strategy Summary
              </div>
              <div className="text-sm text-muted-foreground">
                Invest <span className="font-medium text-foreground">{formData.amountPerInterval} {formData.sourceToken}</span>
                {' '}{interval?.label.toLowerCase()} to accumulate <span className="font-medium text-foreground">{formData.targetToken}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Est. monthly: {formatCurrency(parseFloat(formData.amountPerInterval) * (720 / formData.intervalHours))}
                {' '}• Est. annual: {formatCurrency(parseFloat(formData.amountPerInterval) * (720 / formData.intervalHours) * 12)}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              Create Strategy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StrategyCard({ 
  strategy, 
  onToggle, 
  onDelete 
}: { 
  strategy: DCAStrategy; 
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  // Mock current prices
  const mockPrices: Record<string, number> = {
    ETH: 2770,
    WBTC: 43500,
    LINK: 15,
    UNI: 6,
    WETH: 2770,
  };

  const currentPrice = mockPrices[strategy.targetToken] || 1;
  const performance = getPerformance(strategy.totalInvested, strategy.totalReceived, currentPrice);
  const isPositive = performance.percentage >= 0;
  const interval = INTERVALS.find(i => i.value === strategy.intervalHours);
  const progressPercent = strategy.lastExecutedAt 
    ? ((Date.now() - strategy.lastExecutedAt) / (strategy.intervalHours * 60 * 60 * 1000)) * 100
    : 0;

  return (
    <Card className={`transition-all ${!strategy.enabled ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {strategy.name}
              {strategy.enabled ? (
                <Badge variant="default" className="bg-green-100 text-green-700 border-green-300">Active</Badge>
              ) : (
                <Badge variant="secondary">Paused</Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              {strategy.sourceToken}
              <ArrowsClockwise size={14} />
              {strategy.targetToken}
              <span className="mx-1">•</span>
              {interval?.label}
            </CardDescription>
          </div>
          <Switch
            checked={strategy.enabled}
            onCheckedChange={() => onToggle(strategy.id)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Per Interval</div>
            <div className="font-bold">{strategy.amountPerInterval} {strategy.sourceToken}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Total Invested</div>
            <div className="font-bold">{formatCurrency(parseFloat(strategy.totalInvested))}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Accumulated</div>
            <div className="font-bold">{parseFloat(strategy.totalReceived).toFixed(4)} {strategy.targetToken}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Performance</div>
            <div className={`font-bold flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendUp size={16} weight="bold" /> : <TrendDown size={16} weight="bold" />}
              {isPositive ? '+' : ''}{performance.percentage.toFixed(2)}%
            </div>
          </div>
        </div>

        {strategy.enabled && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Next execution</span>
              <span className="font-medium flex items-center gap-1">
                <Clock size={12} />
                {formatTimeRemaining(strategy.nextExecutionAt)}
              </span>
            </div>
            <Progress value={Math.min(progressPercent, 100)} className="h-1.5" />
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1"
            onClick={() => onToggle(strategy.id)}
          >
            {strategy.enabled ? <Pause size={14} /> : <Play size={14} />}
            {strategy.enabled ? 'Pause' : 'Resume'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-destructive hover:text-destructive"
            onClick={() => {
              onDelete(strategy.id);
              toast.success('Strategy deleted');
            }}
          >
            <Trash size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function DCAStrategyManager() {
  const [strategies, setStrategies] = useState<DCAStrategy[]>(generateMockDCAStrategies);

  const handleCreateStrategy = (data: StrategyFormData) => {
    const newStrategy: DCAStrategy = {
      id: `dca-${Date.now()}`,
      name: data.name,
      sourceToken: data.sourceToken,
      targetToken: data.targetToken,
      amountPerInterval: data.amountPerInterval,
      intervalHours: data.intervalHours,
      nextExecutionAt: Date.now() + data.intervalHours * 60 * 60 * 1000,
      totalInvested: '0',
      totalReceived: '0',
      enabled: true,
    };
    setStrategies([newStrategy, ...strategies]);
  };

  const handleToggleStrategy = (id: string) => {
    setStrategies(strategies.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const handleDeleteStrategy = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">DCA Strategies</h2>
          <p className="text-muted-foreground">Automated dollar-cost averaging for your portfolio</p>
        </div>
        <CreateStrategyDialog onCreateStrategy={handleCreateStrategy} />
      </div>

      <StrategyStats strategies={strategies} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onToggle={handleToggleStrategy}
            onDelete={handleDeleteStrategy}
          />
        ))}

        {strategies.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-12 text-center">
              <ChartLine size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No DCA Strategies</h3>
              <p className="text-muted-foreground mb-4">
                Create your first dollar-cost averaging strategy to automate your investments
              </p>
              <CreateStrategyDialog onCreateStrategy={handleCreateStrategy} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* DCA Benefits Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkle size={24} weight="duotone" className="text-primary" />
            Why Dollar-Cost Averaging?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendUp size={20} weight="duotone" className="text-green-600" />
                <span className="font-medium">Reduce Volatility Risk</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Spread your purchases over time to avoid buying at peaks
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Lightning size={20} weight="duotone" className="text-amber-500" />
                <span className="font-medium">Automated Execution</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Set it and forget it — no emotional trading decisions
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Coins size={20} weight="duotone" className="text-primary" />
                <span className="font-medium">Build Wealth Gradually</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Consistent investing creates long-term wealth
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
