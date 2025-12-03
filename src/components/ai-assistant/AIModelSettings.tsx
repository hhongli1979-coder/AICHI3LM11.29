import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Robot,
  Plus,
  Trash,
  PencilSimple,
  Check,
  CloudArrowUp,
  Desktop,
  Globe,
  Code,
  Key,
  Gear,
  Lightning,
  Database,
  Link,
  CurrencyDollar,
  Cpu,
} from '@phosphor-icons/react';
import { generateMockAIModelSettings } from '@/lib/mock-data';
import type { AIModelConfig, AIModelSettings, AIModelProvider, CustomEndpoint } from '@/lib/types';
import { toast } from 'sonner';

function getProviderIcon(provider: AIModelProvider) {
  switch (provider) {
    case 'local':
      return <Desktop size={18} weight="duotone" className="text-green-500" />;
    case 'ollama':
      return <Robot size={18} weight="duotone" className="text-purple-500" />;
    case 'llama3':
      return <Cpu size={18} weight="duotone" className="text-emerald-500" />;
    case 'openai':
      return <Globe size={18} weight="duotone" className="text-blue-500" />;
    case 'anthropic':
      return <Lightning size={18} weight="duotone" className="text-amber-500" />;
    case 'custom':
      return <Code size={18} weight="duotone" className="text-pink-500" />;
    default:
      return <Robot size={18} weight="duotone" />;
  }
}

function getProviderLabel(provider: AIModelProvider): string {
  switch (provider) {
    case 'local':
      return '本地模型';
    case 'ollama':
      return 'Ollama';
    case 'llama3':
      return 'Llama 3';
    case 'openai':
      return 'OpenAI';
    case 'anthropic':
      return 'Anthropic';
    case 'custom':
      return '自定义';
    default:
      return provider;
  }
}

