import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Coins, TrendUp, Lock, Gift, Sparkle, Crown, Lightning, CurrencyDollar, ClipboardText, ChartLineUp, Rocket } from '@phosphor-icons/react';
import type { OmniTokenStats } from '@/lib/types';
import { formatCurrency, formatLargeNumber } from '@/lib/mock-data';

interface OmniTokenDashboardProps {
  stats: OmniTokenStats;
}

export function OmniTokenDashboard({ stats }: OmniTokenDashboardProps) {
  const stakingPercentage = (parseFloat(stats.stakedAmount) / parseFloat(stats.circulatingSupply)) * 100;
  
  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      {/* Gradient Header */}
      <CardHeader className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
        
        <div className="relative flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <Coins size={28} weight="duotone" />
            </div>
            <div>
              <div className="text-2xl font-bold">OMNI Token Economy</div>
              <div className="text-sm text-white/80 font-normal mt-0.5">Stake, Earn & Govern</div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
            <Crown size={18} weight="fill" className="text-amber-300" />
            <span className="text-sm font-semibold">Premium Holder</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Token Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
              <div className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-1">Price</div>
              <div className="text-2xl font-bold text-violet-900">{formatCurrency(stats.price)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Market Cap</div>
              <div className="text-2xl font-bold text-blue-900">${formatLargeNumber(stats.marketCap)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Circulating</div>
              <div className="text-2xl font-bold text-slate-900">{formatLargeNumber(parseFloat(stats.circulatingSupply))}</div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <TrendUp size={14} weight="bold" />
                Staking APY
              </div>
              <div className="text-2xl font-bold text-emerald-900">{stats.stakingApy}%</div>
            </div>
          </div>
          
          {/* Staking Progress */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-100/50 via-purple-100/50 to-indigo-100/50 border border-violet-200/50">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-muted-foreground font-medium">Total Staked</span>
              <span className="font-bold text-violet-700">{stakingPercentage.toFixed(1)}% of supply</span>
            </div>
            <Progress value={stakingPercentage} className="h-3 bg-white" />
            <div className="flex justify-between text-xs mt-2 text-muted-foreground">
              <span>{formatLargeNumber(parseFloat(stats.stakedAmount))} OMNI staked</span>
              <span>{formatLargeNumber(parseFloat(stats.circulatingSupply))} total supply</span>
            </div>
          </div>
          
          {/* Your Holdings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-white/20">
                  <Coins size={20} weight="duotone" />
                </div>
                <div className="text-sm font-semibold text-white/90">Your Balance</div>
              </div>
              <div className="text-3xl font-bold">{parseFloat(stats.yourBalance).toLocaleString()}</div>
              <div className="text-sm text-white/80 mt-1 flex items-center gap-1">
                <Sparkle size={14} weight="fill" />
                ≈ {formatCurrency(parseFloat(stats.yourBalance) * stats.price)}
              </div>
            </div>
            
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-white/20">
                  <Lock size={20} weight="duotone" />
                </div>
                <div className="text-sm font-semibold text-white/90">Staked</div>
              </div>
              <div className="text-3xl font-bold">{parseFloat(stats.yourStaked).toLocaleString()}</div>
              <div className="text-sm mt-1 flex items-center gap-1">
                <TrendUp size={14} weight="bold" className="text-emerald-300" />
                <span className="text-emerald-300 font-semibold">Earning {stats.stakingApy}% APY</span>
              </div>
            </div>
            
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-white/20">
                  <Gift size={20} weight="duotone" />
                </div>
                <div className="text-sm font-semibold text-white/90">Rewards</div>
              </div>
              <div className="text-3xl font-bold">{parseFloat(stats.yourRewards).toLocaleString()}</div>
              <div className="text-sm text-white/80 mt-1 flex items-center gap-1">
                <Sparkle size={14} weight="fill" />
                ≈ {formatCurrency(parseFloat(stats.yourRewards) * stats.price)}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex-1 gap-2 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-base">
              <Lock size={20} weight="bold" />
              Stake OMNI
            </Button>
            <Button variant="outline" className="flex-1 gap-2 h-12 border-2 border-amber-300 text-amber-700 hover:bg-amber-50 text-base">
              <Gift size={20} weight="bold" />
              Claim Rewards
            </Button>
            <Button variant="outline" className="flex-1 gap-2 h-12 border-2 text-base">
              <Lightning size={20} weight="bold" />
              Buy OMNI
            </Button>
          </div>
          
          {/* Benefits Card */}
          <div className="p-6 bg-gradient-to-br from-slate-50 to-violet-50 rounded-2xl border border-slate-100">
            <div className="font-bold text-lg mb-4 flex items-center gap-2">
              <Crown size={20} weight="fill" className="text-amber-500" />
              OMNI Token Benefits
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { text: 'Up to 50% fee discount on all platform transactions', Icon: CurrencyDollar, color: 'text-emerald-600' },
                { text: 'Governance voting rights for protocol upgrades', Icon: ClipboardText, color: 'text-blue-600' },
                { text: 'Revenue sharing from platform fees when staked', Icon: ChartLineUp, color: 'text-violet-600' },
                { text: 'Priority access to new features and beta programs', Icon: Rocket, color: 'text-amber-600' },
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <benefit.Icon size={24} weight="duotone" className={benefit.color} aria-hidden="true" />
                  <span className="text-sm font-medium text-slate-700">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
