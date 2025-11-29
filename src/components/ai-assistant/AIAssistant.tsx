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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  CircleWavyCheck,
} from '@phosphor-icons/react';
import {
  generateMockAIAssistantState,
  formatTimeAgo,
  generateAdvancedAIResponse,
} from '@/lib/mock-data';
import type { AIMessage, AIMemoryItem, AICapability, AIModelType, AIModel } from '@/lib/types';

function getCapabilityIcon(iconName: string) {
  const icons: Record<string, React.ReactNode> = {
    Brain: <Brain size={18} weight="duotone" />,
    ChartLine: <ChartLine size={18} weight="duotone" />,
    ChatCircle: <ChatCircle size={18} weight="duotone" />,
    Robot: <Robot size={18} weight="duotone" />,
    Wallet: <Wallet size={18} weight="duotone" />,
    ArrowsLeftRight: <ArrowsLeftRight size={18} weight="duotone" />,
    ShieldCheck: <ShieldCheck size={18} weight="duotone" />,
    Lightning: <Lightning size={18} weight="duotone" />,
  };
  return icons[iconName] || <Sparkle size={18} weight="duotone" />;
}

function getModelIcon(iconName: string, size: number = 18) {
  const icons: Record<string, React.ReactNode> = {
    Brain: <Brain size={size} weight="duotone" />,
    Robot: <Robot size={size} weight="duotone" />,
    Lightning: <Lightning size={size} weight="duotone" />,
  };
  return icons[iconName] || <Robot size={size} weight="duotone" />;
}

