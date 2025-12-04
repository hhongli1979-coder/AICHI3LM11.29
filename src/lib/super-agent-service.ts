/**
 * Super Agent Service - 超级智能体服务
 * 
 * 实现多智能体系统:
 * - 智能体注册和管理
 * - 任务调度和分配
 * - 协同通信
 * - 进化学习
 */

import type {
  SuperAgent,
  AgentTask,
  AgentCollaborationSession,
  CollaborationMessage,
  AgentEvolutionMetrics,
  SuperAgentSystemState,
  AgentRole,
  AgentStatus,
  TaskPriority,
  TaskComplexity,
} from './types';

// 智能体能力定义
const AGENT_CAPABILITIES: Record<AgentRole, string[]> = {
  orchestrator: ['任务分解', '资源调度', '协同协调', '全局监控', '决策优化'],
  executor: ['交易签名', '广播执行', '状态监控', '重试机制', '批量处理'],
  analyzer: ['风险评估', '交易分析', '模式识别', '欺诈检测', '合规检查'],
  specialist: ['领域专精', '策略执行', '数据处理', '优化建议'],
  monitor: ['性能监控', '异常检测', '告警触发', '日志分析', '健康检查'],
};

// 超级智能体服务类
export class SuperAgentService {
  private agents: Map<string, SuperAgent> = new Map();
  private tasks: Map<string, AgentTask> = new Map();
  private sessions: Map<string, AgentCollaborationSession> = new Map();
  private evolutionMetrics: AgentEvolutionMetrics[] = [];
  private messageHandlers: ((msg: CollaborationMessage) => void)[] = [];

  constructor() {
    // 初始化默认智能体
    this.initializeDefaultAgents();
  }

  // 初始化默认智能体
  private initializeDefaultAgents() {
    const defaultAgents: Omit<SuperAgent, 'id' | 'createdAt'>[] = [
      {
        name: '主控智能体',
        role: 'orchestrator',
        status: 'idle',
        capabilities: AGENT_CAPABILITIES.orchestrator,
        performanceScore: 95,
        tasksCompleted: 0,
        successRate: 100,
        avgResponseTime: 100,
        lastActiveAt: Date.now(),
      },
      {
        name: '钱包管理专家',
        role: 'specialist',
        status: 'idle',
        capabilities: ['钱包创建', '余额查询', '多签管理', 'Gas优化'],
        performanceScore: 92,
        tasksCompleted: 0,
        successRate: 100,
        avgResponseTime: 80,
        lastActiveAt: Date.now(),
      },
      {
        name: 'DeFi策略专家',
        role: 'specialist',
        status: 'idle',
        capabilities: ['收益分析', '风险评估', '策略执行', 'APY优化'],
        performanceScore: 88,
        tasksCompleted: 0,
        successRate: 100,
        avgResponseTime: 200,
        lastActiveAt: Date.now(),
      },
      {
        name: '风险分析专家',
        role: 'analyzer',
        status: 'idle',
        capabilities: AGENT_CAPABILITIES.analyzer,
        performanceScore: 96,
        tasksCompleted: 0,
        successRate: 100,
        avgResponseTime: 150,
        lastActiveAt: Date.now(),
      },
      {
        name: '交易执行器',
        role: 'executor',
        status: 'idle',
        capabilities: AGENT_CAPABILITIES.executor,
        performanceScore: 94,
        tasksCompleted: 0,
        successRate: 100,
        avgResponseTime: 180,
        lastActiveAt: Date.now(),
      },
      {
        name: '系统监控器',
        role: 'monitor',
        status: 'processing',
        capabilities: AGENT_CAPABILITIES.monitor,
        currentTask: '持续监控系统健康状态',
        performanceScore: 98,
        tasksCompleted: 0,
        successRate: 100,
        avgResponseTime: 50,
        lastActiveAt: Date.now(),
      },
    ];

    defaultAgents.forEach((agent, index) => {
      const id = `agent-${index + 1}`;
      this.agents.set(id, {
        ...agent,
        id,
        createdAt: Date.now() - (90 - index * 10) * 24 * 60 * 60 * 1000,
      });
    });
  }

