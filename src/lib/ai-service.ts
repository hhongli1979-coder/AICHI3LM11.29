import type { AIModelConfig, AIMessage } from './types';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

/**
 * AI Service for calling various LLM providers
 * Supports: Ollama, OpenAI-compatible APIs, Anthropic, and custom endpoints
 */
export class AIService {
  private config: AIModelConfig;
  private abortController: AbortController | null = null;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  /**
   * Abort any ongoing request
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Send a chat message and get a response
   * Supports streaming for real-time token display
   */
  async chat(
    messages: ChatMessage[],
    callbacks?: StreamCallbacks
  ): Promise<string> {
    this.abortController = new AbortController();

    try {
      switch (this.config.provider) {
        case 'ollama':
        case 'local':
          return await this.callOllama(messages, callbacks);
        case 'openai':
          return await this.callOpenAI(messages, callbacks);
        case 'anthropic':
          return await this.callAnthropic(messages, callbacks);
        case 'custom':
          return await this.callCustom(messages, callbacks);
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求已取消');
      }
      throw error;
    }
  }

  /**
   * Call Ollama API (also works for local Ollama-compatible servers)
   */
  private async callOllama(
    messages: ChatMessage[],
    callbacks?: StreamCallbacks
  ): Promise<string> {
    const systemMessage = messages.find(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    // Build the prompt from messages
    let prompt = '';
    for (const msg of chatMessages) {
      if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n`;
      }
    }
    prompt += 'Assistant: ';

    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.modelName,
        prompt: prompt,
        system: systemMessage?.content || this.config.systemPrompt,
        stream: true,
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens,
        },
      }),
      signal: this.abortController?.signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    return await this.processStreamResponse(response, callbacks, 'ollama');
  }

  /**
   * Call OpenAI-compatible API
   */
  private async callOpenAI(
    messages: ChatMessage[],
    callbacks?: StreamCallbacks
  ): Promise<string> {
    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify({
        model: this.config.modelName,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        stream: true,
      }),
      signal: this.abortController?.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    return await this.processStreamResponse(response, callbacks, 'openai');
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(
    messages: ChatMessage[],
    callbacks?: StreamCallbacks
  ): Promise<string> {
    const systemMessage = messages.find(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        ...(this.config.apiKey && { 'x-api-key': this.config.apiKey }),
      },
      body: JSON.stringify({
        model: this.config.modelName,
        max_tokens: this.config.maxTokens,
        system: systemMessage?.content || this.config.systemPrompt,
        messages: chatMessages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
      }),
      signal: this.abortController?.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    return await this.processStreamResponse(response, callbacks, 'anthropic');
  }

  /**
   * Call custom API endpoint
   */
  private async callCustom(
    messages: ChatMessage[],
    callbacks?: StreamCallbacks
  ): Promise<string> {
    // Try OpenAI-compatible format first
    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify({
        model: this.config.modelName,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        stream: true,
      }),
      signal: this.abortController?.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Custom API error: ${response.status} - ${errorText}`);
    }

    return await this.processStreamResponse(response, callbacks, 'openai');
  }

  /**
   * Process streaming response from various providers
   */
  private async processStreamResponse(
    response: Response,
    callbacks: StreamCallbacks | undefined,
    format: 'ollama' | 'openai' | 'anthropic'
  ): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          let token = '';

          if (format === 'ollama') {
            try {
              const data = JSON.parse(line);
              token = data.response || '';
              if (data.done) continue;
            } catch {
              continue;
            }
          } else if (format === 'openai') {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                token = parsed.choices?.[0]?.delta?.content || '';
              } catch {
                continue;
              }
            }
          } else if (format === 'anthropic') {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'content_block_delta') {
                  token = parsed.delta?.text || '';
                }
              } catch {
                continue;
              }
            }
          }

          if (token) {
            fullResponse += token;
            callbacks?.onToken(token);
          }
        }
      }

      callbacks?.onComplete(fullResponse);
      return fullResponse;
    } catch (error) {
      if (error instanceof Error) {
        callbacks?.onError(error);
      }
      throw error;
    } finally {
      reader.releaseLock();
    }
  }
}

/**
 * Create AI service instance from model configuration
 */
export function createAIService(config: AIModelConfig): AIService {
  return new AIService(config);
}

/**
 * Convert AIMessage array to ChatMessage array for API calls
 */
export function convertToChatMessages(
  messages: AIMessage[],
  systemPrompt: string
): ChatMessage[] {
  const chatMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt }
  ];

  for (const msg of messages) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      chatMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  return chatMessages;
}

/**
 * Test connection to an AI model endpoint
 */
export async function testModelConnection(config: AIModelConfig): Promise<{
  success: boolean;
  message: string;
  latency?: number;
}> {
  const startTime = Date.now();
  
  try {
    const service = new AIService(config);
    const response = await service.chat([
      { role: 'system', content: '你是一个测试助手。' },
      { role: 'user', content: '请回复"连接成功"' },
    ]);
    
    const latency = Date.now() - startTime;
    
    if (response && response.length > 0) {
      return {
        success: true,
        message: `连接成功！响应: "${response.slice(0, 50)}${response.length > 50 ? '...' : ''}"`,
        latency,
      };
    } else {
      return {
        success: false,
        message: '模型返回空响应',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '未知错误',
    };
  }
}
