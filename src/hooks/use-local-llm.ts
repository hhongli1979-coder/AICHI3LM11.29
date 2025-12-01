/**
 * useLocalLLM Hook
 * Manages local LLM connection, configuration, and conversation state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  AIMessage,
  AIMemoryItem,
  AICapability,
  LLMConfig,
  LLMConnectionStatus,
  OllamaModel,
} from '@/lib/types';
import {
  getLLMConfig,
  saveLLMConfig,
  getStoredMessages,
  saveMessages,
  getStoredMemories,
  saveMemories,
  addMemory,
  checkLLMConnection,
  getAvailableModels,
  streamLLMResponse,
  extractPotentialMemory,
  clearAllData,
} from '@/lib/llm-service';
import { generateMockAICapabilities } from '@/lib/mock-data';

export interface UseLocalLLMReturn {
  // State
  config: LLMConfig;
  connectionStatus: LLMConnectionStatus | null;
  availableModels: OllamaModel[];
  messages: AIMessage[];
  memories: AIMemoryItem[];
  capabilities: AICapability[];
  isConnecting: boolean;
  isGenerating: boolean;
  streamingContent: string;
  
  // Actions
  updateConfig: (config: Partial<LLMConfig>) => void;
  refreshConnection: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  addNewMemory: (memory: Omit<AIMemoryItem, 'id' | 'learnedAt' | 'usageCount'>) => void;
  deleteMemory: (id: string) => void;
  toggleCapability: (id: string) => void;
  clearAllStoredData: () => void;
}

export function useLocalLLM(): UseLocalLLMReturn {
  // Configuration state
  const [config, setConfig] = useState<LLMConfig>(getLLMConfig);
  const [connectionStatus, setConnectionStatus] = useState<LLMConnectionStatus | null>(null);
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Conversation state
  const [messages, setMessages] = useState<AIMessage[]>(getStoredMessages);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  
  // Memory state
  const [memories, setMemories] = useState<AIMemoryItem[]>(getStoredMemories);
  
  // Capabilities state
  const [capabilities, setCapabilities] = useState<AICapability[]>(generateMockAICapabilities);
  
  // Abort controller for streaming
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check connection on mount and config change
  useEffect(() => {
    refreshConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.endpoint, config.provider]);

  // Save messages when they change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Save memories when they change
  useEffect(() => {
    saveMemories(memories);
  }, [memories]);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<LLMConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      saveLLMConfig(updated);
      return updated;
    });
  }, []);

  // Refresh connection status
  const refreshConnection = useCallback(async () => {
    setIsConnecting(true);
    try {
      const status = await checkLLMConnection(config);
      setConnectionStatus(status);
      
      if (status.connected) {
        const models = await getAvailableModels(config);
        setAvailableModels(models);
        
        // Update model if current one doesn't exist
        if (models.length > 0 && !models.some(m => m.name === config.model)) {
          updateConfig({ model: models[0].name });
        }
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus({
        connected: false,
        provider: config.provider,
        lastChecked: Date.now(),
        error: error instanceof Error ? error.message : '连接检查失败',
      });
    } finally {
      setIsConnecting(false);
    }
  }, [config, updateConfig]);

  // Send a message and get AI response
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isGenerating) return;

    // Create user message
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    // Add user message to conversation
    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);
    setStreamingContent('');

    // Create a placeholder for AI response
    const aiMessageId = `msg-${Date.now()}-ai`;
    
    try {
      let fullResponse = '';
      
      // Stream the response
      for await (const chunk of streamLLMResponse(content, messages, memories, config)) {
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      }

      // Create final AI message
      const aiMessage: AIMessage = {
        id: aiMessageId,
        role: 'assistant',
        content: fullResponse,
        timestamp: Date.now(),
      };

      // Add AI message to conversation
      setMessages(prev => [...prev, aiMessage]);
      setStreamingContent('');

      // Try to extract and save potential memory
      const potentialMemory = extractPotentialMemory(content, fullResponse);
      if (potentialMemory) {
        const newMemory = addMemory(potentialMemory);
        setMemories(prev => [...prev, newMemory]);
      }

    } catch (error) {
      console.error('Message generation failed:', error);
      
      // Add error message
      const errorMessage: AIMessage = {
        id: aiMessageId,
        role: 'assistant',
        content: '抱歉，生成回复时出现错误。请检查本地模型服务是否正常运行。',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setStreamingContent('');
    } finally {
      setIsGenerating(false);
    }
  }, [messages, memories, config, isGenerating]);

  // Clear conversation history
  const clearConversation = useCallback(() => {
    setMessages([]);
    saveMessages([]);
    setStreamingContent('');
  }, []);

  // Add a new memory
  const addNewMemory = useCallback((memory: Omit<AIMemoryItem, 'id' | 'learnedAt' | 'usageCount'>) => {
    const newMemory = addMemory(memory);
    setMemories(prev => [...prev, newMemory]);
  }, []);

  // Delete a memory
  const deleteMemory = useCallback((id: string) => {
    setMemories(prev => {
      const updated = prev.filter(m => m.id !== id);
      saveMemories(updated);
      return updated;
    });
  }, []);

  // Toggle capability
  const toggleCapability = useCallback((id: string) => {
    setCapabilities(prev =>
      prev.map(cap => (cap.id === id ? { ...cap, enabled: !cap.enabled } : cap))
    );
  }, []);

  // Clear all stored data
  const clearAllStoredData = useCallback(() => {
    clearAllData();
    setMessages([]);
    setMemories([]);
    setConfig(getLLMConfig());
    setStreamingContent('');
  }, []);

  return {
    config,
    connectionStatus,
    availableModels,
    messages,
    memories,
    capabilities,
    isConnecting,
    isGenerating,
    streamingContent,
    updateConfig,
    refreshConnection,
    sendMessage,
    clearConversation,
    addNewMemory,
    deleteMemory,
    toggleCapability,
    clearAllStoredData,
  };
}
