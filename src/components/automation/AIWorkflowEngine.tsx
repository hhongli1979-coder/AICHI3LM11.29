import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Robot,
  Lightning,
  Play,
  Pause,
  Plus,
  ArrowRight,
  Gear,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Database,
  Globe,
  ChatCircle,
  Envelope,
  Webhook,
  Brain,
  Cpu,
  Graph,
  Flow,
  TreeStructure,
  GitBranch,
  Timer,
  Funnel,
  CaretRight,
  Sparkle,
  Eye,
  Trash,
  PencilSimple,
  Copy,
  Export,
  PlugsConnected,
  CurrencyDollar,
  ShoppingCart,
  Users,
  FileText,
  Image,
  VideoCamera,
  Microphone
} from '@phosphor-icons/react';
import { toast } from 'sonner';

// ============================================
// 类型定义 - AI工作流引擎
// ============================================

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'ai' | 'mcp';
  name: string;
  icon: React.ReactNode;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  connections: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  status: 'active' | 'inactive' | 'error';
  runs: number;
  lastRun?: string;
  createdAt: string;
}

interface MCPServer {
  id: string;
  name: string;
  type: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  tools: string[];
}

// ============================================
// MCP 服务器管理
// ============================================

export function MCPServerManager() {
  const [servers, setServers] = useState<MCPServer[]>([
    { id: 'mcp-1', name: 'GitHub MCP', type: 'github', url: 'mcp://github.local', status: 'connected', tools: ['search_code', 'create_issue', 'list_repos', 'get_file_contents'] },
    { id: 'mcp-2', name: 'Database MCP', type: 'database', url: 'mcp://db.local', status: 'connected', tools: ['query', 'insert', 'update', 'delete'] },
    { id: 'mcp-3', name: 'Web Search MCP', type: 'web', url: 'mcp://search.local', status: 'connected', tools: ['web_search', 'fetch_page', 'extract_data'] },
    { id: 'mcp-4', name: 'Payment MCP', type: 'payment', url: 'mcp://pay.local', status: 'connected', tools: ['create_payment', 'refund', 'query_order', 'face_pay'] },
    { id: 'mcp-5', name: 'AI Model MCP', type: 'ai', url: 'mcp://ai.local', status: 'connected', tools: ['chat', 'vision', 'embedding', 'speech'] },
    { id: 'mcp-6', name: 'Email MCP', type: 'email', url: 'mcp://email.local', status: 'disconnected', tools: ['send_email', 'read_inbox', 'create_draft'] },
  ]);

  const toggleServer = (id: string) => {
    setServers(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'connected' ? 'disconnected' : 'connected' } : s
    ));
  };

  const getServerIcon = (type: string) => {
    switch (type) {
      case 'github': return <GitBranch size={24} />;
      case 'database': return <Database size={24} />;
      case 'web': return <Globe size={24} />;
      case 'payment': return <CurrencyDollar size={24} />;
      case 'ai': return <Brain size={24} />;
      case 'email': return <Envelope size={24} />;
      default: return <Cpu size={24} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PlugsConnected size={24} weight="duotone" className="text-purple-500" />
              MCP 服务器管理
            </CardTitle>
            <CardDescription>
              管理 Model Context Protocol 服务器 • 约400+可用AI Agent工具
            </CardDescription>
          </div>
          <Button className="gap-2">
            <Plus size={18} />
            添加服务器
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 服务器统计 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-800">{servers.filter(s => s.status === 'connected').length}</div>
            <div className="text-sm text-green-600">已连接</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-800">{servers.reduce((sum, s) => sum + s.tools.length, 0)}</div>
            <div className="text-sm text-blue-600">可用工具</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-800">400+</div>
            <div className="text-sm text-purple-600">MCP市场</div>
          </div>
        </div>

        {/* 服务器列表 */}
        <div className="space-y-3">
          {servers.map(server => (
            <div 
              key={server.id}
              className={`p-4 border rounded-lg transition-all ${
                server.status === 'connected' ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    server.status === 'connected' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {getServerIcon(server.type)}
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {server.name}
                      <Badge variant={server.status === 'connected' ? 'default' : 'secondary'} className="text-xs">
                        {server.status === 'connected' ? '已连接' : '已断开'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{server.url}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => toast.info('配置服务器')}>
                    <Gear size={18} />
                  </Button>
                  <Switch
                    checked={server.status === 'connected'}
                    onCheckedChange={() => toggleServer(server.id)}
                  />
                </div>
              </div>
              
              {/* 工具列表 */}
              <div className="flex flex-wrap gap-1">
                {server.tools.map(tool => (
                  <Badge key={tool} variant="outline" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* MCP市场入口 */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">MCP 服务器市场</div>
              <div className="text-sm text-muted-foreground">浏览 400+ 可用的 AI Agent MCP 服务器</div>
            </div>
            <Button variant="outline" className="gap-2">
              <Globe size={18} />
              浏览市场
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// AI 工作流编辑器
// ============================================

export function AIWorkflowEditor() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'wf-1',
      name: '智能收款通知',
      description: '收到付款后自动发送通知和更新库存',
      nodes: [],
      status: 'active',
      runs: 1234,
      lastRun: '2分钟前',
      createdAt: '2024-01-15',
    },
    {
      id: 'wf-2',
      name: 'AI 客服自动回复',
      description: '使用 AI 自动回复客户咨询',
      nodes: [],
      status: 'active',
      runs: 5678,
      lastRun: '5分钟前',
      createdAt: '2024-01-10',
    },
    {
      id: 'wf-3',
      name: '订单异常检测',
      description: 'AI 检测异常订单并自动处理',
      nodes: [],
      status: 'active',
      runs: 890,
      lastRun: '1小时前',
      createdAt: '2024-01-08',
    },
    {
      id: 'wf-4',
      name: '每日报表生成',
      description: '自动生成并发送每日业务报表',
      nodes: [],
      status: 'inactive',
      runs: 45,
      lastRun: '昨天',
      createdAt: '2024-01-05',
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  // 节点模板
  const nodeTemplates = [
    { category: '触发器', items: [
      { type: 'trigger', name: 'Webhook', icon: <Webhook size={20} /> },
      { type: 'trigger', name: '定时任务', icon: <Timer size={20} /> },
      { type: 'trigger', name: '支付完成', icon: <CurrencyDollar size={20} /> },
      { type: 'trigger', name: '新订单', icon: <ShoppingCart size={20} /> },
    ]},
    { category: 'AI 操作', items: [
      { type: 'ai', name: 'AI 对话', icon: <ChatCircle size={20} /> },
      { type: 'ai', name: 'AI 分析', icon: <Brain size={20} /> },
      { type: 'ai', name: '图像识别', icon: <Image size={20} /> },
      { type: 'ai', name: '语音识别', icon: <Microphone size={20} /> },
    ]},
    { category: 'MCP 工具', items: [
      { type: 'mcp', name: 'GitHub', icon: <GitBranch size={20} /> },
      { type: 'mcp', name: '数据库', icon: <Database size={20} /> },
      { type: 'mcp', name: 'Web 搜索', icon: <Globe size={20} /> },
      { type: 'mcp', name: '支付系统', icon: <CurrencyDollar size={20} /> },
    ]},
    { category: '通用操作', items: [
      { type: 'action', name: '发送邮件', icon: <Envelope size={20} /> },
      { type: 'action', name: 'HTTP 请求', icon: <Globe size={20} /> },
      { type: 'action', name: '代码执行', icon: <Code size={20} /> },
      { type: 'action', name: '条件判断', icon: <GitBranch size={20} /> },
    ]},
  ];

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' } : w
    ));
    toast.success('工作流状态已更新');
  };

  return (
    <div className="space-y-6">
      {/* 工作流列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flow size={24} weight="duotone" className="text-blue-500" />
                AI 工作流自动化
              </CardTitle>
              <CardDescription>
                类似 n8n/Activepieces 的无代码AI工作流引擎 • 支持 MCP 服务器
              </CardDescription>
            </div>
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Plus size={18} />
              创建工作流
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 统计 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-800">{workflows.length}</div>
              <div className="text-sm text-blue-600">工作流</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-800">{workflows.filter(w => w.status === 'active').length}</div>
              <div className="text-sm text-green-600">运行中</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-800">{workflows.reduce((sum, w) => sum + w.runs, 0).toLocaleString()}</div>
              <div className="text-sm text-purple-600">总执行次数</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-800">99.9%</div>
              <div className="text-sm text-orange-600">成功率</div>
            </div>
          </div>

          {/* 工作流列表 */}
          <div className="space-y-3">
            {workflows.map(workflow => (
              <div 
                key={workflow.id}
                className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer ${
                  workflow.status === 'active' ? 'border-green-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      workflow.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Flow size={24} />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {workflow.name}
                        <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                          {workflow.status === 'active' ? '运行中' : '已停止'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{workflow.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{workflow.runs.toLocaleString()} 次执行</div>
                      <div className="text-xs text-muted-foreground">上次: {workflow.lastRun}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <PencilSimple size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleWorkflow(workflow.id)}
                      >
                        {workflow.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 节点库 */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">节点库</CardTitle>
            <CardDescription>拖拽节点到画布构建工作流</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {nodeTemplates.map(category => (
                <div key={category.category}>
                  <Label className="mb-3 block">{category.category}</Label>
                  <div className="space-y-2">
                    {category.items.map(item => (
                      <div
                        key={item.name}
                        className="p-3 border rounded-lg flex items-center gap-3 cursor-move hover:bg-muted hover:border-primary transition-colors"
                        draggable
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          item.type === 'trigger' ? 'bg-yellow-100 text-yellow-600' :
                          item.type === 'ai' ? 'bg-purple-100 text-purple-600' :
                          item.type === 'mcp' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 画布区域 */}
      {isEditing && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">工作流画布</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  取消
                </Button>
                <Button size="sm" className="gap-2">
                  <CheckCircle size={16} />
                  保存工作流
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-lg border-2 border-dashed flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TreeStructure size={64} className="mx-auto mb-4" />
                <p className="text-lg font-medium">拖拽节点到这里</p>
                <p className="text-sm">从左侧节点库选择节点开始构建工作流</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================
// AI Agent 控制中心
// ============================================

export function AIAgentHub() {
  const [agents] = useState([
    { id: 'agent-1', name: '支付助手', type: 'payment', status: 'active', tasks: 156, successRate: 99.2 },
    { id: 'agent-2', name: '客服机器人', type: 'support', status: 'active', tasks: 2340, successRate: 95.8 },
    { id: 'agent-3', name: '数据分析师', type: 'analytics', status: 'active', tasks: 89, successRate: 98.5 },
    { id: 'agent-4', name: '风控专家', type: 'risk', status: 'active', tasks: 567, successRate: 99.9 },
    { id: 'agent-5', name: '运营助手', type: 'ops', status: 'idle', tasks: 23, successRate: 100 },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Robot size={24} weight="duotone" className="text-cyan-500" />
          AI Agent 控制中心
        </CardTitle>
        <CardDescription>管理和监控所有 AI Agent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map(agent => (
          <div key={agent.id} className="p-4 border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                agent.status === 'active' ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <Robot size={24} weight="duotone" />
              </div>
              <div>
                <div className="font-bold flex items-center gap-2">
                  {agent.name}
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status === 'active' ? '工作中' : '空闲'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  已完成 {agent.tasks} 个任务 • 成功率 {agent.successRate}%
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">配置</Button>
              <Button variant="outline" size="sm">日志</Button>
            </div>
          </div>
        ))}

        <Button className="w-full gap-2">
          <Plus size={18} />
          创建新 AI Agent
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================
// 主组件 - AI 自动化工作流系统
// ============================================

export function AIWorkflowAutomation() {
  return (
    <div className="space-y-6">
      {/* 头部介绍 */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Brain size={40} weight="duotone" className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold">AI 工作流自动化引擎</div>
              <div className="text-muted-foreground">
                类似 n8n / Activepieces • 无代码 AI Agent • MCP 服务器集成 • 智能自动化
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600">400+</div>
                <div className="text-sm text-muted-foreground">MCP 工具</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">∞</div>
                <div className="text-sm text-muted-foreground">工作流</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-600">24/7</div>
                <div className="text-sm text-muted-foreground">自动运行</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="workflows" className="gap-2">
            <Flow size={18} />
            工作流
          </TabsTrigger>
          <TabsTrigger value="mcp" className="gap-2">
            <PlugsConnected size={18} />
            MCP 服务器
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-2">
            <Robot size={18} />
            AI Agents
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <FileText size={18} />
            执行日志
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows">
          <AIWorkflowEditor />
        </TabsContent>

        <TabsContent value="mcp">
          <MCPServerManager />
        </TabsContent>

        <TabsContent value="agents">
          <AIAgentHub />
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>执行日志</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2 font-mono text-sm">
                  {[
                    { time: '14:32:05', level: 'info', msg: '[支付通知] 收到新订单 #12345, 金额 ¥299.00' },
                    { time: '14:32:06', level: 'success', msg: '[AI分析] 订单风险评估: 低风险 (score: 12)' },
                    { time: '14:32:07', level: 'info', msg: '[MCP:Payment] 调用 create_payment 成功' },
                    { time: '14:32:08', level: 'success', msg: '[邮件通知] 已发送确认邮件至 customer@example.com' },
                    { time: '14:31:45', level: 'info', msg: '[客服机器人] 收到用户咨询: "订单什么时候发货?"' },
                    { time: '14:31:46', level: 'success', msg: '[AI对话] 自动回复已发送' },
                    { time: '14:30:22', level: 'warning', msg: '[风控检测] 发现异常交易模式, 已标记审核' },
                    { time: '14:28:15', level: 'info', msg: '[定时任务] 每日报表生成中...' },
                    { time: '14:28:45', level: 'success', msg: '[定时任务] 报表已生成并发送' },
                  ].map((log, idx) => (
                    <div key={idx} className={`p-2 rounded ${
                      log.level === 'success' ? 'bg-green-50 text-green-700' :
                      log.level === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                      log.level === 'error' ? 'bg-red-50 text-red-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      <span className="text-muted-foreground">{log.time}</span>
                      {' '}
                      <span>{log.msg}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
