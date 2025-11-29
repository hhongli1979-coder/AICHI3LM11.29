/**
 * Local LLM Service
 * Provides integration with local language models like Ollama
 * Supports memory persistence and intelligent conversation
 */

import type { 
  LLMConfig, 
  LLMResponse, 
  OllamaModel, 
  LLMConnectionStatus,
  AIMessage,
  AIMemoryItem,
} from './types';

// Default configuration for local Ollama instance
const DEFAULT_CONFIG: LLMConfig = {
  provider: 'ollama',
  endpoint: 'http://localhost:11434',
  model: 'qwen2.5:7b',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: `你是 OmniCore 智能助手，一个专业的加密货币钱包管理AI。你具备以下能力：

1. **记忆能力**: 你能记住用户的偏好、交易历史和常用操作模式
2. **语言理解**: 你能理解中文和英文的自然语言指令
3. **控制能力**: 你能帮助用户执行钱包管理、交易、DeFi操作等功能

当用户询问钱包相关问题时，分析他们的需求并提供专业建议。
保持友好、专业的态度，用中文回复用户（除非用户使用英文）。

当前平台支持的功能：
- 多链钱包管理（Ethereum、Polygon、Arbitrum等）
- 多签交易审批
- DeFi策略管理
- 风险评估
- 支付网关

请根据用户的问题提供有针对性的帮助。`,
};

// Storage keys for persistence
const STORAGE_KEYS = {
  CONFIG: 'omnicore_llm_config',
  MESSAGES: 'omnicore_ai_messages',
  MEMORIES: 'omnicore_ai_memories',
};

/**
 * Get stored LLM configuration
 */
export function getLLMConfig(): LLMConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (stored) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load LLM config:', e);
  }
  return DEFAULT_CONFIG;
}

/**
 * Save LLM configuration
 */
export function saveLLMConfig(config: Partial<LLMConfig>): void {
  try {
    const current = getLLMConfig();
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify({ ...current, ...config }));
  } catch (e) {
    console.error('Failed to save LLM config:', e);
  }
}

/**
 * Get stored conversation history
 */
export function getStoredMessages(): AIMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load messages:', e);
  }
  return [];
}

/**
 * Save conversation history
 */
export function saveMessages(messages: AIMessage[]): void {
  try {
    // Keep last 100 messages for memory efficiency
    const toStore = messages.slice(-100);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(toStore));
  } catch (e) {
    console.error('Failed to save messages:', e);
  }
}

/**
 * Get stored AI memories
 */
export function getStoredMemories(): AIMemoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load memories:', e);
  }
  return [];
}

/**
 * Save AI memories
 */
export function saveMemories(memories: AIMemoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  } catch (e) {
    console.error('Failed to save memories:', e);
  }
}

/**
 * Add a new memory item
 */
export function addMemory(memory: Omit<AIMemoryItem, 'id' | 'learnedAt' | 'usageCount'>): AIMemoryItem {
  const memories = getStoredMemories();
  const newMemory: AIMemoryItem = {
    ...memory,
    id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    learnedAt: Date.now(),
    usageCount: 0,
  };
  memories.push(newMemory);
  saveMemories(memories);
  return newMemory;
}

/**
 * Update memory usage count
 */
export function updateMemoryUsage(memoryId: string): void {
  const memories = getStoredMemories();
  const idx = memories.findIndex(m => m.id === memoryId);
  if (idx !== -1) {
    memories[idx].usageCount += 1;
    saveMemories(memories);
  }
}

/**
 * Check connection to local LLM
 */
