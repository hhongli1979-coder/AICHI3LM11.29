import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ChartLine, 
  ChartBar, 
  ChartPie, 
  TrendUp, 
  TrendDown,
  Wallet,
  ArrowsLeftRight,
  CurrencyCircleDollar,
  Clock,
  Lightning,
  Target,
  Medal,
  Globe,
  Users,
  CalendarBlank,
  Export
} from '@phosphor-icons/react';
import { formatCurrency, formatLargeNumber } from '@/lib/mock-data';

interface PortfolioMetric {
  label: string;
  value: number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: string;
}

interface AssetAllocation {
  asset: string;
  value: number;
  percentage: number;
  color: string;
  change24h: number;
}

interface NetworkDistribution {
  network: string;
  value: number;
  percentage: number;
  color: string;
  icon: string;
}

interface PerformanceData {
  period: string;
  pnl: number;
  pnlPercentage: number;
  fees: number;
  transactions: number;
}

// Mock data
const PORTFOLIO_METRICS: PortfolioMetric[] = [
  {
    label: 'Total Portfolio Value',
    value: 2456789.45,
    change: 5.67,
    changeLabel: '24h',
    icon: <Wallet size={24} weight="duotone" />,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Unrealized P&L',
    value: 345678.90,
    change: 12.34,
    changeLabel: 'All time',
    icon: <TrendUp size={24} weight="duotone" />,
    color: 'bg-green-100 text-green-600',
  },
  {
    label: 'Total Fees Saved',
    value: 12456.78,
    change: 8.92,
    changeLabel: 'This month',
    icon: <Lightning size={24} weight="duotone" />,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    label: 'Active Positions',
    value: 24,
    change: 3,
    changeLabel: 'New this week',
    icon: <Target size={24} weight="duotone" />,
    color: 'bg-orange-100 text-orange-600',
  },
];

const ASSET_ALLOCATION: AssetAllocation[] = [
  { asset: 'Ethereum (ETH)', value: 985234.56, percentage: 40.1, color: '#627EEA', change24h: 3.45 },
  { asset: 'USDC', value: 614222.78, percentage: 25.0, color: '#2775CA', change24h: 0.01 },
  { asset: 'Bitcoin (WBTC)', value: 491357.89, percentage: 20.0, color: '#F7931A', change24h: 2.12 },
  { asset: 'OMNI Token', value: 245678.90, percentage: 10.0, color: '#8B5CF6', change24h: 8.67 },
  { asset: 'Others', value: 120295.32, percentage: 4.9, color: '#6B7280', change24h: -1.23 },
];

const NETWORK_DISTRIBUTION: NetworkDistribution[] = [
  { network: 'Ethereum', value: 1478567.89, percentage: 60.2, color: '#627EEA', icon: '⟠' },
  { network: 'Polygon', value: 491357.89, percentage: 20.0, color: '#8247E5', icon: '⬡' },
  { network: 'Arbitrum', value: 294814.74, percentage: 12.0, color: '#28A0F0', icon: '◭' },
  { network: 'Optimism', value: 122407.36, percentage: 5.0, color: '#FF0420', icon: '◉' },
  { network: 'BSC', value: 69641.57, percentage: 2.8, color: '#F3BA2F', icon: '◆' },
];

const PERFORMANCE_DATA: PerformanceData[] = [
  { period: 'Today', pnl: 12456.78, pnlPercentage: 0.51, fees: 234.56, transactions: 12 },
  { period: 'This Week', pnl: 45678.90, pnlPercentage: 1.89, fees: 1234.56, transactions: 45 },
  { period: 'This Month', pnl: 156789.12, pnlPercentage: 6.82, fees: 4567.89, transactions: 178 },
  { period: 'This Year', pnl: 345678.90, pnlPercentage: 16.38, fees: 23456.78, transactions: 2145 },
  { period: 'All Time', pnl: 567890.12, pnlPercentage: 30.06, fees: 45678.90, transactions: 5678 },
];

