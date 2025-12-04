/**
 * React Hook for AI Model Management
 * Manages AI model settings state and provides methods for API interactions
 */

import { useState, useCallback, useEffect } from 'react';
import type { AIModelConfig, AIModelSettings, AIMessage } from '@/lib/types';
import {
  sendMessage,
  getActiveModel,
  getFallbackResponse,
  convertMessagesToAPIFormat,
  testModelConnection,
  type AIServiceResponse,
} from '@/lib/ai-service';
import { generateMockAIModelSettings } from '@/lib/mock-data';

const STORAGE_KEY = 'omnicore_ai_model_settings';

/**
 * Generate a unique ID with fallback for environments without crypto.randomUUID
 */
function generateUniqueId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Load settings from localStorage
 */
function loadSettings(): AIModelSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load AI settings:', error);
  }
  return generateMockAIModelSettings();
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: AIModelSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save AI settings:', error);
  }
}

export interface UseAIModelReturn {
  settings: AIModelSettings;
  activeModel: AIModelConfig | null;
  isLoading: boolean;
  error: string | null;
  
  // Settings management
  updateSettings: (updates: Partial<AIModelSettings>) => void;
  addModel: (model: Omit<AIModelConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateModel: (id: string, updates: Partial<AIModelConfig>) => void;
  deleteModel: (id: string) => void;
  setDefaultModel: (id: string) => void;
  toggleModel: (id: string) => void;
  
  // API interactions
  chat: (messages: AIMessage[], signal?: AbortSignal) => Promise<AIServiceResponse>;
  testConnection: (model: AIModelConfig) => Promise<{ success: boolean; message: string }>;
}

export function useAIModel(): UseAIModelReturn {
  const [settings, setSettings] = useState<AIModelSettings>(() => loadSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the currently active model
  const activeModel = getActiveModel(settings);

  // Save settings whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<AIModelSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const addModel = useCallback((modelData: Omit<AIModelConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newModel: AIModelConfig = {
      ...modelData,
      id: `model-${generateUniqueId()}`,
      createdAt: now,
      updatedAt: now,
    };
    
    setSettings(prev => ({
      ...prev,
      models: [...prev.models, newModel],
      // If this is the first model, make it default
      defaultModelId: prev.models.length === 0 ? newModel.id : prev.defaultModelId,
    }));
  }, []);

  const updateModel = useCallback((id: string, updates: Partial<AIModelConfig>) => {
    setSettings(prev => ({
      ...prev,
      models: prev.models.map(m =>
        m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m
      ),
    }));
  }, []);

  const deleteModel = useCallback((id: string) => {
    setSettings(prev => ({
      ...prev,
      models: prev.models.filter(m => m.id !== id),
      defaultModelId: prev.defaultModelId === id ? null : prev.defaultModelId,
    }));
  }, []);

  const setDefaultModel = useCallback((id: string) => {
    setSettings(prev => ({
      ...prev,
      defaultModelId: id,
      models: prev.models.map(m => ({
        ...m,
        isDefault: m.id === id,
      })),
    }));
  }, []);

  const toggleModel = useCallback((id: string) => {
    setSettings(prev => ({
      ...prev,
      models: prev.models.map(m =>
        m.id === id ? { ...m, enabled: !m.enabled } : m
      ),
    }));
  }, []);

  const chat = useCallback(async (
    messages: AIMessage[],
    signal?: AbortSignal
  ): Promise<AIServiceResponse> => {
    setError(null);

    // If no active model, return fallback response
    if (!activeModel) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      return {
        success: true,
        content: getFallbackResponse(lastUserMessage?.content || ''),
      };
    }

    setIsLoading(true);

    try {
      const apiMessages = convertMessagesToAPIFormat(messages);
      const response = await sendMessage(activeModel, apiMessages, signal);
      
      if (!response.success) {
        setError(response.error || '请求失败');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      return {
        success: false,
        content: '',
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [activeModel]);

  const testConnectionCallback = useCallback(async (model: AIModelConfig) => {
    return testModelConnection(model);
  }, []);

  return {
    settings,
    activeModel,
    isLoading,
    error,
    updateSettings,
    addModel,
    updateModel,
    deleteModel,
    setDefaultModel,
    toggleModel,
    chat,
    testConnection: testConnectionCallback,
  };
}
