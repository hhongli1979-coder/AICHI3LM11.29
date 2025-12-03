import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowsLeftRight, TrendUp, TrendDown } from '@phosphor-icons/react';
import { generateMockFXRates, formatTimeAgo } from '@/lib/mock-data';
import type { Fiat24FXRate } from '@/lib/types';

interface FXRatesDisplayProps {
  pairs?: string[];
}

export function FXRatesDisplay({ pairs }: FXRatesDisplayProps) {
  const allRates = useMemo(() => generateMockFXRates(), []);
  
  const displayedRates = useMemo(() => {
    if (!pairs) {
      return Object.entries(allRates);
    }
    return Object.entries(allRates).filter(([pair]) => pairs.includes(pair));
  }, [allRates, pairs]);

  const formatPair = (pair: string) => {
    return `${pair.slice(0, 3)}/${pair.slice(3)}`;
  };

  const getSpread = (rate: Fiat24FXRate) => {
    return ((rate.ask - rate.bid) / rate.rate * 100).toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowsLeftRight size={20} weight="duotone" />
          FX Rates
        </CardTitle>
        <CardDescription>
          Live foreign exchange rates from Fiat24
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedRates.map(([pair, rate]) => (
            <div
              key={pair}
              className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-semibold">{formatPair(pair)}</span>
                <Badge variant="outline" className="text-xs">
                  {getSpread(rate)}% spread
                </Badge>
              </div>
              
              <div className="text-2xl font-bold mb-2">
                {rate.rate.toFixed(4)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <TrendDown size={12} className="text-green-500" />
                  <span className="text-muted-foreground">Bid:</span>
                  <span className="font-mono">{rate.bid.toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendUp size={12} className="text-red-500" />
                  <span className="text-muted-foreground">Ask:</span>
                  <span className="font-mono">{rate.ask.toFixed(4)}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                Updated {formatTimeAgo(rate.lastUpdateAt)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
