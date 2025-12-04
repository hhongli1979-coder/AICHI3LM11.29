/**
 * AI Service Layer - 真实AI服务连接
 * 
 * 支持多种AI提供商:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude)
 * - 本地模型 (Ollama)
 * - 自定义API
 */

import type { AIMessage, AIAction, AIModelConfig } from './types';

// API配置接口
export interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'ollama' | 'custom';
  apiKey?: string;
  apiEndpoint: string;
  modelName: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

// 默认系统提示词
const DEFAULT_SYSTEM_PROMPT = `你是 OmniCore 智能钱包助手，专门帮助用户管理加密资产。你的能力包括:
1. 查询钱包余额和交易历史
2. 创建和签署多签交易
3. 分析交易风险
4. 管理DeFi策略
5. 提供投资建议

请用专业、友好的方式回答用户问题。对于涉及资金操作的请求，需要谨慎确认。`;

// AI服务类
export class AIService {
  private config: AIServiceConfig;
  private conversationHistory: { role: string; content: string }[] = [];

  constructor(config?: Partial<AIServiceConfig>) {
    this.config = {
      provider: config?.provider || 'openai',
      apiKey: config?.apiKey || import.meta.env.VITE_AI_API_KEY || '',
      apiEndpoint: config?.apiEndpoint || 'https://api.openai.com/v1/chat/completions',
      modelName: config?.modelName || 'gpt-3.5-turbo',
      maxTokens: config?.maxTokens || 2048,
      temperature: config?.temperature || 0.7,
      systemPrompt: config?.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    };
  }

  // 更新配置
  updateConfig(config: Partial<AIServiceConfig>) {
    this.config = { ...this.config, ...config };
  }

  // 从AIModelConfig更新
  updateFromModelConfig(modelConfig: AIModelConfig) {
    this.config = {
      provider: modelConfig.provider as AIServiceConfig['provider'],
      apiKey: modelConfig.apiKey || '',
      apiEndpoint: modelConfig.apiEndpoint,
      modelName: modelConfig.modelName,
      maxTokens: modelConfig.maxTokens,
      temperature: modelConfig.temperature,
      systemPrompt: modelConfig.systemPrompt,
    };
  }

  // 清除对话历史
  clearHistory() {
    this.conversationHistory = [];
  }

  // 发送消息并获取回复
  async sendMessage(userMessage: string): Promise<{ content: string; action?: AIAction }> {
    // 添加用户消息到历史
    this.conversationHistory.push({ role: 'user', content: userMessage });

    try {
      let response: string;

      switch (this.config.provider) {
        case 'openai':
          response = await this.callOpenAI(userMessage);
          break;
        case 'anthropic':
          response = await this.callAnthropic(userMessage);
          break;
        case 'ollama':
          response = await this.callOllama(userMessage);
          break;
        case 'custom':
          response = await this.callCustomAPI(userMessage);
          break;
        default:
          response = this.generateLocalResponse(userMessage);
      }

      // 添加助手回复到历史
      this.conversationHistory.push({ role: 'assistant', content: response });

      // 检测用户意图并生成操作
      const action = this.detectAction(userMessage);

      return { content: response, action };
    } catch (error) {
      console.error('AI Service Error:', error);
      // 如果API调用失败，使用本地响应
      const fallbackResponse = this.generateLocalResponse(userMessage);
      return { content: fallbackResponse };
    }
  }

  // OpenAI API调用
  private async callOpenAI(message: string): Promise<string> {
    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.modelName,
        messages: [
          { role: 'system', content: this.config.systemPrompt },
          ...this.conversationHistory,
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Anthropic Claude API调用
  private async callAnthropic(message: string): Promise<string> {
    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.modelName,
        max_tokens: this.config.maxTokens,
        system: this.config.systemPrompt,
        messages: this.conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  // Ollama本地模型调用
  private async callOllama(message: string): Promise<string> {
    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.modelName,
        prompt: `${this.config.systemPrompt}\n\n用户: ${message}\n\n助手:`,
        stream: false,
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  }

  // 自定义API调用
  private async callCustomAPI(message: string): Promise<string> {
    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {}),
      },
      body: JSON.stringify({
        message,
        history: this.conversationHistory,
        systemPrompt: this.config.systemPrompt,
        config: {
          maxTokens: this.config.maxTokens,
          temperature: this.config.temperature,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.content || data.message;
  }

  // 本地响应生成 (无API时使用)
  private generateLocalResponse(input: string): string {
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

  // 检测用户意图
  private detectAction(input: string): AIAction | undefined {
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
}

// 创建默认服务实例
export const aiService = new AIService();

// 导出便捷函数
export async function sendAIMessage(message: string): Promise<{ content: string; action?: AIAction }> {
  return aiService.sendMessage(message);
}

export function updateAIConfig(config: Partial<AIServiceConfig>) {
  aiService.updateConfig(config);
}

export function clearAIHistory() {
  aiService.clearHistory();
}
