export interface FridaDevice { id: string; name: string; type: 'usb' | 'network' | 'local'; }
export interface FridaSession { id: string; deviceId: string; target: string | number; state: 'attached' | 'spawned' | 'detached'; }
export interface FridaScript { id: string; sessionId: string; source: string; state: 'loaded' | 'unloaded'; }
export class FridaIntegration {
  private devices: Map<string, FridaDevice> = new Map();
  private sessions: Map<string, FridaSession> = new Map();
  private scripts: Map<string, FridaScript> = new Map();
  constructor() { this.devices.set('local', { id: 'local', name: 'Local Device', type: 'local' }); }
  async listDevices(): Promise<FridaDevice[]> { return [...this.devices.values()]; }
  async attach(target: string | number): Promise<FridaSession> { const sessionId = 'session_' + Date.now(); const session: FridaSession = { id: sessionId, deviceId: 'local', target: String(target), state: 'attached' }; this.sessions.set(sessionId, session); return session; }
  async spawn(program: string, argv: string[] = []): Promise<FridaSession> { const sessionId = 'session_' + Date.now(); const session: FridaSession = { id: sessionId, deviceId: 'local', target: program, state: 'spawned' }; this.sessions.set(sessionId, session); return session; }
  async resume(sessionId: string): Promise<void> { const session = this.sessions.get(sessionId); if (session) session.state = 'attached'; }
  async detach(sessionId: string): Promise<void> { const session = this.sessions.get(sessionId); if (session) session.state = 'detached'; }
  async loadScript(sessionId: string, source: string): Promise<FridaScript> { const scriptId = 'script_' + Date.now(); const script: FridaScript = { id: scriptId, sessionId, source, state: 'loaded' }; this.scripts.set(scriptId, script); return script; }
  async unloadScript(scriptId: string): Promise<void> { const script = this.scripts.get(scriptId); if (script) script.state = 'unloaded'; }
  getSessions(): FridaSession[] { return [...this.sessions.values()]; }
  getScripts(): FridaScript[] { return [...this.scripts.values()]; }
}
export const fridaIntegration = new FridaIntegration();
