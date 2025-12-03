import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Terminal,
  Lightning,
  Play,
  Copy,
  CheckCircle,
  ArrowRight,
  Brain,
  Code,
  Globe,
  Spider,
  Database,
  FileText,
  Robot,
  MagicWand,
  Clock,
  Sparkle,
  Warning,
  CaretRight,
  ArrowClockwise,
  Download,
  Gear,
  Eye
} from '@phosphor-icons/react';
import { toast } from 'sonner';

// ============================================
// AI Shell - 自然语言转Shell命令
// ============================================

interface ShellCommand {
  id: string;
  input: string;
  command: string;
  explanation: string;
  executed: boolean;
  output?: string;
  timestamp: Date;
}

export function AIShell() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commands, setCommands] = useState<ShellCommand[]>([
    {
      id: '1',
      input: '查找当前目录下所有大于100MB的文件',
      command: 'find . -type f -size +100M -exec ls -lh {} \\;',
      explanation: '使用find命令查找大于100MB的文件并显示详细信息',
      executed: true,
      output: './logs/app.log 150M\n./data/backup.tar.gz 256M',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      input: '统计当前目录下所有.ts文件的代码行数',
      command: 'find . -name "*.ts" -exec wc -l {} + | tail -1',
      explanation: '查找所有TypeScript文件并计算总行数',
      executed: true,
      output: '12456 total',
      timestamp: new Date(Date.now() - 600000),
    },
  ]);
  const [shell, setShell] = useState<'bash' | 'zsh' | 'powershell'>('bash');
  const inputRef = useRef<HTMLInputElement>(null);

  // 模拟AI生成Shell命令
  const generateCommand = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 模拟AI响应
    const commandMap: Record<string, { cmd: string; exp: string }> = {
      '列出所有进程': { cmd: 'ps aux', exp: '显示所有正在运行的进程' },
      '查看内存使用': { cmd: 'free -h', exp: '以人类可读格式显示内存使用情况' },
      '查看磁盘空间': { cmd: 'df -h', exp: '显示磁盘空间使用情况' },
      '压缩文件夹': { cmd: 'tar -czvf archive.tar.gz folder/', exp: '使用gzip压缩文件夹' },
      '查找文件': { cmd: 'find . -name "*.log" -mtime -7', exp: '查找7天内修改的日志文件' },
      '杀死进程': { cmd: 'pkill -f process_name', exp: '按名称终止进程' },
      '查看端口': { cmd: 'netstat -tlnp', exp: '显示所有监听的TCP端口' },
      '清理Docker': { cmd: 'docker system prune -af', exp: '清理未使用的Docker资源' },
    };

    let result = commandMap[input.trim()];
    if (!result) {
      // 通用命令生成
      if (input.includes('删除') || input.includes('remove')) {
        result = { cmd: `rm -rf target_path`, exp: '删除文件或目录（谨慎使用）' };
      } else if (input.includes('复制') || input.includes('copy')) {
        result = { cmd: `cp -r source dest`, exp: '递归复制文件或目录' };
      } else if (input.includes('移动') || input.includes('move')) {
        result = { cmd: `mv source dest`, exp: '移动或重命名文件' };
      } else if (input.includes('权限') || input.includes('permission')) {
        result = { cmd: `chmod 755 file`, exp: '修改文件权限' };
      } else if (input.includes('下载') || input.includes('download')) {
        result = { cmd: `wget -O output.file "url"`, exp: '下载文件' };
      } else if (input.includes('搜索') || input.includes('grep')) {
        result = { cmd: `grep -rn "pattern" .`, exp: '在文件中递归搜索文本' };
      } else {
        result = { cmd: `echo "${input}"`, exp: '未找到匹配命令，显示输入' };
      }
    }

    const newCommand: ShellCommand = {
      id: Date.now().toString(),
      input: input,
      command: result.cmd,
      explanation: result.exp,
      executed: false,
      timestamp: new Date(),
    };

    setCommands(prev => [newCommand, ...prev]);
    setInput('');
    setIsProcessing(false);
  };

  const executeCommand = async (id: string) => {
    setCommands(prev => prev.map(cmd => {
      if (cmd.id === id) {
        return {
          ...cmd,
          executed: true,
          output: '命令执行成功 ✓\n(模拟输出)',
        };
      }
      return cmd;
    }));
    toast.success('命令已执行');
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success('已复制到剪贴板');
  };

  return (
    <Card className="border-2 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal size={24} weight="duotone" className="text-green-500" />
          AI Shell
        </CardTitle>
        <CardDescription>
          自然语言转Shell命令 • 类似 BuilderIO/ai-shell
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shell选择 */}
        <div className="flex gap-2">
          {['bash', 'zsh', 'powershell'].map(s => (
            <Button
              key={s}
              variant={shell === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShell(s as typeof shell)}
            >
              {s}
            </Button>
          ))}
        </div>

        {/* 输入区 */}
        <div className="space-y-2">
          <Label>用自然语言描述你想做什么</Label>
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="例如：查找所有大于100MB的文件"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateCommand()}
              className="flex-1"
            />
            <Button 
              onClick={generateCommand} 
              disabled={isProcessing || !input.trim()}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  生成中...
                </>
              ) : (
                <>
                  <MagicWand size={18} />
                  生成
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 快捷命令 */}
        <div className="flex flex-wrap gap-2">
          {['列出所有进程', '查看内存使用', '查看磁盘空间', '查找文件', '查看端口'].map(cmd => (
            <Button
              key={cmd}
              variant="outline"
              size="sm"
              onClick={() => setInput(cmd)}
            >
              {cmd}
            </Button>
          ))}
        </div>

        {/* 命令历史 */}
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {commands.map(cmd => (
              <div key={cmd.id} className="p-4 bg-gray-900 rounded-lg text-white font-mono text-sm">
                {/* 用户输入 */}
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Brain size={16} />
                  <span>{cmd.input}</span>
                </div>

                {/* 生成的命令 */}
                <div className="flex items-center justify-between bg-gray-800 rounded p-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <code className="text-green-300">{cmd.command}</code>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-white"
                      onClick={() => copyCommand(cmd.command)}
                    >
                      <Copy size={14} />
                    </Button>
                    {!cmd.executed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-green-400"
                        onClick={() => executeCommand(cmd.id)}
                      >
                        <Play size={14} />
                      </Button>
                    )}
                  </div>
                </div>

                {/* 解释 */}
                <div className="text-xs text-gray-500 mb-2">
                  💡 {cmd.explanation}
                </div>

                {/* 输出 */}
                {cmd.output && (
                  <div className="bg-gray-800/50 rounded p-2 text-gray-300 text-xs">
                    <pre>{cmd.output}</pre>
                  </div>
                )}

                {/* 时间戳 */}
                <div className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <Clock size={12} />
                  {cmd.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// ============================================
// GPT Crawler - AI网页爬虫
// ============================================

interface CrawlTask {
  id: string;
  url: string;
  status: 'pending' | 'crawling' | 'completed' | 'error';
  pages: number;
  tokens: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

export function GPTCrawler() {
  const [url, setUrl] = useState('');
  const [maxPages, setMaxPages] = useState('50');
  const [selector, setSelector] = useState('');
  const [tasks, setTasks] = useState<CrawlTask[]>([
    {
      id: '1',
      url: 'https://docs.example.com',
      status: 'completed',
      pages: 45,
      tokens: 125000,
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() - 3000000),
    },
  ]);
  const [isCrawling, setIsCrawling] = useState(false);

  const startCrawl = async () => {
    if (!url.trim()) {
      toast.error('请输入URL');
      return;
    }

    const newTask: CrawlTask = {
      id: Date.now().toString(),
      url: url,
      status: 'crawling',
      pages: 0,
      tokens: 0,
      startTime: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
    setIsCrawling(true);

    // 模拟爬取过程
    let pages = 0;
    const interval = setInterval(() => {
      pages += Math.floor(Math.random() * 5) + 1;
      setTasks(prev => prev.map(t => 
        t.id === newTask.id ? { ...t, pages, tokens: pages * 2500 } : t
      ));

      if (pages >= parseInt(maxPages)) {
        clearInterval(interval);
        setTasks(prev => prev.map(t => 
          t.id === newTask.id ? { 
            ...t, 
            status: 'completed',
            endTime: new Date(),
          } : t
        ));
        setIsCrawling(false);
        toast.success(`爬取完成！共 ${pages} 个页面`);
      }
    }, 500);

    setUrl('');
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Spider size={24} weight="duotone" className="text-blue-500" />
          GPT Crawler
        </CardTitle>
        <CardDescription>
          使用AI爬取网站生成知识库 • 类似 BuilderIO/gpt-crawler
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 输入配置 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>起始URL</Label>
            <Input
              placeholder="https://docs.example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>最大页面数</Label>
            <Select value={maxPages} onValueChange={setMaxPages}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 页</SelectItem>
                <SelectItem value="50">50 页</SelectItem>
                <SelectItem value="100">100 页</SelectItem>
                <SelectItem value="500">500 页</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>CSS选择器 (可选)</Label>
            <Input
              placeholder="例如: .main-content, article"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
            />
          </div>
        </div>

        {/* 开始按钮 */}
        <Button 
          className="w-full h-12 gap-2"
          onClick={startCrawl}
          disabled={isCrawling}
        >
          {isCrawling ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              爬取中...
            </>
          ) : (
            <>
              <Spider size={20} />
              开始爬取
            </>
          )}
        </Button>

        {/* 任务列表 */}
        <div className="space-y-3">
          <Label>爬取任务</Label>
          {tasks.map(task => (
            <div key={task.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-blue-500" />
                  <span className="font-medium truncate max-w-xs">{task.url}</span>
                </div>
                <Badge variant={
                  task.status === 'completed' ? 'default' :
                  task.status === 'crawling' ? 'secondary' :
                  task.status === 'error' ? 'destructive' : 'outline'
                }>
                  {task.status === 'completed' ? '完成' :
                   task.status === 'crawling' ? '爬取中' :
                   task.status === 'error' ? '错误' : '等待'}
                </Badge>
              </div>

              {task.status === 'crawling' && (
                <Progress value={(task.pages / parseInt(maxPages)) * 100} className="mb-3" />
              )}

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">页面数</div>
                  <div className="font-bold">{task.pages}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Token数</div>
                  <div className="font-bold">{task.tokens.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">用时</div>
                  <div className="font-bold">
                    {task.endTime 
                      ? `${Math.round((task.endTime.getTime() - task.startTime.getTime()) / 1000)}s`
                      : '进行中'
                    }
                  </div>
                </div>
              </div>

              {task.status === 'completed' && (
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download size={14} />
                    下载JSON
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye size={14} />
                    预览
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Database size={14} />
                    导入知识库
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 输出配置 */}
        <Card className="bg-muted/50">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">输出格式</CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">JSON (用于GPT微调)</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Markdown</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">向量嵌入 (Embeddings)</span>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

// ============================================
// AI 知识库管理
// ============================================

export function AIKnowledgeBase() {
  const [bases] = useState([
    { id: '1', name: '产品文档', sources: 45, tokens: 125000, lastUpdate: '1小时前' },
    { id: '2', name: 'API参考', sources: 120, tokens: 350000, lastUpdate: '2天前' },
    { id: '3', name: '常见问题', sources: 30, tokens: 45000, lastUpdate: '5小时前' },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database size={24} weight="duotone" className="text-purple-500" />
          AI 知识库
        </CardTitle>
        <CardDescription>管理AI爬取的知识内容</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bases.map(base => (
          <div key={base.id} className="p-4 border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="font-medium">{base.name}</div>
                <div className="text-xs text-muted-foreground">
                  {base.sources} 来源 • {(base.tokens / 1000).toFixed(0)}K tokens • {base.lastUpdate}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">查看</Button>
              <Button variant="outline" size="sm">更新</Button>
            </div>
          </div>
        ))}

        <Button className="w-full gap-2" variant="outline">
          <Plus size={18} />
          创建新知识库
        </Button>
      </CardContent>
    </Card>
  );
}

// 需要导入Plus
import { Plus } from '@phosphor-icons/react';

// ============================================
// 主组件 - AI 工具集
// ============================================

export function AIToolkit() {
  return (
    <div className="space-y-6">
      {/* 头部 */}
      <Card className="border-2 border-gradient-to-r from-green-200 via-blue-200 to-purple-200 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Robot size={40} weight="duotone" className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold">AI 开发工具集</div>
              <div className="text-muted-foreground">
                AI Shell + GPT Crawler + 知识库 • 智能开发辅助工具
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="shell" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="shell" className="gap-2">
            <Terminal size={18} />
            AI Shell
          </TabsTrigger>
          <TabsTrigger value="crawler" className="gap-2">
            <Spider size={18} />
            GPT Crawler
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <Database size={18} />
            知识库
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shell">
          <AIShell />
        </TabsContent>

        <TabsContent value="crawler">
          <GPTCrawler />
        </TabsContent>

        <TabsContent value="knowledge">
          <AIKnowledgeBase />
        </TabsContent>
      </Tabs>
    </div>
  );
}
