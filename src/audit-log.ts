export class AuditLog {
  private chain: string[] = [];
  private maxEntries: number = 10000;
  constructor(maxEntries: number = 10000) { this.maxEntries = maxEntries; this.loadChain(); }
  private loadChain(): void { try { const raw = localStorage.getItem('velvet_audit_chain'); if (raw) this.chain = JSON.parse(raw); } catch { this.chain = []; } }
  private saveChain(): void { try { localStorage.setItem('velvet_audit_chain', JSON.stringify(this.chain.slice(-this.maxEntries))); } catch { } }
  private computeHash(entry: any): string { const data = JSON.stringify({ ...entry, timestamp: entry.timestamp, prevHash: entry.prevHash || 'genesis' }); let hash = 0; for (let i = 0; i < data.length; i++) { hash = ((hash << 5) - hash) + data.charCodeAt(i); hash = hash & hash; } return Math.abs(hash).toString(16); }
  async audit(action: string, actor: string, resource: string, details?: any): Promise<void> { const prevHash = this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : 'genesis'; const entry = { id: 'audit_' + Date.now() + '_' + Math.random().toString(36).slice(2), timestamp: Date.now(), action, actor, resource, details, prevHash, hash: this.computeHash({ action, actor, resource, details, timestamp: Date.now(), prevHash }) }; this.chain.push(entry); this.saveChain(); }
  async auditSecurity(action: string, actor: string, resource: string, details?: any): Promise<void> { await this.audit('[SECURITY] ' + action, actor, resource, details); }
  async auditCritical(action: string, actor: string, resource: string, details?: any): Promise<void> { await this.audit('[CRITICAL] ' + action, actor, resource, details); }
  async verifyChain(): Promise<boolean> { for (let i = 1; i < this.chain.length; i++) { const current = this.chain[i]; const previous = this.chain[i - 1]; if (current.prevHash !== previous.hash) return false; const expectedHash = this.computeHash({ ...current, prevHash: current.prevHash }); if (current.hash !== expectedHash) return false; } return true; }
  getEntries(limit?: number): any[] { const entries = [...this.chain].reverse(); return limit ? entries.slice(0, limit) : entries; }
}
export const auditLog = new AuditLog();
