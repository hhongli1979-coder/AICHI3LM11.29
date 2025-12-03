import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Robot,
  Brain,
  Lightning,
  Users,
  ChartLine,
  ShieldCheck,
  Gear,
  ArrowsClockwise,
  CheckCircle,
  Warning,
  Clock,
  TrendUp,
  Cpu,
  HardDrive,
  Activity,
  Queue,
  Network,
  Sparkle,
} from '@phosphor-icons/react';
import {
  generateMockSuperAgentSystemState,
  formatTimeAgo,
} from '@/lib/mock-data';
import type { SuperAgent, AgentTask, AgentCollaborationSession, SuperAgentSystemState } from '@/lib/types';

function getAgentRoleIcon(role: string) {
  const icons: Record<string, React.ReactNode> = {
    orchestrator: <Brain size={18} weight="duotone" className="text-purple-500" />,
    executor: <Lightning size={18} weight="duotone" className="text-blue-500" />,
    analyzer: <ChartLine size={18} weight="duotone" className="text-green-500" />,
    specialist: <Robot size={18} weight="duotone" className="text-amber-500" />,
    monitor: <Activity size={18} weight="duotone" className="text-pink-500" />,
  };
  return icons[role] || <Robot size={18} weight="duotone" />;
}

function getAgentRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    orchestrator: '协调器',
    executor: '执行器',
    analyzer: '分析器',
    specialist: '专家',
    monitor: '监控器',
  };
  return labels[role] || role;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'processing': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'idle': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'waiting': return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'error': return 'bg-red-100 text-red-700 border-red-300';
    case 'learning': return 'bg-purple-100 text-purple-700 border-purple-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    processing: '处理中',
    idle: '空闲',
    waiting: '等待中',
    error: '错误',
    learning: '学习中',
  };
  return labels[status] || status;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-700 border-red-300';
    case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
    case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'low': return 'bg-green-100 text-green-700 border-green-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    critical: '紧急',
    high: '高',
    medium: '中',
    low: '低',
  };
  return labels[priority] || priority;
}

function getComplexityLabel(complexity: string): string {
  const labels: Record<string, string> = {
    simple: '简单',
    moderate: '中等',
    complex: '复杂',
    expert: '专家级',
  };
  return labels[complexity] || complexity;
}

function getTaskStatusIcon(status: string) {
  switch (status) {
    case 'completed': return <CheckCircle size={16} weight="fill" className="text-green-500" />;
    case 'in_progress': return <ArrowsClockwise size={16} weight="duotone" className="text-blue-500 animate-spin" />;
    case 'failed': return <Warning size={16} weight="fill" className="text-red-500" />;
    case 'pending': return <Clock size={16} weight="duotone" className="text-amber-500" />;
    default: return <Clock size={16} weight="duotone" />;
  }
}

interface AgentCardProps {
  agent: SuperAgent;
}

