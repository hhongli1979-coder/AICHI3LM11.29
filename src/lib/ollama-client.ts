/**
 * OmniCore Wallet - Ollama Client Service
 * 
 * This module provides integration with Ollama for AI model inference.
 * It supports both local Ollama instances and remote Ollama servers.
 * 
 * @module ollama-client
 * @see https://github.com/ollama/ollama-js
 */

import { Ollama } from 'ollama/browser';
import type { AIModelConfig } from './types';

// ============================================================================
// Types
// ============================================================================

/** Response from Ollama chat/generate API */
export interface OllamaResponse {
  /** Generated text content */
  content: string;
  /** Whether the response completed successfully */
  done: boolean;
  /** Total duration in nanoseconds */
  totalDuration?: number;
  /** Number of tokens generated */
  evalCount?: number;
}

/** Connection status for Ollama server */
export interface OllamaConnectionStatus {
  /** Whether connection was successful */
  connected: boolean;
  /** Error message if connection failed */
  error?: string;
  /** Available models on the server */
  models?: string[];
  /** Server version */
  version?: string;
}

/** Message format for Ollama chat API */
export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// ============================================================================
// Ollama Client Class
// ============================================================================

/**
 * OllamaClient provides a wrapper around the Ollama JavaScript SDK
 * for use in the OmniCore Wallet AI Assistant.
 * 
 * @example
 * ```typescript
 * const client = new OllamaClient('http://localhost:11434');
 * const status = await client.checkConnection();
 * if (status.connected) {
 *   const response = await client.chat('llama3:8b', [
 *     { role: 'user', content: 'Hello!' }
 *   ]);
 *   console.log(response.content);
 * }
 * ```
 */
export class OllamaClient {
  private client: Ollama;
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.client = new Ollama({ host: baseUrl });
  }

  /**
   * Check connection to Ollama server and list available models
   * 
   * @returns Connection status with available models
   */
  async checkConnection(): Promise<OllamaConnectionStatus> {
    try {
      const response = await this.client.list();
      const models = response.models?.map((m) => m.name) || [];
      
      return {
        connected: true,
        models,
        version: 'Ollama Server',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        connected: false,
        error: `Failed to connect to Ollama at ${this.baseUrl}: ${errorMessage}`,
      };
    }
  }

  /**
   * Send a chat message to Ollama and get a response
   * 
   * @param model - Model name (e.g., 'llama3:8b', 'mistral')
   * @param messages - Chat messages including system prompt
   * @param options - Additional options for generation
   * @returns Generated response content
   */
  async chat(
    model: string,
    messages: OllamaChatMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    }
  ): Promise<OllamaResponse> {
    try {
      // Add system prompt if provided and not already in messages
      const allMessages = [...messages];
      if (options?.systemPrompt && !messages.some((m) => m.role === 'system')) {
        allMessages.unshift({
          role: 'system',
          content: options.systemPrompt,
        });
      }

      const response = await this.client.chat({
        model,
        messages: allMessages,
        options: {
          temperature: options?.temperature,
          num_predict: options?.maxTokens,
        },
      });

      return {
        content: response.message?.content || '',
        done: true,
        totalDuration: response.total_duration,
        evalCount: response.eval_count,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Ollama chat failed: ${errorMessage}`);
    }
  }

  /**
   * Generate text using Ollama (non-chat completion)
   * 
   * @param model - Model name
   * @param prompt - Text prompt
   * @param options - Generation options
   * @returns Generated response
   */
  async generate(
    model: string,
    prompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      system?: string;
    }
  ): Promise<OllamaResponse> {
    try {
      const response = await this.client.generate({
        model,
        prompt,
        system: options?.system,
        options: {
          temperature: options?.temperature,
          num_predict: options?.maxTokens,
        },
      });

      return {
        content: response.response || '',
        done: response.done,
        totalDuration: response.total_duration,
        evalCount: response.eval_count,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Ollama generate failed: ${errorMessage}`);
    }
  }

  /**
   * Stream a chat response from Ollama
   * 
   * @param model - Model name
   * @param messages - Chat messages
   * @param onChunk - Callback for each streamed chunk
   * @param options - Generation options
   */
  async streamChat(
    model: string,
    messages: OllamaChatMessage[],
    onChunk: (chunk: string) => void,
    options?: {
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    }
  ): Promise<void> {
    try {
      const allMessages = [...messages];
      if (options?.systemPrompt && !messages.some((m) => m.role === 'system')) {
        allMessages.unshift({
          role: 'system',
          content: options.systemPrompt,
        });
      }

      const stream = await this.client.chat({
        model,
        messages: allMessages,
        stream: true,
        options: {
          temperature: options?.temperature,
          num_predict: options?.maxTokens,
        },
      });

      for await (const chunk of stream) {
        if (chunk.message?.content) {
          onChunk(chunk.message.content);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Ollama stream failed: ${errorMessage}`);
    }
  }

  /**
   * Pull a model from Ollama registry
   * 
   * @param model - Model name to pull
   * @param onProgress - Progress callback
   */
  async pullModel(
    model: string,
    onProgress?: (progress: { status: string; completed?: number; total?: number }) => void
  ): Promise<void> {
    try {
      const stream = await this.client.pull({
        model,
        stream: true,
      });

      for await (const chunk of stream) {
        if (onProgress) {
          onProgress({
            status: chunk.status,
            completed: chunk.completed,
            total: chunk.total,
          });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to pull model ${model}: ${errorMessage}`);
    }
  }

  /**
   * Update the base URL for the Ollama server
   * 
   * @param baseUrl - New base URL
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
    this.client = new Ollama({ host: baseUrl });
  }

  /**
   * Get the current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create an OllamaClient from an AIModelConfig
 * 
 * @param config - AI model configuration
 * @returns Configured OllamaClient instance
 */
export function createOllamaClientFromConfig(config: AIModelConfig): OllamaClient {
  // Extract base URL from API endpoint (remove /api/generate or /api/chat suffix)
  const baseUrl = config.apiEndpoint
    .replace(/\/api\/(generate|chat)$/, '')
    .replace(/\/$/, '');
  
  return new OllamaClient(baseUrl || 'http://localhost:11434');
}

/**
 * Default Ollama client instance for local server
 */
export const defaultOllamaClient = new OllamaClient('http://localhost:11434');

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format Ollama response duration for display
 * 
 * @param nanoseconds - Duration in nanoseconds
 * @returns Formatted duration string
 */
export function formatOllamaDuration(nanoseconds?: number): string {
  if (!nanoseconds) return 'N/A';
  const milliseconds = nanoseconds / 1_000_000;
  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(0)}ms`;
  }
  return `${(milliseconds / 1000).toFixed(2)}s`;
}

/**
 * Check if an Ollama model is available locally
 * 
 * @param client - Ollama client instance
 * @param modelName - Model name to check
 * @returns Whether the model is available
 */
export async function isModelAvailable(
  client: OllamaClient,
  modelName: string
): Promise<boolean> {
  const status = await client.checkConnection();
  if (!status.connected || !status.models) {
    return false;
  }
  return status.models.some((m) => m.includes(modelName) || modelName.includes(m));
}