export async function checkLLMConnection(config?: LLMConfig): Promise<LLMConnectionStatus> {
  const cfg = config || getLLMConfig();
  
  if (cfg.provider === 'mock') {
    return {
      connected: true,
      provider: 'mock',
      model: 'mock-model',
      lastChecked: Date.now(),
    };
  }
  
  try {
    const response = await fetch(`${cfg.endpoint}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      const data = await response.json();
      const models = data.models || [];
      const modelExists = models.some((m: OllamaModel) => m.name.includes(cfg.model.split(':')[0]));
      
      return {
        connected: true,
        provider: cfg.provider,
        model: modelExists ? cfg.model : (models[0]?.name || cfg.model),
        lastChecked: Date.now(),
      };
    }
    
    return {
      connected: false,
      provider: cfg.provider,
      lastChecked: Date.now(),
      error: `HTTP ${response.status}: ${response.statusText}`,
    };
  } catch (e) {
    return {
      connected: false,
      provider: cfg.provider,
      lastChecked: Date.now(),
      error: e instanceof Error ? e.message : '无法连接到本地模型服务',
    };
  }
}

/**
 * Get available models from Ollama
 */
export async function getAvailableModels(config?: LLMConfig): Promise<OllamaModel[]> {
  const cfg = config || getLLMConfig();
  
  if (cfg.provider === 'mock') {
    return [{ name: 'mock-model', modifiedAt: new Date().toISOString(), size: 0, digest: 'mock' }];
  }
  
  try {
    const response = await fetch(`${cfg.endpoint}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.models || [];
    }
  } catch (e) {
    console.error('Failed to get models:', e);
  }
  
  return [];
}

/**
 * Build context from memories for the prompt
 */
function buildMemoryContext(memories: AIMemoryItem[]): string {
  if (memories.length === 0) return '';
  
  const relevantMemories = memories
    .filter(m => m.confidence > 0.5)
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10);
  
  if (relevantMemories.length === 0) return '';
  
  const memoryText = relevantMemories
    .map(m => `- ${m.key}: ${m.value}`)
    .join('\n');
  
  return `\n\n## 用户记忆档案\n${memoryText}\n`;
}

/**
 * Build conversation history for context
 */
