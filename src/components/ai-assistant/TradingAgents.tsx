/**
 * TradingAgents Component - 多智能体交易分析
 * 
 * Based on TradingAgents-CN framework: https://github.com/hsliuping/TradingAgents-CN
 * Provides multi-agent stock analysis using AI models for comprehensive trading insights.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Robot,
  ChartLine,
  Newspaper,
  ShieldCheck,
  Calculator,
  Lightbulb,
  MagnifyingGlass,
  Sparkle,
  TrendUp,
  TrendDown,
  Equals,
  Clock,
  Target,
  Warning,
  Lightning,
  ArrowRight,
  CaretRight,
  Check,
  Gear,
  Info,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import {
  generateMockTradingAgentsConfig,
  generateMockStockReports,
  generateMockStockAnalysisReport,
  getRecommendationText,
  getRecommendationColor,
  getSignalColor,
  getMarketName,
  formatTimeAgo,
} from '@/lib/mock-data';
import type { 
  TradingAgent, 
  TradingAgentsConfig, 
  StockAnalysisReport, 
  AgentAnalysisResult,
  TradingIndicator,
  TradingMarket,
} from '@/lib/types';
import { toast } from 'sonner';

function getAgentIcon(type: string): React.ReactNode {
  switch (type) {
    case 'market_analyst':
      return <ChartLine size={18} weight="duotone" className="text-blue-500" />;
    case 'fundamental_analyst':
      return <Calculator size={18} weight="duotone" className="text-green-500" />;
    case 'news_analyst':
      return <Newspaper size={18} weight="duotone" className="text-purple-500" />;
    case 'risk_analyst':
      return <ShieldCheck size={18} weight="duotone" className="text-orange-500" />;
    case 'strategy_analyst':
      return <Lightbulb size={18} weight="duotone" className="text-amber-500" />;
    default:
      return <Robot size={18} weight="duotone" />;
  }
}

function getSignalIcon(signal: string): React.ReactNode {
  switch (signal) {
    case 'bullish':
      return <TrendUp size={14} weight="bold" className="text-green-500" />;
    case 'bearish':
      return <TrendDown size={14} weight="bold" className="text-red-500" />;
    case 'neutral':
      return <Equals size={14} weight="bold" className="text-yellow-500" />;
    default:
      return null;
  }
}

interface AgentCardProps {
  agent: TradingAgent;
  onToggle: (id: string) => void;
}

function AgentCard({ agent, onToggle }: AgentCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          {getAgentIcon(agent.type)}
        </div>
        <div>
          <div className="font-medium text-sm">{agent.name}</div>
          <div className="text-xs text-muted-foreground">{agent.description}</div>
        </div>
      </div>
      <Switch
        checked={agent.enabled}
        onCheckedChange={() => onToggle(agent.id)}
      />
    </div>
  );
}

interface IndicatorBadgeProps {
  indicator: TradingIndicator;
}

function IndicatorBadge({ indicator }: IndicatorBadgeProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
      {getSignalIcon(indicator.signal)}
      <div className="flex-1">
        <div className="text-xs font-medium">{indicator.name}</div>
        <div className={`text-sm font-semibold ${getSignalColor(indicator.signal)}`}>
          {indicator.value}
        </div>
      </div>
    </div>
  );
}

interface AgentResultCardProps {
  result: AgentAnalysisResult;
}

function AgentResultCard({ result }: AgentResultCardProps) {
  return (
    <AccordionItem value={result.agentType} className="border rounded-lg mb-3 overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-lg bg-muted">
            {getAgentIcon(result.agentType)}
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-sm">{result.agentName}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {result.summary}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getRecommendationColor(result.recommendation)}`}>
              {getRecommendationText(result.recommendation)}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {result.confidence}%
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {result.indicators.map((ind, idx) => (
              <IndicatorBadge key={idx} indicator={ind} />
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="text-sm font-medium">详细分析</div>
            <ul className="space-y-1">
              {result.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CaretRight size={14} className="mt-0.5 flex-shrink-0 text-primary" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>分析时间: {formatTimeAgo(result.timestamp)}</span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

interface ReportCardProps {
  report: StockAnalysisReport;
  onView: (report: StockAnalysisReport) => void;
}

function ReportCard({ report, onView }: ReportCardProps) {
  return (
    <Card 
      className="border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView(report)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              {report.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="font-medium">{report.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>{report.symbol}</span>
                <Badge variant="outline" className="text-xs">
                  {getMarketName(report.market)}
                </Badge>
              </div>
            </div>
          </div>
          <Badge className={`${getRecommendationColor(report.finalRecommendation)}`}>
            {getRecommendationText(report.finalRecommendation)}
          </Badge>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">综合置信度</span>
            <span className="font-medium">{report.overallConfidence}%</span>
          </div>
          <Progress value={report.overallConfidence} className="h-2" />
        </div>
        
        <div className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {report.executiveSummary}
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{formatTimeAgo(report.completedAt || report.requestedAt)}</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <span>查看详情</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AnalysisDetailProps {
  report: StockAnalysisReport;
  onBack: () => void;
}

function AnalysisDetail({ report, onBack }: AnalysisDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowRight size={16} className="rotate-180" />
          返回列表
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowsClockwise size={16} />
          刷新分析
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                {report.symbol.slice(0, 2)}
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {report.name}
                  <Badge variant="outline">{getMarketName(report.market)}</Badge>
                </CardTitle>
                <CardDescription className="text-base">{report.symbol}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`text-sm px-3 py-1 ${getRecommendationColor(report.finalRecommendation)}`}>
                {getRecommendationText(report.finalRecommendation)}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">
                置信度: {report.overallConfidence}%
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-start gap-2">
              <Sparkle size={18} weight="fill" className="text-amber-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">AI 综合分析摘要</div>
                <p className="text-sm text-muted-foreground">{report.executiveSummary}</p>
              </div>
            </div>
          </div>

          {(report.targetPrice || report.stopLoss) && (
            <div className="grid grid-cols-2 gap-4">
              {report.targetPrice && (
                <div className="p-3 rounded-lg border bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <Target size={16} weight="duotone" />
                    <span className="text-sm">目标价位</span>
                  </div>
                  <div className="text-xl font-bold text-green-700 mt-1">
                    ¥{report.targetPrice}
                  </div>
                </div>
              )}
              {report.stopLoss && (
                <div className="p-3 rounded-lg border bg-red-50 border-red-200">
                  <div className="flex items-center gap-2 text-red-700">
                    <ShieldCheck size={16} weight="duotone" />
                    <span className="text-sm">止损价位</span>
                  </div>
                  <div className="text-xl font-bold text-red-700 mt-1">
                    ¥{report.stopLoss}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Robot size={20} weight="duotone" className="text-primary" />
            多智能体分析结果
          </CardTitle>
          <CardDescription>
            {report.agentResults.length} 个 AI 分析师已完成分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {report.agentResults.map((result) => (
              <AgentResultCard key={result.agentType} result={result} />
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-orange-600">
              <Warning size={18} weight="duotone" />
              风险因素
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.riskFactors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-green-600">
              <Lightning size={18} weight="duotone" />
              投资机会
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.opportunities.map((opp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check size={14} weight="bold" className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{opp}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function TradingAgentsPanel() {
  const [config, setConfig] = useState<TradingAgentsConfig>(generateMockTradingAgentsConfig);
  const [reports, setReports] = useState<StockAnalysisReport[]>(generateMockStockReports);
  const [activeTab, setActiveTab] = useState('analyze');
  const [selectedReport, setSelectedReport] = useState<StockAnalysisReport | null>(null);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [searchMarket, setSearchMarket] = useState<TradingMarket>('A');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleToggleAgent = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      agents: prev.agents.map((agent) =>
        agent.id === id ? { ...agent, enabled: !agent.enabled } : agent
      ),
    }));
  };

  const handleStartAnalysis = () => {
    if (!searchSymbol.trim()) {
      toast.error('请输入股票代码');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate multi-agent analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 500);

    // Simulate analysis completion
    setTimeout(() => {
      const newReport = generateMockStockAnalysisReport(
        searchSymbol.toUpperCase(),
        searchSymbol.toUpperCase(),
        searchMarket
      );
      setReports((prev) => [newReport, ...prev]);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setSearchSymbol('');
      toast.success('分析完成！');
      setSelectedReport(newReport);
    }, 3000);
  };

  const handleViewReport = (report: StockAnalysisReport) => {
    setSelectedReport(report);
  };

  if (selectedReport) {
    return (
      <AnalysisDetail
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <Robot size={24} weight="duotone" className="text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">TradingAgents 多智能体分析</CardTitle>
                <CardDescription>
                  基于 <a href="https://github.com/hsliuping/TradingAgents-CN" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TradingAgents-CN</a> 框架的多智能体股票分析系统
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab('settings')}>
              <Gear size={16} />
              配置
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="analyze" className="gap-2">
            <MagnifyingGlass size={16} />
            <span className="hidden sm:inline">分析</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <ChartLine size={16} />
            <span className="hidden sm:inline">报告</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Gear size={16} />
            <span className="hidden sm:inline">设置</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MagnifyingGlass size={18} weight="duotone" />
                股票分析
              </CardTitle>
              <CardDescription>
                输入股票代码，启动多智能体综合分析
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Select 
                  value={searchMarket} 
                  onValueChange={(v: TradingMarket) => setSearchMarket(v)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="市场" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A股</SelectItem>
                    <SelectItem value="HK">港股</SelectItem>
                    <SelectItem value="US">美股</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="输入股票代码 (如: 600519, AAPL)"
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartAnalysis()}
                  className="flex-1"
                  disabled={isAnalyzing}
                />
                <Button 
                  onClick={handleStartAnalysis} 
                  disabled={isAnalyzing}
                  className="gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <ArrowsClockwise size={16} className="animate-spin" />
                      分析中
                    </>
                  ) : (
                    <>
                      <Sparkle size={16} weight="fill" />
                      开始分析
                    </>
                  )}
                </Button>
              </div>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">多智能体分析进行中...</span>
                    <span className="font-medium">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                  <div className="flex flex-wrap gap-2">
                    {config.agents.filter(a => a.enabled).map((agent, idx) => (
                      <Badge 
                        key={agent.id} 
                        variant="outline"
                        className={analysisProgress > idx * 20 ? 'border-primary text-primary' : ''}
                      >
                        {getAgentIcon(agent.type)}
                        <span className="ml-1">{agent.name}</span>
                        {analysisProgress > idx * 20 && (
                          <Check size={12} className="ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info size={18} weight="duotone" className="text-blue-500" />
                多智能体分析说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {config.agents.map((agent) => (
                  <div 
                    key={agent.id}
                    className={`p-3 rounded-lg border ${agent.enabled ? 'bg-card' : 'bg-muted/30 opacity-60'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getAgentIcon(agent.type)}
                      <span className="font-medium text-sm">{agent.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ChartLine size={18} weight="duotone" />
                分析报告历史
              </CardTitle>
              <CardDescription>
                查看已完成的股票分析报告
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {reports.map((report) => (
                    <ReportCard 
                      key={report.id} 
                      report={report} 
                      onView={handleViewReport}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ChartLine size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
                  <p>暂无分析报告</p>
                  <p className="text-sm mt-1">输入股票代码开始分析</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Robot size={18} weight="duotone" />
                分析智能体配置
              </CardTitle>
              <CardDescription>
                启用或禁用分析智能体
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {config.agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onToggle={handleToggleAgent}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Gear size={18} weight="duotone" />
                通用设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Newspaper size={20} weight="duotone" className="text-purple-500" />
                  <div>
                    <div className="font-medium text-sm">启用新闻分析</div>
                    <div className="text-xs text-muted-foreground">
                      实时分析市场新闻和舆情
                    </div>
                  </div>
                </div>
                <Switch
                  checked={config.enableNewsAnalysis}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({ ...prev, enableNewsAnalysis: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Sparkle size={20} weight="duotone" className="text-amber-500" />
                  <div>
                    <div className="font-medium text-sm">启用 AI 智能洞察</div>
                    <div className="text-xs text-muted-foreground">
                      使用 AI 模型生成深度分析和预测
                    </div>
                  </div>
                </div>
                <Switch
                  checked={config.enableAIInsights}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({ ...prev, enableAIInsights: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultMarket">默认市场</Label>
                <Select
                  value={config.defaultMarket}
                  onValueChange={(v: TradingMarket) =>
                    setConfig((prev) => ({ ...prev, defaultMarket: v }))
                  }
                >
                  <SelectTrigger id="defaultMarket">
                    <SelectValue placeholder="选择默认市场" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A股 (中国大陆)</SelectItem>
                    <SelectItem value="HK">港股 (香港)</SelectItem>
                    <SelectItem value="US">美股 (美国)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
