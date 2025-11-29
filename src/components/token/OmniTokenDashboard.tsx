import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Coins, TrendUp, Lock, Gift } from '@phosphor-icons/react';
import type { OmniTokenStats } from '@/lib/types';
import { formatCurrency, formatLargeNumber } from '@/lib/mock-data';

interface OmniTokenDashboardProps {
  stats: OmniTokenStats;
}

export function OmniTokenDashboard({ stats }: OmniTokenDashboardProps) {
  const stakingPercentage = (parseFloat(stats.stakedAmount) / parseFloat(stats.circulatingSupply)) * 100;
  
  return (
    <Card className="border-2 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins size={24} weight="duotone" className="text-accent" />
          OMNI Token Economy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Price</div>
              <div className="text-lg font-bold">{formatCurrency(stats.price)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Market Cap</div>
              <div className="text-lg font-bold">${formatLargeNumber(stats.marketCap)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Circulating Supply</div>
              <div className="text-lg font-bold">{formatLargeNumber(parseFloat(stats.circulatingSupply))}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendUp size={14} weight="bold" />
                Staking APY
              </div>
              <div className="text-lg font-bold text-green-600">{stats.stakingApy}%</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Staked</span>
              <span className="font-medium">{stakingPercentage.toFixed(1)}% of supply</span>
            </div>
            <Progress value={stakingPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="p-4 bg-accent/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Coins size={20} weight="duotone" className="text-accent" />
                <div className="text-sm font-medium">Your Balance</div>
              </div>
              <div className="text-2xl font-bold">{parseFloat(stats.yourBalance).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">
                ≈ {formatCurrency(parseFloat(stats.yourBalance) * stats.price)}
              </div>
            </div>
            
            <div className="p-4 bg-accent/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={20} weight="duotone" className="text-accent" />
                <div className="text-sm font-medium">Staked</div>
              </div>
              <div className="text-2xl font-bold">{parseFloat(stats.yourStaked).toLocaleString()}</div>
              <div className="text-sm text-green-600 font-medium mt-1">
                Earning {stats.stakingApy}% APY
              </div>
            </div>
            
            <div className="p-4 bg-accent/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={20} weight="duotone" className="text-accent" />
                <div className="text-sm font-medium">Rewards</div>
              </div>
              <div className="text-2xl font-bold">{parseFloat(stats.yourRewards).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">
                ≈ {formatCurrency(parseFloat(stats.yourRewards) * stats.price)}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1 gap-2">
              <Lock size={16} weight="bold" />
              Stake OMNI
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Gift size={16} weight="bold" />
              Claim Rewards
            </Button>
            <Button variant="outline" className="flex-1">
              Buy OMNI
            </Button>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="font-medium text-sm">OMNI Token Benefits</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                Up to 50% fee discount on all platform transactions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                Governance voting rights for protocol upgrades
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                Revenue sharing from platform fees when staked
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                Priority access to new features and beta programs
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
