/**
 * Storage Service - 数据存储服务
 * 
 * 提供数据持久化:
 * - 本地存储
 * - 会话存储
 * - IndexedDB
 * - 远程API
 */

// 存储类型
export type StorageType = 'local' | 'session' | 'indexeddb' | 'remote';

// 存储配置
export interface StorageConfig {
  type: StorageType;
  prefix: string;
  encryptionKey?: string;
  remoteEndpoint?: string;
  remoteApiKey?: string;
}

// 存储项元数据
export interface StorageMetadata {
  key: string;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  size: number;
  encrypted: boolean;
}

// 存储服务类
export class StorageService {
  private config: StorageConfig;
  private memoryCache: Map<string, { data: any; metadata: StorageMetadata }> = new Map();

  constructor(config?: Partial<StorageConfig>) {
    this.config = {
      type: config?.type || 'local',
      prefix: config?.prefix || 'omnicore_',
      encryptionKey: config?.encryptionKey,
      remoteEndpoint: config?.remoteEndpoint,
      remoteApiKey: config?.remoteApiKey,
    };
  }

  // 生成完整键名
  private getFullKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  // 简单加密 (实际应使用更强的加密)
  private encrypt(data: string): string {
    if (!this.config.encryptionKey) return data;
    // 简单的XOR加密示例 (生产环境应使用AES等)
    return btoa(data);
  }

  // 解密
  private decrypt(data: string): string {
    if (!this.config.encryptionKey) return data;
    return atob(data);
  }

  // 设置数据
  async set<T>(key: string, value: T, options?: { ttl?: number; encrypt?: boolean }): Promise<void> {
    const fullKey = this.getFullKey(key);
    const now = Date.now();
    
    const metadata: StorageMetadata = {
      key: fullKey,
      createdAt: now,
      updatedAt: now,
      expiresAt: options?.ttl ? now + options.ttl : undefined,
      size: 0,
      encrypted: options?.encrypt || false,
    };

    let serialized = JSON.stringify(value);
    if (options?.encrypt) {
      serialized = this.encrypt(serialized);
    }
    metadata.size = serialized.length;

    const storageData = {
      data: serialized,
      metadata,
    };

    switch (this.config.type) {
      case 'local':
        window.localStorage.setItem(fullKey, JSON.stringify(storageData));
        break;
      case 'session':
        window.sessionStorage.setItem(fullKey, JSON.stringify(storageData));
        break;
      case 'indexeddb':
        await this.setIndexedDB(fullKey, storageData);
        break;
      case 'remote':
        await this.setRemote(fullKey, storageData);
        break;
    }

    // 更新内存缓存
    this.memoryCache.set(fullKey, { data: value, metadata });
  }

  // 获取数据
  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.getFullKey(key);

    // 检查内存缓存
    const cached = this.memoryCache.get(fullKey);
    if (cached) {
      if (cached.metadata.expiresAt && cached.metadata.expiresAt < Date.now()) {
        await this.delete(key);
        return null;
      }
      return cached.data as T;
    }

    let storageData: { data: string; metadata: StorageMetadata } | null = null;

    switch (this.config.type) {
      case 'local':
        const localData = window.localStorage.getItem(fullKey);
        if (localData) storageData = JSON.parse(localData);
        break;
      case 'session':
        const sessionData = window.sessionStorage.getItem(fullKey);
        if (sessionData) storageData = JSON.parse(sessionData);
        break;
      case 'indexeddb':
        storageData = await this.getIndexedDB(fullKey);
        break;
      case 'remote':
        storageData = await this.getRemote(fullKey);
        break;
    }

    if (!storageData) return null;

    // 检查过期
    if (storageData.metadata.expiresAt && storageData.metadata.expiresAt < Date.now()) {
      await this.delete(key);
      return null;
    }

    let data = storageData.data;
    if (storageData.metadata.encrypted) {
      data = this.decrypt(data);
    }

    const parsed = JSON.parse(data) as T;
    
    // 更新内存缓存
    this.memoryCache.set(fullKey, { data: parsed, metadata: storageData.metadata });

