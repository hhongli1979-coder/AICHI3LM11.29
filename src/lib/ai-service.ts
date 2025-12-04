/**
 * AI Service Module
 * Connects to real AI model APIs (Ollama, OpenAI, Anthropic, custom endpoints)
 * Provides actual AI functionality instead of mock responses
 */

import type { AIModelConfig, AIModelSettings, AIMessage } from './types';

export interface AIServiceResponse {
  success: boolean;
  content: string;
  error?: string;
}

export interface StreamCallback {
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

/**
 * Call Ollama API for chat completions
 */
async function callOllamaAPI(
  model: AIModelConfig,
  messages: Array<{ role: string; content: string }>,
  signal?: AbortSignal
): Promise<AIServiceResponse> {
  try {
    const response = await fetch(model.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model.modelName,
        messages: [
          { role: 'system', content: model.systemPrompt },
          ...messages,
        ],
        stream: false,
        options: {
          temperature: model.temperature,
          num_predict: model.maxTokens,
        },
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        content: '',
        error: `Ollama API error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();
    
    // Ollama chat API returns response in message.content
    const content = data.message?.content || data.response || '';
    
    return {
      success: true,
      content,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        content: '',
        error: '请求已取消',
      };
    }
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * Call OpenAI-compatible API (OpenAI, Azure, custom endpoints)
 */
async function callOpenAICompatibleAPI(
  model: AIModelConfig,
  messages: Array<{ role: string; content: string }>,
  signal?: AbortSignal
): Promise<AIServiceResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (model.apiKey) {
      headers['Authorization'] = `Bearer ${model.apiKey}`;
    }

    const response = await fetch(model.apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model.modelName,
        messages: [
          { role: 'system', content: model.systemPrompt },
          ...messages,
        ],
        max_tokens: model.maxTokens,
        temperature: model.temperature,
        stream: false,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        content: '',
        error: `API error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return {
      success: true,
      content,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        content: '',
        error: '请求已取消',
      };
    }
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * Call Anthropic API
 */
async function callAnthropicAPI(
  model: AIModelConfig,
  messages: Array<{ role: string; content: string }>,
  signal?: AbortSignal
): Promise<AIServiceResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    };

    if (model.apiKey) {
      headers['x-api-key'] = model.apiKey;
    }

    const response = await fetch(model.apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model.modelName,
        max_tokens: model.maxTokens,
        system: model.systemPrompt,
        messages: messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        content: '',
        error: `Anthropic API error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    return {
      success: true,
      content,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        content: '',
        error: '请求已取消',
      };
    }
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * Get the default or first enabled model from settings
 */
export function getActiveModel(settings: AIModelSettings): AIModelConfig | null {
  // First try to get the default model
  if (settings.defaultModelId) {
    const defaultModel = settings.models.find(
      m => m.id === settings.defaultModelId && m.enabled
    );
    if (defaultModel) return defaultModel;
  }

  // Otherwise return the first enabled model
  return settings.models.find(m => m.enabled) || null;
}

/**
 * Check if a model endpoint is reachable
 */
export async function testModelConnection(model: AIModelConfig): Promise<{ success: boolean; message: string }> {
  try {
    // For Ollama, check the /api/tags endpoint
    if (model.provider === 'ollama' || model.provider === 'local') {
      const baseUrl = model.apiEndpoint.replace(/\/api\/(generate|chat)$/, '');
      const response = await fetch(`${baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        return { success: true, message: '连接成功' };
      }
      return { success: false, message: `连接失败: ${response.status}` };
    }

    // For other providers, try a minimal request
    const testMessages = [{ role: 'user', content: 'test' }];
    const result = await sendMessage(model, testMessages);
    
    if (result.success) {
      return { success: true, message: '连接成功' };
    }
    return { success: false, message: result.error || '连接失败' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '连接测试失败',
    };
  }
}

/**
 * Send a message to the AI model and get a response
 */
export async function sendMessage(
  model: AIModelConfig,
  messages: Array<{ role: string; content: string }>,
  signal?: AbortSignal
): Promise<AIServiceResponse> {
  switch (model.provider) {
    case 'ollama':
    case 'local':
      return callOllamaAPI(model, messages, signal);
    case 'openai':
    case 'custom':
      return callOpenAICompatibleAPI(model, messages, signal);
    case 'anthropic':
      return callAnthropicAPI(model, messages, signal);
    default:
      return {
        success: false,
        content: '',
        error: `不支持的提供商: ${model.provider}`,
      };
  }
}

/**
 * Convert AIMessage array to a format suitable for API calls
 */
export function convertMessagesToAPIFormat(messages: AIMessage[]): Array<{ role: string; content: string }> {
  return messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role,
      content: m.content,
    }));
}

/**
 * Fallback response when no AI model is available
 */
export function getFallbackResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('钱包') || lowerInput.includes('余额') || lowerInput.includes('wallet') || lowerInput.includes('balance')) {
    return '⚠️ **AI模型未配置**\n\n请在"模型"标签页中配置您的AI模型（如Ollama、OpenAI等）后，我就能为您提供智能钱包管理服务。\n\n💡 推荐配置：\n- 本地：Ollama + llama3 或 qwen2\n- 云端：OpenAI GPT-4 或 Claude';
  }
  
  if (lowerInput.includes('交易') || lowerInput.includes('转账') || lowerInput.includes('transaction') || lowerInput.includes('transfer')) {
    return '⚠️ **AI模型未配置**\n\n请先在"模型"标签页中配置您的AI模型，配置完成后我就能帮您创建和管理交易。';
  }
  
  if (lowerInput.includes('风险') || lowerInput.includes('分析') || lowerInput.includes('risk') || lowerInput.includes('analysis')) {
    return '⚠️ **AI模型未配置**\n\n风险分析功能需要AI模型支持。请在"模型"标签页中配置您的AI模型。';
  }
  
  if (lowerInput.includes('defi') || lowerInput.includes('策略') || lowerInput.includes('收益')) {
    return '⚠️ **AI模型未配置**\n\nDeFi策略推荐需要AI模型支持。请在"模型"标签页中配置您的AI模型。';
  }
  
  return '⚠️ **AI模型未配置**\n\n您好！我是 OmniCore 智能助手。\n\n目前尚未配置AI模型，请前往"模型"标签页配置您的AI模型。\n\n支持的模型类型：\n• 🖥️ Ollama（本地部署）\n• 🌐 OpenAI API\n• ⚡ Anthropic Claude\n• 🔧 自定义API端点\n\n配置完成后，我就能为您提供智能服务！';
}
