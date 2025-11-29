import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartLine, TrendUp, Warning, Sparkle, ArrowUpRight, Shield, Lightning } from '@phosphor-icons/react';
import type { DeFiPosition } from '@/lib/types';
import { formatCurrency, NETWORKS } from '@/lib/mock-data';

interface DeFiPositionsProps {
  positions: DeFiPosition[];
}

export function DeFiPositions({ positions }: DeFiPositionsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lending': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'staking': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'liquidity': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'farming': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lending': return '💰';
      case 'staking': return '🔒';
      case 'liquidity': return '💧';
      case 'farming': return '🌾';
      default: return '📊';
    }
  };
  
  const totalValue = positions.reduce((sum, pos) => sum + parseFloat(pos.valueUsd), 0);
  const totalRewards = positions.reduce((sum, pos) => sum + parseFloat(pos.rewards), 0);
  const weightedApy = positions.reduce((sum, pos) => {
    const weight = parseFloat(pos.valueUsd) / totalValue;
    return sum + (pos.apy * weight);
  }, 0);
  
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <ChartLine size={24} weight="duotone" className="text-white" />
            </div>
            <span>DeFi Positions</span>
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2 border-2 hover:bg-white/80">
            <Sparkle size={16} weight="fill" />
            Manage
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Total Value</div>
              <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalValue)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Weighted APY</div>
              <div className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                <TrendUp size={24} weight="bold" className="text-emerald-500" />
                {weightedApy.toFixed(2)}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Pending Rewards</div>
              <div className="text-2xl font-bold text-amber-900">{formatCurrency(totalRewards)}</div>
            </div>
          </div>
          
          {/* Positions List */}
          <div className="space-y-4">
            {positions.map((position) => {
              const network = NETWORKS[position.network];
              const isHealthy = position.healthFactor === undefined || position.healthFactor > 1.5;
              
              return (
                <div key={position.id} className="border rounded-2xl p-5 space-y-4 hover:shadow-lg transition-all bg-white group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getTypeIcon(position.type)}</span>
                        <div className="font-bold text-lg">{position.protocol}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getTypeColor(position.type)} font-semibold border`}>
                          {position.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="font-semibold border-2" style={{ borderColor: network.color, color: network.color, backgroundColor: `${network.color}10` }}>
                          {network.icon} {network.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl">{formatCurrency(parseFloat(position.valueUsd))}</div>
                      <div className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-1">
                        <ArrowUpRight size={16} weight="bold" />
                        {position.apy.toFixed(2)}% APY
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm p-3 bg-slate-50 rounded-xl">
                    <div>
                      <div className="text-muted-foreground text-xs uppercase font-semibold tracking-wider mb-1">Position</div>
                      <div className="font-bold">{position.amount} {position.asset}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase font-semibold tracking-wider mb-1">Rewards</div>
                      <div className="font-bold text-emerald-600">{position.rewards} {position.asset}</div>
                    </div>
                  </div>
                  
                  {position.healthFactor !== undefined && (
                    <div className={`flex items-center gap-2 text-sm p-3 rounded-xl ${isHealthy ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {isHealthy ? (
                        <Shield size={18} weight="fill" />
                      ) : (
                        <Warning size={18} weight="fill" />
                      )}
                      <span className="font-bold">Health Factor: {position.healthFactor.toFixed(2)}</span>
                      {isHealthy && <span className="text-xs ml-1">(Healthy)</span>}
                      {!isHealthy && <span className="text-xs ml-1">(At Risk)</span>}
                    </div>
                  )}
                  
                  <div className="flex gap-3 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 border-2 hover:bg-slate-50">Withdraw</Button>
                    <Button size="sm" variant="outline" className="flex-1 border-2 hover:bg-slate-50">Add More</Button>
                    <Button size="sm" className="flex-1 gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
                      <Lightning size={14} weight="fill" />
                      Claim Rewards
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {positions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <ChartLine size={40} weight="duotone" className="text-slate-400" />
                </div>
                <p className="font-medium text-lg">No DeFi positions yet</p>
                <p className="text-sm">Start earning yield on your idle assets</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
