export interface Episode { id: string; timestamp: number; type: string; data: any; vector: number[]; parentId?: string; }
export class EpisodicMemory {
  private episodes: Map<string, Episode> = new Map();
  private maxEpisodes: number = 1000;
  constructor(maxEpisodes: number = 1000) { this.maxEpisodes = maxEpisodes; }
  async record(type: string, data: any, parentId?: string, vector: number[] = []): Promise<string> { const id = 'ep_' + Date.now() + '_' + Math.random().toString(36).slice(2); const episode: Episode = { id, timestamp: Date.now(), type, data, vector, parentId }; this.episodes.set(id, episode); if (this.episodes.size > this.maxEpisodes) { const firstId = this.episodes.keys().next().value; if (firstId) this.episodes.delete(firstId); } return id; }
  async get(id: string): Promise<Episode | null> { return this.episodes.get(id) || null; }
  async getByType(type: string): Promise<Episode[]> { return [...this.episodes.values()].filter(e => e.type === type).sort((a, b) => b.timestamp - a.timestamp); }
  async getRecent(limit: number = 50): Promise<Episode[]> { return [...this.episodes.values()].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit); }
  async getByTag(tag: string): Promise<Episode[]> { return [...this.episodes.values()].filter(e => JSON.stringify(e.data).includes(tag)).sort((a, b) => b.timestamp - a.timestamp); }
  async getByParticipant(participant: string): Promise<Episode[]> { return [...this.episodes.values()].filter(e => JSON.stringify(e.data).includes(participant)).sort((a, b) => b.timestamp - a.timestamp); }
  async getChildren(parentId: string): Promise<Episode[]> { return [...this.episodes.values()].filter(e => e.parentId === parentId); }
  async delete(id: string): Promise<void> { this.episodes.delete(id); }
  async clear(): Promise<void> { this.episodes.clear(); }
}
export const episodicMemory = new EpisodicMemory();
