import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Robot,
  Brain,
  Lightning,
  ArrowsClockwise,
  Broadcast,
  CaretRight,
  CheckCircle,
  Warning,
  Clock,
  Activity,
  ShareNetwork,
  ChatCircleDots,
  Gear,
  Play,
  Pause,
  ChartLine,
  ShieldCheck,
  Wallet,
  CurrencyCircleDollar,
  Users,
  Database,
  Link,
} from '@phosphor-icons/react';
import {
  generateMockMultiAgentState,
  formatTimeAgo,
} from '@/lib/mock-data';
import type { 
  Agent, 
  AgentMessage, 
  AgentTask, 
  AgentRole,
  AgentStatus,
  MessageType,
  MessagePriority,
  MultiAgentSystemState,
} from '@/lib/types';
import { toast } from 'sonner';

function getAgentRoleIcon(role: AgentRole) {
  const icons: Record<AgentRole, React.ReactNode> = {
    orchestrator: <ShareNetwork size={18} weight="duotone" className="text-primary" />,
    asset_manager: <Wallet size={18} weight="duotone" className="text-blue-500" />,
    risk_monitor: <ShieldCheck size={18} weight="duotone" className="text-red-500" />,
    yield_optimizer: <ChartLine size={18} weight="duotone" className="text-green-500" />,
    compliance_guard: <ShieldCheck size={18} weight="duotone" className="text-amber-500" />,
    payment_router: <CurrencyCircleDollar size={18} weight="duotone" className="text-purple-500" />,
    audit_reporter: <Database size={18} weight="duotone" className="text-gray-500" />,
    customer_service: <Users size={18} weight="duotone" className="text-pink-500" />,
    market_analyst: <Activity size={18} weight="duotone" className="text-cyan-500" />,
    data_fusion: <Link size={18} weight="duotone" className="text-orange-500" />,
  };
  return icons[role] || <Robot size={18} weight="duotone" />;
}

function getAgentRoleLabel(role: AgentRole): string {
  const labels: Record<AgentRole, string> = {
    orchestrator: '中枢调度',
    asset_manager: '资产管理',
    risk_monitor: '风险监控',
    yield_optimizer: '收益优化',
    compliance_guard: '合规风控',
    payment_router: '支付路由',
    audit_reporter: '审计报告',
    customer_service: '客户服务',
    market_analyst: '市场分析',
    data_fusion: '数据融合',
  };
  return labels[role] || role;
}

function getStatusColor(status: AgentStatus): string {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'busy': return 'bg-amber-500';
    case 'idle': return 'bg-gray-400';
    case 'error': return 'bg-red-500';
    case 'offline': return 'bg-gray-300';
    default: return 'bg-gray-400';
  }
}

function getStatusLabel(status: AgentStatus): string {
  switch (status) {
    case 'active': return '活跃';
    case 'busy': return '繁忙';
    case 'idle': return '空闲';
    case 'error': return '错误';
    case 'offline': return '离线';
    default: return status;
  }
}

function getMessageTypeIcon(type: MessageType) {
  switch (type) {
    case 'request': return <CaretRight size={14} weight="bold" className="text-blue-500" />;
    case 'response': return <CheckCircle size={14} weight="bold" className="text-green-500" />;
    case 'broadcast': return <Broadcast size={14} weight="bold" className="text-purple-500" />;
    case 'handoff': return <ArrowsClockwise size={14} weight="bold" className="text-amber-500" />;
    case 'sync': return <ArrowsClockwise size={14} weight="bold" className="text-cyan-500" />;
    case 'alert': return <Warning size={14} weight="bold" className="text-red-500" />;
    default: return <ChatCircleDots size={14} weight="bold" />;
  }
}

function getMessageTypeLabel(type: MessageType): string {
  switch (type) {
    case 'request': return '请求';
    case 'response': return '响应';
    case 'broadcast': return '广播';
    case 'handoff': return '交接';
    case 'sync': return '同步';
    case 'alert': return '警报';
    default: return type;
  }
}

