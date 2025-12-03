import { useState, useRef, useEffect, useCallback } from 'react';
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
  CheckCircle,
  Warning,
  ArrowClockwise,
} from '@phosphor-icons/react';
import {
  generateMockAIAssistantState,
  formatTimeAgo,
} from '@/lib/mock-data';
import type { AIMessage, AIMemoryItem, AICapability } from '@/lib/types';
import { AIModelSettingsPanel } from './AIModelSettings';
import {
  OllamaClient,
  type OllamaConnectionStatus,
  type OllamaModel,
  getOllamaClient,
  formatModelSize,
  getModelFamily,
  type OllamaChatMessage,
} from '@/lib/ollama';
import { toast } from 'sonner';

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
  
  // Ollama integration state
  const [ollamaStatus, setOllamaStatus] = useState<OllamaConnectionStatus>({ connected: false });
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('llama3:8b');
  const [useOllama, setUseOllama] = useState(true);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const ollamaClientRef = useRef<OllamaClient | null>(null);

  // Initialize Ollama client and check connection
  const checkOllamaConnection = useCallback(async () => {
    setIsCheckingConnection(true);
    try {
      const client = getOllamaClient();
      ollamaClientRef.current = client;
      
      const status = await client.checkConnection();
      setOllamaStatus(status);
      
      if (status.connected) {
        const models = await client.listModels();
        setAvailableModels(models);
        if (models.length > 0 && !models.find(m => m.name === selectedModel)) {
          setSelectedModel(models[0].name);
        }
        toast.success(`已连接到 Ollama 服务器 (v${status.version})`);
      }
    } catch (error) {
      setOllamaStatus({ connected: false, error: error instanceof Error ? error.message : '连接失败' });
    } finally {
      setIsCheckingConnection(false);
    }
  }, [selectedModel]);

  useEffect(() => {
    if (useOllama) {
      checkOllamaConnection();
    }
  }, [useOllama, checkOllamaConnection]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.currentConversation]);

  // Convert conversation to Ollama format
  const convertToOllamaMessages = (messages: AIMessage[]): OllamaChatMessage[] => {
    return messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));
  };

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

    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      let responseContent: string;

      if (useOllama && ollamaStatus.connected && ollamaClientRef.current) {
        // Use Ollama API for real AI response
        const ollamaMessages = convertToOllamaMessages([...state.currentConversation, userMessage]);
        
        // Update client with selected model
        ollamaClientRef.current.updateConfig({ modelName: selectedModel });
        
        responseContent = await ollamaClientRef.current.chat(ollamaMessages);
      } else {
        // Fallback to mock response
        await new Promise(resolve => setTimeout(resolve, 1000));
        responseContent = generateAIResponse(currentInput);
      }

      const aiResponse: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
        action: detectAction(currentInput),
      };

      setState((prev) => ({
        ...prev,
        currentConversation: [...prev.currentConversation, aiResponse],
        lastActiveAt: Date.now(),
      }));
    } catch (error) {
      console.error('AI response error:', error);
      toast.error('AI响应失败，请检查Ollama连接');
      
      // Fallback response on error
      const errorResponse: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，我在处理您的请求时遇到了问题。请确保 Ollama 服务正在运行并重试。',
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        currentConversation: [...prev.currentConversation, errorResponse],
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
        <div className="flex items-center gap-3">
          {/* Ollama Connection Status */}
          <div className="flex items-center gap-2">
            {isCheckingConnection ? (
              <Badge variant="outline" className="gap-1">
                <ArrowClockwise size={14} className="animate-spin" />
                连接中...
              </Badge>
            ) : ollamaStatus.connected ? (
              <Badge variant="outline" className="gap-1 border-green-300 bg-green-50 text-green-700">
                <CheckCircle size={14} weight="fill" />
                Ollama v{ollamaStatus.version}
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 border-orange-300 bg-orange-50 text-orange-700">
                <Warning size={14} weight="fill" />
                Ollama 离线
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={checkOllamaConnection}
              disabled={isCheckingConnection}
              title="刷新连接状态"
            >
              <ArrowClockwise size={16} className={isCheckingConnection ? 'animate-spin' : ''} />
            </Button>
          </div>
          <Badge className="gap-1" variant={state.isActive ? 'default' : 'secondary'}>
            <Sparkle size={14} weight="fill" />
            {state.isActive ? '活跃中' : '休眠'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        {/* TabsList with 4 tabs: 对话, 记忆, 能力, 模型 */}
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
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
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          {/* Ollama Control Panel */}
          <Card className="border-dashed">
            <CardContent className="py-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="use-ollama"
                      checked={useOllama}
                      onCheckedChange={setUseOllama}
                    />
                    <label htmlFor="use-ollama" className="text-sm font-medium cursor-pointer">
                      使用 Ollama
                    </label>
                  </div>
                  
                  {useOllama && availableModels.length > 0 && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">模型:</label>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="h-8 px-2 text-sm border rounded-md bg-background"
                      >
                        {availableModels.map((model) => (
                          <option key={model.name} value={model.name}>
                            {model.name} ({formatModelSize(model.size)})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {useOllama ? (
                    ollamaStatus.connected ? (
                      <span className="text-green-600">
                        ✓ 已连接 - 使用 {getModelFamily(selectedModel)} 模型
                      </span>
                    ) : (
                      <span className="text-orange-600">
                        ⚠ 请启动 Ollama: <code className="bg-muted px-1 rounded">ollama serve</code>
                      </span>
                    )
                  ) : (
                    <span>使用模拟响应模式</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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
                        <span className="text-sm text-muted-foreground">
                          {useOllama && ollamaStatus.connected 
                            ? `${getModelFamily(selectedModel)} 正在思考...` 
                            : 'AI 正在思考...'}
                        </span>
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
                  onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} className="gap-2" disabled={isTyping}>
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
                    disabled={isTyping}
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
      </Tabs>
    </div>
  );
}

// Helper functions for AI responses
function generateAIResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('钱包') || lowerInput.includes('余额') || lowerInput.includes('wallet') || lowerInput.includes('balance')) {
    return '我已经检查了您的钱包状态。您目前有:\n\n💰 **总资产**: $231,690.75\n\n主要钱包:\n- Treasury Vault: $125,432 (Ethereum)\n- Operating Account: $23,234 (Polygon)\n- DeFi Strategy: $8,024 (Arbitrum)\n\n需要我执行什么操作吗？';
  }
  
  if (lowerInput.includes('交易') || lowerInput.includes('转账') || lowerInput.includes('transaction') || lowerInput.includes('transfer')) {
    return '我可以帮您创建新交易。请提供以下信息:\n\n1. 发送方钱包\n2. 接收地址\n3. 金额和代币\n4. 交易描述\n\n或者您可以说 "从Treasury Vault转账5000 USDC到供应商"，我会自动解析。';
  }
  
  if (lowerInput.includes('风险') || lowerInput.includes('分析') || lowerInput.includes('risk') || lowerInput.includes('analysis')) {
    return '🔍 **风险分析报告**\n\n当前待处理交易风险:\n\n⚠️ **高风险** - tx-3 (Operating Account)\n- 大额转账: 25,000 USDT\n- 首次收款地址\n- 建议: 验证收款方身份\n\n✅ **低风险** - tx-1 (Treasury Vault)\n- 已知收款方\n- 常规交易模式\n\n需要我提供更详细的分析吗？';
  }
  
  if (lowerInput.includes('defi') || lowerInput.includes('策略') || lowerInput.includes('收益')) {
    return '📊 **DeFi 策略建议**\n\n基于您的风险偏好，推荐:\n\n1. **稳定币借贷** (Aave V3)\n   - APY: 5.2%\n   - 风险: 低\n\n2. **ETH 质押** (Lido)\n   - APY: 3.8%\n   - 风险: 低\n\n3. **流动性挖矿** (Uniswap V3)\n   - APY: 12.5%\n   - 风险: 中\n\n需要我帮您配置自动投资策略吗？';
  }
  
  return '感谢您的提问！我是 OmniCore 智能助手，可以帮助您:\n\n• 📊 查询和管理钱包\n• 💸 创建和签署交易\n• 🔍 分析交易风险\n• 📈 管理 DeFi 策略\n• ⚙️ 配置平台设置\n\n请告诉我您需要什么帮助？';
}

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
