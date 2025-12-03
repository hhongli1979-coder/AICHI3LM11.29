import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DownloadSimple, 
  FileAi, 
  CheckCircle, 
  XCircle, 
  Sun, 
  Moon,
  CreditCard,
  Info,
  Warning,
  FileText,
  Palette
} from '@phosphor-icons/react';
import { toast } from 'sonner';

type ColorScheme = 'light' | 'dark';

interface DesignSpec {
  key: string;
  value: string;
}

interface DesignRule {
  text: string;
  allowed: boolean;
}

const DESIGN_SPECS: DesignSpec[] = [
  { key: '文件格式', value: 'PNG' },
  { key: '尺寸', value: '1536 x 969 像素' },
  { key: '模板格式', value: 'Adobe Illustrator (.ai)' },
  { key: '模板大小', value: '630KB' },
];

const DESIGN_RULES_REQUIRED: DesignRule[] = [
  { text: '为尺寸为1536 x 969 像素的PNG文件', allowed: true },
  { text: '有借记卡标记', allowed: true },
  { text: '设计元素必须位于虚线区域内', allowed: true },
];

const DESIGN_RULES_PROHIBITED: DesignRule[] = [
  { text: 'EMV芯片面板或触点', allowed: false },
  { text: '磁条', allowed: false },
  { text: '压印属性', allowed: false },
  { text: '透明叠加层', allowed: false },
  { text: '全息图', allowed: false },
  { text: '圆角', allowed: false },
  { text: '阴影或三维效果', allowed: false },
  { text: '商标标识', allowed: false },
];

