import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  TrendUp,
  TrendDown,
  ChartLine,
  Heartbeat,
  Brain,
  Globe,
  Lightning,
  CaretUp,
  CaretDown,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import {
  generateMockMarketData,
  generateMockMarketSentiment,
  generateMockWhaleMovements,
  generateMockOnChainMetrics,
  formatCurrency,
  formatLargeNumber,
  formatTimeAgo,
} from '@/lib/mock-data';
import type { MarketData, MarketSentiment, WhaleMovement, OnChainMetrics } from '@/lib/types';

function getTrendColor(change: number): string {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-muted-foreground';
}

function getTrendIcon(change: number) {
  if (change > 0) return <CaretUp size={16} weight="fill" className="text-green-600" />;
  if (change < 0) return <CaretDown size={16} weight="fill" className="text-red-600" />;
  return null;
}

function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case 'bullish': return 'bg-green-100 text-green-700 border-green-300';
    case 'bearish': return 'bg-red-100 text-red-700 border-red-300';
    default: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  }
}

function getSentimentLabel(sentiment: string): string {
  switch (sentiment) {
    case 'bullish': return '看涨';
    case 'bearish': return '看跌';
    default: return '中性';
  }
}

function getFearGreedLabel(index: number): { label: string; color: string } {
  if (index >= 80) return { label: '极度贪婪', color: 'text-red-600' };
  if (index >= 60) return { label: '贪婪', color: 'text-orange-600' };
  if (index >= 40) return { label: '中性', color: 'text-yellow-600' };
  if (index >= 20) return { label: '恐惧', color: 'text-blue-600' };
  return { label: '极度恐惧', color: 'text-purple-600' };
}

function getSignificanceColor(significance: string): string {
  switch (significance) {
    case 'high': return 'bg-red-100 text-red-700 border-red-300';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    default: return 'bg-green-100 text-green-700 border-green-300';
  }
}

interface MarketCardProps {
  data: MarketData;
}

