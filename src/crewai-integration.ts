export interface CrewAgent { id: string; role: string; goal: string; backstory: string; tools: string[]; }
export interface CrewTask { id: string; description: string; agentId: string; expectedOutput: string; }
export interface CrewResult { crewId: string; tasks: CrewTask[]; output: any; timestamp: number; }
export class CrewAIIntegration {
  private agents: Map<string, CrewAgent> = new Map();
  private tasks: Map<string, CrewTask> = new Map();
  private crews: Map<string, CrewResult> = new Map();
  async createAgent(config: CrewAgent): Promise<string> { this.agents.set(config.id, config); return config.id; }
  async createTask(config: CrewTask): Promise<string> { this.tasks.set(config.id, config); return config.id; }
  async createCrew(agentIds: string[], taskIds: string[]): Promise<string> { const crewId = 'crew_' + Date.now(); const result: CrewResult = { crewId, tasks: taskIds.map(tid => this.tasks.get(tid)!).filter(Boolean), output: { status: 'created', agentCount: agentIds.length }, timestamp: Date.now() }; this.crews.set(crewId, result); return crewId; }
  async runCrew(crewId: string): Promise<CrewResult> { const crew = this.crews.get(crewId); if (!crew) throw new Error('Crew ' + crewId + ' not found'); crew.output = { ...crew.output, status: 'completed', completedAt: Date.now() }; return crew; }
  async getCrew(crewId: string): Promise<CrewResult | null> { return this.crews.get(crewId) || null; }
}
export const crewAIIntegration = new CrewAIIntegration();
