export interface ModelInfo { id: string; name: string; vendor: string; version: string; contextWindow: number; capabilities: string[]; status: 'available' | 'loading' | 'loaded' | 'error'; }
export interface ModelRegistryConfig { defaultModel: string; maxConcurrent: number; vramLimitMB: number; }
export class ModelRegistry {
  private models: Map<string, ModelInfo> = new Map();
  private loadedModels: Map<string, any> = new Map();
  private config: ModelRegistryConfig;
  constructor(config: Partial<ModelRegistryConfig> = {}) {
    this.config = { defaultModel: config.defaultModel ?? 'llama-3.1-8b', maxConcurrent: config.maxConcurrent ?? 3, vramLimitMB: config.vramLimitMB ?? 8192 };
    this.registerDefaultModels();
  }
  private registerDefaultModels(): void {
    const models: ModelInfo[] = [
      { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', vendor: 'Meta', version: '3.1', contextWindow: 128000, capabilities: ['text', 'code', 'reasoning'], status: 'available' },
      { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', vendor: 'Meta', version: '3.1', contextWindow: 128000, capabilities: ['text', 'code', 'reasoning', 'analysis'], status: 'available' },
      { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', vendor: 'Meta', version: '3.1', contextWindow: 128000, capabilities: ['text', 'code', 'reasoning', 'analysis', 'complex'], status: 'available' },
      { id: 'qwen-2.5-7b', name: 'Qwen 2.5 7B', vendor: 'Alibaba', version: '2.5', contextWindow: 128000, capabilities: ['text', 'multilingual', 'code'], status: 'available' },
      { id: 'qwen-2.5-32b', name: 'Qwen 2.5 32B', vendor: 'Alibaba', version: '2.5', contextWindow: 128000, capabilities: ['text', 'multilingual', 'code', 'reasoning'], status: 'available' },
      { id: 'qwen-2.5-72b', name: 'Qwen 2.5 72B', vendor: 'Alibaba', version: '2.5', contextWindow: 128000, capabilities: ['text', 'multilingual', 'code', 'reasoning', 'complex'], status: 'available' },
      { id: 'nemotron-3-ultra', name: 'Nemotron 3 Ultra', vendor: 'NVIDIA', version: '3', contextWindow: 128000, capabilities: ['text', 'reasoning', 'code'], status: 'available' },
      { id: 'deepseek-v3', name: 'DeepSeek V3', vendor: 'DeepSeek', version: 'V3', contextWindow: 128000, capabilities: ['text', 'code', 'reasoning'], status: 'available' },
      { id: 'deepseek-r1', name: 'DeepSeek R1', vendor: 'DeepSeek', version: 'R1', contextWindow: 128000, capabilities: ['text', 'reasoning', 'chain-of-thought'], status: 'available' },
      { id: 'phi-3.5', name: 'Phi-3.5', vendor: 'Microsoft', version: '3.5', contextWindow: 128000, capabilities: ['text', 'code', 'edge'], status: 'available' },
    ];
    for (const m of models) this.models.set(m.id, m);
  }
  getModels(): ModelInfo[] { return [...this.models.values()]; }
  getModel(id: string): ModelInfo | null { return this.models.get(id) || null; }
  async loadModel(id: string): Promise<any> { const model = this.models.get(id); if (!model) throw new Error('Model ' + id + ' not found'); model.status = 'loading'; this.loadedModels.set(id, { id, name: model.name, loadedAt: Date.now() }); model.status = 'loaded'; return this.loadedModels.get(id)!; }
  async unloadModel(id: string): Promise<void> { this.loadedModels.delete(id); const model = this.models.get(id); if (model) model.status = 'available'; }
  async isLoaded(id: string): Promise<boolean> { return this.loadedModels.has(id); }
}
export const modelRegistry = new ModelRegistry();
