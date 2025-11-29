import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendUp, TrendDown, Wallet, ArrowsLeftRight, ChartLine } from '@phosphor-icons/react';
import { formatCurrency, formatLargeNumber } from '@/lib/mock-data';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
}

function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const isPositive = change && change > 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendUp size={16} weight="bold" /> : <TrendDown size={16} weight="bold" />}
            <span>{Math.abs(change).toFixed(2)}% vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  totalValue: number;
  walletCount: number;
  monthlyVolume: number;
  defiYield: number;
}

export function DashboardStats({ totalValue, walletCount, monthlyVolume, defiYield }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Assets"
        value={formatCurrency(totalValue)}
        change={12.5}
        icon={<Wallet size={20} weight="duotone" />}
      />
      <StatsCard
        title="Active Wallets"
        value={walletCount.toString()}
        icon={<ArrowsLeftRight size={20} weight="duotone" />}
      />
      <StatsCard
        title="Monthly Volume"
        value={formatCurrency(monthlyVolume)}
        change={-3.2}
        icon={<ChartLine size={20} weight="duotone" />}
      />
      <StatsCard
        title="DeFi Yield (APY)"
        value={`${defiYield.toFixed(2)}%`}
        change={1.8}
        icon={<ChartLine size={20} weight="duotone" />}
      />
    </div>
  );
}
