/**
 * Notification Service - 通知服务
 * 
 * 提供通知和告警功能:
 * - 实时通知
 * - 邮件/推送通知
 * - 告警管理
 * - 通知偏好设置
 */

import type { NotificationItem } from './types';

// 通知渠道
export type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms' | 'webhook';

// 通知优先级
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

// 通知设置
export interface NotificationSettings {
  channels: {
    [key in NotificationChannel]: boolean;
  };
  preferences: {
    transactions: boolean;
    approvals: boolean;
    risks: boolean;
    defi: boolean;
    system: boolean;
    marketing: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string;   // HH:mm
  };
  email?: string;
  phone?: string;
  webhookUrl?: string;
}

// 通知模板
interface NotificationTemplate {
  title: string;
  message: string;
  priority: NotificationPriority;
}

// 预定义通知模板
const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  'transaction_pending': {
    title: '交易待签名',
    message: '您有一笔交易等待签名审批',
    priority: 'high',
  },
  'transaction_signed': {
    title: '交易已签名',
    message: '交易已收到新的签名',
    priority: 'normal',
  },
  'transaction_completed': {
    title: '交易已完成',
    message: '您的交易已成功执行',
    priority: 'normal',
  },
  'transaction_failed': {
    title: '交易失败',
    message: '您的交易执行失败',
    priority: 'high',
  },
  'high_risk_detected': {
    title: '高风险交易警报',
    message: '检测到高风险交易，请立即审查',
    priority: 'urgent',
  },
  'large_transfer': {
    title: '大额转账提醒',
    message: '检测到大额转账请求',
    priority: 'high',
  },
  'defi_position_alert': {
    title: 'DeFi头寸警报',
    message: '您的DeFi头寸需要关注',
    priority: 'high',
  },
  'apy_change': {
    title: 'APY变化提醒',
    message: 'DeFi协议APY发生显著变化',
    priority: 'normal',
  },
  'system_maintenance': {
    title: '系统维护通知',
    message: '系统将进行计划维护',
    priority: 'low',
  },
  'security_alert': {
    title: '安全警报',
    message: '检测到异常安全事件',
    priority: 'urgent',
  },
};

// 通知服务类
export class NotificationService {
  private notifications: NotificationItem[] = [];
  private settings: NotificationSettings = {
    channels: {
      in_app: true,
      email: true,
      push: false,
      sms: false,
      webhook: false,
    },
    preferences: {
      transactions: true,
      approvals: true,
      risks: true,
      defi: true,
      system: true,
      marketing: false,
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  };
  private listeners: ((notification: NotificationItem) => void)[] = [];

  // 发送通知
  async send(params: {
    type: NotificationItem['type'];
    title: string;
    message: string;
    priority?: NotificationPriority;
    actionUrl?: string;
    data?: Record<string, any>;
  }): Promise<NotificationItem> {
    // 检查是否在静默时间
    if (this.isQuietHours()) {
      console.log('Notification suppressed during quiet hours');
    }

    const notification: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: params.type,
      title: params.title,
      message: params.message,
      read: false,
      createdAt: Date.now(),
      actionUrl: params.actionUrl,
    };

    this.notifications.unshift(notification);

    // 通知所有监听器
    this.listeners.forEach(listener => listener(notification));

    // 发送到其他渠道
    if (this.settings.channels.email && this.settings.email) {
      await this.sendEmail(notification);
    }
    if (this.settings.channels.webhook && this.settings.webhookUrl) {
      await this.sendWebhook(notification);
    }

    return notification;
  }

  // 使用模板发送通知
  async sendFromTemplate(
    templateId: string,
    overrides?: Partial<NotificationItem>,
    data?: Record<string, any>
  ): Promise<NotificationItem | null> {
    const template = NOTIFICATION_TEMPLATES[templateId];
    if (!template) {
      console.error(`Template not found: ${templateId}`);
      return null;
    }

    return this.send({
      type: this.getTypeFromTemplate(templateId),
      title: overrides?.title || template.title,
      message: overrides?.message || template.message,
      priority: template.priority,
      actionUrl: overrides?.actionUrl,
      data,
    });
  }