function getProviderBadgeColor(provider: AIModelProvider): string {
  switch (provider) {
    case 'local':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'ollama':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'llama3':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    case 'openai':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'anthropic':
      return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'custom':
      return 'bg-pink-100 text-pink-700 border-pink-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

interface ModelCardProps {
  model: AIModelConfig;
  isDefault: boolean;
  onToggle: (id: string) => void;
  onSetDefault: (id: string) => void;
  onEdit: (model: AIModelConfig) => void;
  onDelete: (id: string) => void;
}

function ModelCard({ model, isDefault, onToggle, onSetDefault, onEdit, onDelete }: ModelCardProps) {
  const isCostEffective = model.provider === 'llama3' || model.provider === 'local';
  
  return (
    <Card className={`border transition-all hover:shadow-md ${isDefault ? 'ring-2 ring-primary' : ''} ${isCostEffective ? 'bg-gradient-to-br from-emerald-50/50 to-transparent' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getProviderBadgeColor(model.provider)}`}>
              {getProviderIcon(model.provider)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{model.name}</span>
                {isDefault && (
                  <Badge variant="default" className="text-xs">
                    默认
                  </Badge>
                )}
                {isCostEffective && (
                  <Badge variant="outline" className="text-xs bg-emerald-100 text-emerald-700 border-emerald-300 gap-1">
                    <CurrencyDollar size={12} weight="bold" />
                    省钱
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {model.modelName}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                <Badge variant="outline" className={getProviderBadgeColor(model.provider)}>
                  {getProviderLabel(model.provider)}
                </Badge>
                <span>温度: {model.temperature}</span>
                <span>最大Token: {model.maxTokens}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={model.enabled}
              onCheckedChange={() => onToggle(model.id)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 pt-3 border-t flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(model.id)}
            disabled={isDefault}
            className="gap-1"
          >
            <Check size={14} />
            设为默认
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(model)}
            className="gap-1"
          >
            <PencilSimple size={14} />
            编辑
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(model.id)}
            className="gap-1 text-destructive hover:text-destructive"
          >
            <Trash size={14} />
            删除
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface AddModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (model: Omit<AIModelConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingModel?: AIModelConfig | null;
}

function AddModelDialog({ open, onOpenChange, onAdd, editingModel }: AddModelDialogProps) {
  const [formData, setFormData] = useState<{
    name: string;
    provider: AIModelProvider;
    modelName: string;
    apiEndpoint: string;
    apiKey: string;
    maxTokens: number;
    temperature: number;
    systemPrompt: string;
  }>({
    name: editingModel?.name || '',
    provider: editingModel?.provider || 'local',
    modelName: editingModel?.modelName || '',
    apiEndpoint: editingModel?.apiEndpoint || 'http://localhost:11434/api/generate',
    apiKey: editingModel?.apiKey || '',
    maxTokens: editingModel?.maxTokens || 4096,
    temperature: editingModel?.temperature || 0.7,
    systemPrompt: editingModel?.systemPrompt || '你是 OmniCore 钱包的智能助手。',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.modelName || !formData.apiEndpoint) {
      toast.error('请填写必填字段');
      return;
    }
    
    // Validate URL format for apiEndpoint
    try {
      new URL(formData.apiEndpoint);
    } catch {
      toast.error('请输入有效的API端点URL');
      return;
    }
    
    onAdd({
      ...formData,
      enabled: true,
      isDefault: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Robot size={20} weight="duotone" />
            {editingModel ? '编辑模型配置' : '添加新模型'}
          </DialogTitle>
          <DialogDescription>
            配置您自己的AI大模型，支持本地部署和自定义接口
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">模型名称 *</Label>
                <Input
                  id="name"
                  placeholder="例如：我的本地模型"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">提供商 *</Label>
                <Select
                  value={formData.provider}
                  onValueChange={(value: AIModelProvider) => setFormData({ ...formData, provider: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择提供商" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama3">
                      <div className="flex items-center gap-2">
                        <Cpu size={16} />
                        Llama 3 (推荐省钱)
                      </div>
                    </SelectItem>
                    <SelectItem value="local">
                      <div className="flex items-center gap-2">
                        <Desktop size={16} />
                        本地模型
                      </div>
                    </SelectItem>
                    <SelectItem value="ollama">
                      <div className="flex items-center gap-2">
                        <Robot size={16} />
                        Ollama
                      </div>
                    </SelectItem>
                    <SelectItem value="openai">
                      <div className="flex items-center gap-2">
                        <Globe size={16} />
                        OpenAI API
                      </div>
                    </SelectItem>
                    <SelectItem value="anthropic">
                      <div className="flex items-center gap-2">
                        <Lightning size={16} />
                        Anthropic API
                      </div>
                    </SelectItem>
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <Code size={16} />
                        自定义接口
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.provider === 'llama3' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CurrencyDollar size={18} weight="duotone" className="text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-emerald-800 text-sm">Llama 3 省钱模式</div>
                    <p className="text-xs text-emerald-700 mt-1">
                      使用 Meta 开源的 Llama 3 模型，无需 API 费用，本地部署即可运行。
                      支持 8B 和 70B 参数版本，推荐使用 Ollama 进行部署。
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelName">模型标识 *</Label>
                <Input
                  id="modelName"
                  placeholder={formData.provider === 'llama3' ? 'llama3:8b 或 llama3:70b' : '例如：llama3:8b, gpt-4'}
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API 端点 *</Label>
                <Input
                  id="apiEndpoint"
                  placeholder="http://localhost:11434/api/generate"
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                />
              </div>
            </div>

            {(formData.provider === 'openai' || formData.provider === 'anthropic' || formData.provider === 'custom') && (
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="flex items-center gap-2">
                  <Key size={14} />
                  API 密钥
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                />
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <Label>参数配置</Label>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature">温度 (Temperature)</Label>
                    <span className="text-sm text-muted-foreground">{formData.temperature}</span>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={2}
                    step={0.1}
                    value={[formData.temperature]}
                    onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    较低的值使输出更确定，较高的值使输出更随机和创造性
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTokens">最大Token数</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    min={1}
                    max={128000}
                    value={formData.maxTokens}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0 && value <= 128000) {
                        setFormData({ ...formData, maxTokens: value });
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">系统提示词 (System Prompt)</Label>
              <textarea
                id="systemPrompt"
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="定义AI助手的角色和行为..."
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                系统提示词定义了AI助手的角色、能力边界和回复风格
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <CloudArrowUp size={16} />
            {editingModel ? '保存更改' : '添加模型'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EndpointCardProps {
  endpoint: CustomEndpoint;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function EndpointCard({ endpoint, onToggle, onDelete }: EndpointCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <Link size={18} weight="duotone" className="text-primary" />
        <div>
          <div className="font-medium text-sm">{endpoint.name}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[300px]">
            {endpoint.url}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={endpoint.enabled}
          onCheckedChange={() => onToggle(endpoint.id)}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(endpoint.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash size={14} />
        </Button>
      </div>
    </div>
  );
}

export function AIModelSettingsPanel() {
  const [settings, setSettings] = useState<AIModelSettings>(generateMockAIModelSettings);
  const [addModelOpen, setAddModelOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModelConfig | null>(null);

  const handleToggleModel = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      models: prev.models.map((m) =>
        m.id === id ? { ...m, enabled: !m.enabled } : m
      ),
    }));
    toast.success('模型状态已更新');
  };

  const handleSetDefaultModel = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      defaultModelId: id,
      models: prev.models.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    }));
    toast.success('默认模型已设置');
  };

  const handleAddModel = (modelData: Omit<AIModelConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newModel: AIModelConfig = {
      ...modelData,
      id: `model-${crypto.randomUUID()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setSettings((prev) => ({
      ...prev,
      models: [...prev.models, newModel],
    }));
    toast.success('模型添加成功');
  };

  const handleEditModel = (model: AIModelConfig) => {
    setEditingModel(model);
    setAddModelOpen(true);
  };

  const handleDeleteModel = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      models: prev.models.filter((m) => m.id !== id),
      defaultModelId: prev.defaultModelId === id ? null : prev.defaultModelId,
    }));
    toast.success('模型已删除');
  };

  const handleToggleEndpoint = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      customEndpoints: prev.customEndpoints.map((e) =>
        e.id === id ? { ...e, enabled: !e.enabled } : e
      ),
    }));
  };

  const handleDeleteEndpoint = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      customEndpoints: prev.customEndpoints.filter((e) => e.id !== id),
    }));
    toast.success('端点已删除');
  };

  return (
    <div className="space-y-6">
      {/* Llama 3 Cost Saving Recommendation Card */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-100">
              <CurrencyDollar size={28} weight="duotone" className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-emerald-900">使用 Llama 3 省钱方案</h3>
              <p className="text-sm text-emerald-700 mt-1">
                通过接入 Meta 开源的 Llama 3 模型，可以大幅降低 AI 使用成本。本地部署无需 API 费用，
                8B 参数版本适合日常对话，70B 版本适合复杂任务。
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-emerald-200">
                  <span className="text-xs font-medium text-emerald-800">🆓 零 API 费用</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-emerald-200">
                  <span className="text-xs font-medium text-emerald-800">🔒 数据隐私保护</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-emerald-200">
                  <span className="text-xs font-medium text-emerald-800">⚡ 低延迟响应</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-emerald-200">
                  <span className="text-xs font-medium text-emerald-800">🎯 相比 GPT-4 节省 90%+</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database size={20} weight="duotone" className="text-primary" />
                原生态大模型配置
              </CardTitle>
              <CardDescription>
                配置和管理您自己的AI大模型，支持本地部署和二次开发
              </CardDescription>
            </div>
            <Button onClick={() => {
              setEditingModel(null);
              setAddModelOpen(true);
            }} className="gap-2">
              <Plus size={16} />
              添加模型
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {settings.models.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isDefault={model.id === settings.defaultModelId}
                onToggle={handleToggleModel}
                onSetDefault={handleSetDefaultModel}
                onEdit={handleEditModel}
                onDelete={handleDeleteModel}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gear size={20} weight="duotone" className="text-amber-500" />
            高级设置
          </CardTitle>
          <CardDescription>
            配置本地处理和二次开发选项
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Desktop size={20} weight="duotone" className="text-green-500" />
              <div>
                <div className="font-medium">启用本地处理</div>
                <div className="text-sm text-muted-foreground">
                  敏感数据在本地处理，不发送到外部服务器
                </div>
              </div>
            </div>
            <Switch
              checked={settings.enableLocalProcessing}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, enableLocalProcessing: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Code size={20} weight="duotone" className="text-purple-500" />
              <div>
                <div className="font-medium">启用二次开发接口</div>
                <div className="text-sm text-muted-foreground">
                  开放API接口供开发者进行定制化开发
                </div>
              </div>
            </div>
            <Switch
              checked={settings.enableSecondaryDevelopment}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, enableSecondaryDevelopment: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link size={20} weight="duotone" className="text-blue-500" />
            自定义端点
          </CardTitle>
          <CardDescription>
            配置外部API端点用于模型调用
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {settings.customEndpoints.map((endpoint) => (
            <EndpointCard
              key={endpoint.id}
              endpoint={endpoint}
              onToggle={handleToggleEndpoint}
              onDelete={handleDeleteEndpoint}
            />
          ))}
          {settings.customEndpoints.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Link size={32} weight="duotone" className="mx-auto mb-2 opacity-50" />
              <p>暂无自定义端点</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddModelDialog
        open={addModelOpen}
        onOpenChange={(open) => {
          setAddModelOpen(open);
          if (!open) setEditingModel(null);
        }}
        onAdd={handleAddModel}
        editingModel={editingModel}
      />
    </div>
  );
}
