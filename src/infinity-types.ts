// Infinity Runtime Types for Velvet OS Agentic Core
export type AgentId = string;
export type ConversationId = string;
export type ModelId = string;
export type ToolId = string;
export type AgentStatus = 'idle' | 'running' | 'paused' | 'stopped' | 'error' | 'completed';
export interface AgentConfig {
  id: AgentId; name: string; type: 'worker' | 'orchestrator' | 'specialist' | 'critical';
  capabilities: string[]; quota: ResourceQuota; modelId: ModelId; tools: ToolId[];
  autoRestart: boolean; maxRestarts: number; timeoutMs: number; metadata: Record<string, string>;
}
export interface AgentState {
  id: AgentId; status: AgentStatus; startedAt: number | null; stoppedAt: number | null;
  restartCount: number; currentTask: string | null; lastActivity: number | null;
  error: string | null; resourceUsage: ResourceUsage; capabilities: string[]; metadata: Record<string, string>;
}
export interface ResourceQuota {
  cpuPercent: number; memoryMB: number; vramMB: number; networkMBps: number;
  maxConcurrentCalls: number; maxIterations: number;
}
export interface ResourceUsage { cpuPercent: number; memoryMB: number; vramMB: number; networkMBps: number; }
export type RapMessageType = 'agent.spawn' | 'agent.stop' | 'agent.kill' | 'agent.restart' | 'agent.update' | 'agent.state' | 'agent.event' | 'message.send' | 'message.receive' | 'message.stream' | 'tool.call' | 'tool.result' | 'model.load' | 'model.unload' | 'model.inference' | 'model.inference.stream' | 'snapshot.create' | 'snapshot.restore' | 'system.status' | 'system.health';
export interface RapMessage { id: string; type: RapMessageType; timestamp: number; agentId?: AgentId; conversationId?: ConversationId; payload: Record<string, any>; correlationId?: string; replyTo?: string; }
export interface AgentEvent { id: string; agentId: AgentId; type: 'started' | 'stopped' | 'paused' | 'resumed' | 'error' | 'task_started' | 'task_completed' | 'tool_call_started' | 'tool_call_completed' | 'model_loaded' | 'model_unloaded' | 'snapshot_created' | 'snapshot_restored'; timestamp: number; data: Record<string, any>; }
export interface InferenceRequest { modelId: ModelId; prompt: string; systemPrompt?: string; temperature?: number; topP?: number; maxTokens?: number; stream?: boolean; tools?: ToolId[]; contextWindow?: number; }
export interface InferenceResponse { modelId: ModelId; text: string; finishReason: 'stop' | 'length' | 'tool_calls' | 'error'; tokenCount: number; latencyMs: number; toolCalls?: ToolCall[]; }
export interface ToolCall { id: string; toolId: ToolId; name: string; arguments: Record<string, any>; result?: any; error?: string; latencyMs: number; }
export interface AgentSnapshot { id: string; agentId: AgentId; timestamp: number; state: AgentState; conversationHistory: RapMessage[]; toolCalls: ToolCall[]; metadata: Record<string, string>; }
export interface InfinityBridgeConfig { websocketUrl: string; reconnectIntervalMs: number; maxReconnectAttempts: number; heartbeatIntervalMs: number; requestTimeoutMs: number; enableHeartbeat: boolean; }
export interface BridgeEvent { type: 'connected' | 'disconnected' | 'reconnecting' | 'message' | 'error' | 'heartbeat'; timestamp: number; data?: any; error?: Error; }
