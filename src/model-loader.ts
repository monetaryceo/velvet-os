export interface LoadConfig { maxConcurrent: number; vramLimitMB: number; autoUnload: boolean; }
export class ModelLoader {
  private loading: Map<string, Promise<any>> = new Map();
  private config: LoadConfig;
  constructor(config: Partial<LoadConfig> = {}) { this.config = { maxConcurrent: config.maxConcurrent ?? 3, vramLimitMB: config.vramLimitMB ?? 8192, autoUnload: config.autoUnload ?? true }; }
  async load(modelId: string, loader: () => Promise<any>): Promise<any> { if (this.loading.has(modelId)) return this.loading.get(modelId)!; const promise = this.doLoad(modelId, loader); this.loading.set(modelId, promise); const result = await promise; this.loading.delete(modelId); return result; }
  private async doLoad(modelId: string, loader: () => Promise<any>): Promise<any> { return loader(); }
  async unload(modelId: string): Promise<void> { this.loading.delete(modelId); }
  async isLoading(modelId: string): Promise<boolean> { return this.loading.has(modelId); }
  getConfig(): LoadConfig { return { ...this.config }; }
}
export const modelLoader = new ModelLoader();