export function CardDesignTemplate() {
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme>('light');
  
  const handleDownloadTemplate = () => {
    toast.success('模板下载已开始', {
      description: 'Fiat24_CoBrand_MasterCard_Template.ai (630KB)'
    });
    // In a real implementation, this would trigger a file download
  };

  const handleDownloadLicenseAgreement = () => {
    toast.success('商标许可协议下载已开始', {
      description: '正在下载商标许可协议模板...'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">卡片设计模板</h2>
          <p className="text-muted-foreground mt-1">
            Fiat24 联名 MasterCard 定制设计
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2 gap-2">
          <CreditCard size={20} weight="duotone" />
          MasterCard
        </Badge>
      </div>

      <Tabs defaultValue="template" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="template" className="gap-2">
            <FileAi size={18} weight="duotone" />
            <span className="hidden sm:inline">下载模板</span>
          </TabsTrigger>
          <TabsTrigger value="guidelines" className="gap-2">
            <Info size={18} weight="duotone" />
            <span className="hidden sm:inline">设计规则</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-2">
            <Palette size={18} weight="duotone" />
            <span className="hidden sm:inline">颜色选择</span>
          </TabsTrigger>
          <TabsTrigger value="license" className="gap-2">
            <FileText size={18} weight="duotone" />
            <span className="hidden sm:inline">许可协议</span>
          </TabsTrigger>
        </TabsList>

        {/* Template Download Tab */}
        <TabsContent value="template" className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <FileAi size={32} weight="duotone" className="text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle>Adobe Illustrator 模板</CardTitle>
                  <CardDescription className="mt-1">
                    Fiat24_CoBrand_MasterCard_Template.ai
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-base">630KB</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                下载官方 Adobe Illustrator 模板以开始设计您的定制卡片。
                模板包含所有必要的设计区域和安全标记。
              </p>
              
              <div className="flex gap-3">
                <Button className="gap-2 flex-1" onClick={handleDownloadTemplate}>
                  <DownloadSimple size={18} weight="bold" />
                  下载模板
                </Button>
                <Button variant="outline" className="gap-2">
                  打开预览
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Design Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">设计规格</CardTitle>
              <CardDescription>卡片设计的技术要求</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {DESIGN_SPECS.map((spec) => (
                  <div 
                    key={spec.key} 
                    className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-muted-foreground">{spec.key}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design Guidelines Tab */}
        <TabsContent value="guidelines" className="space-y-6">
          {/* Required Elements */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle size={24} weight="duotone" className="text-green-600" />
                <div>
                  <CardTitle className="text-lg">必须包含</CardTitle>
                  <CardDescription>卡片设计图片必须满足以下要求</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {DESIGN_RULES_REQUIRED.map((rule, index) => (
                  <li key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <CheckCircle size={20} weight="fill" className="text-green-600 flex-shrink-0" />
                    <span>{rule.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Elements */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle size={24} weight="duotone" className="text-red-600" />
                <div>
                  <CardTitle className="text-lg">禁止包含</CardTitle>
                  <CardDescription>卡片设计图片不得包含以下元素</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {DESIGN_RULES_PROHIBITED.map((rule, index) => (
                  <li key={index} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <XCircle size={20} weight="fill" className="text-red-600 flex-shrink-0" />
                    <span>{rule.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Warning size={24} weight="duotone" className="text-yellow-600" />
                <CardTitle className="text-lg">重要提示</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                您的设计元素必须位于虚线区域内。超出此区域的设计将不会被打印在最终卡片上。
                请确保您的设计符合所有上述规则，以避免设计被拒绝。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Color Selection Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">选择卡片配色方案</CardTitle>
              <CardDescription>
                您可以选择深色系或浅色系的卡片，也可以更改卡片表面的颜色
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Light Scheme */}
                <div 
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedScheme === 'light' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                  onClick={() => setSelectedScheme('light')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Sun size={24} weight="duotone" className="text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">浅色系</h3>
                      <p className="text-sm text-muted-foreground">Light Theme</p>
                    </div>
                  </div>
                  
                  {/* Card Preview - Light */}
                  <div className="aspect-[1.586/1] rounded-lg bg-gradient-to-br from-gray-50 to-gray-200 border shadow-inner p-4 flex flex-col justify-between">
                    <div className="w-10 h-8 rounded bg-yellow-400/50"></div>
                    <div className="space-y-1">
                      <div className="h-2 w-24 rounded bg-gray-400/50"></div>
                      <div className="h-2 w-16 rounded bg-gray-400/30"></div>
                    </div>
                  </div>
                  
                  {selectedScheme === 'light' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle size={24} weight="fill" className="text-primary" />
                    </div>
                  )}
                </div>

                {/* Dark Scheme */}
                <div 
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedScheme === 'dark' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                  onClick={() => setSelectedScheme('dark')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <Moon size={24} weight="duotone" className="text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold">深色系</h3>
                      <p className="text-sm text-muted-foreground">Dark Theme</p>
                    </div>
                  </div>
                  
                  {/* Card Preview - Dark */}
                  <div className="aspect-[1.586/1] rounded-lg bg-gradient-to-br from-gray-800 to-gray-950 border border-gray-700 shadow-inner p-4 flex flex-col justify-between">
                    <div className="w-10 h-8 rounded bg-yellow-500/50"></div>
                    <div className="space-y-1">
                      <div className="h-2 w-24 rounded bg-gray-500/50"></div>
                      <div className="h-2 w-16 rounded bg-gray-600/30"></div>
                    </div>
                  </div>
                  
                  {selectedScheme === 'dark' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle size={24} weight="fill" className="text-primary" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  <strong>提示：</strong>选择配色方案后，您可以在 Adobe Illustrator 模板中进一步自定义卡片表面的具体颜色。
                  确保您的颜色选择与品牌形象一致。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* License Agreement Tab */}
        <TabsContent value="license" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">商标许可协议</CardTitle>
              <CardDescription>
                提交设计前需要完成的文件
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <p className="text-muted-foreground">
                  请提供您的徽标版权注册文件和已签署的商标许可协议，以授权 Fiat24 在卡片中使用您的品牌。
                </p>
                <p className="text-muted-foreground">
                  模板附在下面，请下载并填写完整后与您的设计一起提交。
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileText size={24} weight="duotone" className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">商标许可协议</h4>
                        <p className="text-sm text-muted-foreground">Trademark License Agreement</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-3 gap-2"
                      onClick={handleDownloadLicenseAgreement}
                    >
                      <DownloadSimple size={16} />
                      下载模板
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <FileText size={24} weight="duotone" className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">版权注册文件</h4>
                        <p className="text-sm text-muted-foreground">Copyright Registration</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-3 gap-2"
                    >
                      <DownloadSimple size={16} />
                      上传文件
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Required Documents Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">提交清单</CardTitle>
              <CardDescription>确保您已准备好以下所有文件</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 p-3 rounded-lg border">
                  <CheckCircle size={20} weight="duotone" className="text-muted-foreground" />
                  <span>卡片设计 PNG 文件 (1536 x 969 像素)</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-lg border">
                  <CheckCircle size={20} weight="duotone" className="text-muted-foreground" />
                  <span>徽标版权注册文件</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-lg border">
                  <CheckCircle size={20} weight="duotone" className="text-muted-foreground" />
                  <span>已签署的商标许可协议</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
