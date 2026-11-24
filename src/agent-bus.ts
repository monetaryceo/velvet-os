import type { AgentEvent, RapMessage } from './infinity-types';
export interface BusSubscriber { id: string; topics: string[]; callback: (event: AgentEvent | RapMessage) => void; once: boolean; }
export interface PendingRequest { id: string; resolve: (value: any) => void; reject: (error: Error) => void; timeout: NodeJS.Timeout | null; }
export interface AgentBusConfig { maxHistory: number; requestTimeoutMs: number; maxSubscribers: number; }
export class AgentBus {
  private subscribers: Map<string, BusSubscriber[]> = new Map();
  private subscribersById: Map<string, BusSubscriber> = new Map();
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private messageHistory: Array<AgentEvent | RapMessage> = [];
  private config: AgentBusConfig;
  private subscriberCounter = 0; private requestCounter = 0;
  constructor(config: Partial<AgentBusConfig> = {}) {
    this.config = { maxHistory: config.maxHistory ?? 1000, requestTimeoutMs: config.requestTimeoutMs ?? 30000, maxSubscribers: config.maxSubscribers ?? 1000 };
  }
  subscribe(topics: string | string[], callback: (event: AgentEvent | RapMessage) => void, once = false): string {
    const topicList = Array.isArray(topics) ? topics : [topics];
    const id = 'sub_' + ++this.subscriberCounter + '_' + Date.now();
    const subscriber: BusSubscriber = { id, topics: topicList, callback, once };
    for (const topic of topicList) { if (!this.subscribers.has(topic)) this.subscribers.set(topic, []); this.subscribers.get(topic)!.push(subscriber); }
    this.subscribersById.set(id, subscriber);
    if (this.subscribersById.size > this.config.maxSubscribers) { const firstId = this.subscribersById.keys().next().value; if (firstId) this.unsubscribe(firstId); }
    return id;
  }
  unsubscribe(id: string): boolean {
    const subscriber = this.subscribersById.get(id); if (!subscriber) return false;
    for (const topic of subscriber.topics) { const topicSubs = this.subscribers.get(topic); if (topicSubs) { const idx = topicSubs.findIndex(s => s.id === id); if (idx >= 0) topicSubs.splice(idx, 1); if (topicSubs.length === 0) this.subscribers.delete(topic); } }
    this.subscribersById.delete(id); return true;
  }
  publish(event: AgentEvent | RapMessage): number { let delivered = 0; const topics = this.extractTopics(event); for (const topic of topics) { const subscribers = this.subscribers.get(topic); if (!subscribers) continue; const toRemove: string[] = []; for (const sub of subscribers) { try { sub.callback(event); delivered++; if (sub.once) toRemove.push(sub.id); } catch (err) { console.error('AgentBus subscriber ' + sub.id + ' error:', err); } } for (const id of toRemove) this.unsubscribe(id); } this.addToHistory(event); return delivered; }
  async request(message: RapMessage, timeoutMs?: number): Promise<any> { return new Promise((resolve, reject) => { const id = 'req_' + ++this.requestCounter + '_' + Date.now(); const timeout = timeoutMs ?? this.config.requestTimeoutMs; const timeoutHandle = setTimeout(() => { this.pendingRequests.delete(id); reject(new Error('Request ' + id + ' timed out after ' + timeout + 'ms')); }, timeout); this.pendingRequests.set(id, { id, resolve, reject, timeout: timeoutHandle }); const requestMsg: RapMessage = { ...message, id, correlationId: message.correlationId || id }; this.publish(requestMsg); }); }
  respond(correlationId: string, response: any): void { const responseMsg: RapMessage = { id: 'resp_' + Date.now(), type: 'message.receive', timestamp: Date.now(), correlationId, payload: response }; this.publish(responseMsg); }
  cancelRequest(id: string): boolean { const pending = this.pendingRequests.get(id); if (!pending) return false; if (pending.timeout) clearTimeout(pending.timeout); pending.reject(new Error('Request cancelled')); this.pendingRequests.delete(id); return true; }
  getHistory(limit?: number, type?: 'agent' | 'rap'): (AgentEvent | RapMessage)[] { let filtered = this.messageHistory; if (type) { filtered = filtered.filter(m => { if (type === 'agent') return 'type' in m && (m as AgentEvent).type !== undefined; return 'type' in m && (m as RapMessage).type !== undefined; }); } if (limit) return filtered.slice(-limit); return filtered; }
  clearHistory(): void { this.messageHistory = []; }
  getSubscriberCount(): number { return this.subscribersById.size; }
  getTopicCounts(): Record<string, number> { const counts: Record<string, number> = {}; for (const [topic, subs] of this.subscribers) { counts[topic] = subs.length; } return counts; }
  private extractTopics(event: AgentEvent | RapMessage): string[] { const topics: string[] = []; if ('type' in event && (event as AgentEvent).type !== undefined) { const agentEvent = event as AgentEvent; topics.push('agent.' + agentEvent.type); topics.push('agent.' + agentEvent.agentId + '.' + agentEvent.type); } if ('type' in event && (event as RapMessage).type !== undefined) { const rapEvent = event as RapMessage; topics.push('rap.' + rapEvent.type); if (rapEvent.agentId) topics.push('rap.' + rapEvent.agentId + '.' + rapEvent.type); } topics.push('*'); return topics; }
  private addToHistory(event: AgentEvent | RapMessage): void { this.messageHistory.push(event); if (this.messageHistory.length > this.config.maxHistory) { this.messageHistory = this.messageHistory.slice(-this.config.maxHistory); } }
}
export const agentBus = new AgentBus();
