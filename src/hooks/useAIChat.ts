import { useState, useCallback, useRef, useEffect } from 'react';
import type { AIMessage, AIModelConfig, AIModelSettings } from '@/lib/types';
import { AIService, convertToChatMessages, testModelConnection } from '@/lib/ai-service';
import { generateMockAIModelSettings } from '@/lib/mock-data';

// Local storage key for AI model settings
const AI_SETTINGS_STORAGE_KEY = 'omnicore-ai-settings';

/**
 * Load AI model settings from localStorage
 */
function loadSettings(): AIModelSettings {
  try {
    const stored = localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load AI settings:', error);
  }
  return generateMockAIModelSettings();
}

/**
 * Save AI model settings to localStorage
 */
function saveSettings(settings: AIModelSettings): void {
  try {
    localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save AI settings:', error);
  }
}

export interface UseAIChatOptions {
  onError?: (error: Error) => void;
}

export interface UseAIChatReturn {
  // Chat state
  messages: AIMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  currentResponse: string;
  error: string | null;
  
  // Chat actions
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  abortRequest: () => void;
  
  // Model settings
  settings: AIModelSettings;
  activeModel: AIModelConfig | null;
  updateSettings: (settings: AIModelSettings) => void;
  testConnection: (modelId?: string) => Promise<{ success: boolean; message: string; latency?: number }>;
}

/**
 * React hook for AI chat functionality with real LLM integration
 */
export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AIModelSettings>(loadSettings);
  
  const aiServiceRef = useRef<AIService | null>(null);
  const messageIdRef = useRef(0);

  // Get the active/default model
  const activeModel = settings.models.find(m => m.id === settings.defaultModelId && m.enabled)
    || settings.models.find(m => m.enabled)
    || null;

  // Save settings whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    messageIdRef.current += 1;
    return `msg-${Date.now()}-${messageIdRef.current}`;
  }, []);

  // Abort current request
  const abortRequest = useCallback(() => {
    if (aiServiceRef.current) {
      aiServiceRef.current.abort();
      aiServiceRef.current = null;
    }
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  // Send a message to the AI
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Check if we have an active model
    if (!activeModel) {
      setError('没有可用的AI模型。请在"模型"标签页中配置并启用一个模型。');
      return;
    }

    // Add user message
    const userMessage: AIMessage = {
      id: generateMessageId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsStreaming(false);
    setCurrentResponse('');
    setError(null);

    try {
      // Create AI service
      const service = new AIService(activeModel);
      aiServiceRef.current = service;

      // Convert messages for API
      const chatMessages = convertToChatMessages(
        [...messages, userMessage],
        activeModel.systemPrompt
      );

      // Start streaming response
      setIsStreaming(true);
      
      const fullResponse = await service.chat(chatMessages, {
        onToken: (token) => {
          setCurrentResponse(prev => prev + token);
        },
        onComplete: (response) => {
          // Add assistant message when complete
          const assistantMessage: AIMessage = {
            id: generateMessageId(),
            role: 'assistant',
            content: response,
            timestamp: Date.now(),
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          setCurrentResponse('');
          setIsStreaming(false);
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err.message);
          setIsStreaming(false);
          setIsLoading(false);
          options.onError?.(err);
        },
      });

      // If no streaming (shouldn't happen normally)
      if (!fullResponse) {
        throw new Error('AI模型返回了空响应');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送消息时发生错误';
      setError(errorMessage);
      setIsStreaming(false);
      setIsLoading(false);
      
      if (err instanceof Error) {
        options.onError?.(err);
      }
    } finally {
      aiServiceRef.current = null;
    }
  }, [activeModel, messages, generateMessageId, options]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentResponse('');
    setError(null);
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: AIModelSettings) => {
    setSettings(newSettings);
  }, []);

  // Test connection to a model
  const testConnectionFn = useCallback(async (modelId?: string) => {
    const modelToTest = modelId 
      ? settings.models.find(m => m.id === modelId)
      : activeModel;
    
    if (!modelToTest) {
      return { success: false, message: '未找到要测试的模型' };
    }

    return await testModelConnection(modelToTest);
  }, [settings.models, activeModel]);

  return {
    messages,
    isLoading,
    isStreaming,
    currentResponse,
    error,
    sendMessage,
    clearMessages,
    abortRequest,
    settings,
    activeModel,
    updateSettings,
    testConnection: testConnectionFn,
  };
}
