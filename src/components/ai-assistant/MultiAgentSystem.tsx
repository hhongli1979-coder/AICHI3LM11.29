import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Robot,
  Brain,
  MagnifyingGlass,
  Database,
  Users,
  ChartLine,
  ShieldCheck,
  Code,
  BookOpen,
  ArrowUp,
  Clock,
  CheckCircle,
  Spinner,
  Warning,
  Globe,
  Sparkle,
  TrendUp,
  Target,
} from '@phosphor-icons/react';
import {
  generateMockMultiAgentState,
  getAgentSpecializationLabel,
  getEvolutionStageLabel,
  formatTimeAgo,
} from '@/lib/mock-data';
import type { AIAgent, AgentTask, KnowledgeEntry, WebSearchResult, EvolutionEvent, AgentSpecialization, AgentStatus } from '@/lib/types';
import { toast } from 'sonner';

function getSpecializationIcon(spec: AgentSpecialization) {
  switch (spec) {
    case 'data_analyst': return <ChartLine size={18} weight="duotone" />;
    case 'web_searcher': return <Globe size={18} weight="duotone" />;
    case 'code_generator': return <Code size={18} weight="duotone" />;
    case 'risk_assessor': return <ShieldCheck size={18} weight="duotone" />;
    case 'defi_optimizer': return <TrendUp size={18} weight="duotone" />;
    case 'transaction_monitor': return <Target size={18} weight="duotone" />;
    case 'knowledge_manager': return <BookOpen size={18} weight="duotone" />;
    case 'coordinator': return <Users size={18} weight="duotone" />;
    default: return <Robot size={18} weight="duotone" />;
  }
}