function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor(agent.status)}`}>
              {getAgentRoleIcon(agent.role)}
            </div>
            <div>
              <div className="font-semibold text-sm">{agent.name}</div>
              <div className="text-xs text-muted-foreground">
                {getAgentRoleLabel(agent.role)}
              </div>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(agent.status)}>
            {getStatusLabel(agent.status)}
          </Badge>
        </div>

        {agent.currentTask && (
          <div className="mb-3 p-2 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">当前任务</div>
            <div className="text-sm font-medium truncate">{agent.currentTask}</div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">性能评分</span>
            <span className="font-medium">{agent.performanceScore}%</span>
          </div>
          <Progress value={agent.performanceScore} className="h-1.5" />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-center">
          <div>
            <div className="text-lg font-bold text-primary">{agent.tasksCompleted}</div>
            <div className="text-xs text-muted-foreground">已完成</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{agent.successRate}%</div>
            <div className="text-xs text-muted-foreground">成功率</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{agent.avgResponseTime}ms</div>
            <div className="text-xs text-muted-foreground">响应时间</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
          {agent.capabilities.slice(0, 3).map((cap, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {cap}
            </Badge>
          ))}
          {agent.capabilities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{agent.capabilities.length - 3}
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          最后活跃: {formatTimeAgo(agent.lastActiveAt)}
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskCardProps {
  task: AgentTask;
  agents: SuperAgent[];
}

function TaskCard({ task, agents }: TaskCardProps) {
  const assignedAgentNames = task.assignedAgents
    .map(id => agents.find(a => a.id === id)?.name || id)
    .join(', ');

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getTaskStatusIcon(task.status)}
            <span className="font-medium text-sm">{task.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">进度</span>
            <span className="font-medium">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span className="text-muted-foreground truncate max-w-[150px]">{assignedAgentNames}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {getComplexityLabel(task.complexity)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface CollaborationViewProps {
  session: AgentCollaborationSession;
  agents: SuperAgent[];
}

function CollaborationView({ session, agents }: CollaborationViewProps) {
  const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || id;

  const getMessageTypeColor = (type: string): string => {
    switch (type) {
      case 'instruction': return 'border-l-purple-500';
      case 'status': return 'border-l-blue-500';
      case 'result': return 'border-l-green-500';
      case 'error': return 'border-l-red-500';
      case 'suggestion': return 'border-l-amber-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Network size={20} weight="duotone" className="text-purple-500" />
              {session.name}
            </CardTitle>
            <CardDescription>
              协调者: {getAgentName(session.orchestratorId)} | 阶段: {session.currentPhase}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {session.participants.length} 参与者
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {session.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg border-l-4 bg-muted/30 ${getMessageTypeColor(msg.type)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{msg.senderName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface SystemHealthProps {
  health: SuperAgentSystemState['systemHealth'];
}

function SystemHealth({ health }: SystemHealthProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Cpu size={20} weight="duotone" className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{health.cpuUsage}%</div>
              <div className="text-xs text-muted-foreground">CPU使用率</div>
            </div>
          </div>
          <Progress value={health.cpuUsage} className="h-1.5 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <HardDrive size={20} weight="duotone" className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{health.memoryUsage}%</div>
              <div className="text-xs text-muted-foreground">内存使用</div>
            </div>
          </div>
          <Progress value={health.memoryUsage} className="h-1.5 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Activity size={20} weight="duotone" className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{health.activeConnections}</div>
              <div className="text-xs text-muted-foreground">活跃连接</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Queue size={20} weight="duotone" className="text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{health.queuedTasks}</div>
              <div className="text-xs text-muted-foreground">排队任务</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SuperAgentDashboard() {
  const [state, setState] = useState<SuperAgentSystemState>(generateMockSuperAgentSystemState);

  const handleToggleSetting = (key: keyof SuperAgentSystemState['settings']) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: !prev.settings[key],
      },
    }));
  };

  const activeAgents = state.agents.filter(a => a.status === 'processing').length;
  const pendingTasks = state.activeTasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = state.activeTasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Brain size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">超级智能体系统</h2>
            <p className="text-muted-foreground">
              动态调度 · 智能协同 · 自主进化
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="gap-1" variant="default">
            <Sparkle size={14} weight="fill" />
            {activeAgents} 活跃智能体
          </Badge>
          <Badge className="gap-1" variant="secondary">
            {inProgressTasks} 任务进行中
          </Badge>
        </div>
      </div>

      <SystemHealth health={state.systemHealth} />

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="agents" className="gap-2">
            <Robot size={18} weight="duotone" />
            <span className="hidden sm:inline">智能体</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <Lightning size={18} weight="duotone" />
            <span className="hidden sm:inline">任务调度</span>
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="gap-2">
            <Users size={18} weight="duotone" />
            <span className="hidden sm:inline">协同协作</span>
          </TabsTrigger>
          <TabsTrigger value="evolution" className="gap-2">
            <TrendUp size={18} weight="duotone" />
            <span className="hidden sm:inline">进化优化</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {state.agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightning size={20} weight="duotone" className="text-blue-500" />
                  活跃任务
                </CardTitle>
                <CardDescription>
                  {inProgressTasks} 进行中 · {pendingTasks} 等待中
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {state.activeTasks.map((task) => (
                  <TaskCard key={task.id} task={task} agents={state.agents} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gear size={20} weight="duotone" className="text-amber-500" />
                  调度设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">动态智能调度</div>
                    <div className="text-xs text-muted-foreground">
                      根据任务复杂度自动分配智能体
                    </div>
                  </div>
                  <Switch
                    checked={state.settings.enableDynamicScheduling}
                    onCheckedChange={() => handleToggleSetting('enableDynamicScheduling')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">容错协作</div>
                    <div className="text-xs text-muted-foreground">
                      单个智能体失败时自动切换
                    </div>
                  </div>
                  <Switch
                    checked={state.settings.enableFaultTolerance}
                    onCheckedChange={() => handleToggleSetting('enableFaultTolerance')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">批处理优化</div>
                    <div className="text-xs text-muted-foreground">
                      合并相似任务提升吞吐量
                    </div>
                  </div>
                  <Switch
                    checked={state.settings.batchProcessingEnabled}
                    onCheckedChange={() => handleToggleSetting('batchProcessingEnabled')}
                  />
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">最大并发任务</span>
                    <span className="font-bold">{state.settings.maxConcurrentTasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-4">
          {state.collaborationSessions.map((session) => (
            <CollaborationView
              key={session.id}
              session={session}
              agents={state.agents}
            />
          ))}
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendUp size={20} weight="duotone" className="text-green-500" />
                自主进化指标
              </CardTitle>
              <CardDescription>
                智能体持续学习和优化的表现
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {state.evolutionMetrics.map((metric) => {
                  const agent = state.agents.find(a => a.id === metric.agentId);
                  return (
                    <Card key={metric.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          {agent && getAgentRoleIcon(agent.role)}
                          <span className="font-medium">{agent?.name || metric.agentId}</span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">成功率</span>
                            <span className="font-medium text-green-600">{metric.successRate}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">响应提升</span>
                            <span className="font-medium text-blue-600">+{metric.responseTimeImprovement}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">新能力</span>
                            <span className="font-medium text-purple-600">+{metric.newCapabilitiesLearned}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">协作评分</span>
                            <span className="font-medium">{metric.collaborationScore}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">用户满意度</span>
                            <span className="font-medium">{metric.userSatisfaction}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">成本效率</span>
                            <span className="font-medium">{metric.costEfficiency}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} weight="duotone" className="text-primary" />
                  <span className="font-medium">进化设置</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">启用自主进化</div>
                    <div className="text-xs text-muted-foreground">
                      允许智能体从交互中学习并自动优化
                    </div>
                  </div>
                  <Switch
                    checked={state.settings.enableAutoEvolution}
                    onCheckedChange={() => handleToggleSetting('enableAutoEvolution')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
