import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChartPie,
  TrendUp,
  TrendDown,
  ShieldCheck,
  ChartLine,
  Target,
  Warning,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import { generateMockPortfolioAnalytics, formatCurrency, formatLargeNumber } from '@/lib/mock-data';
import type { PortfolioAnalytics, AllocationItem, RiskMetrics } from '@/lib/types';

function getRiskLevelColor(value: number, type: 'var' | 'volatility' | 'sharpe' | 'drawdown'): string {
  switch (type) {
    case 'sharpe':
      if (value >= 2) return 'text-green-600';
      if (value >= 1) return 'text-yellow-600';
      return 'text-red-600';
    case 'volatility':
      if (value <= 20) return 'text-green-600';
      if (value <= 40) return 'text-yellow-600';
      return 'text-red-600';
    case 'drawdown':
      if (value >= -10) return 'text-green-600';
      if (value >= -25) return 'text-yellow-600';
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
}

interface AllocationChartProps {
  allocation: AllocationItem[];
}

function AllocationChart({ allocation }: AllocationChartProps) {
  return (
    <div className="space-y-4">
      {allocation.map((item) => (
        <div key={item.symbol} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium">{item.asset}</span>
              <span className="text-muted-foreground">({item.symbol})</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{formatCurrency(item.value)}</span>
              <Badge variant="outline">{item.percentage.toFixed(1)}%</Badge>
            </div>
          </div>
          <Progress 
            value={item.percentage} 
            className="h-2"
            style={{ 
              '--progress-background': item.color 
            } as React.CSSProperties}
          />
        </div>
      ))}
    </div>
  );
}

interface RiskMetricsPanelProps {
  metrics: RiskMetrics;
}

function RiskMetricsPanel({ metrics }: RiskMetricsPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Warning size={16} weight="duotone" />
          VaR (95%)
        </div>
        <div className="text-xl font-bold text-red-600">
          -{formatCurrency(metrics.var95)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          每日最大损失风险
        </div>
      </div>
      
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Warning size={16} weight="duotone" />
          VaR (99%)
        </div>
        <div className="text-xl font-bold text-red-600">
          -{formatCurrency(metrics.var99)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          极端情况下损失
        </div>
      </div>
      
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Target size={16} weight="duotone" />
          夏普比率
        </div>
        <div className={`text-xl font-bold ${getRiskLevelColor(metrics.sharpeRatio, 'sharpe')}`}>
          {metrics.sharpeRatio.toFixed(2)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          风险调整后收益
        </div>
      </div>
      
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <ChartLine size={16} weight="duotone" />
          波动率
        </div>
        <div className={`text-xl font-bold ${getRiskLevelColor(metrics.volatility, 'volatility')}`}>
          {metrics.volatility.toFixed(1)}%
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          年化波动率
        </div>
      </div>
      
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <TrendDown size={16} weight="duotone" />
          最大回撤
        </div>
        <div className={`text-xl font-bold ${getRiskLevelColor(metrics.maxDrawdown, 'drawdown')}`}>
          {metrics.maxDrawdown.toFixed(1)}%
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          历史最大跌幅
        </div>
      </div>
      
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <ArrowsClockwise size={16} weight="duotone" />
          Beta系数
        </div>
        <div className="text-xl font-bold">
          {metrics.beta.toFixed(2)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          市场敏感度
        </div>
      </div>
    </div>
  );
}

interface PortfolioStatsProps {
  analytics: PortfolioAnalytics;
}

function PortfolioStats({ analytics }: PortfolioStatsProps) {
  const isProfitable = analytics.totalPnl >= 0;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">总资产价值</div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(analytics.totalValue)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">总成本</div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(analytics.totalCost)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">总盈亏</div>
          <div className={`text-2xl font-bold mt-1 flex items-center gap-2 ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {isProfitable ? <TrendUp size={20} weight="bold" /> : <TrendDown size={20} weight="bold" />}
            {isProfitable ? '+' : ''}{formatCurrency(analytics.totalPnl)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">收益率</div>
          <div className={`text-2xl font-bold mt-1 ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {isProfitable ? '+' : ''}{analytics.pnlPercent.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PortfolioAnalyticsPanel() {
  const analytics = generateMockPortfolioAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
            <ChartPie size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">投资组合分析</h2>
            <p className="text-muted-foreground">
              资产配置、收益追踪和风险评估
            </p>
          </div>
        </div>
      </div>

      <PortfolioStats analytics={analytics} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ChartPie size={20} weight="duotone" className="text-primary" />
              资产配置
            </CardTitle>
            <CardDescription>
              各资产在投资组合中的比例分布
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AllocationChart allocation={analytics.allocation} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck size={20} weight="duotone" className="text-amber-500" />
              风险指标
            </CardTitle>
            <CardDescription>
              投资组合的风险分析和评估
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RiskMetricsPanel metrics={analytics.riskMetrics} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendUp size={20} weight="duotone" className="text-green-500" />
            收益表现
          </CardTitle>
          <CardDescription>
            过去90天投资组合价值变化
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-lg">
            <div className="text-center">
              <ChartLine size={48} weight="duotone" className="mx-auto mb-2 opacity-50" />
              <p>收益曲线图表</p>
              <p className="text-sm">90天收益: +{analytics.pnlPercent.toFixed(2)}%</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-3 rounded-lg bg-muted text-center">
              <div className="text-sm text-muted-foreground">7日收益</div>
              <div className="text-lg font-bold text-green-600">+5.23%</div>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <div className="text-sm text-muted-foreground">30日收益</div>
              <div className="text-lg font-bold text-green-600">+12.45%</div>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <div className="text-sm text-muted-foreground">BTC相关性</div>
              <div className="text-lg font-bold">{analytics.riskMetrics.correlationToBtc.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
