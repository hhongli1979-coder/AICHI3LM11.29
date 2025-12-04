import type { AIModelConfig, AIModelSettings } from './types';

export interface AIResponse {
  content: string;
  isSimulated: boolean;
  modelName?: string;
  error?: string;
}

export interface AIServiceState {
  isConnected: boolean;
  activeModel: AIModelConfig | null;
  lastError: string | null;
}

const DEFAULT_SYSTEM_PROMPT = `你是 OmniCore 钱包的智能助手，专注于加密货币钱包管理、DeFi 策略和风险分析。请用专业且友好的方式回答用户问题。

你可以帮助用户:
- 查询和管理钱包余额
- 创建和签署交易
- 分析交易风险
- 管理 DeFi 策略和收益优化
- 配置平台设置

请用中文回答用户问题，保持专业且友好。`;

// Simulated response generator (fallback when no real AI is available)
function generateSimulatedResponse(input: string): string {
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

// Try to call Ollama API
async function callOllamaAPI(
  endpoint: string,
  modelName: string,
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      prompt: prompt,
      system: systemPrompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.response || data.message?.content || '';
}

// Try to call OpenAI-compatible API
async function callOpenAICompatibleAPI(
  endpoint: string,
  modelName: string,
  prompt: string,
  systemPrompt: string,
  maxTokens: number,
  temperature: number,
  apiKey?: string
): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Main AI service function
export async function sendMessage(
  prompt: string,
  settings: AIModelSettings | null
): Promise<AIResponse> {
  // If no settings or no models configured, use simulated response
  if (!settings || settings.models.length === 0) {
    return {
      content: generateSimulatedResponse(prompt),
      isSimulated: true,
    };
  }

  // Find the active model (default or first enabled)
  const activeModel = settings.models.find(
    (m) => m.id === settings.defaultModelId && m.enabled
  ) || settings.models.find((m) => m.enabled);

  if (!activeModel) {
    return {
      content: generateSimulatedResponse(prompt),
      isSimulated: true,
    };
  }

  const systemPrompt = activeModel.systemPrompt || DEFAULT_SYSTEM_PROMPT;

  try {
    let responseContent: string;

    if (activeModel.provider === 'ollama' || activeModel.provider === 'local') {
      responseContent = await callOllamaAPI(
        activeModel.apiEndpoint,
        activeModel.modelName,
        prompt,
        systemPrompt
      );
    } else {
      // OpenAI-compatible API (openai, anthropic, custom)
      responseContent = await callOpenAICompatibleAPI(
        activeModel.apiEndpoint,
        activeModel.modelName,
        prompt,
        systemPrompt,
        activeModel.maxTokens,
        activeModel.temperature,
        activeModel.apiKey
      );
    }

    return {
      content: responseContent,
      isSimulated: false,
      modelName: activeModel.name,
    };
  } catch (error) {
    console.error('AI API error:', error);
    
    // Fallback to simulated response on error
    return {
      content: generateSimulatedResponse(prompt),
      isSimulated: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Check if an AI model endpoint is available
export async function checkModelAvailability(model: AIModelConfig): Promise<boolean> {
  try {
    if (model.provider === 'ollama' || model.provider === 'local') {
      // For Ollama, check the tags endpoint
      const baseUrl = model.apiEndpoint.replace('/api/generate', '').replace('/api/chat', '');
      const response = await fetch(`${baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } else {
      // For other APIs, just check if endpoint responds
      const response = await fetch(model.apiEndpoint, {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok || response.status === 405; // 405 is OK for OPTIONS not allowed
    }
  } catch {
    return false;
  }
}