const TOP_PERFORMERS = [
  { asset: 'OMNI', gain: 156.78, percentage: 45.6, period: '30d' },
  { asset: 'ETH', gain: 45678.90, percentage: 23.4, period: '30d' },
  { asset: 'SOL', gain: 12345.67, percentage: 18.9, period: '30d' },
];

const RECENT_ACTIVITY = [
  { type: 'swap', from: 'USDC', to: 'ETH', amount: 5000, time: Date.now() - 2 * 60 * 60 * 1000 },
  { type: 'stake', asset: 'OMNI', amount: 1000, apy: 8.5, time: Date.now() - 5 * 60 * 60 * 1000 },
  { type: 'deposit', asset: 'USDC', amount: 25000, time: Date.now() - 12 * 60 * 60 * 1000 },
  { type: 'claim', asset: 'OMNI', amount: 42.5, time: Date.now() - 24 * 60 * 60 * 1000 },
];

export function SmartAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Smart Analytics</h2>
          <p className="text-muted-foreground">AI-powered insights for your portfolio</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <CalendarBlank size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Export size={16} weight="bold" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PORTFOLIO_METRICS.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">
                    {metric.label.includes('Positions') 
                      ? metric.value 
                      : formatCurrency(metric.value)}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    {metric.change > 0 ? (
                      <TrendUp size={14} weight="bold" className="text-green-600" />
                    ) : (
                      <TrendDown size={14} weight="bold" className="text-red-600" />
                    )}
                    <span className={metric.change > 0 ? 'text-green-600' : 'text-red-600'}>
                      {metric.change > 0 ? '+' : ''}{metric.label.includes('Positions') ? metric.change : `${metric.change}%`}
                    </span>
                    <span className="text-muted-foreground">{metric.changeLabel}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Asset Allocation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ChartPie size={20} weight="duotone" className="text-primary" />
                  Asset Allocation
                </CardTitle>
                <CardDescription>Portfolio distribution by asset type</CardDescription>
              </div>
              <Badge variant="outline">5 Assets</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Visual allocation bar */}
              <div className="flex h-4 rounded-full overflow-hidden">
                {ASSET_ALLOCATION.map((asset, idx) => (
                  <div
                    key={idx}
                    style={{ 
                      width: `${asset.percentage}%`, 
                      backgroundColor: asset.color 
                    }}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </div>
              
              {/* Asset list */}
              <div className="space-y-3 mt-6">
                {ASSET_ALLOCATION.map((asset, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: asset.color }}
                      />
                      <div>
                        <div className="font-medium">{asset.asset}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.percentage.toFixed(1)}% of portfolio
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(asset.value)}</div>
                      <div className={`text-sm ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}% 24h
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers & Quick Stats */}
        <div className="space-y-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal size={20} weight="duotone" className="text-yellow-500" />
                Top Performers
              </CardTitle>
              <CardDescription>Best performing assets this period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {TOP_PERFORMERS.map((performer, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-transparent border border-green-100">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 p-0 justify-center">
                      {idx + 1}
                    </Badge>
                    <span className="font-medium">{performer.asset}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+{performer.percentage}%</div>
                    <div className="text-xs text-muted-foreground">{performer.period}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Network Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={20} weight="duotone" className="text-primary" />
                Network Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {NETWORK_DISTRIBUTION.map((network, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span style={{ color: network.color }}>{network.icon}</span>
                      <span>{network.network}</span>
                    </div>
                    <span className="font-medium">{network.percentage}%</span>
                  </div>
                  <Progress 
                    value={network.percentage} 
                    className="h-2"
                    style={{ '--progress-color': network.color } as React.CSSProperties}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar size={20} weight="duotone" className="text-primary" />
            Performance Analysis
          </CardTitle>
          <CardDescription>Track your portfolio performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pnl">P&L Analysis</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-5">
                {PERFORMANCE_DATA.map((data, idx) => (
                  <Card key={idx} className={idx === 2 ? 'border-primary border-2' : ''}>
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground mb-1">{data.period}</div>
                      <div className={`text-xl font-bold ${data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.pnl >= 0 ? '+' : ''}{formatCurrency(data.pnl)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {data.pnlPercentage >= 0 ? (
                          <TrendUp size={12} weight="bold" className="text-green-600" />
                        ) : (
                          <TrendDown size={12} weight="bold" className="text-red-600" />
                        )}
                        <span className={`text-sm ${data.pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.pnlPercentage >= 0 ? '+' : ''}{data.pnlPercentage}%
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                        <div>{data.transactions} transactions</div>
                        <div>Fees: {formatCurrency(data.fees)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pnl" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="text-sm text-green-700">Realized Gains</div>
                    <div className="text-3xl font-bold text-green-600">+{formatCurrency(234567.89)}</div>
                    <div className="text-sm text-green-600 mt-2">From 145 profitable trades</div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <div className="text-sm text-red-700">Realized Losses</div>
                    <div className="text-3xl font-bold text-red-600">-{formatCurrency(45678.90)}</div>
                    <div className="text-sm text-red-600 mt-2">From 23 losing trades</div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="text-sm text-blue-700">Net Profit</div>
                    <div className="text-3xl font-bold text-blue-600">+{formatCurrency(188888.99)}</div>
                    <div className="text-sm text-blue-600 mt-2">86.3% win rate</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Monthly P&L Breakdown</h4>
                    <Badge variant="outline">Last 6 Months</Badge>
                  </div>
                  <div className="space-y-3">
                    {['Nov 2024', 'Oct 2024', 'Sep 2024', 'Aug 2024', 'Jul 2024', 'Jun 2024'].map((month, idx) => {
                      const pnl = [45678, 32456, -12345, 56789, 23456, 34567][idx];
                      const percentage = pnl > 0 ? (pnl / 2456789 * 100) : Math.abs(pnl / 2456789 * 100);
                      return (
                        <div key={month} className="flex items-center gap-4">
                          <div className="w-20 text-sm text-muted-foreground">{month}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                                <div 
                                  className={`h-full ${pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(percentage * 5, 100)}%` }}
                                />
                              </div>
                              <span className={`w-24 text-right font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'swap' ? 'bg-blue-100' :
                        activity.type === 'stake' ? 'bg-purple-100' :
                        activity.type === 'deposit' ? 'bg-green-100' :
                        'bg-orange-100'
                      }`}>
                        {activity.type === 'swap' && <ArrowsLeftRight size={20} className="text-blue-600" />}
                        {activity.type === 'stake' && <Target size={20} className="text-purple-600" />}
                        {activity.type === 'deposit' && <Wallet size={20} className="text-green-600" />}
                        {activity.type === 'claim' && <CurrencyCircleDollar size={20} className="text-orange-600" />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{activity.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.type === 'swap' 
                            ? `${activity.from} → ${activity.to}`
                            : activity.asset}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {activity.type === 'swap' 
                          ? formatCurrency(activity.amount)
                          : `${activity.amount} ${activity.asset}`}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock size={12} />
                        {new Date(activity.time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightning size={24} weight="duotone" className="text-primary" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Smart recommendations based on your portfolio analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-white/50">
              <Badge className="mb-2">Optimization</Badge>
              <h4 className="font-semibold mb-1">Rebalancing Opportunity</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Your ETH allocation has drifted 5% above target. Consider rebalancing to maintain risk profile.
              </p>
              <Button size="sm" variant="outline">View Details</Button>
            </div>
            <div className="p-4 rounded-lg border bg-white/50">
              <Badge className="mb-2" variant="secondary">Yield</Badge>
              <h4 className="font-semibold mb-1">Higher Yield Available</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Move 10,000 USDC to Aave V3 on Arbitrum for 2.3% higher APY with similar risk.
              </p>
              <Button size="sm" variant="outline">Optimize Now</Button>
            </div>
            <div className="p-4 rounded-lg border bg-white/50">
              <Badge className="mb-2" variant="destructive">Alert</Badge>
              <h4 className="font-semibold mb-1">Gas Optimization</h4>
              <p className="text-sm text-muted-foreground mb-3">
                You paid $234 in gas fees this month. Consider batching transactions or using L2s.
              </p>
              <Button size="sm" variant="outline">Learn More</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
