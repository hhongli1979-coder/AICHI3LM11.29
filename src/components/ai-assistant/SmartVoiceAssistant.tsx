import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Microphone, 
  MicrophoneSlash, 
  SpeakerHigh, 
  SpeakerSlash,
  Robot,
  Lightning,
  NavigationArrow,
  CreditCard,
  Wallet,
  Car,
  ShoppingCart,
  ChartLine,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Spinner,
  Play,
  Pause,
  X
} from '@phosphor-icons/react';
import { toast } from 'sonner';

// Add SpeechRecognition type for TypeScript
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

// 语音命令类型
interface VoiceCommand {
  id: string;
  keywords: string[];
  action: string;
  category: 'payment' | 'navigation' | 'taxi' | 'wallet' | 'defi' | 'general';
  description: string;
  examples: string[];
  handler: (params?: string) => Promise<VoiceResponse>;
}

// 语音响应
interface VoiceResponse {
  text: string;
  action?: string;
  data?: Record<string, unknown>;
  followUp?: string;
}

// 对话消息
interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  action?: string;
}

// 语音命令库
const VOICE_COMMANDS: VoiceCommand[] = [
  // 支付相关
  {
    id: 'pay_alipay',
    keywords: ['支付宝', '支付宝支付', '用支付宝'],
    action: 'OPEN_ALIPAY',
    category: 'payment',
    description: '打开支付宝支付',
    examples: ['用支付宝支付', '打开支付宝', '支付宝付款'],
    handler: async () => ({
      text: '好的，正在打开支付宝支付页面，请扫描二维码完成支付。',
      action: 'OPEN_ALIPAY',
    }),
  },
  {
    id: 'pay_wechat',
    keywords: ['微信', '微信支付', '用微信'],
    action: 'OPEN_WECHAT',
    category: 'payment',
    description: '打开微信支付',
    examples: ['用微信支付', '打开微信', '微信付款'],
    handler: async () => ({
      text: '好的，正在打开微信支付，请使用微信扫一扫。',
      action: 'OPEN_WECHAT',
    }),
  },
  {
    id: 'pay_crypto',
    keywords: ['加密', '比特币', 'USDT', '加密货币'],
    action: 'OPEN_CRYPTO_PAY',
    category: 'payment',
    description: '加密货币支付',
    examples: ['用USDT支付', '加密货币付款', '比特币支付'],
    handler: async () => ({
      text: '正在生成加密货币支付地址，支持USDT、BTC、ETH等主流币种。',
      action: 'OPEN_CRYPTO_PAY',
    }),
  },
  {
    id: 'create_payment',
    keywords: ['收款', '生成收款', '收钱', '创建收款'],
    action: 'CREATE_PAYMENT',
    category: 'payment',
    description: '创建收款链接',
    examples: ['帮我生成收款码', '创建100元收款', '我要收钱'],
    handler: async (params) => ({
      text: `好的，正在为您生成收款二维码。${params ? `金额：${params}元` : '请告诉我收款金额。'}`,
      action: 'CREATE_PAYMENT',
      followUp: params ? undefined : '请问您要收多少钱？',
    }),
  },
  {
    id: 'check_balance',
    keywords: ['余额', '查余额', '我有多少钱', '账户余额'],
    action: 'CHECK_BALANCE',
    category: 'wallet',
    description: '查询账户余额',
    examples: ['查一下余额', '我的钱包有多少钱', '账户还剩多少'],
    handler: async () => ({
      text: '您的账户余额如下：\n💰 Treasury Vault: $125,432.18\n💎 Operating Account: $8,234.42\n📊 DeFi仓位总值: $75,029.00',
      action: 'CHECK_BALANCE',
      data: { total: 208695.60 },
    }),
  },
  {
    id: 'transfer',
    keywords: ['转账', '转钱', '发送', '汇款'],
    action: 'TRANSFER',
    category: 'wallet',
    description: '转账汇款',
    examples: ['转100USDT给张三', '给地址0x123转账', '汇款500元'],
    handler: async (params) => ({
      text: params 
        ? `正在准备转账，请确认交易详情后签名。` 
        : '好的，请告诉我转账金额和收款地址。',
      action: 'TRANSFER',
      followUp: params ? undefined : '您要转多少钱？转给谁？',
    }),
  },
  
  // 出租车相关
  {
    id: 'call_taxi',
    keywords: ['叫车', '打车', '叫出租车', '我要打车'],
    action: 'CALL_TAXI',
    category: 'taxi',
    description: '叫出租车',
    examples: ['帮我叫一辆车', '我要打车去机场', '叫个出租车'],
    handler: async (params) => ({
      text: params 
        ? `好的，正在为您叫车前往${params}，预计3分钟内有司机接单。`
        : '好的，请告诉我您的目的地。',
      action: 'CALL_TAXI',
      followUp: params ? undefined : '您要去哪里？',
    }),
  },
  {
    id: 'taxi_navigation',
    keywords: ['导航', '去哪里', '怎么走', '路线'],
    action: 'NAVIGATE',
    category: 'navigation',
    description: '导航到目的地',
    examples: ['导航到北京西站', '去机场怎么走', '帮我规划路线'],
    handler: async (params) => ({
      text: params 
        ? `正在为您规划前往${params}的最优路线，预计行程时间25分钟。`
        : '请告诉我您的目的地。',
      action: 'NAVIGATE',
    }),
  },
  {
    id: 'taxi_fare',
    keywords: ['多少钱', '车费', '费用', '价格'],
    action: 'ESTIMATE_FARE',
    category: 'taxi',
    description: '估算车费',
    examples: ['到机场多少钱', '车费大概多少', '估算一下费用'],
    handler: async () => ({
      text: '根据当前距离和路况，预计费用约45-55元。高峰期可能会有浮动。',
      action: 'ESTIMATE_FARE',
      data: { minFare: 45, maxFare: 55 },
    }),
  },
  
  // DeFi相关
  {
    id: 'defi_yield',
    keywords: ['收益', 'DeFi', '理财', 'APY', '年化'],
    action: 'CHECK_DEFI',
    category: 'defi',
    description: '查看DeFi收益',
    examples: ['查看我的DeFi收益', '年化收益多少', '理财收益情况'],
    handler: async () => ({
      text: '您的DeFi仓位收益情况：\n📈 Aave V3: 5.20% APY ($25,000)\n🌊 Lido: 4.80% APY ($30,000)\n🦄 Uniswap: 22.50% APY ($20,029)\n总加权收益率: 10.06%',
      action: 'CHECK_DEFI',
    }),
  },
  {
    id: 'swap_token',
    keywords: ['兑换', '换币', 'swap', '交换'],
    action: 'SWAP_TOKEN',
    category: 'defi',
    description: '代币兑换',
    examples: ['把ETH换成USDT', '兑换100个USDC', '我要换币'],
    handler: async (params) => ({
      text: params 
        ? `好的，正在为您准备${params}的兑换交易。当前汇率实时更新中。`
        : '您想兑换什么代币？请告诉我兑换的币种和数量。',
      action: 'SWAP_TOKEN',
    }),
  },
  
  // 代购相关
  {
    id: 'proxy_purchase',
    keywords: ['代购', '海外代购', '帮我买', '国外购买'],
    action: 'PROXY_PURCHASE',
    category: 'general',
    description: '全球代购服务',
    examples: ['帮我代购日本商品', '美国代购', '我想买海外商品'],
    handler: async (params) => ({
      text: params 
        ? `好的，正在为您搜索${params}，我们支持美国、日本、韩国、欧洲的代购服务。`
        : '您想代购什么商品？支持美国、日本、韩国、欧洲等地区。',
      action: 'PROXY_PURCHASE',
    }),
  },
  
  // 通用命令
  {
    id: 'help',
    keywords: ['帮助', '怎么用', '功能', '你能做什么'],
    action: 'SHOW_HELP',
    category: 'general',
    description: '显示帮助',
    examples: ['你能帮我做什么', '有什么功能', '帮助'],
    handler: async () => ({
      text: '我是您的智能助手，可以帮您：\n💳 支付收款（支付宝/微信/加密货币）\n🚖 叫车导航\n💰 查询余额、转账\n📈 查看DeFi收益\n🛒 全球代购\n\n您可以直接说出需求，比如"帮我叫车"或"查一下余额"。',
      action: 'SHOW_HELP',
    }),
  },
];

