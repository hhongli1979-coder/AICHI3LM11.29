/**
 * LLM Service Layer for AI Assistant
 * 
 * Provides integration with various LLM providers including:
 * - iFlytek Spark (科大讯飞星火大模型)
 * - OpenAI API compatible services
 * - Custom endpoints
 * 
 * For iFlytek Spark-13B integration:
 * Repository: https://gitee.com/iflytekopensource/iFlytekSpark-13B
 * Documentation: https://www.xfyun.cn/doc/spark/Web.html
 */

import type { 
  LLMModelConfig, 
  LLMProvider, 
  LLMRequest, 
  LLMResponse, 
  LLMRequestMessage,
  IFlytekSparkConfig 
} from './types';

// Default model configurations
export const DEFAULT_LLM_CONFIGS: LLMModelConfig[] = [
  {
    id: 'mock',
    provider: 'mock',
    name: '模拟模式',
    description: '使用本地模拟响应（无需API密钥）',
    enabled: true,
    maxTokens: 2048,
    temperature: 0.7,
  },
  {
    id: 'iflytek-spark-13b',
    provider: 'iflytek-spark',
    name: '讯飞星火 13B',
    description: '基于iFlytekSpark-13B的开源大语言模型，适合二次开发定制',
    modelVersion: '13B',
    maxTokens: 4096,
    temperature: 0.5,
    enabled: false,
  },
  {
    id: 'iflytek-spark-v3',
    provider: 'iflytek-spark',
    name: '讯飞星火 V3.5',
    description: '讯飞星火认知大模型V3.5版本，支持联网搜索',
    modelVersion: 'v3.5',
    maxTokens: 8192,
    temperature: 0.5,
    enabled: false,
  },
  {
    id: 'custom-model',
    provider: 'custom',
    name: '自定义模型',
    description: '连接自托管的本地大语言模型服务',
    maxTokens: 4096,
    temperature: 0.7,
    enabled: false,
  },
];

// iFlytek Spark WebSocket URL mappings (for reference when implementing backend)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SPARK_WS_URLS: Record<string, string> = {
  'v1.5': 'wss://spark-api.xf-yun.com/v1.1/chat',
  'v2.0': 'wss://spark-api.xf-yun.com/v2.1/chat',
  'v3.0': 'wss://spark-api.xf-yun.com/v3.1/chat',
  'v3.5': 'wss://spark-api.xf-yun.com/v3.5/chat',
  'v4.0': 'wss://spark-api.xf-yun.com/v4.0/chat',
  '13B': 'wss://spark-api.xf-yun.com/v1.1/chat', // Uses v1 API for local deployment
};

// iFlytek Spark domain mappings (for reference when implementing backend)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SPARK_DOMAINS: Record<string, string> = {
  'v1.5': 'general',
  'v2.0': 'generalv2',
  'v3.0': 'generalv3',
  'v3.5': 'generalv3.5',
  'v4.0': 'generalv4.0',
  '13B': 'general',
};

/**
 * Get the WebSocket URL for iFlytek Spark API
 * Note: Authentication should be done server-side to protect API secrets
 * TODO: Implement full authentication flow in backend service
 */
export function getSparkWebSocketUrl(config: IFlytekSparkConfig): string {
  // In production, authentication should be handled by a backend service
  // that generates the proper HMAC-SHA256 signature
  return config.sparkUrl;
}

/**
 * Format messages for iFlytek Spark API
 * This helper is provided for backend service implementation
 */
export function formatMessagesForSpark(messages: LLMRequestMessage[]): object {
  return {
    text: messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
  };
}

/**
 * LLM Service class for handling AI model requests
 */
export class LLMService {
  private config: LLMModelConfig;
  private systemPrompt: string;

  constructor(config: LLMModelConfig) {
    this.config = config;
    this.systemPrompt = `你是 OmniCore 智能助手，一个专业的企业级加密资产管理平台AI助手。

你的核心能力包括:
1. 钱包管理 - 帮助用户查询余额、创建钱包、管理资产
2. 交易处理 - 协助发起、审核和签署交易
3. DeFi策略 - 提供收益优化建议和风险分析
4. 风险评估 - 实时评估交易和地址风险
5. 支付网关 - 处理多渠道支付请求

请用专业、友好的语气回复用户。如果涉及敏感操作，请提醒用户进行二次确认。
对于复杂问题，请分步骤清晰地解释。`;
  }

