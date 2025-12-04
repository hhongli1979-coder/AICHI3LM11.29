/**
 * Organization Service - 组织/团队管理服务
 * 
 * 提供企业级团队管理:
 * - 组织管理
 * - 成员权限
 * - 角色配置
 * - 审批流程
 */

import type { Organization, OrganizationMember } from './types';

// 角色类型
export type Role = 'owner' | 'admin' | 'signer' | 'viewer' | 'analyst';

// 权限类型
export type Permission = 
  | 'view_wallets'
  | 'create_wallets'
  | 'view_transactions'
  | 'create_transactions'
  | 'sign_transactions'
  | 'approve_transactions'
  | 'manage_defi'
  | 'manage_members'
  | 'manage_settings'
  | 'view_analytics'
  | 'manage_agents';

// 角色权限映射
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    'view_wallets', 'create_wallets', 'view_transactions', 'create_transactions',
    'sign_transactions', 'approve_transactions', 'manage_defi', 'manage_members',
    'manage_settings', 'view_analytics', 'manage_agents',
  ],
  admin: [
    'view_wallets', 'create_wallets', 'view_transactions', 'create_transactions',
    'sign_transactions', 'approve_transactions', 'manage_defi', 'manage_members',
    'view_analytics', 'manage_agents',
  ],
  signer: [
    'view_wallets', 'view_transactions', 'create_transactions', 'sign_transactions',
    'view_analytics',
  ],
  viewer: [
    'view_wallets', 'view_transactions', 'view_analytics',
  ],
  analyst: [
    'view_wallets', 'view_transactions', 'view_analytics', 'manage_defi',
  ],
};

// 审批策略
export interface ApprovalPolicy {
  id: string;
  name: string;
  conditions: {
    minAmount?: number;
    maxAmount?: number;
    tokenTypes?: string[];
    recipientTypes?: ('internal' | 'external' | 'new')[];
  };
  requiredApprovals: number;
  approverRoles: Role[];
  timeoutHours: number;
  enabled: boolean;
}

// 审批请求
export interface ApprovalRequest {
  id: string;
  type: 'transaction' | 'member' | 'setting' | 'policy';
  resourceId: string;
  requesterId: string;
  requesterName: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requiredApprovals: number;
  currentApprovals: { memberId: string; memberName: string; timestamp: number }[];
  rejections: { memberId: string; memberName: string; reason: string; timestamp: number }[];
  createdAt: number;
  expiresAt: number;
}

// 组织设置
export interface OrganizationSettings {
  requireApprovalForNewRecipients: boolean;
  requireApprovalAboveAmount: number;
  defaultApprovalTimeout: number;
  allowSelfApproval: boolean;
  notifyOnPendingApprovals: boolean;
  twoFactorRequired: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
}

// 组织服务类
export class OrganizationService {
  private organizations: Map<string, Organization> = new Map();
  private members: Map<string, OrganizationMember[]> = new Map();
  private approvalPolicies: Map<string, ApprovalPolicy[]> = new Map();
  private approvalRequests: Map<string, ApprovalRequest[]> = new Map();
  private settings: Map<string, OrganizationSettings> = new Map();

  constructor() {
    this.initializeDefaultOrganization();
  }

