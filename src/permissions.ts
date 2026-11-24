export type Permission = 'read' | 'write' | 'execute' | 'network' | 'filesystem' | 'network.egress' | 'network.ingress';
export type ConditionType = 'time_window' | 'allowed_hosts' | 'allowed_ports' | 'allowed_paths';
export interface Condition { type: ConditionType; values: string[]; }
export interface PermissionGrant { subject: string; permission: Permission; conditions: Condition[]; grantedAt: number; grantedBy: string; expiresAt?: number; }
export class PermissionManager {
  private grants: Map<string, PermissionGrant[]> = new Map();
  private defaultDeny: boolean = true;
  async grant(subject: string, permission: Permission, conditions: Condition[] = [], grantedBy: string = 'system', expiresAt?: number): Promise<void> { const grant: PermissionGrant = { subject, permission, conditions, grantedAt: Date.now(), grantedBy, expiresAt }; if (!this.grants.has(subject)) this.grants.set(subject, []); this.grants.get(subject)!.push(grant); }
  async revoke(subject: string, permission: Permission): Promise<void> { const grants = this.grants.get(subject); if (grants) { this.grants.set(subject, grants.filter(g => g.permission !== permission)); } }
  async check(subject: string, permission: Permission, context?: Record<string, any>): Promise<boolean> { if (!this.defaultDeny) return true; const grants = this.grants.get(subject); if (!grants) return false; const now = Date.now(); const matching = grants.filter(g => g.permission === permission && (!g.expiresAt || g.expiresAt > now)); for (const grant of matching) { if (await this.evaluateConditions(grant.conditions, context || {})) return true; } return false; }
  private async evaluateConditions(conditions: Condition[], context: Record<string, any>): Promise<boolean> { for (const condition of conditions) { if (!await this.evaluateCondition(condition, context)) return false; } return true; }
  private async evaluateCondition(condition: Condition, context: Record<string, any>): Promise<boolean> { switch (condition.type) { case 'time_window': { const now = new Date(); const start = condition.values[0] ? new Date(condition.values[0]) : null; const end = condition.values[1] ? new Date(condition.values[1]) : null; if (start && now < start) return false; if (end && now > end) return false; return true; } case 'allowed_hosts': { const host = context.host || ''; return condition.values.includes(host) || condition.values.includes('*'); } case 'allowed_ports': { const port = context.port ? String(context.port) : ''; return condition.values.includes(port) || condition.values.includes('*'); } case 'allowed_paths': { const path = context.path || ''; return condition.values.some(p => path.startsWith(p)) || condition.values.includes('*'); } default: return false; } }
  async getGrants(subject: string): Promise<PermissionGrant[]> { return this.grants.get(subject) || []; }
  async setDefaultDeny(deny: boolean): Promise<void> { this.defaultDeny = deny; }
}
export const permissionManager = new PermissionManager();