function getPriorityColor(priority: MessagePriority): string {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-700 border-red-300';
    case 'high': return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'normal': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'low': return 'bg-gray-100 text-gray-700 border-gray-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

function getPriorityLabel(priority: MessagePriority): string {
  switch (priority) {
    case 'critical': return '紧急';
    case 'high': return '高';
    case 'normal': return '普通';
    case 'low': return '低';
    default: return priority;
  }
}

function getTaskStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-700 border-green-300';
    case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'queued': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'failed': return 'bg-red-100 text-red-700 border-red-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

function getTaskStatusLabel(status: string): string {
  switch (status) {
    case 'completed': return '已完成';
    case 'in_progress': return '进行中';
    case 'queued': return '排队中';
    case 'failed': return '失败';
    default: return status;
  }
}

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

function AgentCard({ agent, onClick }: AgentCardProps) {
  return (
    <Card 
      className="border hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted">
            {getAgentRoleIcon(agent.role)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{agent.name}</span>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {agent.currentTask || '等待任务'}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {getAgentRoleLabel(agent.role)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {getStatusLabel(agent.status)}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>负载</span>
                <span>{agent.load}%</span>
              </div>
              <Progress value={agent.load} className="h-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MessageItemProps {
  message: AgentMessage;
  agents: Agent[];
}

function MessageItem({ message, agents }: MessageItemProps) {
  const fromAgent = agents.find(a => a.id === message.fromAgentId);
  const toAgent = message.toAgentId === 'broadcast' 
    ? null 
    : agents.find(a => a.id === message.toAgentId);

  return (
    <div className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {getMessageTypeIcon(message.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{message.subject}</span>
            <Badge variant="outline" className={`text-xs ${getPriorityColor(message.priority)}`}>
              {getPriorityLabel(message.priority)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getMessageTypeLabel(message.type)}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {fromAgent?.name || message.fromAgentId} → {message.toAgentId === 'broadcast' ? '所有智能体' : (toAgent?.name || message.toAgentId)}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {message.content}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatTimeAgo(message.createdAt)}
            </span>
            <Badge variant="outline" className="text-xs">
              {message.status === 'processed' ? '已处理' : 
               message.status === 'delivered' ? '已送达' : 
               message.status === 'pending' ? '待处理' : '失败'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: AgentTask;
  agents: Agent[];
}

function TaskCard({ task, agents }: TaskCardProps) {
  const assignedAgentNames = task.assignedAgents
    .map(id => agents.find(a => a.id === id)?.name || id)
    .join(', ');

  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{task.name}</span>
              <Badge variant="outline" className={`text-xs ${getTaskStatusColor(task.status)}`}>
                {getTaskStatusLabel(task.status)}
              </Badge>
              <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                {getPriorityLabel(task.priority)}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {task.description}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              参与智能体: {assignedAgentNames}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>进度</span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>
        {task.result && (
          <div className="mt-3 p-2 rounded bg-green-50 text-green-700 text-sm">
            ✓ {task.result}
          </div>
        )}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span>创建: {formatTimeAgo(task.createdAt)}</span>
          {task.completedAt && <span>完成: {formatTimeAgo(task.completedAt)}</span>}
          <span>消息: {task.messages.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function AgentCoordinator() {
  const [state, setState] = useState<MultiAgentSystemState>(generateMockMultiAgentState);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleToggleSystem = () => {
    setState(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
    toast.success(state.isRunning ? '多智能体系统已暂停' : '多智能体系统已启动');
  };

  const activeAgents = state.agents.filter(a => a.status === 'active' || a.status === 'busy').length;
  const pendingMessages = state.messages.filter(m => m.status === 'pending').length;
  const inProgressTasks = state.tasks.filter(t => t.status === 'in_progress').length;

  // Simulate real-time updates
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        totalMessagesProcessed: prev.totalMessagesProcessed + Math.floor(Math.random() * 5),
        averageResponseTimeMs: Math.max(100, prev.averageResponseTimeMs + (Math.random() - 0.5) * 20),
        agents: prev.agents.map(agent => ({
          ...agent,
          load: Math.max(0, Math.min(100, agent.load + (Math.random() - 0.5) * 10)),
          lastActiveAt: agent.status === 'active' || agent.status === 'busy' ? Date.now() : agent.lastActiveAt,
        })),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [state.isRunning]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-600">
            <ShareNetwork size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Agent-to-Agent 协调中心</h2>
            <p className="text-muted-foreground">
              多智能体协同进化系统 · 实时通信与任务协调
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">系统状态</span>
            <Switch checked={state.isRunning} onCheckedChange={handleToggleSystem} />
          </div>
          <Button 
            variant={state.isRunning ? 'outline' : 'default'} 
            className="gap-2"
            onClick={handleToggleSystem}
          >
            {state.isRunning ? (
              <>
                <Pause size={16} weight="fill" />
                暂停
              </>
            ) : (
              <>
                <Play size={16} weight="fill" />
                启动
              </>
            )}
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Activity size={20} weight="duotone" className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeAgents}/{state.agents.length}</div>
                <div className="text-sm text-muted-foreground">活跃智能体</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <ChatCircleDots size={20} weight="duotone" className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{state.totalMessagesProcessed.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">已处理消息</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock size={20} weight="duotone" className="text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{Math.round(state.averageResponseTimeMs)}ms</div>
                <div className="text-sm text-muted-foreground">平均响应时间</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Lightning size={20} weight="duotone" className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{inProgressTasks}</div>
                <div className="text-sm text-muted-foreground">进行中任务</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="agents" className="gap-2">
            <Robot size={18} weight="duotone" />
            <span className="hidden sm:inline">智能体</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <ChatCircleDots size={18} weight="duotone" />
            <span className="hidden sm:inline">消息流</span>
            {pendingMessages > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 p-0 text-xs">
                {pendingMessages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <Lightning size={18} weight="duotone" />
            <span className="hidden sm:inline">协作任务</span>
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2">
            <Gear size={18} weight="duotone" />
            <span className="hidden sm:inline">协议配置</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Robot size={20} weight="duotone" className="text-primary" />
                智能体集群
              </CardTitle>
              <CardDescription>
                当前系统中运行的所有智能体及其状态
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {state.agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onClick={() => setSelectedAgent(agent)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agent Detail Dialog would go here */}
          {selectedAgent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getAgentRoleIcon(selectedAgent.role)}
                    {selectedAgent.name}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedAgent(null)}>
                    关闭
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">基本信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">角色</span>
                        <span>{getAgentRoleLabel(selectedAgent.role)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">状态</span>
                        <span className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedAgent.status)}`} />
                          {getStatusLabel(selectedAgent.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">工作负载</span>
                        <span>{selectedAgent.load}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">成功率</span>
                        <span>{(selectedAgent.successRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">消息数</span>
                        <span>{selectedAgent.messageCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">最后活跃</span>
                        <span>{formatTimeAgo(selectedAgent.lastActiveAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">能力</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.capabilities.map((cap, idx) => (
                        <Badge key={idx} variant="outline">{cap}</Badge>
                      ))}
                    </div>
                    <h4 className="font-medium mt-4 mb-2">描述</h4>
                    <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
                    {selectedAgent.currentTask && (
                      <>
                        <h4 className="font-medium mt-4 mb-2">当前任务</h4>
                        <p className="text-sm">{selectedAgent.currentTask}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ChatCircleDots size={20} weight="duotone" className="text-blue-500" />
                A2A 消息流
              </CardTitle>
              <CardDescription>
                智能体间的实时通信记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {state.messages
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((message) => (
                      <MessageItem 
                        key={message.id} 
                        message={message} 
                        agents={state.agents} 
                      />
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightning size={20} weight="duotone" className="text-amber-500" />
                协作任务
              </CardTitle>
              <CardDescription>
                多智能体协同执行的任务列表
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} agents={state.agents} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShareNetwork size={20} weight="duotone" className="text-purple-500" />
                协作集群
              </CardTitle>
              <CardDescription>
                正在进行的多智能体协作
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.collaborations.map((collab) => {
                  const coordinator = state.agents.find(a => a.id === collab.coordinatorAgentId);
                  const participantNames = collab.participatingAgents
                    .map(id => state.agents.find(a => a.id === id)?.name || id)
                    .join(', ');

                  return (
                    <Card key={collab.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{collab.name}</span>
                              <Badge variant="outline" className={
                                collab.status === 'executing' 
                                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                                  : collab.status === 'completed'
                                  ? 'bg-green-100 text-green-700 border-green-300'
                                  : 'bg-gray-100 text-gray-700 border-gray-300'
                              }>
                                {collab.status === 'executing' ? '执行中' : 
                                 collab.status === 'completed' ? '已完成' : 
                                 collab.status === 'planning' ? '规划中' : '审核中'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{collab.description}</p>
                            <div className="text-xs text-muted-foreground mt-2">
                              协调者: {coordinator?.name || collab.coordinatorAgentId}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              参与者: {participantNames}
                            </div>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            <div>任务数: {collab.tasks.length}</div>
                            <div className="mt-1">开始: {formatTimeAgo(collab.startedAt)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gear size={20} weight="duotone" className="text-gray-500" />
                A2A 协议配置
              </CardTitle>
              <CardDescription>
                智能体间通信协议的参数设置
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">最大重试次数</div>
                    <div className="text-sm text-muted-foreground">消息发送失败时的重试次数</div>
                  </div>
                  <Badge variant="outline">{state.protocolConfig.maxRetries}</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">超时时间</div>
                    <div className="text-sm text-muted-foreground">消息等待响应的最长时间</div>
                  </div>
                  <Badge variant="outline">{state.protocolConfig.timeoutMs}ms</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">广播节流</div>
                    <div className="text-sm text-muted-foreground">广播消息的最小间隔</div>
                  </div>
                  <Badge variant="outline">{state.protocolConfig.broadcastThrottleMs}ms</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">优先级队列</div>
                    <div className="text-sm text-muted-foreground">按优先级处理消息</div>
                  </div>
                  <Switch checked={state.protocolConfig.priorityQueueEnabled} disabled />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">安全设置</h4>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} weight="duotone" className="text-green-500" />
                    <div>
                      <div className="font-medium">端到端加密</div>
                      <div className="text-sm text-muted-foreground">对智能体间通信进行加密保护</div>
                    </div>
                  </div>
                  <Switch checked={state.protocolConfig.enableEncryption} disabled />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Database size={20} weight="duotone" className="text-blue-500" />
                    <div>
                      <div className="font-medium">通信日志</div>
                      <div className="text-sm text-muted-foreground">记录所有A2A通信以供审计</div>
                    </div>
                  </div>
                  <Switch checked={state.protocolConfig.enableLogging} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