  // 获取通知类型
  private getTypeFromTemplate(templateId: string): NotificationItem['type'] {
    if (templateId.startsWith('transaction')) return 'transaction';
    if (templateId.includes('risk') || templateId.includes('security')) return 'risk';
    if (templateId.includes('defi') || templateId.includes('apy')) return 'payment';
    if (templateId.includes('approval')) return 'approval';
    return 'system';
  }

  // 获取所有通知
  getNotifications(options?: {
    unreadOnly?: boolean;
    type?: NotificationItem['type'];
    limit?: number;
  }): NotificationItem[] {
    let result = [...this.notifications];

    if (options?.unreadOnly) {
      result = result.filter(n => !n.read);
    }

    if (options?.type) {
      result = result.filter(n => n.type === options.type);
    }

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  // 获取未读数量
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // 标记为已读
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  // 标记全部已读
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  // 删除通知
  delete(notificationId: string): void {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  // 清空所有通知
  clearAll(): void {
    this.notifications = [];
  }

  // 订阅通知
  subscribe(listener: (notification: NotificationItem) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 更新设置
  updateSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  // 获取设置
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // 检查是否在静默时间
  private isQuietHours(): boolean {
    if (!this.settings.quietHours.enabled) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = this.settings.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = this.settings.quietHours.end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
  }

  // 发送邮件 (模拟)
  private async sendEmail(notification: NotificationItem): Promise<void> {
    console.log(`[Email] Sending to ${this.settings.email}:`, notification.title);
    // 实际实现应调用邮件服务API
  }

  // 发送Webhook (模拟)
  private async sendWebhook(notification: NotificationItem): Promise<void> {
    if (!this.settings.webhookUrl) return;

    try {
      await fetch(this.settings.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          timestamp: notification.createdAt,
        }),
      });
    } catch (error) {
      console.error('Webhook delivery failed:', error);
    }
  }

  // 创建交易通知
  async notifyTransaction(status: 'pending' | 'signed' | 'completed' | 'failed', txId: string, details?: string) {
    return this.sendFromTemplate(`transaction_${status}`, {
      message: details || NOTIFICATION_TEMPLATES[`transaction_${status}`]?.message,
      actionUrl: `/transactions/${txId}`,
    });
  }

  // 创建风险警报
  async notifyRisk(level: 'high' | 'critical', message: string, actionUrl?: string) {
    return this.send({
      type: 'risk',
      title: level === 'critical' ? '🚨 严重风险警报' : '⚠️ 高风险提醒',
      message,
      priority: 'urgent',
      actionUrl,
    });
  }

  // 创建DeFi警报
  async notifyDefi(event: 'position_alert' | 'apy_change', details: string, actionUrl?: string) {
    return this.sendFromTemplate(event === 'position_alert' ? 'defi_position_alert' : 'apy_change', {
      message: details,
      actionUrl,
    });
  }
}

// 创建默认服务实例
export const notificationService = new NotificationService();

// 导出便捷函数
export function sendNotification(params: Parameters<NotificationService['send']>[0]) {
  return notificationService.send(params);
}

export function getNotifications(options?: Parameters<NotificationService['getNotifications']>[0]) {
  return notificationService.getNotifications(options);
}

export function getUnreadNotificationCount(): number {
  return notificationService.getUnreadCount();
}

export function markNotificationAsRead(id: string): void {
  notificationService.markAsRead(id);
}

export function subscribeToNotifications(listener: (notification: NotificationItem) => void): () => void {
  return notificationService.subscribe(listener);
}

export function updateNotificationSettings(settings: Partial<NotificationSettings>): void {
  notificationService.updateSettings(settings);
}