export function SmartVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是OmniCore智能助手。我可以帮您处理支付、叫车、查余额、DeFi等操作。请说"帮助"了解更多功能。',
      timestamp: Date.now(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化语音识别
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript;
        
        setTranscript(text);
        
        if (result.isFinal) {
          handleVoiceInput(text);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current?.start();
        }
      };
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [isListening]);

  // 开始/停止语音识别
  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setTranscript('');
    }
  }, [isListening]);

  // 语音合成
  const speak = useCallback((text: string) => {
    if (!voiceEnabled) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // 停止语音
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // 处理语音输入
  const handleVoiceInput = async (text: string) => {
    if (!text.trim()) return;

    // 添加用户消息
    const userMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    setIsProcessing(true);

    try {
      // 匹配命令
      const matchedCommand = findMatchingCommand(text);
      
      let response: VoiceResponse;
      if (matchedCommand) {
        // 提取参数
        const params = extractParams(text, matchedCommand.keywords);
        response = await matchedCommand.handler(params);
      } else {
        // 通用响应
        response = await handleGeneralQuery(text);
      }

      // 添加助手响应
      const assistantMessage: ConversationMessage = {
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        action: response.action,
      };
      setMessages(prev => [...prev, assistantMessage]);

      // 语音播报
      speak(response.text);

      // 处理后续问题
      if (response.followUp) {
        setPendingAction(response.action || null);
      }

      // 执行操作提示
      if (response.action) {
        toast.success(`执行操作: ${response.action}`);
      }
    } catch (error) {
      const errorMessage: ConversationMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: '抱歉，处理您的请求时出现了问题，请再试一次。',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // 查找匹配的命令
  const findMatchingCommand = (text: string): VoiceCommand | null => {
    const lowerText = text.toLowerCase();
    for (const command of VOICE_COMMANDS) {
      if (command.keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
        return command;
      }
    }
    return null;
  };

  // 提取参数
  const extractParams = (text: string, keywords: string[]): string | undefined => {
    for (const keyword of keywords) {
      const index = text.indexOf(keyword);
      if (index !== -1) {
        const after = text.slice(index + keyword.length).trim();
        if (after) return after;
      }
    }
    return undefined;
  };

  // 处理通用查询
  const handleGeneralQuery = async (text: string): Promise<VoiceResponse> => {
    // 数字识别（可能是金额）
    const amountMatch = text.match(/(\d+(?:\.\d+)?)/);
    if (amountMatch && pendingAction) {
      return {
        text: `好的，金额${amountMatch[1]}元已记录。正在处理您的请求...`,
        action: pendingAction,
      };
    }

    return {
      text: '我不太理解您的意思。您可以说"帮助"来了解我能做什么，或者直接说出您的需求，比如"帮我叫车"或"查一下余额"。',
    };
  };

  // 发送文本消息
  const handleTextSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    if (input.value.trim()) {
      handleVoiceInput(input.value);
      input.value = '';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Robot size={28} weight="duotone" className="text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">OmniCore 智能助手</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {isListening ? (
                  <>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    正在聆听...
                  </>
                ) : isProcessing ? (
                  <>
                    <Spinner size={14} className="animate-spin" />
                    处理中...
                  </>
                ) : (
                  '随时为您服务'
                )}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              title={voiceEnabled ? '关闭语音' : '开启语音'}
            >
              {voiceEnabled ? <SpeakerHigh size={18} /> : <SpeakerSlash size={18} />}
            </Button>
            {isSpeaking && (
              <Button variant="outline" size="icon" onClick={stopSpeaking}>
                <X size={18} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
        {/* 对话区域 */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  {message.action && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {message.action}
                    </Badge>
                  )}
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('zh-CN')}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* 语音转文字显示 */}
        {transcript && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <span className="text-blue-600">🎤 </span>
            {transcript}
          </div>
        )}

        {/* 快捷命令 */}
        <div className="flex flex-wrap gap-2 mt-4 pb-2">
          <Button variant="outline" size="sm" onClick={() => handleVoiceInput('查一下余额')}>
            <Wallet size={16} className="mr-1" /> 查余额
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleVoiceInput('帮我叫车')}>
            <Car size={16} className="mr-1" /> 叫车
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleVoiceInput('生成收款码')}>
            <CreditCard size={16} className="mr-1" /> 收款
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleVoiceInput('查看DeFi收益')}>
            <ChartLine size={16} className="mr-1" /> DeFi
          </Button>
        </div>

        {/* 输入区域 */}
        <div className="flex gap-2 mt-2">
          <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
            <Input
              name="message"
              placeholder="输入消息或点击麦克风说话..."
              className="flex-1"
              disabled={isProcessing}
            />
            <Button type="submit" disabled={isProcessing}>
              <Lightning size={18} />
            </Button>
          </form>
          
          <Button
            variant={isListening ? 'destructive' : 'default'}
            size="icon"
            onClick={toggleListening}
            className={isListening ? 'animate-pulse' : ''}
          >
            {isListening ? <MicrophoneSlash size={20} /> : <Microphone size={20} />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// 声明全局类型
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}