  // 初始化默认组织
  private initializeDefaultOrganization() {
    const orgId = 'org-default';
    
    const org: Organization = {
      id: orgId,
      name: 'OmniCore Enterprise',
      logo: '',
      walletCount: 6,
      memberCount: 5,
      createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    };

    const members: OrganizationMember[] = [
      {
        id: 'member-1',
        name: '张三',
        email: 'zhangsan@example.com',
        role: 'owner',
        wallets: ['wallet-1', 'wallet-2', 'wallet-3'],
        lastActive: Date.now() - 10 * 60 * 1000,
        joinedAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
      },
      {
        id: 'member-2',
        name: '李四',
        email: 'lisi@example.com',
        role: 'admin',
        wallets: ['wallet-1', 'wallet-2'],
        lastActive: Date.now() - 30 * 60 * 1000,
        joinedAt: Date.now() - 150 * 24 * 60 * 60 * 1000,
      },
      {
        id: 'member-3',
        name: '王五',
        email: 'wangwu@example.com',
        role: 'signer',
        wallets: ['wallet-1'],
        lastActive: Date.now() - 2 * 60 * 60 * 1000,
        joinedAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
      },
      {
        id: 'member-4',
        name: '赵六',
        email: 'zhaoliu@example.com',
        role: 'analyst',
        wallets: [],
        lastActive: Date.now() - 5 * 60 * 60 * 1000,
        joinedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
      },
      {
        id: 'member-5',
        name: '钱七',
        email: 'qianqi@example.com',
        role: 'viewer',
        wallets: [],
        lastActive: Date.now() - 24 * 60 * 60 * 1000,
        joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      },
    ];

    const policies: ApprovalPolicy[] = [
      {
        id: 'policy-1',
        name: '大额交易审批',
        conditions: { minAmount: 10000 },
        requiredApprovals: 2,
        approverRoles: ['owner', 'admin'],
        timeoutHours: 24,
        enabled: true,
      },
      {
        id: 'policy-2',
        name: '新地址交易审批',
        conditions: { recipientTypes: ['new'] },
        requiredApprovals: 1,
        approverRoles: ['owner', 'admin', 'signer'],
        timeoutHours: 48,
        enabled: true,
      },
      {
        id: 'policy-3',
        name: '超大额交易审批',
        conditions: { minAmount: 100000 },
        requiredApprovals: 3,
        approverRoles: ['owner'],
        timeoutHours: 72,
        enabled: true,
      },
    ];

    const orgSettings: OrganizationSettings = {
      requireApprovalForNewRecipients: true,
      requireApprovalAboveAmount: 10000,
      defaultApprovalTimeout: 24,
      allowSelfApproval: false,
      notifyOnPendingApprovals: true,
      twoFactorRequired: true,
      sessionTimeout: 30,
      ipWhitelist: [],
    };

    this.organizations.set(orgId, org);
    this.members.set(orgId, members);
    this.approvalPolicies.set(orgId, policies);
    this.approvalRequests.set(orgId, []);
    this.settings.set(orgId, orgSettings);
  }

  // 获取组织
  getOrganization(orgId: string = 'org-default'): Organization | undefined {
    return this.organizations.get(orgId);
  }

  // 获取成员列表
  getMembers(orgId: string = 'org-default'): OrganizationMember[] {
    return this.members.get(orgId) || [];
  }

  // 获取成员
  getMember(orgId: string, memberId: string): OrganizationMember | undefined {
    const members = this.members.get(orgId) || [];
    return members.find(m => m.id === memberId);
  }

  // 添加成员
  async addMember(orgId: string, member: Omit<OrganizationMember, 'id' | 'lastActive' | 'joinedAt'>): Promise<OrganizationMember> {
    const newMember: OrganizationMember = {
      ...member,
      id: `member-${Date.now()}`,
      lastActive: Date.now(),
      joinedAt: Date.now(),
    };

    const members = this.members.get(orgId) || [];
    members.push(newMember);
    this.members.set(orgId, members);

    // 更新组织成员数
    const org = this.organizations.get(orgId);
    if (org) {
      org.memberCount = members.length;
      this.organizations.set(orgId, org);
    }

    return newMember;
  }

  // 更新成员角色
  async updateMemberRole(orgId: string, memberId: string, newRole: Role): Promise<OrganizationMember | null> {
    const members = this.members.get(orgId) || [];
    const member = members.find(m => m.id === memberId);
    
    if (member) {
      member.role = newRole;
      this.members.set(orgId, members);
      return member;
    }
    
    return null;
  }

  // 移除成员
  async removeMember(orgId: string, memberId: string): Promise<boolean> {
    const members = this.members.get(orgId) || [];
    const index = members.findIndex(m => m.id === memberId);
    
    if (index > -1) {
      members.splice(index, 1);
      this.members.set(orgId, members);

      // 更新组织成员数
      const org = this.organizations.get(orgId);
      if (org) {
        org.memberCount = members.length;
        this.organizations.set(orgId, org);
      }

      return true;
    }
    
    return false;
  }

  // 检查权限
  hasPermission(orgId: string, memberId: string, permission: Permission): boolean {
    const member = this.getMember(orgId, memberId);
    if (!member) return false;

    const permissions = ROLE_PERMISSIONS[member.role as Role];
    return permissions?.includes(permission) || false;
  }

