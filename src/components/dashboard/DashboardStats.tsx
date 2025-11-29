import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendUp, TrendDown, Wallet, ArrowsLeftRight, ChartLine, Sparkle } from '@phosphor-icons/react';
import { formatCurrency, formatLargeNumber } from '@/lib/mock-data';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  gradient?: string;
  iconBg?: string;
}

function StatsCard({ title, value, change, icon, gradient, iconBg }: StatsCardProps) {
  const isPositive = change && change > 0;
  
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity ${gradient || 'bg-gradient-to-br from-blue-500 to-indigo-600'}`} />
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
        <div className={`w-full h-full rounded-full opacity-10 ${iconBg || 'bg-blue-500'}`} />
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">{title}</CardTitle>
        <div className={`p-2.5 rounded-xl ${iconBg || 'bg-blue-500/10'} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1.5 text-sm mt-2 font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
            <span className={`flex items-center justify-center w-5 h-5 rounded-full ${isPositive ? 'bg-emerald-100' : 'bg-rose-100'}`}>
              {isPositive ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
            </span>
            <span>{Math.abs(change).toFixed(2)}%</span>
            <span className="text-muted-foreground font-normal">vs last month</span>
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Assets"
        value={formatCurrency(totalValue)}
        change={12.5}
        icon={<Wallet size={22} weight="duotone" className="text-blue-600" />}
        gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
        iconBg="bg-blue-500/10"
      />
      <StatsCard
        title="Active Wallets"
        value={walletCount.toString()}
        icon={<ArrowsLeftRight size={22} weight="duotone" className="text-violet-600" />}
        gradient="bg-gradient-to-br from-violet-500 to-purple-600"
        iconBg="bg-violet-500/10"
      />
      <StatsCard
        title="Monthly Volume"
        value={formatCurrency(monthlyVolume)}
        change={-3.2}
        icon={<ChartLine size={22} weight="duotone" className="text-amber-600" />}
        gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        iconBg="bg-amber-500/10"
      />
      <StatsCard
        title="DeFi Yield (APY)"
        value={`${defiYield.toFixed(2)}%`}
        change={1.8}
        icon={<Sparkle size={22} weight="duotone" className="text-emerald-600" />}
        gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        iconBg="bg-emerald-500/10"
      />
    </div>
  );
}