  // 获取所有智能体
  getAgents(): SuperAgent[] {
    return Array.from(this.agents.values());
  }

  // 获取单个智能体
  getAgent(id: string): SuperAgent | undefined {
    return this.agents.get(id);
  }

  // 更新智能体状态
  updateAgentStatus(id: string, status: AgentStatus, currentTask?: string) {
    const agent = this.agents.get(id);
    if (agent) {
      agent.status = status;
      agent.currentTask = currentTask;
      agent.lastActiveAt = Date.now();
      this.agents.set(id, agent);
    }
  }

  // 创建新任务
  async createTask(params: {
    name: string;
    description: string;
    priority: TaskPriority;
    complexity: TaskComplexity;
    requiredCapabilities: string[];
  }): Promise<AgentTask> {
    const task: AgentTask = {
      id: `task-${Date.now()}`,
      name: params.name,
      description: params.description,
      priority: params.priority,
      complexity: params.complexity,
      assignedAgents: [],
      requiredCapabilities: params.requiredCapabilities,
      status: 'pending',
      progress: 0,
      estimatedTime: this.estimateTaskTime(params.complexity),
      createdAt: Date.now(),
    };

    this.tasks.set(task.id, task);

    // 自动分配智能体
    await this.assignAgentsToTask(task.id);

    return task;
  }

  // 自动分配智能体到任务
  private async assignAgentsToTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const availableAgents = this.getAgents().filter(
      agent => agent.status === 'idle' || agent.status === 'waiting'
    );

    // 找到具有所需能力的智能体
    const matchingAgents = availableAgents.filter(agent =>
      task.requiredCapabilities.some(cap =>
        agent.capabilities.includes(cap)
      )
    );

    // 按性能评分排序，选择最佳智能体
    const sortedAgents = matchingAgents.sort(
      (a, b) => b.performanceScore - a.performanceScore
    );

    // 分配智能体
    const agentsToAssign = sortedAgents.slice(0, Math.min(3, sortedAgents.length));
    task.assignedAgents = agentsToAssign.map(a => a.id);

    // 更新智能体状态
    agentsToAssign.forEach(agent => {
      this.updateAgentStatus(agent.id, 'processing', task.name);
    });

    this.tasks.set(taskId, task);