  /**
   * Send a chat completion request to the configured LLM
   */
  async chat(userMessage: string, conversationHistory: LLMRequestMessage[] = []): Promise<LLMResponse> {
    const messages: LLMRequestMessage[] = [
      { role: 'system', content: this.systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const request: LLMRequest = {
      messages,
      maxTokens: this.config.maxTokens,
      temperature: this.config.temperature,
    };

    switch (this.config.provider) {
      case 'mock':
        return this.mockChat(request);
      case 'iflytek-spark':
        return this.iflytekSparkChat(request);
      case 'custom':
        return this.customChat(request);
      default:
        return this.mockChat(request);
    }
  }

  /**
   * Mock chat implementation for testing
   */
  private async mockChat(request: LLMRequest): Promise<LLMResponse> {
    const userMessage = request.messages[request.messages.length - 1].content;
    const response = this.generateMockResponse(userMessage);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    return {
      success: true,
      content: response,
      usage: {
        promptTokens: Math.floor(userMessage.length / 4),
        completionTokens: Math.floor(response.length / 4),
        totalTokens: Math.floor((userMessage.length + response.length) / 4),
      },
    };
  }

  /**
   * iFlytek Spark chat implementation
   * Note: WebSocket connection should be handled by backend for security
   */
  private async iflytekSparkChat(request: LLMRequest): Promise<LLMResponse> {
    // Check if configuration is complete
    if (!this.config.apiKey || !this.config.appId || !this.config.apiSecret) {
      return {
        success: false,
        error: '请先配置讯飞星火API密钥。配置路径: AI助手 > 能力 > 模型设置',
      };
    }

    try {
      // In a real implementation, this would connect to a backend service
      // that handles the WebSocket connection to iFlytek Spark API
      // 
      // For iFlytek Spark-13B local deployment:
      // 1. Clone: git clone https://gitee.com/iflytekopensource/iFlytekSpark-13B.git
      // 2. Follow the deployment guide in the repository
      // 3. Configure your local endpoint URL
      
      const endpoint = this.config.apiEndpoint || '/api/llm/spark';
      
      // This would call your backend API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Id': this.config.appId,
        },
        body: JSON.stringify({
          model: this.config.modelVersion,
          messages: request.messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          max_tokens: request.maxTokens,
          temperature: request.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        content: data.choices?.[0]?.message?.content || data.content || '',
        usage: data.usage,
      };
    } catch (error) {
      // Fallback to mock if API fails
      console.error('iFlytek Spark API error:', error);
      return {
        success: false,
        error: `讯飞星火API调用失败: ${error instanceof Error ? error.message : '未知错误'}。已切换到模拟模式。`,
      };
    }
  }

  /**
   * Custom endpoint chat implementation
   */
  private async customChat(request: LLMRequest): Promise<LLMResponse> {
    if (!this.config.apiEndpoint) {
      return {
        success: false,
        error: '请配置自定义模型API端点',
      };
    }

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          messages: request.messages,
          max_tokens: request.maxTokens,
          temperature: request.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        content: data.choices?.[0]?.message?.content || data.content || '',
        usage: data.usage,
      };
    } catch (error) {
      return {
        success: false,
        error: `自定义API调用失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  /**
   * Generate mock response based on user input
   */
  private generateMockResponse(input: string): string {
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

    if (lowerInput.includes('模型') || lowerInput.includes('配置') || lowerInput.includes('spark') || lowerInput.includes('讯飞')) {
      return '🤖 **AI模型配置说明**\n\n当前支持以下模型:\n\n1. **讯飞星火 13B** (开源版)\n   - 可本地部署和二次开发\n   - 仓库: gitee.com/iflytekopensource/iFlytekSpark-13B\n\n2. **讯飞星火 V3.5** (云端API)\n   - 需要API密钥\n\n3. **自定义模型**\n   - 支持OpenAI兼容API\n\n请在"能力"标签页中配置您的模型。';
    }
    
    return '感谢您的提问！我是 OmniCore 智能助手，可以帮助您:\n\n• 📊 查询和管理钱包\n• 💸 创建和签署交易\n• 🔍 分析交易风险\n• 📈 管理 DeFi 策略\n• ⚙️ 配置平台设置\n• 🤖 配置AI模型（支持讯飞星火13B等）\n\n请告诉我您需要什么帮助？';
  }

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<LLMModelConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): LLMModelConfig {
    return { ...this.config };
  }
}

/**
 * Create LLM service instance with default configuration
 */
export function createLLMService(config?: Partial<LLMModelConfig>): LLMService {
  const defaultConfig = DEFAULT_LLM_CONFIGS[0]; // Mock by default
  return new LLMService({ ...defaultConfig, ...config });
}

/**
 * Get iFlytek Spark setup instructions
 */
export function getIFlytekSparkSetupGuide(): string {
  return `# 讯飞星火13B二次开发指南

## 概述
iFlytekSpark-13B是科大讯飞开源的130亿参数大语言模型，适合企业进行定制化开发。

## 获取模型

### 方式一：克隆开源仓库
\`\`\`bash
git clone https://gitee.com/iflytekopensource/iFlytekSpark-13B.git
cd iFlytekSpark-13B
\`\`\`

### 方式二：使用云端API
1. 访问 https://www.xfyun.cn/
2. 注册开发者账号
3. 创建应用获取 APP_ID, API_KEY, API_SECRET

## 本地部署要求

### 硬件要求
- GPU: 至少24GB显存 (推荐A100 40GB/80GB)
- RAM: 至少64GB
- 存储: 至少50GB SSD

### 软件要求
- Python 3.8+
- PyTorch 2.0+
- CUDA 11.8+
- transformers 4.30+

## 配置步骤

1. **安装依赖**
\`\`\`bash
pip install torch transformers accelerate
\`\`\`

2. **下载模型权重**
按照仓库README指引下载模型文件

3. **启动推理服务**
\`\`\`python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("./iFlytekSpark-13B")
tokenizer = AutoTokenizer.from_pretrained("./iFlytekSpark-13B")
\`\`\`

4. **在OmniCore中配置**
- 进入 AI助手 > 能力 > 模型设置
- 选择"讯飞星火 13B"
- 配置本地API端点

## 二次开发场景

1. **金融知识增强** - 使用领域数据微调
2. **多语言支持** - 扩展语言能力
3. **专业问答** - 构建知识库RAG系统
4. **安全审计** - 集成风控模型

## 注意事项

- 遵守模型使用许可协议
- 生产环境注意API安全
- 建议使用后端服务代理API调用
`;
}
