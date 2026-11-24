export interface VectorEntry { id: string; text: string; vector: number[]; metadata: Record<string, any>; timestamp: number; }
export class VectorMemory {
  private entries: Map<string, VectorEntry> = new Map();
  private dimensions: number = 128;
  async embed(text: string): Promise<number[]> { const hash = this.simpleHash(text); const vector: number[] = []; for (let i = 0; i < this.dimensions; i++) { vector.push((hash >> (i % 32)) & 1 ? 0.5 : -0.5); } return vector; }
  private simpleHash(text: string): number { let hash = 0; for (let i = 0; i < text.length; i++) { hash = ((hash << 5) - hash) + text.charCodeAt(i); hash = hash & hash; } return Math.abs(hash); }
  async store(text: string, metadata: Record<string, any> = {}): Promise<string> { const id = 'mem_' + Date.now() + '_' + Math.random().toString(36).slice(2); const vector = await this.embed(text); const entry: VectorEntry = { id, text, vector, metadata, timestamp: Date.now() }; this.entries.set(id, entry); return id; }
  async query(text: string, topK: number = 10): Promise<{ id: string; text: string; score: number; metadata: Record<string, any> }[]> { const queryVector = await this.embed(text); const results: { id: string; text: string; score: number; metadata: Record<string, any> }[] = []; for (const [id, entry] of this.entries) { const score = this.cosineSimilarity(queryVector, entry.vector); results.push({ id, text: entry.text, score, metadata: entry.metadata }); } results.sort((a, b) => b.score - a.score); return results.slice(0, topK); }
  private cosineSimilarity(a: number[], b: number[]): number { let dot = 0; let normA = 0; let normB = 0; for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; normA += a[i] * a[i]; normB += b[i] * b[i]; } return normA === 0 || normB === 0 ? 0 : dot / (Math.sqrt(normA) * Math.sqrt(normB)); }
  async get(id: string): Promise<VectorEntry | null> { return this.entries.get(id) || null; }
  async delete(id: string): Promise<void> { this.entries.delete(id); }
  async getAll(): Promise<VectorEntry[]> { return [...this.entries.values()]; }
}
export const vectorMemory = new VectorMemory();