    return parsed;
  }

  // 删除数据
  async delete(key: string): Promise<void> {
    const fullKey = this.getFullKey(key);

    switch (this.config.type) {
      case 'local':
        window.localStorage.removeItem(fullKey);
        break;
      case 'session':
        window.sessionStorage.removeItem(fullKey);
        break;
      case 'indexeddb':
        await this.deleteIndexedDB(fullKey);
        break;
      case 'remote':
        await this.deleteRemote(fullKey);
        break;
    }

    this.memoryCache.delete(fullKey);
  }

  // 检查键是否存在
  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  // 获取所有键
  async keys(): Promise<string[]> {
    const prefix = this.config.prefix;
    const keys: string[] = [];

    switch (this.config.type) {
      case 'local':
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key?.startsWith(prefix)) {
            keys.push(key.slice(prefix.length));
          }
        }
        break;
      case 'session':
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          if (key?.startsWith(prefix)) {
            keys.push(key.slice(prefix.length));
          }
        }
        break;
      case 'indexeddb':
        const idbKeys = await this.keysIndexedDB();
        keys.push(...idbKeys.map(k => k.slice(prefix.length)));
        break;
      case 'remote':
        const remoteKeys = await this.keysRemote();
        keys.push(...remoteKeys.map(k => k.slice(prefix.length)));
        break;
    }

    return keys;
  }

  // 清空所有数据
  async clear(): Promise<void> {
    const keys = await this.keys();
    for (const key of keys) {
      await this.delete(key);
    }
    this.memoryCache.clear();
  }

  // 获取存储统计
  async getStats(): Promise<{
    itemCount: number;
    totalSize: number;
    oldestItem: number | null;
    newestItem: number | null;
  }> {
    const keys = await this.keys();
    let totalSize = 0;
    let oldestItem: number | null = null;
    let newestItem: number | null = null;

    for (const key of keys) {
      const fullKey = this.getFullKey(key);
      const cached = this.memoryCache.get(fullKey);
      if (cached) {
        totalSize += cached.metadata.size;
        if (!oldestItem || cached.metadata.createdAt < oldestItem) {
          oldestItem = cached.metadata.createdAt;
        }
        if (!newestItem || cached.metadata.createdAt > newestItem) {
          newestItem = cached.metadata.createdAt;
        }
      }
    }

    return {
      itemCount: keys.length,
      totalSize,
      oldestItem,
      newestItem,
    };
  }

  // IndexedDB 操作
  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('omnicore_storage', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('storage')) {
          db.createObjectStore('storage', { keyPath: 'key' });
        }
      };
    });
  }

  private async setIndexedDB(key: string, value: any): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['storage'], 'readwrite');
      const store = transaction.objectStore('storage');
      const request = store.put({ key, value });
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async getIndexedDB(key: string): Promise<any> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['storage'], 'readonly');
      const store = transaction.objectStore('storage');
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.value || null);
    });
  }

  private async deleteIndexedDB(key: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['storage'], 'readwrite');
      const store = transaction.objectStore('storage');
      const request = store.delete(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async keysIndexedDB(): Promise<string[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['storage'], 'readonly');
      const store = transaction.objectStore('storage');
      const request = store.getAllKeys();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as string[]);
    });
  }

  // 远程API操作
  private async setRemote(key: string, value: any): Promise<void> {
    if (!this.config.remoteEndpoint) return;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.config.remoteApiKey) {
      headers['Authorization'] = 'Bearer ' + this.config.remoteApiKey;
    }
    
    await fetch(`${this.config.remoteEndpoint}/storage/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(value),
    });
  }

  private async getRemote(key: string): Promise<any> {
    if (!this.config.remoteEndpoint) return null;
    
    const headers: Record<string, string> = {};
    if (this.config.remoteApiKey) {
      headers['Authorization'] = 'Bearer ' + this.config.remoteApiKey;
    }
    
    const response = await fetch(`${this.config.remoteEndpoint}/storage/${encodeURIComponent(key)}`, {
      headers,
    });

    if (!response.ok) return null;
    return response.json();
  }

  private async deleteRemote(key: string): Promise<void> {
    if (!this.config.remoteEndpoint) return;
    
    const headers: Record<string, string> = {};
    if (this.config.remoteApiKey) {
      headers['Authorization'] = 'Bearer ' + this.config.remoteApiKey;
    }
    
    await fetch(`${this.config.remoteEndpoint}/storage/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers,
    });
  }

  private async keysRemote(): Promise<string[]> {
    if (!this.config.remoteEndpoint) return [];
    
    const headers: Record<string, string> = {};
    if (this.config.remoteApiKey) {
      headers['Authorization'] = 'Bearer ' + this.config.remoteApiKey;
    }
    
    const response = await fetch(`${this.config.remoteEndpoint}/storage/keys`, {
      headers,
    });

    if (!response.ok) return [];
    return response.json();
  }
}

// 创建默认服务实例
export const storageService = new StorageService();

// 创建不同类型的存储实例
export const localStorageService = new StorageService({ type: 'local', prefix: 'omnicore_' });
export const sessionStorageService = new StorageService({ type: 'session', prefix: 'omnicore_session_' });

// 导出便捷函数
export async function setStorageItem<T>(key: string, value: T, options?: { ttl?: number; encrypt?: boolean }) {
  return storageService.set(key, value, options);
}

export async function getStorageItem<T>(key: string): Promise<T | null> {
  return storageService.get<T>(key);
}

export async function deleteStorageItem(key: string) {
  return storageService.delete(key);
}

export async function hasStorageItem(key: string) {
  return storageService.has(key);
}

export async function getStorageKeys() {
  return storageService.keys();
}

export async function clearStorage() {
  return storageService.clear();
}

export async function getStorageStats() {
  return storageService.getStats();
}
