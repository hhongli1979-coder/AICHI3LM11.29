/**
 * OmniCore Wallet - Ollama API Client
 * 
 * This module provides integration with Ollama local LLM server.
 * Ollama is an open-source local LLM server that can run various models.
 * 
 * @see https://github.com/ollama/ollama
 * @module ollama
 */

import type { AIModelConfig } from './types';

// ============================================================================
// Types
// ============================================================================

/** Ollama API request for chat/generate */
export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
    top_k?: number;
    top_p?: number;
  };
}

/** Ollama API response for generate */
export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

/** Ollama chat message format */
export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** Ollama chat request */
export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

/** Ollama chat response */
export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: OllamaChatMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

/** Available model information from Ollama */
export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format?: string;
    family?: string;
    parameter_size?: string;
    quantization_level?: string;
  };
}

/** Ollama models list response */
export interface OllamaModelsResponse {
  models: OllamaModel[];
}

/** Connection status result */
export interface OllamaConnectionStatus {
  connected: boolean;
  version?: string;
  error?: string;
}

// ============================================================================
// Default Configuration
// ============================================================================

/** Default Ollama server endpoint */
export const DEFAULT_OLLAMA_ENDPOINT = 'http://localhost:11434';

/** Default model to use if none specified */
export const DEFAULT_OLLAMA_MODEL = 'llama3:8b';

/** Default system prompt for OmniCore assistant */
export const DEFAULT_SYSTEM_PROMPT = `你是 OmniCore 钱包的智能助手，专注于以下领域：
- 加密货币钱包管理和多链资产查询
- DeFi 策略推荐和收益分析
- 交易风险评估和安全建议
- 多签交易审批流程

请用专业且友好的中文回答用户问题。如果用户询问的内容超出你的专业范围，请礼貌地说明并引导用户回到钱包相关话题。`;

// ============================================================================
// Ollama Client Class
// ============================================================================

/**
 * Ollama API client for interacting with local LLM server
 */
export class OllamaClient {
  private baseUrl: string;
  private model: string;
  private systemPrompt: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config?: Partial<AIModelConfig>) {
    this.baseUrl = config?.apiEndpoint?.replace(/\/api\/(generate|chat)$/, '') || DEFAULT_OLLAMA_ENDPOINT;
    this.model = config?.modelName || DEFAULT_OLLAMA_MODEL;
    this.systemPrompt = config?.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    this.temperature = config?.temperature ?? 0.7;
    this.maxTokens = config?.maxTokens ?? 4096;
  }

  /**
   * Update client configuration
   */
  updateConfig(config: Partial<AIModelConfig>): void {
    if (config.apiEndpoint) {
      this.baseUrl = config.apiEndpoint.replace(/\/api\/(generate|chat)$/, '');
    }
    if (config.modelName) this.model = config.modelName;
    if (config.systemPrompt) this.systemPrompt = config.systemPrompt;
    if (config.temperature !== undefined) this.temperature = config.temperature;
    if (config.maxTokens !== undefined) this.maxTokens = config.maxTokens;
  }

  /**
   * Check connection to Ollama server
   */
  async checkConnection(): Promise<OllamaConnectionStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.baseUrl}/api/version`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return {
          connected: true,
          version: data.version,
        };
      }

      return {
        connected: false,
        error: `Server returned status ${response.status}`,
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  /**
   * List available models from Ollama server
   */
  async listModels(): Promise<OllamaModel[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data: OllamaModelsResponse = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Failed to list Ollama models:', error);
      return [];
    }
  }

  /**
   * Generate a response using Ollama's generate API
   */
  async generate(prompt: string): Promise<string> {
    const request: OllamaGenerateRequest = {
      model: this.model,
      prompt,
      system: this.systemPrompt,
      stream: false,
      options: {
        temperature: this.temperature,
        num_predict: this.maxTokens,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for generation

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaGenerateResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama generate error:', error);
      throw error;
    }
  }

  /**
   * Chat with Ollama using the chat API (recommended for conversation)
   */
  async chat(messages: OllamaChatMessage[]): Promise<string> {
    // Check if system message already exists
    const hasSystemMessage = messages.some(msg => msg.role === 'system');
    
    // Prepend system message only if not already present
    const allMessages: OllamaChatMessage[] = hasSystemMessage
      ? messages
      : [{ role: 'system', content: this.systemPrompt }, ...messages];

    const request: OllamaChatRequest = {
      model: this.model,
      messages: allMessages,
      stream: false,
      options: {
        temperature: this.temperature,
        num_predict: this.maxTokens,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama chat API error: ${response.status}`);
      }

      const data: OllamaChatResponse = await response.json();
      return data.message.content;
    } catch (error) {
      console.error('Ollama chat error:', error);
      throw error;
    }
  }

  /**
   * Stream a response using Ollama's generate API
   * Returns an async generator that yields response chunks
   */
  async *generateStream(prompt: string): AsyncGenerator<string, void, unknown> {
    const request: OllamaGenerateRequest = {
      model: this.model,
      prompt,
      system: this.systemPrompt,
      stream: true,
      options: {
        temperature: this.temperature,
        num_predict: this.maxTokens,
      },
    };

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data: OllamaGenerateResponse = JSON.parse(line);
            if (data.response) {
              yield data.response;
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Get current model name
   */
  getModel(): string {
    return this.model;
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/** Global Ollama client instance */
let ollamaClient: OllamaClient | null = null;

/**
 * Get or create the global Ollama client instance
 */
export function getOllamaClient(config?: Partial<AIModelConfig>): OllamaClient {
  if (!ollamaClient) {
    ollamaClient = new OllamaClient(config);
  } else if (config) {
    ollamaClient.updateConfig(config);
  }
  return ollamaClient;
}

/**
 * Reset the global Ollama client (useful for testing or config changes)
 */
export function resetOllamaClient(): void {
  ollamaClient = null;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format model size for display
 */
export function formatModelSize(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    return `${gb.toFixed(1)} GB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

/**
 * Extract model family from name (e.g., "llama3:8b" -> "Llama 3")
 */
export function getModelFamily(modelName: string): string {
  const name = modelName.toLowerCase();
  if (name.includes('llama3')) return 'Llama 3';
  if (name.includes('llama2')) return 'Llama 2';
  if (name.includes('mistral')) return 'Mistral';
  if (name.includes('codellama')) return 'Code Llama';
  if (name.includes('phi')) return 'Phi';
  if (name.includes('qwen')) return 'Qwen';
  if (name.includes('gemma')) return 'Gemma';
  if (name.includes('vicuna')) return 'Vicuna';
  return modelName.split(':')[0];
}
