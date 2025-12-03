import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Microphone, MicrophoneSlash, Speaker, Robot, NavigationArrow, CurrencyDollar, Wallet, ArrowRight } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: {
    type: 'navigate' | 'payment' | 'balance' | 'transfer';
    data?: Record<string, string>;
  };
}

const VOICE_COMMANDS = [
  { keywords: ['导航', '去', '到', '怎么走'], action: 'navigate' },
  { keywords: ['收款', '收钱', '付款', '支付'], action: 'payment' },
  { keywords: ['余额', '多少钱', '查询'], action: 'balance' },
  { keywords: ['转账', '发送', '打钱'], action: 'transfer' },
];

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是您的智能语音助手。我可以帮您：\n• 导航到目的地\n• 创建收款链接\n• 查询钱包余额\n• 发起转账\n\n请说出您的需求，或点击麦克风开始语音输入。',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processCommand = (text: string): Message => {
    const lowerText = text.toLowerCase();
    
    // Check for navigation
    if (VOICE_COMMANDS[0].keywords.some(k => lowerText.includes(k))) {
      const destination = text.replace(/导航|去|到|怎么走/g, '').trim() || '目的地';
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `好的，正在为您导航到${destination}。\n\n🗺️ 路线规划中...\n📍 预计距离: 5.2公里\n⏱️ 预计时间: 15分钟\n\n已开启语音导航，请按照指示行驶。`,
        action: { type: 'navigate', data: { destination } },
      };
    }
    
    // Check for payment
    if (VOICE_COMMANDS[1].keywords.some(k => lowerText.includes(k))) {
      const amountMatch = text.match(/(\d+)/);
      const amount = amountMatch ? amountMatch[1] : '100';
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `收款链接已生成！\n\n💰 金额: ${amount} USDT\n🔗 链接: https://pay.omnicore.io/p/voice123\n📱 您可以将此链接分享给付款方\n\n二维码已显示在屏幕上，对方可扫码支付。`,
        action: { type: 'payment', data: { amount } },
      };
    }
    
    // Check for balance
    if (VOICE_COMMANDS[2].keywords.some(k => lowerText.includes(k))) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `您的钱包余额如下：\n\n💎 ETH: 45.2341 (≈$110,823.95)\n💵 USDT: 50,000.00\n💵 USDC: 25,000.00\n🪙 OMNI: 10,000 (≈$24,500.00)\n\n📊 总资产约: $210,323.95`,
        action: { type: 'balance' },
      };
    }
    
    // Check for transfer
    if (VOICE_COMMANDS[3].keywords.some(k => lowerText.includes(k))) {
      const amountMatch = text.match(/(\d+)/);
      const amount = amountMatch ? amountMatch[1] : '100';
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `转账准备就绪：\n\n💸 金额: ${amount} USDT\n📍 请输入收款地址或从通讯录选择\n\n确认后我会帮您完成转账。是否继续？`,
        action: { type: 'transfer', data: { amount } },
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `我理解您说的是："${text}"\n\n请告诉我您需要什么帮助？我可以：\n• 帮您导航\n• 创建收款链接\n• 查询余额\n• 发起转账`,
    };
  };

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      toast.info('语音输入已停止');
      return;
    }

    setIsListening(true);
    toast.success('正在聆听...');

    // Simulate voice recognition
    setTimeout(() => {
      const simulatedTexts = [
        '帮我导航到机场',
        '收款100块钱',
        '查询我的余额',
        '转账500给张三',
      ];
      const randomText = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
      
      setIsListening(false);
      handleSendMessage(randomText);
    }, 2000);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text.replace(/[•📍💰🔗📱💎💵🪙📊💸🗺️⏱️]/g, ''));
      utterance.lang = 'zh-CN';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Process and respond
    setTimeout(() => {
      const response = processCommand(messageText);
      setMessages(prev => [...prev, response]);
      speakResponse(response.content);
    }, 500);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Robot size={24} weight="duotone" className="text-primary" />
          智能语音助手
        </CardTitle>
        <CardDescription>语音控制导航、收款、转账等功能</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {/* Quick Actions */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => handleSendMessage('帮我导航')}>
            <NavigationArrow size={14} className="mr-1" /> 导航
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => handleSendMessage('创建收款')}>
            <CurrencyDollar size={14} className="mr-1" /> 收款
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => handleSendMessage('查询余额')}>
            <Wallet size={14} className="mr-1" /> 余额
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => handleSendMessage('转账')}>
            <ArrowRight size={14} className="mr-1" /> 转账
          </Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg whitespace-pre-line ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
                {message.action && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <Button size="sm" variant={message.role === 'user' ? 'secondary' : 'default'}>
                      {message.action.type === 'navigate' && '开始导航'}
                      {message.action.type === 'payment' && '查看收款码'}
                      {message.action.type === 'balance' && '查看详情'}
                      {message.action.type === 'transfer' && '确认转账'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Button
            size="icon"
            variant={isListening ? 'destructive' : 'default'}
            onClick={handleVoiceInput}
            className="shrink-0"
          >
            {isListening ? <MicrophoneSlash size={20} /> : <Microphone size={20} />}
          </Button>
          <Input
            placeholder="输入或说出您的需求..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={() => handleSendMessage()} disabled={!input.trim()}>
            发送
          </Button>
          {isSpeaking && (
            <Button size="icon" variant="outline" onClick={() => window.speechSynthesis.cancel()}>
              <Speaker size={20} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
