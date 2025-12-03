import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartLine, TrendUp, Warning } from '@phosphor-icons/react';
import type { DeFiPosition } from '@/lib/types';
import { formatCurrency, NETWORKS } from '@/lib/mock-data';

interface DeFiPositionsProps {
  positions: DeFiPosition[];
}

export function DeFiPositions({ positions }: DeFiPositionsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lending': return 'bg-blue-100 text-blue-700';
      case 'staking': return 'bg-purple-100 text-purple-700';
      case 'liquidity': return 'bg-green-100 text-green-700';
      case 'farming': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const totalValue = positions.reduce((sum, pos) => sum + parseFloat(pos.valueUsd), 0);
  const totalRewards = positions.reduce((sum, pos) => sum + parseFloat(pos.rewards), 0);
  const weightedApy = positions.reduce((sum, pos) => {
    const weight = parseFloat(pos.valueUsd) / totalValue;
    return sum + (pos.apy * weight);
  }, 0);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ChartLine size={24} weight="duotone" className="text-primary" />
            DeFi Positions
          </CardTitle>
          <Button variant="outline" size="sm">Manage</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Total Value</div>
              <div className="text-xl font-bold">{formatCurrency(totalValue)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Weighted APY</div>
              <div className="text-xl font-bold flex items-center gap-1 text-green-600">
                <TrendUp size={20} weight="bold" />
                {weightedApy.toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Pending Rewards</div>
              <div className="text-xl font-bold">{formatCurrency(totalRewards)}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {positions.map((position) => {
              const network = NETWORKS[position.network];
              const isHealthy = position.healthFactor === undefined || position.healthFactor > 1.5;
              
              return (
                <div key={position.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{position.protocol}</div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(position.type)}>
                          {position.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" style={{ borderColor: network.color, color: network.color }}>
                          {network.icon} {network.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(parseFloat(position.valueUsd))}</div>
                      <div className="text-sm text-green-600 font-medium">{position.apy.toFixed(2)}% APY</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Position</div>
                      <div className="font-medium">{position.amount} {position.asset}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Rewards</div>
                      <div className="font-medium text-green-600">{position.rewards} {position.asset}</div>
                    </div>
                  </div>
                  
                  {position.healthFactor !== undefined && (
                    <div className={`flex items-center gap-2 text-sm ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                      {!isHealthy && <Warning size={16} weight="fill" />}
                      <span className="font-medium">Health Factor: {position.healthFactor.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">Withdraw</Button>
                    <Button size="sm" variant="outline" className="flex-1">Add More</Button>
                    <Button size="sm" className="flex-1">Claim Rewards</Button>
                  </div>
                </div>
              );
            })}
            
            {positions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No DeFi positions yet. Start earning yield on your idle assets.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
