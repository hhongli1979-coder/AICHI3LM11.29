import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Robot,
  Brain,
  ChatCircle,
  PaperPlaneTilt,
  Wallet,
  ArrowsLeftRight,
  ChartLine,
  ShieldCheck,
  Sparkle,
  Lightning,
  Memory,
  Gear,
  Database,
  Users,
} from '@phosphor-icons/react';
import {
  generateMockAIAssistantState,
  formatTimeAgo,
} from '@/lib/mock-data';
import { sendAIMessage } from '@/lib/ai-service';
import type { AIMessage, AIMemoryItem, AICapability } from '@/lib/types';
import { AIModelSettingsPanel } from './AIModelSettings';
import { SuperAgentDashboard } from './SuperAgentDashboard';

function getCapabilityIcon(iconName: string) {
  const icons: Record<string, React.ReactNode> = {
    Brain: <Brain size={18} weight="duotone" />,
    ChartLine: <ChartLine size={18} weight="duotone" />,
    ChatCircle: <ChatCircle size={18} weight="duotone" />,
    Robot: <Robot size={18} weight="duotone" />,
    Wallet: <Wallet size={18} weight="duotone" />,
    ArrowsLeftRight: <ArrowsLeftRight size={18} weight="duotone" />,
    ShieldCheck: <ShieldCheck size={18} weight="duotone" />,
  };
  return icons[iconName] || <Sparkle size={18} weight="duotone" />;
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'memory':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'language':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'control':
      return 'bg-green-100 text-green-700 border-green-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'memory':
      return '记忆';
    case 'language':
      return '语言';
    case 'control':
      return '控制';
    default:
      return category;
  }
}