function buildConversationContext(messages: AIMessage[], maxMessages = 10): string {
  const recent = messages.slice(-maxMessages);
  if (recent.length === 0) return '';
  
  return recent
    .map(m => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
    .join('\n');
}

/**
 * Generate mock response for testing
 */
function generateMockResponse(input: string, memories: AIMemoryItem[]): string {
  const lowerInput = input.toLowerCase();
  
  // Check memories for personalization
  const userPrefs = memories.filter(m => m.type === 'preference');
  const prefText = userPrefs.length > 0 
    ? `\n\n根据我的记忆，您的偏好是：${userPrefs.map(p => p.value).join('、')}`
    : '';
  
  if (lowerInput.includes('钱包') || lowerInput.includes('余额') || lowerInput.includes('wallet') || lowerInput.includes('balance')) {
    return `我已经检查了您的钱包状态。您目前有:

💰 **总资产**: $231,690.75

主要钱包:
- Treasury Vault: $125,432 (Ethereum)
- Operating Account: $23,234 (Polygon)
- DeFi Strategy: $8,024 (Arbitrum)

需要我执行什么操作吗？${prefText}`;
  }
  
  if (lowerInput.includes('交易') || lowerInput.includes('转账') || lowerInput.includes('transaction') || lowerInput.includes('transfer')) {
    return `我可以帮您创建新交易。请提供以下信息:

1. 发送方钱包
2. 接收地址
3. 金额和代币
4. 交易描述

或者您可以说 "从Treasury Vault转账5000 USDC到供应商"，我会自动解析。${prefText}`;
  }
  
  if (lowerInput.includes('风险') || lowerInput.includes('分析') || lowerInput.includes('risk') || lowerInput.includes('analysis')) {
    return `🔍 **风险分析报告**

当前待处理交易风险:

⚠️ **高风险** - tx-3 (Operating Account)
- 大额转账: 25,000 USDT
- 首次收款地址
- 建议: 验证收款方身份

✅ **低风险** - tx-1 (Treasury Vault)
- 已知收款方
- 常规交易模式

需要我提供更详细的分析吗？${prefText}`;
  }
  
  if (lowerInput.includes('defi') || lowerInput.includes('策略') || lowerInput.includes('收益')) {
    return `📊 **DeFi 策略建议**

基于您的风险偏好，推荐:

1. **稳定币借贷** (Aave V3)
   - APY: 5.2%
   - 风险: 低

2. **ETH 质押** (Lido)
   - APY: 3.8%
   - 风险: 低

3. **流动性挖矿** (Uniswap V3)
   - APY: 12.5%
   - 风险: 中

需要我帮您配置自动投资策略吗？${prefText}`;
  }
  
  if (lowerInput.includes('记住') || lowerInput.includes('记忆') || lowerInput.includes('remember')) {
    return `好的，我已经记住了这个信息！我的记忆系统会自动学习您的偏好和操作模式。

当前我记住的内容包括:
${memories.length > 0 ? memories.map(m => `- ${m.key}: ${m.value}`).join('\n') : '- 还没有学习到特定偏好'}

您可以随时告诉我需要记住的内容！`;
  }
  
  if (lowerInput.includes('你好') || lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return `您好！我是 OmniCore 智能助手 🤖

我是一个具备记忆、语言理解和控制能力的AI机器人，可以帮助您:

• 📊 查询和管理钱包
• 💸 创建和签署交易
• 🔍 分析交易风险
• 📈 管理 DeFi 策略
• 🧠 记住您的偏好和习惯

请告诉我您需要什么帮助？${prefText}`;
  }
  
  return `感谢您的提问！我是 OmniCore 智能助手，可以帮助您:

• 📊 查询和管理钱包
• 💸 创建和签署交易
• 🔍 分析交易风险
• 📈 管理 DeFi 策略
• ⚙️ 配置平台设置

请告诉我您需要什么帮助？${prefText}`;
}

/**
 * Stream response from Ollama API
 */
export async function* streamLLMResponse(
  userMessage: string,
  conversationHistory: AIMessage[],
  memories: AIMemoryItem[],
  config?: LLMConfig,
): AsyncGenerator<string, void, unknown> {
  const cfg = config || getLLMConfig();
  
  // Use mock mode if provider is mock or if endpoint is not reachable
  if (cfg.provider === 'mock') {
    const mockResponse = generateMockResponse(userMessage, memories);
    // Simulate streaming by yielding chunks
    const words = mockResponse.split('');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
      yield words[i];
    }
    return;
  }
  
  const memoryContext = buildMemoryContext(memories);
  const conversationContext = buildConversationContext(conversationHistory);
  
  const fullPrompt = `${cfg.systemPrompt || DEFAULT_CONFIG.systemPrompt}${memoryContext}

## 对话历史
${conversationContext}

用户: ${userMessage}
AI:`;

  try {
    const response = await fetch(`${cfg.endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: cfg.model,
        prompt: fullPrompt,
        stream: true,
        options: {
          temperature: cfg.temperature || 0.7,
          num_predict: cfg.maxTokens || 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const data: LLMResponse = JSON.parse(line);
          if (data.response) {
            yield data.response;
          }
        } catch {
          // Skip invalid JSON lines
        }
      }
    }
  } catch (e) {
    console.error('LLM streaming error:', e);
    // Fallback to mock response
    const mockResponse = generateMockResponse(userMessage, memories);
    yield mockResponse;
  }
}

/**
 * Non-streaming API call (for simpler use cases)
 */
export async function generateLLMResponse(
  userMessage: string,
  conversationHistory: AIMessage[],
  memories: AIMemoryItem[],
  config?: LLMConfig,
): Promise<string> {
  let fullResponse = '';
  
  for await (const chunk of streamLLMResponse(userMessage, conversationHistory, memories, config)) {
    fullResponse += chunk;
  }
  
  return fullResponse;
}

/**
 * Extract potential memory from user input
 */
export function extractPotentialMemory(
  userMessage: string,
  aiResponse: string,
): Omit<AIMemoryItem, 'id' | 'learnedAt' | 'usageCount'> | null {
  const lowerInput = userMessage.toLowerCase();
  
  // Detect preference statements
  if (lowerInput.includes('我喜欢') || lowerInput.includes('我偏好') || lowerInput.includes('i prefer') || lowerInput.includes('i like')) {
    return {
      type: 'preference',
      key: '用户偏好',
      value: userMessage,
      confidence: 0.8,
    };
  }
  
  // Detect contact mentions
  if (lowerInput.includes('地址') && lowerInput.includes('0x')) {
    const addressMatch = userMessage.match(/0x[a-fA-F0-9]{6,}/);
    if (addressMatch) {
      return {
        type: 'contact',
        key: '提及的地址',
        value: addressMatch[0],
        confidence: 0.7,
      };
    }
  }
  
  // Detect remember requests
  if (lowerInput.includes('记住') || lowerInput.includes('remember')) {
    return {
      type: 'preference',
      key: '用户请求记忆',
      value: userMessage,
      confidence: 0.9,
    };
  }
  
  return null;
}

/**
 * Clear all stored data
 */
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.CONFIG);
  localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  localStorage.removeItem(STORAGE_KEYS.MEMORIES);
}
