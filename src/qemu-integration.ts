export interface QemuVmConfig { id: string; name: string; arch: string; machine: string; accelerator: string; memoryMB: number; smp: number; disks: string[]; networks: string[]; display: 'vnc' | 'spice' | 'serial' | 'none'; }
export interface QemuVmState { id: string; name: string; state: 'running' | 'paused' | 'stopped' | 'error'; pid: number | null; }
export class QemuIntegration {
  private vms: Map<string, QemuVmConfig> = new Map();
  private states: Map<string, QemuVmState> = new Map();
  async createVm(config: QemuVmConfig): Promise<void> { this.vms.set(config.id, config); this.states.set(config.id, { id: config.id, name: config.name, state: 'stopped', pid: null }); }
  async startVm(vmId: string): Promise<void> { const vm = this.vms.get(vmId); if (!vm) throw new Error('VM ' + vmId + ' not found'); const state = this.states.get(vmId); if (state) { state.state = 'running'; state.pid = Date.now(); } }
  async stopVm(vmId: string): Promise<void> { const state = this.states.get(vmId); if (state) { state.state = 'stopped'; state.pid = null; } }
  async pauseVm(vmId: string): Promise<void> { const state = this.states.get(vmId); if (state) state.state = 'paused'; }
  async resumeVm(vmId: string): Promise<void> { const state = this.states.get(vmId); if (state) state.state = 'running'; }
  async getVmState(vmId: string): Promise<QemuVmState | null> { return this.states.get(vmId) || null; }
  async getVms(): Promise<QemuVmConfig[]> { return [...this.vms.values()]; }
  async readMemory(vmId: string, address: number, size: number): Promise<Uint8Array> { return new Uint8Array(size); }
  async writeMemory(vmId: string, address: number, data: Uint8Array): Promise<void> { }
}
export const qemuIntegration = new QemuIntegration();
