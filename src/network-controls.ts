export interface NetworkRule { id: string; type: 'allow' | 'deny'; cidr?: string; domain?: string; port?: number; protocol?: 'tcp' | 'udp' | 'both'; }
export interface NetworkRuleSet { defaultAction: 'allow' | 'deny'; rules: NetworkRule[]; }
export class NetworkControlManager {
  private rules: Map<string, NetworkRuleSet> = new Map();
  async setRuleSet(agentId: string, ruleSet: NetworkRuleSet): Promise<void> { this.rules.set(agentId, ruleSet); }
  async getRuleSet(agentId: string): Promise<NetworkRuleSet | null> { return this.rules.get(agentId) || null; }
  async checkConnection(agentId: string, host: string, port: number, protocol: 'tcp' | 'udp' = 'tcp'): Promise<boolean> { const ruleSet = this.rules.get(agentId); if (!ruleSet) return ruleSet ? ruleSet.defaultAction === 'allow' : true; for (const rule of ruleSet.rules) { if (rule.cidr && this.cidrMatch(host, rule.cidr)) return rule.type === 'allow'; if (rule.domain && (host === rule.domain || rule.domain === '*')) return rule.type === 'allow'; if (rule.port && rule.port === port) return rule.type === 'allow'; if (rule.protocol && rule.protocol !== 'both' && rule.protocol !== protocol) continue; } return ruleSet.defaultAction === 'allow'; }
  private cidrMatch(ip: string, cidr: string): boolean { const [ipStr, prefixStr] = cidr.split('/'); const prefix = parseInt(prefixStr, 10); const ipParts = ipStr.split('.').map(Number); const targetParts = ip.split('.').map(Number); let mask = 0xFFFFFFFF << (32 - prefix); mask &= 0xFFFFFFFF; let ipInt = 0; let targetInt = 0; for (let i = 0; i < 4; i++) { ipInt = (ipInt << 8) | ipParts[i]; targetInt = (targetInt << 8) | targetParts[i]; } return (ipInt & mask) === (targetInt & mask); }
  async generateWireGuardConfig(agentId: string, privateKey: string, peerPublicKey: string, peerEndpoint: string, allowedIPs: string[]): Promise<string> { return '[Interface]\\nPrivateKey = ' + privateKey + '\\nAddress = ' + allowedIPs.join(', ') + '\\n\\n[Peer]\\nPublicKey = ' + peerPublicKey + '\\nEndpoint = ' + peerEndpoint + '\\nAllowedIPs = ' + allowedIPs.join(', ') + '\\nPersistentKeepalive = 25\\n'; }
}
export const networkControlManager = new NetworkControlManager();