  // 获取成员权限
  getMemberPermissions(orgId: string, memberId: string): Permission[] {
    const member = this.getMember(orgId, memberId);
    if (!member) return [];

    return ROLE_PERMISSIONS[member.role as Role] || [];
  }

  // 获取审批策略
  getApprovalPolicies(orgId: string = 'org-default'): ApprovalPolicy[] {
    return this.approvalPolicies.get(orgId) || [];
  }

  // 创建审批请求
  async createApprovalRequest(
    orgId: string,
    request: Omit<ApprovalRequest, 'id' | 'status' | 'currentApprovals' | 'rejections' | 'createdAt' | 'expiresAt'>
  ): Promise<ApprovalRequest> {
    const settings = this.settings.get(orgId);
    const timeoutHours = settings?.defaultApprovalTimeout || 24;

    const newRequest: ApprovalRequest = {
      ...request,
      id: `approval-${Date.now()}`,
      status: 'pending',
      currentApprovals: [],
      rejections: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + timeoutHours * 60 * 60 * 1000,
    };

    const requests = this.approvalRequests.get(orgId) || [];
    requests.push(newRequest);
    this.approvalRequests.set(orgId, requests);

    return newRequest;
  }

  // 审批请求
  async approveRequest(orgId: string, requestId: string, memberId: string, memberName: string): Promise<ApprovalRequest | null> {
    const requests = this.approvalRequests.get(orgId) || [];
    const request = requests.find(r => r.id === requestId);

    if (!request || request.status !== 'pending') return null;

    // 检查是否已审批
    if (request.currentApprovals.some(a => a.memberId === memberId)) {
      return null;
    }

    request.currentApprovals.push({
      memberId,
      memberName,
      timestamp: Date.now(),
    });

    // 检查是否达到所需审批数
    if (request.currentApprovals.length >= request.requiredApprovals) {
      request.status = 'approved';
    }

    this.approvalRequests.set(orgId, requests);
    return request;
  }

  // 拒绝请求
  async rejectRequest(orgId: string, requestId: string, memberId: string, memberName: string, reason: string): Promise<ApprovalRequest | null> {
    const requests = this.approvalRequests.get(orgId) || [];
    const request = requests.find(r => r.id === requestId);

    if (!request || request.status !== 'pending') return null;

    request.status = 'rejected';
    request.rejections.push({
      memberId,
      memberName,
      reason,
      timestamp: Date.now(),
    });

    this.approvalRequests.set(orgId, requests);
    return request;
  }

  // 获取待处理审批
  getPendingApprovals(orgId: string = 'org-default'): ApprovalRequest[] {
    const requests = this.approvalRequests.get(orgId) || [];
    return requests.filter(r => r.status === 'pending' && r.expiresAt > Date.now());
  }

  // 获取组织设置
  getSettings(orgId: string = 'org-default'): OrganizationSettings | undefined {
    return this.settings.get(orgId);
  }

  // 更新组织设置
  async updateSettings(orgId: string, updates: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
    const current = this.settings.get(orgId) || {} as OrganizationSettings;
    const updated = { ...current, ...updates };
    this.settings.set(orgId, updated);
    return updated;
  }

  // 获取角色权限定义
  getRolePermissions(): Record<Role, Permission[]> {
    return ROLE_PERMISSIONS;
  }

  // 获取所有角色
  getRoles(): Role[] {
    return Object.keys(ROLE_PERMISSIONS) as Role[];
  }
}

// 创建默认服务实例
export const organizationService = new OrganizationService();

// 导出便捷函数
export function getOrganization(orgId?: string) {
  return organizationService.getOrganization(orgId);
}

export function getOrganizationMembers(orgId?: string) {
  return organizationService.getMembers(orgId);
}

export function checkPermission(orgId: string, memberId: string, permission: Permission) {
  return organizationService.hasPermission(orgId, memberId, permission);
}

export function getPendingApprovals(orgId?: string) {
  return organizationService.getPendingApprovals(orgId);
}

export async function createApprovalRequest(orgId: string, request: Parameters<OrganizationService['createApprovalRequest']>[1]) {
  return organizationService.createApprovalRequest(orgId, request);
}

export async function approveRequest(orgId: string, requestId: string, memberId: string, memberName: string) {
  return organizationService.approveRequest(orgId, requestId, memberId, memberName);
}