function MarketCard({ data }: MarketCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{data.symbol}</span>
              <span className="text-sm text-muted-foreground">{data.name}</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {formatCurrency(data.price)}
            </div>
          </div>
          <Badge className={getSentimentColor(data.changePercent24h > 0 ? 'bullish' : 'bearish')}>
            {getTrendIcon(data.changePercent24h)}
            <span className="ml-1">{data.changePercent24h > 0 ? '+' : ''}{data.changePercent24h.toFixed(2)}%</span>
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <div className="text-muted-foreground">24h高</div>
            <div className="font-medium">{formatCurrency(data.high24h)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">24h低</div>
            <div className="font-medium">{formatCurrency(data.low24h)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">24h交易量</div>
            <div className="font-medium">${formatLargeNumber(data.volume24h)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">市值</div>
            <div className="font-medium">${formatLargeNumber(data.marketCap)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SentimentPanelProps {
  sentiment: MarketSentiment;
}

function SentimentPanel({ sentiment }: SentimentPanelProps) {
  const fearGreed = getFearGreedLabel(sentiment.fearGreedIndex);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Heartbeat size={20} weight="duotone" className="text-primary" />
          市场情绪分析
        </CardTitle>
        <CardDescription>
          综合分析市场情绪和技术指标
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
          <div>
            <div className="text-sm text-muted-foreground">整体趋势</div>
            <Badge className={`mt-1 ${getSentimentColor(sentiment.overall)}`}>
              {sentiment.overall === 'bullish' ? <TrendUp size={14} weight="bold" className="mr-1" /> : <TrendDown size={14} weight="bold" className="mr-1" />}
              {getSentimentLabel(sentiment.overall)}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">恐惧贪婪指数</div>
            <div className={`text-2xl font-bold ${fearGreed.color}`}>
              {sentiment.fearGreedIndex}
            </div>
            <div className={`text-xs ${fearGreed.color}`}>{fearGreed.label}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">RSI (相对强弱指数)</span>
              <span className="font-medium">{sentiment.technicalSignals.rsi.toFixed(1)}</span>
            </div>
            <Progress value={sentiment.technicalSignals.rsi} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>超卖 (30)</span>
              <span>中性 (50)</span>
              <span>超买 (70)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">MACD信号</div>
              <Badge className={`mt-1 ${sentiment.technicalSignals.macd === 'buy' ? 'bg-green-100 text-green-700' : sentiment.technicalSignals.macd === 'sell' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {sentiment.technicalSignals.macd === 'buy' ? '买入' : sentiment.technicalSignals.macd === 'sell' ? '卖出' : '中性'}
              </Badge>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">均线位置</div>
              <Badge className={`mt-1 ${sentiment.technicalSignals.movingAverage === 'above' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {sentiment.technicalSignals.movingAverage === 'above' ? '均线之上' : sentiment.technicalSignals.movingAverage === 'below' ? '均线之下' : '穿越中'}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">社交媒体提及</div>
              <div className="text-xl font-bold text-primary">{formatLargeNumber(sentiment.socialMentions)}</div>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">新闻情绪分数</div>
              <div className="text-xl font-bold text-primary">{sentiment.newsScore}/100</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface WhaleMovementCardProps {
  movement: WhaleMovement;
}

function WhaleMovementCard({ movement }: WhaleMovementCardProps) {
  const typeLabel = {
    transfer: '大额转账',
    exchange_inflow: '交易所流入',
    exchange_outflow: '交易所流出',
  }[movement.type];
  
  const typeIcon = {
    transfer: <ArrowsClockwise size={18} weight="duotone" className="text-blue-500" />,
    exchange_inflow: <TrendDown size={18} weight="duotone" className="text-red-500" />,
    exchange_outflow: <TrendUp size={18} weight="duotone" className="text-green-500" />,
  }[movement.type];
  
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border hover:shadow-md transition-shadow">
      <div className="p-2 rounded-lg bg-muted">{typeIcon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">{typeLabel}</span>
            <Badge className={getSignificanceColor(movement.significance)}>
              {movement.significance === 'high' ? '高影响' : movement.significance === 'medium' ? '中影响' : '低影响'}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{formatTimeAgo(movement.timestamp)}</span>
        </div>
        <div className="mt-2 text-sm">
          <span className="font-bold">{movement.amount} {movement.token}</span>
          <span className="text-muted-foreground"> (${formatLargeNumber(movement.valueUsd)})</span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {movement.from} → {movement.to}
        </div>
      </div>
    </div>
  );
}

interface OnChainMetricsPanelProps {
  metrics: OnChainMetrics;
}

function OnChainMetricsPanel({ metrics }: OnChainMetricsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe size={20} weight="duotone" className="text-primary" />
          链上数据
        </CardTitle>
        <CardDescription>
          实时区块链网络指标
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg border">
            <div className="text-sm text-muted-foreground">24h活跃地址</div>
            <div className="text-xl font-bold">{formatLargeNumber(metrics.activeAddresses24h)}</div>
          </div>
          <div className="p-3 rounded-lg border">
            <div className="text-sm text-muted-foreground">24h交易数</div>
            <div className="text-xl font-bold">{formatLargeNumber(metrics.transactionCount24h)}</div>
          </div>
          <div className="p-3 rounded-lg border">
            <div className="text-sm text-muted-foreground">平均交易价值</div>
            <div className="text-xl font-bold">{formatCurrency(metrics.avgTransactionValue)}</div>
          </div>
          <div className="p-3 rounded-lg border">
            <div className="text-sm text-muted-foreground">Gas价格</div>
            <div className="text-xl font-bold">{metrics.gasPrice} Gwei</div>
          </div>
          {metrics.networkHashrate && (
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">网络算力</div>
              <div className="text-xl font-bold">{formatLargeNumber(metrics.networkHashrate)} H/s</div>
            </div>
          )}
          {metrics.stakingRatio && (
            <div className="p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">质押比例</div>
              <div className="text-xl font-bold">{metrics.stakingRatio}%</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MarketAnalysis() {
  const [marketData] = useState(generateMockMarketData);
  const [sentiment] = useState(generateMockMarketSentiment);
  const [whaleMovements] = useState(generateMockWhaleMovements);
  const [onChainMetrics] = useState(generateMockOnChainMetrics);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
            <ChartLine size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">市场分析</h2>
            <p className="text-muted-foreground">
              实时市场数据、情绪分析和链上指标
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <ArrowsClockwise size={18} weight="bold" />
          刷新数据
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <ChartLine size={18} weight="duotone" />
            <span className="hidden sm:inline">概览</span>
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="gap-2">
            <Heartbeat size={18} weight="duotone" />
            <span className="hidden sm:inline">情绪</span>
          </TabsTrigger>
          <TabsTrigger value="whale" className="gap-2">
            <Lightning size={18} weight="duotone" />
            <span className="hidden sm:inline">巨鲸</span>
          </TabsTrigger>
          <TabsTrigger value="onchain" className="gap-2">
            <Globe size={18} weight="duotone" />
            <span className="hidden sm:inline">链上</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {marketData.map((data) => (
              <MarketCard key={data.id} data={data} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <SentimentPanel sentiment={sentiment} />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain size={20} weight="duotone" className="text-purple-500" />
                  AI市场洞察
                </CardTitle>
                <CardDescription>
                  基于AI分析的市场预测和建议
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendUp size={18} weight="bold" className="text-green-600" />
                    <span className="font-medium text-green-700">短期看涨信号</span>
                  </div>
                  <p className="text-sm text-green-700">
                    BTC突破关键阻力位，配合交易量放大，预计短期内将继续上涨。建议持有或适当加仓。
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightning size={18} weight="bold" className="text-yellow-600" />
                    <span className="font-medium text-yellow-700">需要关注</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    ETH接近超买区域，RSI达到58.5。如持续上涨可能面临回调风险，建议设置止盈点。
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={18} weight="bold" className="text-blue-600" />
                    <span className="font-medium text-blue-700">机会提示</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    SOL近期表现强劲，24h涨幅接近10%。DeFi生态活跃，可考虑适量配置。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whale" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightning size={20} weight="duotone" className="text-amber-500" />
                巨鲸动向追踪
              </CardTitle>
              <CardDescription>
                监控大额资金流动和巨鲸行为
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {whaleMovements.map((movement) => (
                <WhaleMovementCard key={movement.id} movement={movement} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onchain" className="space-y-4">
          <OnChainMetricsPanel metrics={onChainMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
