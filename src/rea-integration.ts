export interface ReaBinary { id: string; path: string; format: string; architecture: string; size: number; sha256: string; }
export interface ReaFunction { id: string; name: string; address: string; size: number; signature: string; bodyRanges: { start: number; end: number }[]; }
export interface ReaReference { source: string; target: string; type: 'call' | 'data' | 'string'; }
export interface ReaString { id: string; address: string; value: string; encoding: string; }
export interface ReaDecompileResult { functionId: string; pseudocode: string; confidence: number; limitations: string[]; }
export interface ReaCallGraph { nodes: ReaFunction[]; edges: ReaReference[]; }
export interface ReaAnalysisResult { binary: ReaBinary; functions: ReaFunction[]; strings: ReaString[]; references: ReaReference[]; callGraph: ReaCallGraph; }
export class ReaAdapter {
  async analyzeBinary(path: string): Promise<ReaAnalysisResult> { return this.simulatedAnalysis(path); }
  async decompileFunction(functionId: string): Promise<ReaDecompileResult> { return { functionId, pseudocode: '// Simulated decompiled code\\nint main() { return 0; }', confidence: 0.85, limitations: ['No source symbols available', 'Optimized code may be incomplete'] }; }
  async getXrefs(address: string): Promise<ReaReference[]> { return []; }
  async getCallGraph(functionId: string): Promise<ReaCallGraph> { return { nodes: [], edges: [] }; }
  async listStrings(binaryId: string): Promise<ReaString[]> { return []; }
  private async simulatedAnalysis(path: string): Promise<ReaAnalysisResult> { return { binary: { id: 'bin_' + Date.now(), path, format: 'elf', architecture: 'x86_64', size: 1024, sha256: 'simulated' }, functions: [], strings: [], references: [], callGraph: { nodes: [], edges: [] } }; }
}
export class ReaIntegration {
  private adapter: ReaAdapter;
  private analyses: Map<string, ReaAnalysisResult> = new Map();
  constructor(adapter?: ReaAdapter) { this.adapter = adapter || new ReaAdapter(); }
  setAdapter(adapter: ReaAdapter): void { this.adapter = adapter; }
  async analyzeBinary(path: string): Promise<ReaAnalysisResult> { const result = await this.adapter.analyzeBinary(path); this.analyses.set(result.binary.id, result); return result; }
  async decompileFunction(binaryId: string, functionId: string): Promise<ReaDecompileResult> { return this.adapter.decompileFunction(functionId); }
  async getXrefs(address: string): Promise<ReaReference[]> { return this.adapter.getXrefs(address); }
  async getCallGraph(functionId: string): Promise<ReaCallGraph> { return this.adapter.getCallGraph(functionId); }
  async listStrings(binaryId: string): Promise<ReaString[]> { return this.adapter.listStrings(binaryId); }
  getAnalysis(binaryId: string): ReaAnalysisResult | null { return this.analyses.get(binaryId) || null; }
  getAnalyses(): ReaAnalysisResult[] { return [...this.analyses.values()]; }
}
export const reaIntegration = new ReaIntegration();
