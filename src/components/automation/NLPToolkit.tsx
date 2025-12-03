import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain,
  ChartLine,
  TrendUp,
  TrendDown,
  Lightning,
  Eye,
  Target,
  Sparkle,
  ChatCircle,
  User,
  Warning,
  CheckCircle,
  XCircle,
  MagnifyingGlass,
  Funnel,
  Fire,
  Newspaper,
  TwitterLogo,
  Globe,
  Clock,
  ArrowUp,
  ArrowDown,
  Hash,
  Heart,
  SmileyWink,
  SmileySad,
  SmileyMeh,
  Tag,
  FileText,
  ShieldCheck,
  Translate,
  Robot,
  Database,
  List
} from '@phosphor-icons/react';
import { toast } from 'sonner';

// ============================================
// NLP 情感分析
// ============================================

interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  keywords: string[];
  emotions: { emotion: string; score: number }[];
}

export function SentimentAnalysis() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);

  const analyzeText = async () => {
    if (!text.trim()) {
      toast.error('请输入文本');
      return;
    }

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 模拟NLP分析
    const positiveWords = ['好', '棒', '优秀', '满意', '喜欢', '感谢', '推荐', '完美', '快', '专业'];
    const negativeWords = ['差', '糟糕', '失望', '慢', '问题', '退款', '投诉', '垃圾', '骗', '坑'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    const keywords: string[] = [];

    positiveWords.forEach(word => {
      if (text.includes(word)) {
        positiveCount++;
        keywords.push(word);
      }
    });

    negativeWords.forEach(word => {
      if (text.includes(word)) {
        negativeCount++;
        keywords.push(word);
      }
    });

    const total = positiveCount + negativeCount || 1;
    const positiveRatio = positiveCount / total;
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    let score: number;

    if (positiveRatio > 0.6) {
      sentiment = 'positive';
      score = 0.6 + positiveRatio * 0.4;
    } else if (positiveRatio < 0.4) {
      sentiment = 'negative';
      score = 0.4 - positiveRatio * 0.4;
    } else {
      sentiment = 'neutral';
      score = 0.5;
    }

    setResult({
      text,
      sentiment,
      score,
      keywords: keywords.slice(0, 5),
      emotions: [
        { emotion: '开心', score: sentiment === 'positive' ? 0.8 : 0.2 },
        { emotion: '满意', score: sentiment === 'positive' ? 0.7 : 0.3 },
        { emotion: '愤怒', score: sentiment === 'negative' ? 0.6 : 0.1 },
        { emotion: '失望', score: sentiment === 'negative' ? 0.5 : 0.1 },
        { emotion: '中性', score: sentiment === 'neutral' ? 0.8 : 0.3 },
      ],
    });

    setIsAnalyzing(false);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <SmileyWink size={32} weight="fill" className="text-green-500" />;
      case 'negative': return <SmileySad size={32} weight="fill" className="text-red-500" />;
      default: return <SmileyMeh size={32} weight="fill" className="text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart size={24} weight="duotone" className="text-pink-500" />
          情感分析
        </CardTitle>
        <CardDescription>分析文本的情感倾向和关键情绪</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>输入文本</Label>
          <Textarea
            placeholder="输入要分析的文本，例如客户评价、社交媒体内容..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['这个产品真的很棒，发货快服务好！', '太差了，完全不满意，要求退款', '一般般吧，没什么特别的'].map(sample => (
            <Button
              key={sample}
              variant="outline"
              size="sm"
              onClick={() => setText(sample)}
            >
              {sample.substring(0, 15)}...
            </Button>
          ))}
        </div>

        <Button 
          className="w-full gap-2"
          onClick={analyzeText}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              分析中...
            </>
          ) : (
            <>
              <Brain size={18} />
              开始分析
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            {/* 情感结果 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getSentimentIcon(result.sentiment)}
                <div>
                  <div className="font-bold text-lg">
                    {result.sentiment === 'positive' ? '正面情感' :
                     result.sentiment === 'negative' ? '负面情感' : '中性情感'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    置信度: {(result.score * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <Badge variant={
                result.sentiment === 'positive' ? 'default' :
                result.sentiment === 'negative' ? 'destructive' : 'secondary'
              } className="text-lg px-4 py-2">
                {result.sentiment === 'positive' ? '👍' :
                 result.sentiment === 'negative' ? '👎' : '😐'}
              </Badge>
            </div>

            {/* 关键词 */}
            {result.keywords.length > 0 && (
              <div>
                <Label className="mb-2 block">关键词</Label>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map(kw => (
                    <Badge key={kw} variant="outline">{kw}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 情绪分布 */}
            <div>
              <Label className="mb-2 block">情绪分布</Label>
              <div className="space-y-2">
                {result.emotions.map(e => (
                  <div key={e.emotion} className="flex items-center gap-2">
                    <span className="w-16 text-sm">{e.emotion}</span>
                    <Progress value={e.score * 100} className="flex-1" />
                    <span className="w-12 text-sm text-right">{(e.score * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// 敏感词检测
// ============================================

export function SensitiveWordDetection() {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<{ word: string; type: string; position: number }[]>([]);

  // 模拟敏感词库
  const sensitiveWords = {
    politics: ['政治敏感词1', '敏感词2'],
    violence: ['暴力', '杀', '打死'],
    gambling: ['赌博', '博彩', '押注', '下注'],
    fraud: ['诈骗', '骗钱', '传销', '杀猪盘'],
    adult: ['色情', '成人内容'],
  };

  const checkText = async () => {
    if (!text.trim()) {
      toast.error('请输入文本');
      return;
    }

    setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const found: { word: string; type: string; position: number }[] = [];

    Object.entries(sensitiveWords).forEach(([type, words]) => {
      words.forEach(word => {
        const pos = text.indexOf(word);
        if (pos !== -1) {
          found.push({ word, type, position: pos });
        }
      });
    });

    setResults(found);
    setIsChecking(false);

    if (found.length === 0) {
      toast.success('未检测到敏感词');
    } else {
      toast.warning(`检测到 ${found.length} 个敏感词`);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      politics: '政治敏感',
      violence: '暴力内容',
      gambling: '赌博相关',
      fraud: '诈骗信息',
      adult: '成人内容',
    };
    return labels[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck size={24} weight="duotone" className="text-red-500" />
          敏感词检测
        </CardTitle>
        <CardDescription>检测文本中的敏感词和违规内容</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>输入文本</Label>
          <Textarea
            placeholder="输入要检测的文本内容..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
        </div>

        <Button 
          className="w-full gap-2"
          onClick={checkText}
          disabled={isChecking}
        >
          {isChecking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              检测中...
            </>
          ) : (
            <>
              <Eye size={18} />
              开始检测
            </>
          )}
        </Button>

        {/* 检测结果 */}
        <div className={`p-4 rounded-lg ${results.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            {results.length > 0 ? (
              <>
                <Warning size={24} className="text-red-500" />
                <span className="font-bold text-red-700">检测到 {results.length} 个敏感词</span>
              </>
            ) : (
              <>
                <CheckCircle size={24} className="text-green-500" />
                <span className="font-bold text-green-700">内容安全</span>
              </>
            )}
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((r, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{r.word}</Badge>
                    <span className="text-sm text-muted-foreground">位置: {r.position}</span>
                  </div>
                  <Badge variant="outline">{getTypeLabel(r.type)}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 敏感词库统计 */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {Object.entries(sensitiveWords).map(([type, words]) => (
            <div key={type} className="p-2 bg-muted rounded">
              <div className="font-bold">{words.length}</div>
              <div className="text-muted-foreground">{getTypeLabel(type)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// 实体识别 (NER)
// ============================================

export function EntityRecognition() {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [entities, setEntities] = useState<{ text: string; type: string; start: number; end: number }[]>([]);

  const recognizeEntities = async () => {
    if (!text.trim()) {
      toast.error('请输入文本');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 模拟实体识别
    const foundEntities: { text: string; type: string; start: number; end: number }[] = [];

    // 简单的规则匹配
    const patterns = [
      { regex: /(\d{4}年\d{1,2}月\d{1,2}日|\d{1,2}月\d{1,2}日)/g, type: '日期' },
      { regex: /(北京|上海|广州|深圳|杭州|成都|武汉|南京)/g, type: '地点' },
      { regex: /(腾讯|阿里巴巴|百度|华为|小米|字节跳动|美团|京东)/g, type: '公司' },
      { regex: /(\d+元|\d+美元|\d+万|\d+亿)/g, type: '金额' },
      { regex: /(iPhone|Android|微信|支付宝|抖音|淘宝)/g, type: '产品' },
    ];

    patterns.forEach(({ regex, type }) => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        foundEntities.push({
          text: match[0],
          type,
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    });

    setEntities(foundEntities);
    setIsProcessing(false);
    toast.success(`识别到 ${foundEntities.length} 个实体`);
  };

  const getEntityColor = (type: string) => {
    const colors: Record<string, string> = {
      '日期': 'bg-blue-100 text-blue-700',
      '地点': 'bg-green-100 text-green-700',
      '公司': 'bg-purple-100 text-purple-700',
      '金额': 'bg-yellow-100 text-yellow-700',
      '产品': 'bg-pink-100 text-pink-700',
      '人名': 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag size={24} weight="duotone" className="text-purple-500" />
          实体识别 (NER)
        </CardTitle>
        <CardDescription>识别文本中的人名、地点、组织、时间等实体</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>输入文本</Label>
          <Textarea
            placeholder="例如：2024年1月15日，腾讯在深圳发布了新产品..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
        </div>

        <Button 
          className="w-full gap-2"
          onClick={recognizeEntities}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              识别中...
            </>
          ) : (
            <>
              <Target size={18} />
              实体识别
            </>
          )}
        </Button>

        {entities.length > 0 && (
          <div className="space-y-4">
            {/* 实体列表 */}
            <div className="flex flex-wrap gap-2">
              {entities.map((e, idx) => (
                <Badge key={idx} className={getEntityColor(e.type)}>
                  {e.text} <span className="opacity-70 ml-1">({e.type})</span>
                </Badge>
              ))}
            </div>

            {/* 实体统计 */}
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(
                entities.reduce((acc, e) => {
                  acc[e.type] = (acc[e.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <div key={type} className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">{type}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// 趋势雷达 (TrendRadar)
// ============================================

interface TrendItem {
  id: string;
  title: string;
  source: string;
  heat: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  category: string;
  time: string;
}

export function TrendRadar() {
  const [trends, setTrends] = useState<TrendItem[]>([
    { id: '1', title: 'AI大模型新突破', source: '微博', heat: 9850000, trend: 'up', change: 125, category: '科技', time: '10分钟前' },
    { id: '2', title: '加密货币市场波动', source: '推特', heat: 7230000, trend: 'up', change: 89, category: '金融', time: '25分钟前' },
    { id: '3', title: '新能源汽车销量', source: '百度', heat: 5680000, trend: 'stable', change: 12, category: '汽车', time: '1小时前' },
    { id: '4', title: '跨境电商政策调整', source: '知乎', heat: 4520000, trend: 'up', change: 67, category: '电商', time: '2小时前' },
    { id: '5', title: '移动支付新趋势', source: '今日头条', heat: 3890000, trend: 'down', change: -15, category: '支付', time: '3小时前' },
    { id: '6', title: '元宇宙概念降温', source: '抖音', heat: 3210000, trend: 'down', change: -45, category: '科技', time: '5小时前' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = ['all', '科技', '金融', '电商', '支付', '汽车'];

  const refreshTrends = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 模拟数据更新
    setTrends(prev => prev.map(t => ({
      ...t,
      heat: t.heat + Math.floor(Math.random() * 100000) - 50000,
      change: t.change + Math.floor(Math.random() * 20) - 10,
    })));
    setIsRefreshing(false);
    toast.success('趋势数据已更新');
  };

  const filteredTrends = selectedCategory === 'all' 
    ? trends 
    : trends.filter(t => t.category === selectedCategory);

  const formatHeat = (heat: number) => {
    if (heat >= 10000000) return `${(heat / 10000000).toFixed(1)}千万`;
    if (heat >= 10000) return `${(heat / 10000).toFixed(0)}万`;
    return heat.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Fire size={24} weight="duotone" className="text-orange-500" />
              趋势雷达
            </CardTitle>
            <CardDescription>实时追踪全网热点话题和趋势</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshTrends}
            disabled={isRefreshing}
            className="gap-2"
          >
            {isRefreshing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
            ) : (
              <Lightning size={16} />
            )}
            刷新
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? '全部' : cat}
            </Button>
          ))}
        </div>

        {/* 趋势列表 */}
        <div className="space-y-3">
          {filteredTrends.map((trend, idx) => (
            <div 
              key={trend.id}
              className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    idx === 0 ? 'bg-red-500 text-white' :
                    idx === 1 ? 'bg-orange-500 text-white' :
                    idx === 2 ? 'bg-yellow-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {trend.title}
                      <Badge variant="outline" className="text-xs">{trend.category}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{trend.source}</span>
                      <span>•</span>
                      <span>{trend.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Fire size={16} className="text-orange-500" />
                    <span className="font-bold">{formatHeat(trend.heat)}</span>
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${
                    trend.trend === 'up' ? 'text-green-600' :
                    trend.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {trend.trend === 'up' ? <ArrowUp size={12} /> :
                     trend.trend === 'down' ? <ArrowDown size={12} /> : null}
                    {trend.change > 0 ? '+' : ''}{trend.change}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 数据来源 */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4 border-t">
          <span className="flex items-center gap-1"><Globe size={14} /> 微博</span>
          <span className="flex items-center gap-1"><TwitterLogo size={14} /> 推特</span>
          <span className="flex items-center gap-1"><Newspaper size={14} /> 百度</span>
          <span className="flex items-center gap-1"><ChatCircle size={14} /> 知乎</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// 关键词提取
// ============================================

export function KeywordExtraction() {
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState<{ word: string; weight: number }[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const extractKeywords = async () => {
    if (!text.trim()) {
      toast.error('请输入文本');
      return;
    }

    setIsExtracting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 模拟关键词提取 (简单的词频统计)
    const words = text.match(/[\u4e00-\u9fa5]+/g) || [];
    const wordCount: Record<string, number> = {};
    
    words.forEach(word => {
      if (word.length >= 2) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    const sorted = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        weight: count / Math.max(...Object.values(wordCount)),
      }));

    setKeywords(sorted);
    setIsExtracting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash size={24} weight="duotone" className="text-blue-500" />
          关键词提取
        </CardTitle>
        <CardDescription>自动提取文本中的关键词和主题</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="输入长文本内容..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />

        <Button 
          className="w-full gap-2"
          onClick={extractKeywords}
          disabled={isExtracting}
        >
          {isExtracting ? '提取中...' : '提取关键词'}
        </Button>

        {keywords.length > 0 && (
          <div className="space-y-3">
            <Label>关键词云</Label>
            <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg justify-center">
              {keywords.map((kw, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-full bg-primary text-white"
                  style={{ 
                    fontSize: `${12 + kw.weight * 12}px`,
                    opacity: 0.5 + kw.weight * 0.5,
                  }}
                >
                  {kw.word}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// 主组件 - NLP工具集
// ============================================

export function NLPToolkit() {
  return (
    <div className="space-y-6">
      {/* 头部 */}
      <Card className="border-2 border-pink-200 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Brain size={40} weight="duotone" className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold">NLP 智能分析工具</div>
              <div className="text-muted-foreground">
                情感分析 • 敏感词检测 • 实体识别 • 趋势追踪 • 类似 funNLP + TrendRadar
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sentiment" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="sentiment" className="gap-2">
            <Heart size={18} />
            情感分析
          </TabsTrigger>
          <TabsTrigger value="sensitive" className="gap-2">
            <ShieldCheck size={18} />
            敏感词
          </TabsTrigger>
          <TabsTrigger value="ner" className="gap-2">
            <Tag size={18} />
            实体识别
          </TabsTrigger>
          <TabsTrigger value="keywords" className="gap-2">
            <Hash size={18} />
            关键词
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <Fire size={18} />
            趋势雷达
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment">
          <SentimentAnalysis />
        </TabsContent>

        <TabsContent value="sensitive">
          <SensitiveWordDetection />
        </TabsContent>

        <TabsContent value="ner">
          <EntityRecognition />
        </TabsContent>

        <TabsContent value="keywords">
          <KeywordExtraction />
        </TabsContent>

        <TabsContent value="trends">
          <TrendRadar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
