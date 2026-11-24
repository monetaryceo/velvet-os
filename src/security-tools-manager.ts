import { nethunterIntegration } from './nethunter-integration';
import { jarvisIntegration } from './jarvis-integration';
import { artexIntegration } from './artex-integration';
import { ghostmanIntegration } from './ghostman-integration';
export interface ToolStatus { id: string; name: string; status: 'available' | 'running' | 'error'; lastUsed?: number; }
export class SecurityToolsManager {
  private tools: Map<string, { name: string; status: 'available' | 'running' | 'error'; lastUsed?: number }> = new Map();
  constructor() {
    this.tools.set('nethunter', { name: 'Nethunter', status: 'available' });
    this.tools.set('jarvis', { name: 'Jarvis', status: 'available' });
    this.tools.set('artex', { name: 'ARTEX', status: 'available' });
    this.tools.set('ghostman', { name: 'Ghostman', status: 'available' });
  }
  getTools(): ToolStatus[] { return [...this.tools.values()]; }
  getTool(id: string): ToolStatus | null { return this.tools.get(id) || null; }
  async enableTool(id: string): Promise<boolean> { const tool = this.tools.get(id); if (!tool) return false; tool.status = 'available'; tool.lastUsed = Date.now(); return true; }
  async disableTool(id: string): Promise<boolean> { const tool = this.tools.get(id); if (!tool) return false; tool.status = 'available'; return true; }
  async getToolStatus(id: string): Promise<'available' | 'running' | 'error' | null> { const tool = this.tools.get(id); return tool ? tool.status : null; }
  async coordinatedScan(target: string, tools: string[] = ['nethunter', 'artex']): Promise<any[]> { const results: any[] = []; for (const toolId of tools) { const tool = this.tools.get(toolId); if (!tool) continue; tool.status = 'running'; tool.lastUsed = Date.now(); try { if (toolId === 'nethunter') { const result = await nethunterIntegration.execute('nmap-scan', target); results.push({ tool: toolId, result }); } else if (toolId === 'artex') { const targetResult = await artexIntegration.discover(target); const scanResult = await artexIntegration.scan(targetResult.id); results.push({ tool: toolId, result: scanResult }); } tool.status = 'available'; } catch (err) { tool.status = 'error'; results.push({ tool: toolId, error: String(err) }); } } return results; }
}
export const securityToolsManager = new SecurityToolsManager();