function getModelColor(modelId: AIModelType): string {
  switch (modelId) {
    case 'omnicore':
      return 'from-primary to-accent';
    case 'claude':
      return 'from-purple-500 to-pink-500';
    case 'mxyejic':
      return 'from-amber-500 to-orange-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
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
  availableModels?: AIModel[];
}

function MessageBubble({ message, availableModels }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const model = availableModels?.find(m => m.id === message.model);
  const modelName = model?.name || 'OmniCore AI';
  const modelIcon = model?.icon || 'Robot';
  
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
            {getModelIcon(modelIcon, 16)}
            <span className="text-xs font-medium text-primary">{modelName}</span>
            {model?.isAdvanced && (
              <Badge variant="secondary" className="text-xs py-0 px-1">
                高级
              </Badge>
            )}
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

  const handleModelChange = (modelId: AIModelType) => {
    setState((prev) => ({
      ...prev,
      currentModel: modelId,
    }));
  };

  const currentModel = state.availableModels.find(m => m.id === state.currentModel);

  const handleSendMessage = () => {
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

    setInputValue('');
    setIsTyping(true);

    // Simulate AI response based on selected model
    const responseDelay = state.currentModel === 'omnicore' ? 1500 : 2000;
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: generateAdvancedAIResponse(inputValue, state.currentModel),
        timestamp: Date.now(),
        action: detectAction(inputValue),
        model: state.currentModel,
      };

      setState((prev) => ({
        ...prev,
        currentConversation: [...prev.currentConversation, aiResponse],
        lastActiveAt: Date.now(),
      }));
      setIsTyping(false);
    }, responseDelay);
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${getModelColor(state.currentModel)}`}>
            {getModelIcon(currentModel?.icon || 'Robot', 32)}
          </div>
          <div>
            <h2 className="text-3xl font-bold">AI 智能助手</h2>
            <p className="text-muted-foreground">
              高级机器人集成 - 支持多模型切换
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={state.currentModel} onValueChange={(value) => handleModelChange(value as AIModelType)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择AI模型" />
            </SelectTrigger>
            <SelectContent>
              {state.availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    {getModelIcon(model.icon, 16)}
                    <span>{model.name}</span>
                    {model.isAdvanced && (
                      <Badge variant="secondary" className="text-xs py-0 px-1 ml-1">
                        高级
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge className="gap-1" variant={state.isActive ? 'default' : 'secondary'}>
            <Sparkle size={14} weight="fill" />
            {state.isActive ? '活跃中' : '休眠'}
          </Badge>
        </div>
      </div>

      {/* Model Info Card */}
      {currentModel && (
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${getModelColor(state.currentModel)} text-white`}>
                {getModelIcon(currentModel.icon, 24)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{currentModel.name}</h3>
                  {currentModel.isAdvanced && (
                    <Badge variant="secondary" className="text-xs">高级模型</Badge>
                  )}
                  <Badge variant={currentModel.status === 'online' ? 'default' : 'destructive'} className="text-xs gap-1">
                    <CircleWavyCheck size={12} weight="fill" />
                    {currentModel.status === 'online' ? '在线' : '离线'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{currentModel.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentModel.capabilities.map((cap) => (
                    <Badge key={cap} variant="outline" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="chat" className="gap-2">
            <ChatCircle size={18} weight="duotone" />
            <span className="hidden sm:inline">对话</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-2">
            <Robot size={18} weight="duotone" />
            <span className="hidden sm:inline">模型</span>
          </TabsTrigger>
          <TabsTrigger value="memory" className="gap-2">
            <Memory size={18} weight="duotone" />
            <span className="hidden sm:inline">记忆</span>
          </TabsTrigger>
          <TabsTrigger value="capabilities" className="gap-2">
            <Gear size={18} weight="duotone" />
            <span className="hidden sm:inline">能力</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ChatCircle size={20} weight="duotone" />
                智能对话
                {currentModel && (
                  <Badge variant="outline" className="ml-2 text-xs gap-1">
                    {getModelIcon(currentModel.icon, 12)}
                    {currentModel.name}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                使用自然语言与 {currentModel?.name || 'AI'} 交流，执行钱包操作
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
                {state.currentConversation.map((message) => (
                  <MessageBubble key={message.id} message={message} availableModels={state.availableModels} />
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getModelIcon(currentModel?.icon || 'Robot', 16)}
                        <span className="text-sm text-muted-foreground">{currentModel?.name || 'AI'} 正在思考...</span>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder={`向 ${currentModel?.name || 'AI'} 提问...`}
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

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Robot size={20} weight="duotone" className="text-primary" />
                AI 模型管理
              </CardTitle>
              <CardDescription>
                选择和配置高级AI机器人模型
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {state.availableModels.map((model) => (
                  <Card 
                    key={model.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      state.currentModel === model.id 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleModelChange(model.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${getModelColor(model.id)} text-white mb-4`}>
                          {getModelIcon(model.icon, 40)}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{model.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          {model.isAdvanced && (
                            <Badge variant="secondary" className="text-xs">高级</Badge>
                          )}
                          <Badge variant={model.status === 'online' ? 'default' : 'destructive'} className="text-xs gap-1">
                            <CircleWavyCheck size={10} weight="fill" />
                            {model.status === 'online' ? '在线' : '离线'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {model.capabilities.slice(0, 3).map((cap) => (
                            <Badge key={cap} variant="outline" className="text-xs">
                              {cap}
                            </Badge>
                          ))}
                          {model.capabilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{model.capabilities.length - 3}
                            </Badge>
                          )}
                        </div>
                        {state.currentModel === model.id && (
                          <Badge className="mt-4 gap-1">
                            <Sparkle size={12} weight="fill" />
                            当前使用
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightning size={16} weight="fill" className="text-amber-500" />
                  <span className="font-medium text-sm">模型能力对比</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">功能</th>
                        {state.availableModels.map((model) => (
                          <th key={model.id} className="text-center py-2">{model.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['钱包管理', '风险评估', '高级推理', '市场预测', '智能合约审计'].map((feature) => (
                        <tr key={feature} className="border-b border-border/50">
                          <td className="py-2">{feature}</td>
                          {state.availableModels.map((model) => (
                            <td key={model.id} className="text-center py-2">
                              {model.capabilities.includes(feature) ? (
                                <CircleWavyCheck size={18} weight="fill" className="text-green-500 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
      </Tabs>
    </div>
  );
}

// Helper function for detecting AI actions
function detectAction(input: string): AIMessage['action'] | undefined {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('钱包') || lowerInput.includes('余额')) {
    return { type: 'wallet_query', status: 'completed' };
  }
  if (lowerInput.includes('交易') || lowerInput.includes('转账')) {
    return { type: 'transaction_create', status: 'pending' };
  }
  if (lowerInput.includes('风险') || lowerInput.includes('分析')) {
    return { type: 'risk_analyze', status: 'completed' };
  }
  if (lowerInput.includes('defi') || lowerInput.includes('策略')) {
    return { type: 'defi_manage', status: 'completed' };
  }
  
  return undefined;
}