function getMemoryTypeColor(type: string): string {
  switch (type) {
    case 'preference':
      return 'bg-blue-50 border-blue-200';
    case 'transaction_pattern':
      return 'bg-green-50 border-green-200';
    case 'contact':
      return 'bg-purple-50 border-purple-200';
    case 'insight':
      return 'bg-amber-50 border-amber-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}

function getMemoryTypeLabel(type: string): string {
  switch (type) {
    case 'preference':
      return '偏好';
    case 'transaction_pattern':
      return '交易模式';
    case 'contact':
      return '联系人';
    case 'insight':
      return '洞察';
    default:
      return type;
  }
}

interface MessageBubbleProps {
  message: AIMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <Robot size={16} weight="duotone" className="text-primary" />
            <span className="text-xs font-medium text-primary">OmniCore AI</span>
          </div>
        )}
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        {message.action && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs opacity-80">
              <Lightning size={12} weight="fill" />
              <span>操作: {message.action.type}</span>
              <Badge variant="outline" className="text-xs py-0">
                {message.action.status === 'completed' ? '✓ 完成' : message.action.status}
              </Badge>
            </div>
          </div>
        )}
        <div className="text-xs opacity-60 mt-1">
          {formatTimeAgo(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

interface MemoryCardProps {
  memory: AIMemoryItem;
}

function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <Card className={`${getMemoryTypeColor(memory.type)} border`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {getMemoryTypeLabel(memory.type)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                置信度: {Math.round(memory.confidence * 100)}%
              </span>
            </div>
            <div className="font-medium text-sm">{memory.key}</div>
            <div className="text-sm text-muted-foreground mt-1">{memory.value}</div>
          </div>
          <Brain size={20} weight="duotone" className="text-purple-500 ml-2" />
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span>使用 {memory.usageCount} 次</span>
          <span>学习于 {formatTimeAgo(memory.learnedAt)}</span>
        </div>
        <Progress value={memory.confidence * 100} className="h-1 mt-2" />
      </CardContent>
    </Card>
  );
}

interface CapabilityCardProps {
  capability: AICapability;
  onToggle: (id: string) => void;
}

function CapabilityCard({ capability, onToggle }: CapabilityCardProps) {
  return (
    <Card className="border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getCategoryColor(capability.category)}`}>
              {getCapabilityIcon(capability.icon)}
            </div>
            <div>
              <div className="font-medium text-sm flex items-center gap-2">
                {capability.name}
                <Badge variant="outline" className={`text-xs ${getCategoryColor(capability.category)}`}>
                  {getCategoryLabel(capability.category)}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {capability.description}
              </div>
            </div>
          </div>
          <Switch
            checked={capability.enabled}
            onCheckedChange={() => onToggle(capability.id)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function AIAssistant() {
  const [state, setState] = useState(generateMockAIAssistantState);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.currentConversation]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      currentConversation: [...prev.currentConversation, userMessage],
      lastActiveAt: Date.now(),
    }));

    const messageContent = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // 使用真实AI服务 (支持API调用和本地回退)
      const response = await sendAIMessage(messageContent);
      
      const aiResponse: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        action: response.action,
      };

      setState((prev) => ({
        ...prev,
        currentConversation: [...prev.currentConversation, aiResponse],
        lastActiveAt: Date.now(),
      }));
    } catch (error) {
      console.error('AI response error:', error);
      // 使用本地回退响应
      const aiResponse: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，处理您的请求时出现问题。请稍后再试。',
        timestamp: Date.now(),
      };
      setState((prev) => ({
        ...prev,
        currentConversation: [...prev.currentConversation, aiResponse],
        lastActiveAt: Date.now(),
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleCapability = (id: string) => {
    setState((prev) => ({
      ...prev,
      capabilities: prev.capabilities.map((cap) =>
        cap.id === id ? { ...cap, enabled: !cap.enabled } : cap
      ),
    }));
  };

  const memoryCapabilities = state.capabilities.filter((c) => c.category === 'memory');
  const languageCapabilities = state.capabilities.filter((c) => c.category === 'language');
  const controlCapabilities = state.capabilities.filter((c) => c.category === 'control');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Robot size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">AI 智能助手</h2>
            <p className="text-muted-foreground">
              具备记忆、语言理解和全面控制能力的智能助手
            </p>
          </div>
        </div>
        <Badge className="gap-1" variant={state.isActive ? 'default' : 'secondary'}>
          <Sparkle size={14} weight="fill" />
          {state.isActive ? '活跃中' : '休眠'}
        </Badge>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        {/* TabsList with 5 tabs: 对话, 记忆, 能力, 模型, 超级智能体 */}
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="chat" className="gap-2">
            <ChatCircle size={18} weight="duotone" />
            <span className="hidden sm:inline">对话</span>
          </TabsTrigger>
          <TabsTrigger value="memory" className="gap-2">
            <Memory size={18} weight="duotone" />
            <span className="hidden sm:inline">记忆</span>
          </TabsTrigger>
          <TabsTrigger value="capabilities" className="gap-2">
            <Gear size={18} weight="duotone" />
            <span className="hidden sm:inline">能力</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-2">
            <Database size={18} weight="duotone" />
            <span className="hidden sm:inline">模型</span>
          </TabsTrigger>
          <TabsTrigger value="super-agent" className="gap-2">
            <Users size={18} weight="duotone" />
            <span className="hidden sm:inline">超级智能体</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ChatCircle size={20} weight="duotone" />
                智能对话
              </CardTitle>
              <CardDescription>
                使用自然语言与 AI 助手交流，执行钱包操作
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
                {state.currentConversation.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Robot size={16} weight="duotone" className="text-primary animate-pulse" />
                        <span className="text-sm text-muted-foreground">AI 正在思考...</span>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="输入您的问题或指令..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="gap-2">
                  <PaperPlaneTilt size={18} weight="fill" />
                  发送
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['查看钱包余额', '创建新交易', '分析风险', 'DeFi策略推荐'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain size={20} weight="duotone" className="text-purple-500" />
                AI 记忆库
              </CardTitle>
              <CardDescription>
                AI 从您的操作中学习到的偏好、模式和洞察
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {state.memories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkle size={16} weight="fill" className="text-amber-500" />
                  <span className="font-medium text-sm">记忆统计</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{state.memories.length}</div>
                    <div className="text-xs text-muted-foreground">已学习记忆</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {state.memories.length > 0
                        ? Math.round(
                            state.memories.reduce((acc, m) => acc + m.confidence, 0) /
                              state.memories.length *
                              100
                          )
                        : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">平均置信度</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {state.memories.reduce((acc, m) => acc + m.usageCount, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">总使用次数</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain size={20} weight="duotone" className="text-purple-500" />
                  记忆能力
                </CardTitle>
                <CardDescription>
                  学习和记住用户偏好与模式
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {memoryCapabilities.map((cap) => (
                  <CapabilityCard
                    key={cap.id}
                    capability={cap}
                    onToggle={handleToggleCapability}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChatCircle size={20} weight="duotone" className="text-blue-500" />
                  语言能力
                </CardTitle>
                <CardDescription>
                  自然语言理解与生成
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {languageCapabilities.map((cap) => (
                  <CapabilityCard
                    key={cap.id}
                    capability={cap}
                    onToggle={handleToggleCapability}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightning size={20} weight="duotone" className="text-green-500" />
                  控制能力
                </CardTitle>
                <CardDescription>
                  执行和管理平台功能
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {controlCapabilities.map((cap) => (
                  <CapabilityCard
                    key={cap.id}
                    capability={cap}
                    onToggle={handleToggleCapability}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <AIModelSettingsPanel />
        </TabsContent>

        <TabsContent value="super-agent" className="space-y-4">
          <SuperAgentDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Note: AI response generation and action detection have been moved to src/lib/ai-service.ts
// The AIAssistant now uses the real AI service with API support and local fallback
