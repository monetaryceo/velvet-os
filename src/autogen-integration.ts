export interface AgentConfig { id: string; name: string; role: string; systemMessage: string; llmConfig: any; }
export interface AgentMessage { agentId: string; content: string; role: 'user' | 'assistant' | 'system'; timestamp: number; }
export class AutoGenIntegration {
  private agents: Map<string, AgentConfig> = new Map();
  private conversations: Map<string, AgentMessage[]> = new Map();
  async createAgent(config: AgentConfig): Promise<string> { this.agents.set(config.id, config); return config.id; }
  async deleteAgent(agentId: string): Promise<void> { this.agents.delete(agentId); }
  async listAgents(): Promise<AgentConfig[]> { return [...this.agents.values()]; }
  async startConversation(conversationId: string, participants: string[]): Promise<void> { this.conversations.set(conversationId, []); }
  async sendMessage(conversationId: string, message: AgentMessage): Promise<void> { const msgs = this.conversations.get(conversationId) || []; msgs.push(message); this.conversations.set(conversationId, msgs); }
  async getConversation(conversationId: string): Promise<AgentMessage[]> { return this.conversations.get(conversationId) || []; }
}
export const autogenIntegration = new AutoGenIntegration();
