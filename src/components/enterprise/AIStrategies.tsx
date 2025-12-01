import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Robot, 
  TrendUp, 
  ChartLine, 
  Lightning,
  Play,
  Pause,
  Gear,
  ArrowsClockwise,
  Wallet,
  CheckCircle
} from '@phosphor-icons/react';
import type { AIStrategy } from '@/lib/types';
import { formatCurrency, formatTimeAgo, getRiskColor } from '@/lib/mock-data';
import { toast } from 'sonner';

interface AIStrategiesProps {
  strategies: AIStrategy[];
}

export function AIStrategies({ strategies }: AIStrategiesProps) {
  const [localStrategies, setLocalStrategies] = useState(strategies);
  
  const totalValue = localStrategies.reduce((sum, s) => sum + parseFloat(s.totalValue), 0);
  const totalProfit = localStrategies.reduce((sum, s) => sum + parseFloat(s.profit24h), 0);
  const activeStrategies = localStrategies.filter(s => s.status === 'active').length;
  const avgScore = Math.round(localStrategies.reduce((sum, s) => sum + s.aiScore, 0) / localStrategies.length);

  const handleToggleStrategy = (strategyId: string) => {
    setLocalStrategies(localStrategies.map(strategy => {
      if (strategy.id === strategyId) {
        const newStatus = strategy.status === 'active' ? 'paused' : 'active';
        toast.success(
          newStatus === 'active' ? 'Strategy activated' : 'Strategy paused',
          { description: `${strategy.name} has been ${newStatus === 'active' ? 'activated' : 'paused'}` }
        );
        return { ...strategy, status: newStatus };
      }
      return strategy;
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'yield_optimization': return <TrendUp size={16} weight="duotone" className="text-green-500" />;
      case 'risk_management': return <Lightning size={16} weight="duotone" className="text-yellow-500" />;
      case 'rebalancing': return <ArrowsClockwise size={16} weight="duotone" className="text-blue-500" />;
      case 'dca': return <Wallet size={16} weight="duotone" className="text-purple-500" />;
      default: return <ChartLine size={16} weight="duotone" className="text-gray-500" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'yield_optimization': return 'Yield Optimizer';
      case 'risk_management': return 'Risk Management';
      case 'rebalancing': return 'Auto-Rebalance';
      case 'dca': return 'DCA Strategy';
      default: return type;
    }
  };

  const getRiskBadge = (level: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700',
    };
    return <Badge className={colors[level] || 'bg-gray-100'}>{level.toUpperCase()} RISK</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Robot size={18} weight="duotone" className="text-primary" />
              AI Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{avgScore}</div>
            <Progress value={avgScore} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Average optimization score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet size={18} weight="duotone" className="text-blue-500" />
              Total Managed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all strategies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendUp size={18} weight="duotone" className="text-green-500" />
              24h Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Combined returns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightning size={18} weight="duotone" className="text-yellow-500" />
              Active Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{activeStrategies}</div>
            <p className="text-xs text-muted-foreground mt-1">of {localStrategies.length} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Strategies List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Robot size={24} weight="duotone" className="text-primary" />
                AI-Powered Strategies
              </CardTitle>
              <CardDescription>
                Automated investment strategies powered by machine learning
              </CardDescription>
            </div>
            <Button className="gap-2">
              <ChartLine size={16} weight="bold" />
              Create Strategy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {localStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`border rounded-lg p-4 space-y-4 ${
                strategy.status === 'active' ? 'bg-background' : 'bg-muted/50'
              }`}
            >
              {/* Strategy Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    strategy.status === 'active' ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    {getTypeIcon(strategy.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{strategy.name}</span>
                      <Badge variant={strategy.status === 'active' ? 'default' : 'secondary'}>
                        {strategy.status === 'active' ? (
                          <><Play size={12} weight="fill" className="mr-1" /> Active</>
                        ) : (
                          <><Pause size={12} weight="fill" className="mr-1" /> Paused</>
                        )}
                      </Badge>
                      {getRiskBadge(strategy.riskLevel)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getTypeIcon(strategy.type)}
                      <span>{getTypeName(strategy.type)}</span>
                      <span>•</span>
                      <span>AI Score: <strong className="text-primary">{strategy.aiScore}</strong></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={strategy.status === 'active'}
                    onCheckedChange={() => handleToggleStrategy(strategy.id)}
                  />
                  <Button variant="outline" size="icon">
                    <Gear size={16} />
                  </Button>
                </div>
              </div>

              {/* Strategy Stats */}
              <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-xs text-muted-foreground">Total Value</div>
                  <div className="font-semibold">{formatCurrency(parseFloat(strategy.totalValue))}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Expected APY</div>
                  <div className="font-semibold text-green-600">
                    {strategy.expectedApy > 0 ? `${strategy.expectedApy.toFixed(1)}%` : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">24h Profit</div>
                  <div className={`font-semibold ${parseFloat(strategy.profit24h) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(strategy.profit24h) >= 0 ? '+' : ''}{strategy.profit24h}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Last Executed</div>
                  <div className="font-semibold text-sm">
                    {strategy.lastExecuted ? formatTimeAgo(strategy.lastExecuted) : 'Never'}
                  </div>
                </div>
              </div>

              {/* Allocations */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Portfolio Allocation</div>
                <div className="space-y-2">
                  {strategy.allocations.map((allocation, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <CheckCircle size={12} className="text-green-500" />
                            <span className="font-medium">{allocation.protocol}</span>
                            <span className="text-muted-foreground">({allocation.asset})</span>
                          </span>
                          <span>
                            {allocation.percentage}%
                            {allocation.apy > 0 && (
                              <span className="text-green-600 ml-2">+{allocation.apy}% APY</span>
                            )}
                          </span>
                        </div>
                        <Progress value={allocation.percentage} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" className="gap-2">
                  <ArrowsClockwise size={14} weight="bold" />
                  Rebalance Now
                </Button>
                <Button size="sm" variant="outline">
                  View History
                </Button>
                <Button size="sm" variant="outline">
                  Edit Parameters
                </Button>
              </div>
            </div>
          ))}

          {localStrategies.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Robot size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
              <p>No AI strategies configured yet</p>
              <Button className="mt-4">Create Your First Strategy</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