function getStatusBadge(status: AgentStatus) {
  switch (status) {
    case 'working':
      return <Badge className="bg-blue-100 text-blue-700 border-blue-300 gap-1"><Spinner size={12} className="animate-spin" /> 工作中</Badge>;
    case 'learning':
      return <Badge className="bg-purple-100 text-purple-700 border-purple-300 gap-1"><Brain size={12} /> 学习中</Badge>;
    case 'evolving':
      return <Badge className="bg-amber-100 text-amber-700 border-amber-300 gap-1"><ArrowUp size={12} /> 进化中</Badge>;
    case 'idle':
      return <Badge variant="secondary" className="gap-1"><Clock size={12} /> 空闲</Badge>;
    case 'error':
      return <Badge variant="destructive" className="gap-1"><Warning size={12} /> 错误</Badge>;
    case 'offline':
      return <Badge variant="outline" className="gap-1">离线</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getEvolutionStageColor(stage: string): string {
  switch (stage) {
    case 'basic': return 'text-gray-500';
    case 'intermediate': return 'text-blue-500';
    case 'advanced': return 'text-green-500';
    case 'expert': return 'text-purple-500';
    case 'master': return 'text-amber-500';
    default: return 'text-gray-500';
  }
}

interface AgentCardProps {
  agent: AIAgent;
  onToggle: (id: string) => void;
}

function AgentCard({ agent, onToggle }: AgentCardProps) {
  const evolutionProgress = (agent.experiencePoints / agent.experienceToNextStage) * 100;
  
  return (
    <Card className="border hover:shadow-lg transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {getSpecializationIcon(agent.specialization)}
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">
                {agent.name}
                <span className={`text-xs ${getEvolutionStageColor(agent.evolutionStage)}`}>
                  ⭐ {getEvolutionStageLabel(agent.evolutionStage)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {getAgentSpecializationLabel(agent.specialization)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(agent.status)}
            <Switch checked={agent.enabled} onCheckedChange={() => onToggle(agent.id)} />
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">进化进度</span>
              <span className="font-medium">{agent.experiencePoints} / {agent.experienceToNextStage} XP</span>
            </div>
            <Progress value={evolutionProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="text-lg font-bold text-primary">{agent.tasksCompleted}</div>
              <div className="text-xs text-muted-foreground">完成任务</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="text-lg font-bold text-green-600">{agent.successRate}%</div>
              <div className="text-xs text-muted-foreground">成功率</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 3).map((cap, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {cap}
              </Badge>
            ))}
            {agent.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs">+{agent.capabilities.length - 3}</Badge>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            最后活动: {formatTimeAgo(agent.lastActiveAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskCardProps {
  task: AgentTask;
  agentName: string;
}

function TaskCard({ task, agentName }: TaskCardProps) {
  const getTaskStatusIcon = () => {
    switch (task.status) {
      case 'completed': return <CheckCircle size={16} weight="fill" className="text-green-500" />;
      case 'in_progress': return <Spinner size={16} className="animate-spin text-blue-500" />;
      case 'pending': return <Clock size={16} className="text-muted-foreground" />;
      case 'failed': return <Warning size={16} className="text-red-500" />;
      default: return null;
    }
  };
  
  return (
    <div className="p-3 rounded-lg border bg-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          {getTaskStatusIcon()}
          <div className="flex-1">
            <div className="text-sm font-medium">{task.description}</div>
            <div className="text-xs text-muted-foreground mt-1">
              执行者: {agentName} | 优先级: {'⭐'.repeat(task.priority)}
            </div>
          </div>
        </div>
      </div>
      {task.result && (
        <div className="mt-2 p-2 rounded bg-green-50 text-green-700 text-xs border border-green-200">
          📊 {task.result}
        </div>
      )}
      <div className="text-xs text-muted-foreground mt-2">
        创建于 {formatTimeAgo(task.createdAt)}
        {task.completedAt && ` | 完成于 ${formatTimeAgo(task.completedAt)}`}
      </div>
    </div>
  );
}

interface KnowledgeCardProps {
  entry: KnowledgeEntry;
}

function KnowledgeCard({ entry }: KnowledgeCardProps) {
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'crypto': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'defi': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'security': return 'bg-red-100 text-red-700 border-red-300';
      case 'market': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'technology': return 'bg-green-100 text-green-700 border-green-300';
      case 'regulation': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };
  
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge className={getCategoryColor(entry.category)}>{entry.category}</Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Brain size={12} />
            置信度: {Math.round(entry.confidence * 100)}%
          </div>
        </div>
        <h4 className="font-semibold text-sm mb-2">{entry.title}</h4>
        <p className="text-sm text-muted-foreground mb-3">{entry.content}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {entry.tags.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">#{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>引用 {entry.referenceCount} 次</span>
          <span>更新于 {formatTimeAgo(entry.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface SearchResultCardProps {
  result: WebSearchResult;
}

function SearchResultCard({ result }: SearchResultCardProps) {
  const getSourceBadge = (sourceType: string) => {
    switch (sourceType) {
      case 'news': return <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">新闻</Badge>;
      case 'documentation': return <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">文档</Badge>;
      case 'forum': return <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs">论坛</Badge>;
      case 'blog': return <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs">博客</Badge>;
      case 'official': return <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-xs">官方</Badge>;
      default: return <Badge variant="outline" className="text-xs">{sourceType}</Badge>;
    }
  };
  
  return (
    <div className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-primary" />
          {getSourceBadge(result.sourceType)}
        </div>
        <div className="text-xs text-green-600 font-medium">
          相关度: {result.relevanceScore}%
        </div>
      </div>
      <h4 className="font-semibold text-sm text-primary hover:underline cursor-pointer">{result.title}</h4>
      <p className="text-xs text-muted-foreground mt-1 mb-2">{result.snippet}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate max-w-[200px]">{result.url}</span>
        <span>{formatTimeAgo(result.searchedAt)}</span>
      </div>
    </div>
  );
}

interface EvolutionEventCardProps {
  event: EvolutionEvent;
  agentName: string;
}

function EvolutionEventCard({ event, agentName }: EvolutionEventCardProps) {
  return (
    <div className="p-3 rounded-lg border bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="flex items-center gap-2 mb-2">
        <ArrowUp size={16} className="text-amber-500" />
        <span className="font-semibold text-sm">{agentName} 进化成功!</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Badge variant="outline">{getEvolutionStageLabel(event.fromStage)}</Badge>
        <span>→</span>
        <Badge className="bg-amber-100 text-amber-700 border-amber-300">{getEvolutionStageLabel(event.toStage)}</Badge>
      </div>
      <div className="mt-2">
        <div className="text-xs text-muted-foreground mb-1">获得技能:</div>
        <div className="flex flex-wrap gap-1">
          {event.skillsGained.map((skill, idx) => (
            <Badge key={idx} variant="outline" className="text-xs bg-green-50">
              ✨ {skill}
            </Badge>
          ))}
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        {formatTimeAgo(event.evolvedAt)}
      </div>
    </div>
  );
}

export function MultiAgentSystem() {
  const [state, setState] = useState(generateMockMultiAgentState);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleToggleAgent = (id: string) => {
    setState((prev) => ({
      ...prev,
      agents: prev.agents.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a
      ),
    }));
    toast.success('智能体状态已更新');
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    toast.info('网络探索者正在搜索...');
    
    setTimeout(() => {
      const newResult: WebSearchResult = {
        id: `search-${Date.now()}`,
        query: searchQuery,
        title: `${searchQuery} - 搜索结果`,
        url: `https://example.com/search?q=${encodeURIComponent(searchQuery)}`,
        snippet: `关于"${searchQuery}"的最新信息和分析...`,
        relevanceScore: Math.floor(Math.random() * 20) + 80,
        sourceType: 'news',
        searchedAt: Date.now(),
      };
      
      setState((prev) => ({
        ...prev,
        searchHistory: [newResult, ...prev.searchHistory],
      }));
      
      setIsSearching(false);
      setSearchQuery('');
      toast.success('搜索完成，已添加到搜索历史');
    }, 2000);
  };

  const getAgentName = (agentId: string): string => {
    const agent = state.agents.find((a) => a.id === agentId);
    return agent?.name || '未知智能体';
  };

  const activeAgents = state.agents.filter((a) => a.enabled).length;
  const workingAgents = state.agents.filter((a) => a.status === 'working' || a.status === 'learning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Users size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">多智能体系统</h2>
            <p className="text-muted-foreground">
              自进化 AI 智能体团队，协同处理复杂任务
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{activeAgents}</div>
            <div className="text-xs text-muted-foreground">活跃智能体</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{workingAgents}</div>
            <div className="text-xs text-muted-foreground">工作中</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target size={24} weight="duotone" className="mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{state.stats.totalTasksCompleted}</div>
            <div className="text-xs text-muted-foreground">总完成任务</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendUp size={24} weight="duotone" className="mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{state.stats.averageSuccessRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">平均成功率</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Database size={24} weight="duotone" className="mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{state.stats.knowledgeBaseSize}</div>
            <div className="text-xs text-muted-foreground">知识条目</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Sparkle size={24} weight="duotone" className="mx-auto mb-2 text-amber-500" />
            <div className="text-2xl font-bold">{state.stats.totalEvolutions}</div>
            <div className="text-xs text-muted-foreground">进化次数</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="agents" className="gap-2">
            <Robot size={18} weight="duotone" />
            <span className="hidden sm:inline">智能体</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <Target size={18} weight="duotone" />
            <span className="hidden sm:inline">任务</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <MagnifyingGlass size={18} weight="duotone" />
            <span className="hidden sm:inline">搜索</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <Database size={18} weight="duotone" />
            <span className="hidden sm:inline">知识库</span>
          </TabsTrigger>
          <TabsTrigger value="evolution" className="gap-2">
            <ArrowUp size={18} weight="duotone" />
            <span className="hidden sm:inline">进化</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Robot size={20} weight="duotone" />
                智能体团队
              </CardTitle>
              <CardDescription>
                管理和监控多个专业化 AI 智能体
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {state.agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onToggle={handleToggleAgent}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target size={20} weight="duotone" />
                任务管理
              </CardTitle>
              <CardDescription>
                查看和管理智能体任务分配
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {state.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      agentName={getAgentName(task.assignedAgentId)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe size={20} weight="duotone" />
                网络搜索
              </CardTitle>
              <CardDescription>
                使用网络探索者智能体搜索互联网信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="输入搜索关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
                  {isSearching ? (
                    <Spinner size={16} className="animate-spin" />
                  ) : (
                    <MagnifyingGlass size={16} />
                  )}
                  搜索
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {['DeFi 最新动态', 'ETH 价格分析', '安全漏洞报告', 'Layer 2 发展'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
              
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {state.searchHistory.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database size={20} weight="duotone" />
                知识库
              </CardTitle>
              <CardDescription>
                智能体学习积累的知识和见解
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {state.knowledgeBase.map((entry) => (
                  <KnowledgeCard key={entry.id} entry={entry} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkle size={20} weight="duotone" className="text-amber-500" />
                进化历史
              </CardTitle>
              <CardDescription>
                智能体自我升级和进化记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {state.evolutionHistory.map((event) => (
                  <EvolutionEventCard
                    key={event.id}
                    event={event}
                    agentName={getAgentName(event.agentId)}
                  />
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={18} weight="duotone" className="text-purple-500" />
                  <span className="font-semibold">进化机制说明</span>
                </div>
                <div className="grid md:grid-cols-5 gap-3 text-center text-xs">
                  {['基础', '中级', '高级', '专家', '大师'].map((stage, idx) => (
                    <div key={stage} className="p-2 rounded bg-background border">
                      <div className={`font-bold ${getEvolutionStageColor(['basic', 'intermediate', 'advanced', 'expert', 'master'][idx])}`}>
                        {stage}
                      </div>
                      <div className="text-muted-foreground">Lv.{idx + 1}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  智能体通过完成任务积累经验值(XP)，达到阈值后自动进化并获得新技能。
                  进化过程中智能体会分析历史数据，优化自身算法，提升专业能力。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
