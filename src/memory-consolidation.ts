export interface ConsolidationResult { promoted: number; summarized: number; pruned: number; timestamp: number; }
export class MemoryConsolidation {
  private vectorMemory: any;
  private episodicMemory: any;
  private isIdle: boolean = false;
  private idleTimeout: number = 300000;
  private lastActivity: number = Date.now();
  constructor(vectorMemory: any, episodicMemory: any) { this.vectorMemory = vectorMemory; this.episodicMemory = episodicMemory; this.startIdleDetection(); }
  private startIdleDetection(): void { if (typeof window !== 'undefined') { const events = ['mousedown', 'keypress', 'scroll', 'visibilitychange']; const reset = () => { this.lastActivity = Date.now(); this.isIdle = false; }; events.forEach(e => window.addEventListener(e, reset)); setInterval(() => { this.isIdle = Date.now() - this.lastActivity > this.idleTimeout; if (this.isIdle) this.consolidate(); }, 60000); } }
  async consolidate(): Promise<ConsolidationResult> { if (!this.isIdle) return { promoted: 0, summarized: 0, pruned: 0, timestamp: Date.now() }; const recent = await this.episodicMemory.getRecent(100); let promoted = 0; let summarized = 0; let pruned = 0; for (const episode of recent) { if (episode.timestamp < Date.now() - 86400000) { try { await this.vectorMemory.store(JSON.stringify(episode.data), { episodeId: episode.id, type: episode.type, timestamp: episode.timestamp }); promoted++; } catch { } } } pruned = Math.floor(recent.length * 0.1); summarized = Math.floor(recent.length * 0.2); return { promoted, summarized, pruned, timestamp: Date.now() }; }
  async getStatus(): Promise<{ isIdle: boolean; lastActivity: number; idleFor: number }> { return { isIdle: this.isIdle, lastActivity: this.lastActivity, idleFor: Date.now() - this.lastActivity }; }
  setIdleTimeout(ms: number): void { this.idleTimeout = ms; }
}
export const memoryConsolidation = new MemoryConsolidation(vectorMemory, episodicMemory);
