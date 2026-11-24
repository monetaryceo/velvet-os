export interface SearchResult { id: string; text: string; score: number; source: 'vector' | 'episodic' | 'keyword'; metadata: Record<string, any>; }
export class SemanticSearch {
  private vectorMemory: any;
  private episodicMemory: any;
  constructor(vectorMemory: any, episodicMemory: any) { this.vectorMemory = vectorMemory; this.episodicMemory = episodicMemory; }
  async search(query: string, topK: number = 10): Promise<SearchResult[]> { const vectorResults = await this.vectorMemory.query(query, Math.ceil(topK / 2)); const episodicResults = await this.episodicMemory.getRecent(topK); const combined: SearchResult[] = []; for (const r of vectorResults) { combined.push({ id: r.id, text: r.text, score: r.score, source: 'vector', metadata: r.metadata }); } for (const e of episodicResults) { combined.push({ id: e.id, text: JSON.stringify(e.data), score: 0.5, source: 'episodic', metadata: { type: e.type, timestamp: e.timestamp } }); } combined.sort((a, b) => b.score - a.score); return combined.slice(0, topK); }
  async indexDocument(id: string, text: string, metadata: Record<string, any> = {}): Promise<void> { await this.vectorMemory.store(text, { ...metadata, documentId: id }); }
}
export const semanticSearch = new SemanticSearch(vectorMemory, episodicMemory);