    // 广播任务分配消息
    this.broadcastMessage({
      id: `msg-${Date.now()}`,
      senderId: 'agent-1', // 主控智能体
      senderName: '主控智能体',
      content: `任务 "${task.name}" 已分配给 ${agentsToAssign.map(a => a.name).join(', ')}`,
      type: 'instruction',
      timestamp: Date.now(),
    });
  }

  // 估算任务时间
  private estimateTaskTime(complexity: TaskComplexity): number {
    const times: Record<TaskComplexity, number> = {
      simple: 60,
      moderate: 180,
      complex: 300,
      expert: 600,
    };
    return times[complexity];
  }

  // 执行任务
  async executeTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'pending') return;

    task.status = 'in_progress';
    task.startedAt = Date.now();
    this.tasks.set(taskId, task);

    // 模拟任务执行过程
    const updateInterval = setInterval(() => {
      const currentTask = this.tasks.get(taskId);
      if (!currentTask || currentTask.status !== 'in_progress') {
        clearInterval(updateInterval);
        return;
      }

      currentTask.progress = Math.min(100, currentTask.progress + 10);
      this.tasks.set(taskId, currentTask);

      if (currentTask.progress >= 100) {
        clearInterval(updateInterval);
        this.completeTask(taskId);
      }
    }, currentTask.estimatedTime * 10); // 按估算时间的1/10更新进度
  }

  // 完成任务
  private completeTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = 'completed';
    task.completedAt = Date.now();
    task.actualTime = task.completedAt - (task.startedAt || task.createdAt);
    task.result = '任务已成功完成';
    this.tasks.set(taskId, task);

    // 释放智能体
    task.assignedAgents.forEach(agentId => {
      const agent = this.agents.get(agentId);
      if (agent) {
        agent.status = 'idle';
        agent.currentTask = undefined;
        agent.tasksCompleted++;
        this.agents.set(agentId, agent);
      }
    });

    // 更新进化指标
    this.updateEvolutionMetrics(task);

    // 广播完成消息
    this.broadcastMessage({
      id: `msg-${Date.now()}`,
      senderId: 'agent-1',
      senderName: '主控智能体',
      content: `任务 "${task.name}" 已完成`,
      type: 'result',
      timestamp: Date.now(),
    });
  }

  // 更新进化指标
  private updateEvolutionMetrics(completedTask: AgentTask): void {
    completedTask.assignedAgents.forEach(agentId => {
      const existingMetric = this.evolutionMetrics.find(
        m => m.agentId === agentId && m.period === 'daily'
      );

      if (existingMetric) {
        existingMetric.successRate = Math.min(100, existingMetric.successRate + 0.1);
        existingMetric.responseTimeImprovement += 1;
      } else {
        this.evolutionMetrics.push({
          id: `evo-${Date.now()}-${agentId}`,
          agentId,
          period: 'daily',
          successRate: 95,
          responseTimeImprovement: 5,
          newCapabilitiesLearned: 0,
          collaborationScore: 90,
          userSatisfaction: 92,
          costEfficiency: 88,
          timestamp: Date.now(),
        });
      }
    });
  }

  // 创建协作会话
  createCollaborationSession(params: {
    name: string;
    participantIds: string[];
  }): AgentCollaborationSession {
    const orchestrator = this.getAgents().find(a => a.role === 'orchestrator');
    
    const session: AgentCollaborationSession = {
      id: `session-${Date.now()}`,
      name: params.name,
      participants: params.participantIds,
      orchestratorId: orchestrator?.id || 'agent-1',
      currentPhase: 'planning',
      tasks: [],
      messages: [],
      startedAt: Date.now(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  // 广播消息
  broadcastMessage(message: CollaborationMessage): void {
    // 添加到所有活跃会话
    this.sessions.forEach(session => {
      session.messages.push(message);
      this.sessions.set(session.id, session);
    });

    // 通知所有监听器
    this.messageHandlers.forEach(handler => handler(message));
  }

  // 订阅消息
  onMessage(handler: (msg: CollaborationMessage) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  // 获取系统状态
  getSystemState(): SuperAgentSystemState {
    return {
      agents: this.getAgents(),
      activeTasks: Array.from(this.tasks.values()),
      collaborationSessions: Array.from(this.sessions.values()),
      evolutionMetrics: this.evolutionMetrics,
      systemHealth: {
        cpuUsage: Math.round(20 + Math.random() * 30),
        memoryUsage: Math.round(40 + Math.random() * 30),
        activeConnections: this.agents.size * 10 + Math.round(Math.random() * 50),
        queuedTasks: Array.from(this.tasks.values()).filter(t => t.status === 'pending').length,
      },
      settings: {
        enableDynamicScheduling: true,
        enableAutoEvolution: true,
        enableFaultTolerance: true,
        maxConcurrentTasks: 10,
        batchProcessingEnabled: true,
      },
    };
  }

  // 获取活跃任务
  getActiveTasks(): AgentTask[] {
    return Array.from(this.tasks.values()).filter(
      t => t.status === 'pending' || t.status === 'in_progress'
    );
  }

  // 获取进化指标
  getEvolutionMetrics(): AgentEvolutionMetrics[] {
    return this.evolutionMetrics;
  }
}

// 创建默认服务实例
export const superAgentService = new SuperAgentService();

// 导出便捷函数
export function getSuperAgents(): SuperAgent[] {
  return superAgentService.getAgents();
}

export function getSuperAgentSystemState(): SuperAgentSystemState {
  return superAgentService.getSystemState();
}

export async function createAgentTask(
  params: Parameters<SuperAgentService['createTask']>[0]
): Promise<AgentTask> {
  return superAgentService.createTask(params);
}

export async function executeAgentTask(taskId: string): Promise<void> {
  return superAgentService.executeTask(taskId);
}

export function subscribeToMessages(
  handler: (msg: CollaborationMessage) => void
): () => void {
  return superAgentService.onMessage(handler);
}
