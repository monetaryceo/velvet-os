// ============================================================================
// Velvet OS - Complete Integrated Version
// Built on Astryx Design System + A2UI + Exact + Infinity + Elephant Goldfish
// Integrated: ARTEX, Dolphy, Nethunter, Flipper Zero, Sapper v2
// Integrated: Claude Code, Codex, Grok, DeepSeek, Hermes, Opus, Kimi, Muse, Fable
// ============================================================================

import {
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  TextInput,
  Card,
  Badge,
  ProgressBar,
  Tooltip,
  Icon,
  IconButton,
  Divider,
  Switch,
} from '@astryxdesign/core';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { TabList, Tab } from '@astryxdesign/core/TabList';
import { Selector } from '@astryxdesign/core/Selector';
import { Slider } from '@astryxdesign/core/Slider';
import { Avatar } from '@astryxdesign/core/Avatar';
import '@astryxdesign/theme-neutral';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ============================================
// Type Definitions
// ============================================
type TabId = 'dashboard' | 'terminal' | 'agents' | 'models' | 'tools' | 'memory' | 'settings' | 'security' | 'a2ui' | 'exact' | 'elephant' | 'artex' | 'nethunter' | 'dolphy' | 'flipper' | 'sapper' | 'competitor-models' | 'native-build' | 'rea' | 'context7';
type AgentStatus = 'running' | 'idle' | 'complete' | 'waiting';
type ModelStatus = 'loaded' | 'training' | 'queued';
type ToolStatus = 'active' | 'training' | 'idle';
type A2UIStatus = 'streaming' | 'idle' | 'connected';
type ExactStatus = 'web' | 'ios' | 'macos' | 'android' | 'linux' | 'windows';
type EGMStage = 'brainstorm' | 'draft' | 'review' | 'resolve' | 'bootstrap' | 'drift';

// ============================================
// Helper Components using EXACT Astryx APIs
// ============================================

function SimpleCard({ children, variant = 'default', width, height }: React.ComponentProps<typeof Card>) {
  return <Card variant={variant} width={width} height={height}>{children}</Card>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Heading level={3}>{children}</Heading>;
}

function ToolButton({ label, variant = 'secondary', icon, onClick }: { label: string; variant?: 'primary' | 'secondary' | 'ghost'; icon?: React.ReactNode; onClick: () => void }) {
  return <Button label={label} variant={variant} icon={icon} onClick={onClick} />;
}

function InfoRow({ label, value, color = 'accent' }: { label: string; value: string | number; color?: 'accent' | 'success' | 'warning' | 'neutral' }) {
  return (
    <HStack gap={3} vAlign="center">
      <Text type="label" color="secondary">{label}</Text>
      <ProgressBar label={label} value={Number(value)} max={100} variant={color} />
      <Text type="supporting" color="secondary">{value}%</Text>
    </HStack>
  );
}

function BadgeStatus({ status }: { status: string }) {
  const variant = status === 'running' || status === 'loaded' || status === 'active' ? 'success' :
                  status === 'waiting' || status === 'training' ? 'warning' : 'neutral';
  return <Badge label={status.charAt(0).toUpperCase() + status.slice(1)} variant={variant} />;
}

function StatCard({ label, value, trend, trendPositive, icon }: { label: string; value: string; trend: string; trendPositive: boolean; icon: string }) {
  return (
    <Card variant="default" width={280}>
      <HStack gap={3} hAlign="between" vAlign="start">
        <VStack gap={1}>
          <Text type="label" color="secondary">{label}</Text>
          <Text type="display-1" weight="bold">{value}</Text>
          <HStack gap={1} vAlign="center">
            <Icon icon={(trendPositive ? 'chevronUp' : 'chevronDown') as any} size="sm" color={trendPositive ? 'accent' : 'secondary'} />
            <Text type="label" weight="medium" color={trendPositive ? 'accent' : 'secondary'}>{trend}</Text>
          </HStack>
        </VStack>
        <HStack hAlign="center" vAlign="center" width={48} height={48}>
          <Icon icon={icon as any} size="lg" color="accent" />
        </HStack>
      </HStack>
    </Card>
  );
}

// ============================================
// A2UI Agent Streaming Surface (A2UI Protocol Integration)
// ============================================
function A2uiAgentStream() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent' | 'system'; content: string; timestamp: string }>>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [a2uiStatus, setA2UIStatus] = useState<A2UIStatus>('idle');
  const [catalogId, setCatalogId] = useState<string>('basic-catalog-v1');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() }]);
    setInput('');
    setIsStreaming(true);
    setA2UIStatus('streaming');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'agent', content: `Agent response via A2UI streaming protocol (catalog: ${catalogId})`, timestamp: new Date().toLocaleTimeString() }]);
      setIsStreaming(false);
      setA2UIStatus('connected');
    }, 1500);
  };

  return (
    <Card variant="default">
      <SectionTitle>A2UI Agent Stream</SectionTitle>
      <VStack gap={3}>
        <HStack gap={3} hAlign="between" vAlign="center">
          <VStack gap={0.5} hAlign="start">
            <Text weight="medium">A2UI Protocol</Text>
            <Text type="supporting" color="secondary">Generative UI streaming at low latency</Text>
          </VStack>
          <Badge label={a2uiStatus} variant={a2uiStatus === 'streaming' ? 'warning' : 'success'} />
        </HStack>
        <VStack gap={1} style={{ maxHeight: '300px', overflowY: 'auto', padding: '12px', background: 'var(--velvet-bg-secondary)', borderRadius: '8px' }}>
          {messages.map((msg, i) => (
            <HStack key={i} gap={2} hAlign={msg.role === 'user' ? 'end' : 'start'}>
              <VStack gap={0.5} hAlign={msg.role === 'user' ? 'end' : 'start'}>
                <Text weight="medium" color={msg.role === 'user' ? 'accent' : 'secondary'}>
                  {msg.content}
                </Text>
                <Text type="supporting" color="secondary" style={{ fontSize: '10px', marginTop: '2px' }}>
                  {msg.role === 'user' ? 'You' : 'Agent'} • {msg.timestamp}
                </Text>
              </VStack>
            </HStack>
          ))}
          {isStreaming && (
            <HStack gap={2} hAlign="start">
              <VStack gap={0.5}>
                <Text color="secondary">Agent is streaming UI via A2UI protocol...</Text>
                <ProgressBar label="Streaming" value={50} max={100} variant="accent" />
              </VStack>
            </HStack>
          )}
        </VStack>
        <HStack gap={2}>
          <TextInput
            label="Message"
            value={input}
            onChange={(v: string) => setInput(v)}
            placeholder="Type a message to the agent..."
            width="100%"
            onEnter={handleSend}
          />
          <Button variant="primary" onClick={handleSend} label="Send" isDisabled={!input.trim() || isStreaming} />
        </HStack>
        <Divider />
        <HStack gap={3} vAlign="center">
          <Text type="supporting" color="secondary">Catalog ID</Text>
          <Selector
            label="Catalog"
            value={catalogId}
            onChange={(v: string | null) => setCatalogId(v || 'basic-catalog-v1')}
            width={250}
            options={[
              { value: 'basic-catalog-v1', label: 'Basic Catalog v1' },
              { value: 'mcp-catalog-v1', label: 'MCP Catalog v1' },
              { value: 'vegachart-catalog-v1', label: 'VegaChart Catalog' },
            ]}
            hasClear
          />
        </HStack>
      </VStack>
    </Card>
  );
}

// ============================================
// Exact Native Capabilities (Exact Framework Integration)
// ============================================
function ExactNativePanel() {
  const [exactStatus, setExactStatus] = useState<ExactStatus>('web');
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'unknown'>('unknown');
  const [geoPermission, setGeoPermission] = useState<'granted' | 'denied' | 'unknown'>('unknown');
  const [location, setLocation] = useState<{ lat: number; lon: number; accuracy: number } | null>(null);
  const [speechText, setSpeechText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const checkPermissions = useCallback(async () => {
    setCameraPermission('granted');
    setGeoPermission('granted');
  }, []);

  const getLocation = useCallback(async () => {
    setLocation({ lat: 37.7749, lon: -122.4194, accuracy: 10 });
  }, []);

  const startListening = useCallback(async () => {
    setIsListening(true);
    setSpeechText('Voice input captured via Exact API');
    setTimeout(() => setIsListening(false), 2000);
  }, []);

  const speak = useCallback(async (text: string) => {
    console.log('Speaking:', text);
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return (
    <Card variant="default">
      <SectionTitle>Exact Native Capabilities</SectionTitle>
      <VStack gap={3}>
        <HStack gap={3} hAlign="between" vAlign="center">
          <VStack gap={0.5} hAlign="start">
            <Text weight="medium">Exact Framework</Text>
            <Text type="supporting" color="secondary">All-platform native app framework</Text>
          </VStack>
          <Badge label={exactStatus} variant="success" />
        </HStack>
        <HStack gap={3} wrap="wrap">
          <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Web" onClick={() => setExactStatus('web')} />
          <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="iOS" onClick={() => setExactStatus('ios')} />
          <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="macOS" onClick={() => setExactStatus('macos')} />
          <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Android" onClick={() => setExactStatus('android')} />
          <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Linux" onClick={() => setExactStatus('linux')} />
          <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Windows" onClick={() => setExactStatus('windows')} />
        </HStack>
        <HStack gap={3} hAlign="between" vAlign="center">
          <VStack gap={0.5} hAlign="start">
            <Text weight="medium">Camera</Text>
            <Text type="supporting" color="secondary">Native camera access via Exact API</Text>
          </VStack>
          <Badge label={cameraPermission === 'granted' ? 'Granted' : cameraPermission === 'denied' ? 'Denied' : 'Unknown'} variant={cameraPermission === 'granted' ? 'success' : cameraPermission === 'denied' ? 'error' : 'neutral'} />
        </HStack>
        <HStack gap={3} hAlign="between" vAlign="center">
          <VStack gap={0.5} hAlign="start">
            <Text weight="medium">Geolocation</Text>
            <Text type="supporting" color="secondary">GPS location access</Text>
          </VStack>
          <Badge label={geoPermission === 'granted' ? 'Granted' : geoPermission === 'denied' ? 'Denied' : 'Unknown'} variant={geoPermission === 'granted' ? 'success' : geoPermission === 'denied' ? 'error' : 'neutral'} />
        </HStack>
        {location && (
          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Location</Text>
              <Text type="supporting" color="secondary">{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</Text>
            </VStack>
            <Badge label={`${location.accuracy.toFixed(0)}m`} variant="neutral" />
          </HStack>
        )}
        <HStack gap={2}>
          <Button variant="secondary" size="sm" icon={<Icon icon="check" size="sm" />} label="Get Location" onClick={getLocation} isDisabled={geoPermission !== 'granted'} />
          <Button variant={isListening ? 'destructive' : 'secondary'} size="sm" icon={<Icon icon="check" size="sm" />} label={isListening ? 'Listening...' : 'Voice Input'} onClick={startListening} isDisabled={isListening} />
          <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Speak" onClick={() => speak(speechText || 'Hello from Velvet OS')} isDisabled={!speechText} />
        </HStack>
        {speechText && (
          <Text type="supporting" color="secondary" style={{ fontStyle: 'italic' }}>
            "{speechText}"
          </Text>
        )}
      </VStack>
    </Card>
  );
}

// ============================================
// Elephant Goldfish Skill Manager (EGM Integration)
// ============================================
function ElephantGoldfishPanel() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [skillResult, setSkillResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [egmStage, setEGMStage] = useState<EGMStage>('brainstorm');

  const skills = [
    { id: 'bootstrap', name: 'Bootstrap', category: 'system', description: 'Create or update documentation for existing codebase' },
    { id: 'brainstorm', name: 'Brainstorm', category: 'creative', description: 'Test an idea and write a concept brief' },
    { id: 'draft', name: 'Draft', category: 'writing', description: 'Turn a brief into a design document' },
    { id: 'resolve', name: 'Resolve', category: 'problem-solving', description: 'Work through review findings and agree on changes' },
    { id: 'review', name: 'Review', category: 'analysis', description: 'Review a design with fresh agents across five stages' },
    { id: 'review-loop', name: 'Review Loop', category: 'analysis', description: 'Run a configured group of reviewers' },
    { id: 'drift-report', name: 'Drift Report', category: 'analysis', description: 'Compare checked-in documents with current source code' },
  ];

  const runSkill = useCallback(async (skillId: string) => {
    setIsExecuting(true);
    try {
      const result = { skill: skillId, stage: egmStage, result: 'executed successfully', timestamp: new Date().toISOString() };
      setSkillResult(result);
    } catch (err: any) {
      setSkillResult({ error: err.message });
    }
    setIsExecuting(false);
  }, [egmStage]);

  return (
    <Card variant="default">
      <SectionTitle>Elephant Goldfish Skills</SectionTitle>
      <VStack gap={3}>
        <HStack gap={3} hAlign="between" vAlign="center">
          <VStack gap={0.5} hAlign="start">
            <Text weight="medium">EGM Workflow</Text>
            <Text type="supporting" color="secondary">Elephant drafts, Goldfish reviews, You approve</Text>
          </VStack>
          <Badge label={egmStage} variant="neutral" />
        </HStack>
        <SectionTitle>Available Skills</SectionTitle>
        <HStack gap={1} wrap="wrap">
          {skills.map(skill => (
            <Badge key={skill.id} variant="neutral" label={skill.name} />
          ))}
        </HStack>
        <SectionTitle>Skill Execution</SectionTitle>
        <Selector
          label="Select Skill"
          value={selectedSkill || ''}
          onChange={(v: string | null) => setSelectedSkill(v)}
          width={250}
          options={skills.map(s => ({ value: s.id, label: s.name }))}
          hasClear
        />
        <HStack gap={2}>
          <Button variant="primary" onClick={() => selectedSkill && runSkill(selectedSkill)} label="Run Skill" isDisabled={isExecuting || !selectedSkill} />
          <Button variant="secondary" onClick={() => {
            const stages: EGMStage[] = ['brainstorm', 'draft', 'review', 'resolve', 'bootstrap', 'drift'];
            const next = stages[(stages.indexOf(egmStage) + 1) % stages.length];
            setEGMStage(next);
          }} label="Next Stage" isDisabled={isExecuting} />
        </HStack>
        {skillResult && (
          <SimpleCard variant="muted">
            <SectionTitle>Result</SectionTitle>
            <Text type="code" color="secondary">{JSON.stringify(skillResult, null, 2)}</Text>
          </SimpleCard>
        )}
        {isExecuting && (
          <ProgressBar label="Executing" value={50} max={100} variant="warning" />
        )}
      </VStack>
    </Card>
  );
}

// ============================================
// Security Tools Panel (ARTEX, Nethunter, Dolphy, Flipper Zero, Sapper v2)
// ============================================
function SecurityToolsPanel() {
  const [tools] = useState([
    { id: 'artex', name: 'ARTEX', category: 'Penetration Testing', status: 'active' as ToolStatus, version: '2.4.1', modules: 142, description: 'AI autonomous penetration testing system with dual-graph architecture', capabilities: ['reconnaissance', 'vulnerability-scanning', 'exploitation', 'post-exploitation', 'reporting'], config: { targetScope: '192.168.1.0/24', aggressiveness: 'medium', stealth: true, reporting: 'detailed' } },
    { id: 'nethunter', name: 'Kali Nethunter', category: 'Mobile Kali', status: 'active' as ToolStatus, version: '2024.4', modules: 67, description: 'Full Kali Linux toolset on Android with touch-friendly interface', capabilities: ['mobile-pentest', 'wifi-testing', 'bluetooth', 'nfc', 'usb-otg'], config: { deviceMode: 'tablet', autoUpdate: true, vncEnabled: false, chrootPath: '/data/local/nh' } },
    { id: 'dolphy', name: 'Dolphy', category: 'AI Framework', status: 'training' as ToolStatus, version: '1.8.0', modules: 89, description: 'AI model framework with uncensored model support', capabilities: ['model-training', 'weight-generation', 'local-inference', 'multi-model'], config: { defaultModel: 'Needle3', trainingEpochs: 100, batchSize: 32, precision: 'bf16' } },
    { id: 'flipper-zero', name: 'Flipper Zero', category: 'Hardware Hacking', status: 'active' as ToolStatus, version: '1.4.0', modules: 34, description: 'Handheld multi-tool for RFID, NFC, IR, GPIO, sub-GHz, Bluetooth, BadUSB', capabilities: ['rfid-read-write', 'nfc-emulate', 'ir-transmit', 'gpio-control', 'sub-ghz', 'bluetooth', 'badusb'], config: { frequency: '433MHz', protocol: 'FAP', btEnabled: true } },
    { id: 'sapper-v2', name: 'Sapper v2', category: 'Agent Orchestration', status: 'active' as ToolStatus, version: '2.0.0', modules: 23, description: 'AI agent framework with multi-agent coordination', capabilities: ['agent-coordination', 'tool-use', 'function-calling', 'model-agnostic'], config: { maxAgents: 10, coordinationMode: 'parallel', modelProvider: 'auto' } },
  ]);

  const [selectedTool, setSelectedTool] = useState<typeof tools[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleToolClick = (tool: typeof tools[0]) => {
    setSelectedTool(tool);
    setDialogOpen(true);
  };

  return (
    <VStack gap={4} padding={4}>
      <HStack gap={3} hAlign="between">
        <HStack gap={3} vAlign="center">
          <Heading level={2}>Security Tools</Heading>
          <Badge label={`${tools.length} tools integrated`} variant="neutral" />
        </HStack>
        <ToolButton label="New Tool" variant="primary" icon={<Icon icon="check" size="sm" />} onClick={() => alert('Add new security tool')} />
      </HStack>

      <VStack gap={4}>
        {tools.map(tool => (
          <SimpleCard key={tool.id} variant="default" onClick={() => handleToolClick(tool)} style={{ cursor: 'pointer' }}>
            <HStack gap={3} hAlign="between" vAlign="start">
              <HStack gap={3} vAlign="center">
                <HStack hAlign="center" vAlign="center" width={48} height={48}>
                  <Text weight="bold" color="accent" type="display-1">{tool.name.charAt(0)}</Text>
                </HStack>
                <VStack gap={0.5} hAlign="start">
                  <Text weight="semibold">{tool.name}</Text>
                  <Text type="supporting" color="secondary">{tool.category}</Text>
                </VStack>
              </HStack>
              <Badge label={tool.status.charAt(0).toUpperCase() + tool.status.slice(1)} variant={tool.status === 'active' ? 'success' : tool.status === 'training' ? 'warning' : 'neutral'} />
            </HStack>
            <VStack gap={3}>
              <Text type="supporting" color="secondary" style={{ lineHeight: 1.5 }}>{tool.description}</Text>
              <HStack gap={2} hAlign="between">
                <HStack gap={1}>
                  {tool.capabilities.map((cap, i) => (
                    <Badge key={i} variant="neutral" label={cap} />
                  ))}
                </HStack>
                <Text type="supporting" color="secondary">v{tool.version}</Text>
              </HStack>
              <Divider />
              <HStack gap={2} hAlign="between">
                <HStack gap={2} vAlign="center">
                  <Icon icon="check" size="sm" color="secondary" />
                  <Text type="supporting" color="secondary">{tool.modules} modules</Text>
                </HStack>
                <HStack gap={1}>
                  <Tooltip content="Configure">
                    <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Configure" />
                  </Tooltip>
                  <Tooltip content="View Logs">
                    <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="View Logs" />
                  </Tooltip>
                  <Tooltip content={tool.status === 'active' ? 'Disable' : 'Enable'}>
                    <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label={tool.status === 'active' ? 'Disable' : 'Enable'} />
                  </Tooltip>
                </HStack>
              </HStack>
            </VStack>
          </SimpleCard>
        ))}
      </VStack>

      {dialogOpen && selectedTool && (
        <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen} width={800} maxHeight="85dvh" padding={4}>
          <DialogHeader title={selectedTool.name} subtitle={selectedTool.category} />
          <VStack gap={4}>
            <SimpleCard variant="muted">
              <SectionTitle>Description</SectionTitle>
              <Text style={{ lineHeight: 1.6 }}>{selectedTool.description}</Text>
            </SimpleCard>

            <HStack gap={4}>
              <SimpleCard variant="muted" width={300}>
                <SectionTitle>Capabilities</SectionTitle>
                <HStack gap={1}>
                  {selectedTool.capabilities.map((cap, i) => (
                    <Badge key={i} variant="neutral" label={cap} />
                  ))}
                </HStack>
              </SimpleCard>
              <SimpleCard variant="muted" width={300}>
                <SectionTitle>Module Stats</SectionTitle>
                <HStack gap={3} hAlign="between">
                  <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Total Modules</Text><Text weight="medium">{selectedTool.modules}</Text></VStack>
                  <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Version</Text><Text weight="medium">{selectedTool.version}</Text></VStack>
                  <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Status</Text><Text weight="medium">{selectedTool.status}</Text></VStack>
                </HStack>
              </SimpleCard>
            </HStack>

            <SimpleCard variant="muted">
              <SectionTitle>Configuration</SectionTitle>
              <VStack gap={3}>
                {Object.entries(selectedTool.config).map(([key, value]) => (
                  <HStack key={key} gap={2} hAlign="between" vAlign="center">
                    <Text weight="medium">{key}</Text>
                    <Text type="code" color="secondary" style={{ fontFamily: 'monospace' }}>{String(value)}</Text>
                  </HStack>
                ))}
              </VStack>
            </SimpleCard>

            <SimpleCard variant="muted">
              <SectionTitle>Integration Health</SectionTitle>
              <HStack gap={3}>
                <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">API Latency</Text><Text weight="medium" color="secondary">12ms</Text></VStack>
                <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Success Rate</Text><Text weight="medium" color="secondary">99.2%</Text></VStack>
                <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Last Sync</Text><Text weight="medium" color="secondary">2 min ago</Text></VStack>
              </HStack>
            </SimpleCard>
          </VStack>
          <HStack gap={2} hAlign="end">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} label="Close" />
            <Button variant={selectedTool.status === 'active' ? 'destructive' : 'primary'} icon={<Icon icon="check" size="sm" />} label={selectedTool.status === 'active' ? 'Disable' : 'Enable'} onClick={() => {}} />
          </HStack>
        </Dialog>
      )}
    </VStack>
  );
}

// ============================================
// Competitor Integration Panel (Claude Code, Codex, Grok, DeepSeek, Hermes, Opus, Kimi, Muse, Fable)
// ============================================
export function CompetitorPanel() {
  const [models] = useState([
    { id: 'claude-code', name: 'Claude Code', provider: 'Anthropic', type: 'Agentic Coding', status: 'loaded' as ModelStatus, params: 'Large', capabilities: ['terminal', 'git', 'file-ops', 'multi-file-edit', 'testing'], lastUsed: '2 min ago' },
    { id: 'codex', name: 'Codex CLI', provider: 'OpenAI', type: 'Coding Agent', status: 'loaded' as ModelStatus, params: 'Large', capabilities: ['code-gen', 'completion', 'explanation', 'ide-integration'], lastUsed: '5 min ago' },
    { id: 'grok', name: 'Grok', provider: 'xAI', type: 'Multi-Agent Reasoning', status: 'loaded' as ModelStatus, params: 'Large', capabilities: ['multi-agent', 'web-search', 'x-search', 'image-gen', 'video-gen', 'voice', 'code'], lastUsed: '10 min ago' },
    { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', type: 'Reasoning', status: 'loaded' as ModelStatus, params: '671B MoE', capabilities: ['chain-of-thought', 'reasoning', 'math', 'code'], lastUsed: '15 min ago' },
    { id: 'hermes-3', name: 'Hermes 3', provider: 'Nous Research', type: 'Open-Weight', status: 'loaded' as ModelStatus, params: '405B', capabilities: ['function-calling', 'json-mode', 'roleplaying', 'conversational'], lastUsed: '20 min ago' },
    { id: 'opus', name: 'Claude Opus', provider: 'Anthropic', type: 'Complex Reasoning', status: 'queued' as ModelStatus, params: 'Large', capabilities: ['complex-reasoning', 'advanced-coding', 'deep-analysis', 'multimodal'], lastUsed: 'Never' },
    { id: 'kimi', name: 'Kimi 1.5', provider: 'Moonshot AI', type: 'Long Context', status: 'training' as ModelStatus, params: 'Large', capabilities: ['long-context', 'multimodal', 'document-processing', 'web-search'], lastUsed: '30 min ago' },
    { id: 'muse', name: 'Muse', provider: 'Microsoft Research', type: 'Game Generation', status: 'idle' as ModelStatus, params: 'Large', capabilities: ['gameplay-video', 'controller-prediction', 'game-state'], lastUsed: '1 hour ago' },
    { id: 'fable', name: 'Fable', provider: 'Fable Simulation', type: 'World Simulation', status: 'idle' as ModelStatus, params: 'Large', capabilities: ['character-simulation', 'narrative-modeling', 'showrunner-ai'], lastUsed: '2 hours ago' },
  ]);

  const [selectedModel, setSelectedModel] = useState<typeof models[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleModelClick = (model: typeof models[0]) => {
    setSelectedModel(model);
    setDialogOpen(true);
  };

  return (
    <VStack gap={4} padding={4}>
      <HStack gap={3} hAlign="between">
        <HStack gap={3} vAlign="center">
          <Heading level={2}>Competitor Integration</Heading>
          <Badge label={`${models.length} models integrated`} variant="neutral" />
        </HStack>
      </HStack>

      <VStack gap={4}>
        {models.map(model => (
          <SimpleCard key={model.id} variant="default" onClick={() => handleModelClick(model)} style={{ cursor: 'pointer' }}>
            <HStack gap={3} hAlign="between" vAlign="center">
              <HStack gap={3} vAlign="center">
                <HStack hAlign="center" vAlign="center" width={40} height={40}>
                  <Text weight="bold" color="accent" type="display-1">{model.name.charAt(0)}</Text>
                </HStack>
                <VStack gap={0.5} hAlign="start">
                  <Text weight="medium">{model.name}</Text>
                  <Text type="supporting" color="secondary">{model.provider} • {model.type}</Text>
                </VStack>
              </HStack>
              <HStack gap={3} vAlign="center">
                <Text weight="medium">{model.params}</Text>
                <Text type="supporting" color="secondary">{model.status}</Text>
                <Text type="supporting" color="secondary">{model.lastUsed}</Text>
              </HStack>
              <HStack gap={1}>
                <Tooltip content="Load/Unload">
                  <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label={model.status === 'loaded' ? 'Unload' : 'Load'} />
                </Tooltip>
              </HStack>
            </HStack>
          </SimpleCard>
        ))}
      </VStack>

      {dialogOpen && selectedModel && (
        <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen} width={700} maxHeight="80dvh" padding={4}>
          <DialogHeader title={selectedModel.name} subtitle={selectedModel.type} />
          <VStack gap={4}>
            <SimpleCard variant="muted">
              <SectionTitle>Provider Information</SectionTitle>
              <VStack gap={2}>
                <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Provider</Text><Text weight="medium">{selectedModel.provider}</Text></HStack>
                <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Type</Text><Text weight="medium">{selectedModel.type}</Text></HStack>
                <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Parameters</Text><Text weight="medium">{selectedModel.params}</Text></HStack>
                <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Last Used</Text><Text weight="medium" style={{ fontFamily: 'monospace' }}>{selectedModel.lastUsed}</Text></HStack>
              </VStack>
            </SimpleCard>

            <SimpleCard variant="muted">
              <SectionTitle>Capabilities</SectionTitle>
              <HStack gap={1}>
                {selectedModel.capabilities.map((cap, i) => (
                  <Badge key={i} variant="neutral" label={cap} />
                ))}
              </HStack>
            </SimpleCard>

            <SimpleCard variant="muted">
              <SectionTitle>Integration Status</SectionTitle>
              {selectedModel.status === 'loaded' ? (
                <Text color="secondary">Model is loaded and ready for inference.</Text>
              ) : selectedModel.status === 'training' ? (
                <Text color="secondary">Model is training. Will be available when complete.</Text>
              ) : (
                <Text color="secondary">Model is queued for loading.</Text>
              )}
            </SimpleCard>
          </VStack>
          <HStack gap={2} hAlign="end">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} label="Close" />
            <Button variant={selectedModel.status === 'loaded' ? 'destructive' : 'primary'} icon={<Icon icon="check" size="sm" />} label={selectedModel.status === 'loaded' ? 'Unload' : 'Load'} onClick={() => {}} />
          </HStack>
        </Dialog>
      )}
    </VStack>
  );
}

// ============================================
// VelvetDashboard Component
// ============================================
export function VelvetDashboard() {
  const [systemHealth] = useState({
    cpu: 45,
    memory: 62,
    gpu: 78,
    disk: 34,
    network: 12,
  });

  const stats = [
    { label: 'Active Agents', value: '12', trend: '+3', trendPositive: true, icon: 'check' },
    { label: 'Models Loaded', value: '9', trend: '+1', trendPositive: true, icon: 'check' },
    { label: 'Tools Integrated', value: '31', trend: '+5', trendPositive: true, icon: 'wrench' },
    { label: 'Memory Entries', value: '1.2K', trend: '+234', trendPositive: true, icon: 'check' },
    { label: 'Tasks Completed', value: '847', trend: '+89', trendPositive: true, icon: 'check' },
    { label: 'Success Rate', value: '94.2%', trend: '+2.1%', trendPositive: true, icon: 'success' },
  ];

  const recentActivity = [
    { id: 1, type: 'agent', message: 'Agent "PenTest-01" completed reconnaissance', time: '2 min ago', status: 'success' },
    { id: 2, type: 'model', message: 'Needle3 model weights updated with RSI improvements', time: '15 min ago', status: 'info' },
    { id: 3, type: 'tool', message: 'ARTEX integration: new exploit module loaded', time: '1 hour ago', status: 'success' },
    { id: 4, type: 'memory', message: 'Vector memory synced: 234 new embeddings', time: '2 hours ago', status: 'info' },
    { id: 5, type: 'agent', message: 'Agent "RedTeam-03" started privilege escalation', time: '3 hours ago', status: 'running' },
    { id: 6, type: 'tool', message: 'Nethunter module deployed to mobile target', time: '4 hours ago', status: 'success' },
  ];

  const tools = [
    { name: 'ARTEX', status: 'active' as ToolStatus, version: '2.4.1', modules: 142 },
    { name: 'Dolphy', status: 'active' as ToolStatus, version: '1.8.0', modules: 89 },
    { name: 'Nethunter', status: 'active' as ToolStatus, version: '2024.4', modules: 67 },
    { name: 'Needle', status: 'training' as ToolStatus, version: '3.2.0', modules: 45 },
    { name: 'Jarvis', status: 'active' as ToolStatus, version: '1.0.0', modules: 23 },
    { name: 'Flipper Zero', status: 'active' as ToolStatus, version: '1.4.0', modules: 34 },
    { name: 'Sapper v2', status: 'active' as ToolStatus, version: '2.0.0', modules: 23 },
  ];

  const models = [
    { name: 'Needle3', type: 'Primary', status: 'loaded' as ModelStatus, params: '7B', quantization: '4-bit' },
    { name: 'Claude Code', type: 'Agentic', status: 'loaded' as ModelStatus, params: 'Large', quantization: '4-bit' },
    { name: 'Codex CLI', type: 'Coding', status: 'loaded' as ModelStatus, params: 'Large', quantization: '4-bit' },
    { name: 'Grok', type: 'Reasoning', status: 'loaded' as ModelStatus, params: 'Large', quantization: '4-bit' },
    { name: 'DeepSeek R1', type: 'Reasoning', status: 'loaded' as ModelStatus, params: '671B MoE', quantization: '4-bit' },
    { name: 'Hermes 3', type: 'Open-Weight', status: 'loaded' as ModelStatus, params: '405B', quantization: '4-bit' },
    { name: 'Opus', type: 'Complex', status: 'queued' as ModelStatus, params: 'Large', quantization: '4-bit' },
  ];

  return (
    <VStack gap={4} padding={4}>
      <SectionTitle>System Overview</SectionTitle>
      <HStack gap={3}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </HStack>

      <HStack gap={4}>
        <SimpleCard width={400}>
          <HStack gap={3} hAlign="between" vAlign="center">
            <SectionTitle>System Health</SectionTitle>
            <Badge label="Optimal" variant="success" />
          </HStack>
          <VStack gap={3}>
            {Object.entries(systemHealth).map(([key, value]) => (
              <InfoRow key={key} label={key.toUpperCase()} value={value} color={value > 80 ? 'neutral' : value > 60 ? 'warning' : 'accent'} />
            ))}
          </VStack>
        </SimpleCard>

        <SimpleCard width={400}>
          <SectionTitle>Quick Actions</SectionTitle>
          <HStack gap={2}>
            <ToolButton label="Launch Agent" variant="primary" icon={<Icon icon="check" size="sm" />} onClick={() => alert('Launching new agent...')} />
            <ToolButton label="Load Model" icon={<Icon icon="upload" size="sm" />} onClick={() => alert('Loading model...')} />
            <ToolButton label="Run Scan" icon={<Icon icon="search" size="sm" />} onClick={() => alert('Running scan...')} />
            <ToolButton label="Sync Memory" variant="ghost" icon={<Icon icon="chevronDown" size="sm" />} onClick={() => alert('Syncing memory...')} />
          </HStack>
        </SimpleCard>

        <SimpleCard>
          <SectionTitle>Recent Activity</SectionTitle>
          <VStack gap={2}>
            {recentActivity.map((activity) => (
              <HStack key={activity.id} gap={3} vAlign="start">
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  marginTop: 6,
                  background: activity.status === 'success' ? 'var(--velvet-success)' :
                            activity.status === 'running' ? 'var(--velvet-warning)' : 'var(--velvet-info)'
                }} />
                <VStack gap={1}>
                  <HStack gap={2} vAlign="center">
                    <Text weight="medium">{activity.message}</Text>
                    <Badge label={activity.type} variant={activity.status === 'success' ? 'success' : activity.status === 'running' ? 'warning' : 'info'} />
                  </HStack>
                  <Text type="supporting" color="secondary">{activity.time}</Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </SimpleCard>

        <SimpleCard>
          <SectionTitle>Integrated Tools</SectionTitle>
          <VStack gap={2}>
            {tools.map((tool) => (
              <HStack key={tool.name} gap={3} hAlign="between" vAlign="center">
                <HStack gap={3} vAlign="center">
                  <HStack hAlign="center" vAlign="center" width={40} height={40}>
                    <Text weight="bold" color="accent" style={{ fontSize: '1.25rem' }}>{tool.name.charAt(0)}</Text>
                  </HStack>
                  <VStack gap={0.5}>
                    <Text weight="medium">{tool.name}</Text>
                    <Text type="supporting" color="secondary">v{tool.version} • {tool.modules} modules</Text>
                  </VStack>
                </HStack>
                <BadgeStatus status={tool.status} />
              </HStack>
            ))}
          </VStack>
        </SimpleCard>

        <SimpleCard>
          <SectionTitle>Model Status</SectionTitle>
          <VStack gap={2}>
            {models.map((model) => (
              <HStack key={model.name} gap={3} hAlign="between" vAlign="center">
                <HStack gap={3} vAlign="center">
                  <HStack hAlign="center" vAlign="center" width={40} height={40}>
                    <Icon icon="check" size="lg" color={model.status === 'loaded' ? 'success' : (model.status === 'training' ? 'warning' : 'secondary')} />
                  </HStack>
                  <VStack gap={0.5}>
                    <Text weight="medium">{model.name}</Text>
                    <Text type="supporting" color="secondary">{model.type} • {model.params} • {model.quantization}</Text>
                  </VStack>
                </HStack>
                <BadgeStatus status={model.status} />
              </HStack>
            ))}
          </VStack>
        </SimpleCard>
      </HStack>
    </VStack>
  );
}

// ============================================
// VelvetTerminal Component
// ============================================
export function VelvetTerminal() {
  const [history, setHistory] = useState<Array<{type: string, content: string, timestamp: number}>>([
    { type: 'system', content: 'Velvet OS Terminal v1.0.0', timestamp: Date.now() },
    { type: 'system', content: 'Type "help" for available commands', timestamp: Date.now() },
    { type: 'prompt', content: 'velvet@brain:~$', timestamp: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' });
    inputRef.current?.focus();
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    const newHistory = [...history, { type: 'input', content: `velvet@brain:~$ ${trimmed}`, timestamp: Date.now() }];
    
    let response = '';
    const lowerCmd = trimmed.toLowerCase();
    
    if (lowerCmd === 'help') {
      response = `Available commands:
  help              - Show this help
  clear             - Clear terminal
  agents            - List active agents
  models            - List loaded models
  tools             - List integrated tools
  memory            - Show memory stats
  scan <target>     - Run security scan
  train <model>     - Start model training
  deploy <target>   - Deploy to target
  status            - System status
  exit              - Close terminal
  a2ui              - A2UI agent stream
  exact             - Exact native capabilities
  elephant          - Elephant Goldfish skills
  security          - Security tools panel`;
    } else if (lowerCmd === 'clear') {
      setHistory([{ type: 'prompt', content: 'velvet@brain:~$', timestamp: Date.now() }]);
      return;
    } else if (lowerCmd === 'agents') {
      response = `Active Agents:
  1. PenTest-01     [RUNNING]  Recon: 192.168.1.0/24
  2. RedTeam-03     [RUNNING]  PrivEsc: CVE-2024-XXXX
  3. BlueTeam-02    [IDLE]     Monitoring: /var/log
  4. Forensics-01   [COMPLETE] Analysis: memory.dmp
  5. SocialEng-01   [WAITING]  Phishing: campaign-7`;
    } else if (lowerCmd === 'models') {
      response = `Loaded Models:
  1. Claude Code    [LOADED]   Agentic coding
  2. Codex CLI      [LOADED]   Coding agent
  3. Grok           [LOADED]   Multi-agent reasoning
  4. DeepSeek R1    [LOADED]   Reasoning (671B MoE)
  5. Hermes 3       [LOADED]   Open-weight (405B)
  6. Opus           [QUEUED]   Complex reasoning`;
    } else if (lowerCmd === 'tools') {
      response = `Integrated Tools:
  ARTEX       [ACTIVE]  142 modules - Autonomous pentesting
  Nethunter   [ACTIVE]  67 modules  - Mobile Kali
  Dolphy      [TRAINING] 89 modules  - AI model framework
  Flipper Zero[ACTIVE]  34 modules  - Hardware hacking
  Sapper v2   [ACTIVE]  23 modules  - Agent orchestration
  Needle      [TRAINING] 45 modules  - Custom models
  Jarvis      [ACTIVE]  23 modules  - Main shell`;
    } else if (lowerCmd === 'memory') {
      response = `Vector Memory Stats:
  Total Entries:     1,234
  Embeddings:        847
  Agent Memories:    234
  Tool Interactions: 156
  Training Samples:  1,245
  Index Size:        2.4 GB
  Last Sync:         2 hours ago`;
    } else if (lowerCmd === 'status') {
      response = `System Status:
  CPU:      45% (8 cores)
  Memory:   62% (32 GB / 512 GB)
  GPU:      78% (RTX 4090 x2)
  Disk:     34% (1.2 TB / 3.5 TB)
  Network:  12% (1.2 Gbps / 10 Gbps)
  Uptime:   14 days, 6 hours`;
    } else if (lowerCmd.startsWith('scan ')) {
      const target = lowerCmd.replace('scan ', '');
      response = `Initiating security scan on ${target}...
  [ARTEX] Loading reconnaissance modules...
  [ARTEX] Port scan: 65535 ports
  [ARTEX] Service enumeration: 23 services found
  [ARTEX] Vulnerability scan: 4 critical, 12 high, 28 medium
  [ARTEX] Exploit validation: 3 confirmed
  Scan complete. Report saved to /velvet/scans/${target}_${Date.now()}.json`;
    } else if (lowerCmd.startsWith('train ')) {
      const model = lowerCmd.replace('train ', '');
      response = `Starting training for ${model}...
  [Needle] Loading dataset: 2.4M samples
  [Needle] Initializing RSI optimizer...
  [Needle] Epoch 1/100: loss=2.341, acc=0.421
  [Needle] Epoch 2/100: loss=1.987, acc=0.512
  [Needle] Training in background. Check status with "models"`;
    } else if (lowerCmd.startsWith('deploy ')) {
      const target = lowerCmd.replace('deploy ', '');
      response = `Deploying to ${target}...
  [Nethunter] Preparing mobile payload...
  [ARTEX] Validating exploit chain...
  [Jarvis] Establishing C2 channel...
  Deployment initiated. Session ID: ${Date.now()}`;
    } else if (lowerCmd === 'exit') {
      response = 'Closing terminal session...';
    } else if (lowerCmd === 'a2ui') {
      response = 'A2UI Agent Stream: Open the A2UI tab to stream generative UI via the A2UI protocol.';
    } else if (lowerCmd === 'exact') {
      response = 'Exact Native Capabilities: Open the Exact tab to access cross-platform native features.';
    } else if (lowerCmd === 'elephant') {
      response = 'Elephant Goldfish: Open the Elephant tab to run design-review skills.';
    } else if (lowerCmd === 'security') {
      response = 'Security Tools: Open the Security tab to manage ARTEX, Nethunter, Dolphy, Flipper Zero, and Sapper v2.';
    } else {
      response = `Command not found: ${trimmed}. Type "help" for available commands.`;
    }
    
    setHistory([
      ...newHistory,
      { type: 'output', content: response, timestamp: Date.now() },
      { type: 'prompt', content: 'velvet@brain:~$', timestamp: Date.now() }
    ]);
    setInput('');
  };

  return (
    <SimpleCard width="100%">
      <VStack width="100%" gap={0} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div ref={terminalRef} style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          <VStack gap={1} style={{ fontFamily: 'monospace', fontSize: '13px' }}>
            {history.map((entry, idx) => (
              <HStack key={idx} gap={2} vAlign="start">
                {entry.type === 'prompt' && (
                  <Text color="accent" style={{ whiteSpace: 'pre' }}>{entry.content} </Text>
                )}
                {entry.type === 'input' && (
                  <Text color="accent" style={{ whiteSpace: 'pre' }}>{entry.content}</Text>
                )}
                {entry.type === 'output' && (
                  <Text color="secondary" style={{ whiteSpace: 'pre-wrap', flex: 1 }}>{entry.content}</Text>
                )}
                {entry.type === 'system' && (
                  <Text color="secondary" style={{ whiteSpace: 'pre-wrap', flex: 1 }}>{entry.content}</Text>
                )}
              </HStack>
            ))}
          </VStack>
        </div>
        <Divider />
        <HStack gap={2} vAlign="center" padding={3}>
          <Text type="supporting" color="secondary" style={{ minWidth: '120px', fontFamily: 'monospace' }}>velvet@brain:~$</Text>
          <TextInput
            ref={inputRef}
            label="Terminal"
            value={input}
            onChange={(v: string) => setInput(v)}
            onEnter={() => handleCommand(input)}
            placeholder="Type command..."
          />
          <Button variant="ghost" size="sm" icon={<Icon icon="upload" size="sm" />} label="Send" onClick={() => handleCommand(input)} />
        </HStack>
      </VStack>
    </SimpleCard>
  );
}

// ============================================
// VelvetAgentManager Component
// ============================================
export function VelvetAgentManager() {
  const [agents] = useState([
    { id: 1, name: 'PenTest-01', type: 'Reconnaissance', status: 'running' as AgentStatus, target: '192.168.1.0/24', progress: 67, modules: ['port-scan', 'service-enum', 'vuln-scan', 'exploit-validation'], logs: ['[09:12] Port scan complete: 23 open ports', '[09:15] Service enumeration: SSH, HTTP, RDP', '[09:18] Vulnerability scan in progress...'] },
    { id: 2, name: 'RedTeam-03', type: 'Privilege Escalation', status: 'running' as AgentStatus, target: 'CVE-2024-XXXX', progress: 42, modules: ['exploit-dev', 'payload-gen', 'evasion', 'persistence'], logs: ['[08:45] Exploit chain validated', '[08:52] Payload generated: meterpreter', '[08:58] Evasion techniques applied'] },
    { id: 3, name: 'BlueTeam-02', type: 'Monitoring', status: 'idle' as AgentStatus, target: '/var/log', progress: 0, modules: ['log-analysis', 'anomaly-detection', 'alerting'], logs: ['[06:00] Log rotation complete', '[06:00] Monitoring active'] },
    { id: 4, name: 'Forensics-01', type: 'Memory Analysis', status: 'complete' as AgentStatus, target: 'memory.dmp', progress: 100, modules: ['volatility', 'strings', 'malfind', 'timeline'], logs: ['[04:22] Process tree reconstructed', '[04:35] Malware artifacts found: 3', '[04:48] Report generated'] },
    { id: 5, name: 'SocialEng-01', type: 'Phishing', status: 'waiting' as AgentStatus, target: 'campaign-7', progress: 0, modules: ['template-gen', 'delivery', 'tracking'], logs: ['[10:00] Templates prepared', '[10:05] Awaiting approval'] },
    { id: 6, name: 'WebApp-02', type: 'Web App Testing', status: 'idle' as AgentStatus, target: 'app.example.com', progress: 0, modules: ['sqli', 'xss', 'csrf', 'auth-bypass'], logs: [] },
    { id: 7, name: 'Network-01', type: 'Network Pentest', status: 'idle' as AgentStatus, target: '10.0.0.0/8', progress: 0, modules: ['mitm', 'dns-spoof', 'arp-poison', 'vlan-hop'], logs: [] },
    { id: 8, name: 'Cloud-01', type: 'Cloud Audit', status: 'idle' as AgentStatus, target: 'AWS/Azure/GCP', progress: 0, modules: ['iam-audit', 'storage-scan', 'network-config', 'compliance'], logs: [] },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'running' | 'idle' | 'complete'>('all');
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) ||
                         agent.type.toLowerCase().includes(search.toLowerCase()) ||
                         agent.target.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || agent.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAgentClick = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    setDialogOpen(true);
  };

  return (
    <VStack gap={4} padding={4}>
      <HStack gap={3} hAlign="between">
        <HStack gap={3} vAlign="center">
          <Heading level={2}>Agent Manager</Heading>
          <Badge label={`${agents.length} agents`} variant="neutral" />
        </HStack>
        <HStack gap={2}>
          <TextInput label="Search" placeholder="Search agents..." value={search} onChange={(v: string) => setSearch(v)} width={280} startIcon={<Icon icon="search" size="sm" />} />
          <ToolButton label="New Agent" variant="primary" icon={<Icon icon="check" size="sm" />} onClick={() => alert('Create new agent')} />
        </HStack>
      </HStack>

      <TabList value={activeTab} onChange={(v: string | null) => setActiveTab(v as any)}>
        <Tab value="all" label="All" />
        <Tab value="running" label={`Running (${agents.filter(a => a.status === 'running').length})`} />
        <Tab value="idle" label={`Idle (${agents.filter(a => a.status === 'idle').length})`} />
        <Tab value="complete" label={`Complete (${agents.filter(a => a.status === 'complete').length})`} />
      </TabList>

      <VStack gap={4}>
        {filteredAgents.map(agent => (
          <SimpleCard key={agent.id} variant="default" onClick={() => handleAgentClick(agent)} style={{ cursor: 'pointer' }}>
            <HStack gap={3} hAlign="between" vAlign="start">
              <HStack gap={3} vAlign="center">
                <HStack hAlign="center" vAlign="center" width={48} height={48}>
                  <Icon icon="check" size="lg" color="accent" />
                </HStack>
                <VStack gap={0.5} hAlign="start">
                  <Text weight="semibold">{agent.name}</Text>
                  <Text type="supporting" color="secondary">{agent.type}</Text>
                </VStack>
              </HStack>
              <Badge label={agent.status.charAt(0).toUpperCase() + agent.status.slice(1)} variant={agent.status === 'running' ? 'success' : agent.status === 'waiting' ? 'warning' : 'neutral'} />
            </HStack>
            <VStack gap={2}>
              <HStack gap={2} hAlign="between">
                <Text type="supporting" color="secondary">Target</Text>
                <Text size="sm" weight="medium" style={{ fontFamily: 'monospace' }}>{agent.target}</Text>
              </HStack>
              <HStack gap={2} hAlign="between">
                <Text type="supporting" color="secondary">Progress</Text>
                <Text size="sm" weight="medium">{agent.progress}%</Text>
              </HStack>
              <ProgressBar label="Progress" value={agent.progress} max={100} />
              <HStack gap={1}>
                {agent.modules.slice(0, 3).map((mod, i) => (
                  <Badge key={i} variant="neutral" label={mod} />
                ))}
                {agent.modules.length > 3 && (
                  <Badge variant="neutral" label={`+${agent.modules.length - 3} more`} />
                )}
              </HStack>
            </VStack>
          </SimpleCard>
        ))}
      </VStack>

      {dialogOpen && selectedAgent && (
        <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen} width={600} maxHeight="80dvh" padding={4}>
          <DialogHeader title={selectedAgent.name} subtitle={selectedAgent.type} />
          <VStack gap={4}>
            <SimpleCard variant="muted">
              <SectionTitle>Target & Progress</SectionTitle>
              <HStack gap={3} hAlign="between">
                <VStack gap={1} hAlign="start">
                  <Text type="supporting" color="secondary">Target</Text>
                  <Text weight="medium" style={{ fontFamily: 'monospace' }}>{selectedAgent.target}</Text>
                </VStack>
                <VStack gap={1} hAlign="start">
                  <Text type="supporting" color="secondary">Progress</Text>
                  <Text weight="medium">{selectedAgent.progress}%</Text>
                </VStack>
              </HStack>
              <ProgressBar label="Progress" value={selectedAgent.progress} max={100} />
            </SimpleCard>

            <SimpleCard variant="muted">
              <SectionTitle>Active Modules</SectionTitle>
              <HStack gap={1}>
                {selectedAgent.modules.map((mod, i) => (
                  <Badge key={i} variant="neutral" label={mod} />
                ))}
              </HStack>
            </SimpleCard>

            <SimpleCard variant="muted">
              <SectionTitle>Recent Logs</SectionTitle>
              <VStack gap={1}>
                {selectedAgent.logs.map((log, i) => (
                  <Text key={i} type="code" color="secondary">
                    {log}
                  </Text>
                ))}
                {selectedAgent.logs.length === 0 && (
                  <Text type="supporting" color="secondary">No logs available</Text>
                )}
              </VStack>
            </SimpleCard>
          </VStack>
          <HStack gap={2} hAlign="end">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} label="Close" />
            <Button variant={selectedAgent.status === 'running' ? 'destructive' : 'primary'} icon={<Icon icon="check" size="sm" />} label={selectedAgent.status === 'running' ? 'Stop' : 'Start'} onClick={() => {}} />
          </HStack>
        </Dialog>
      )}
    </VStack>
  );
}

// ============================================
// VelvetModelManager Component
// ============================================
export function VelvetModelManager() {
  const [models] = useState([
    { id: 1, name: 'Needle3', type: 'Primary', status: 'loaded' as ModelStatus, params: '7B', quantization: '4-bit', vram: '4.2 GB', context: '32K', architecture: 'Transformer', capabilities: ['reasoning', 'coding', 'tool-calling', 'rsi'], lastUsed: '2 min ago' },
    { id: 2, name: 'LFM3-OMNI', type: 'Secondary', status: 'loaded' as ModelStatus, params: '13B', quantization: '8-bit', vram: '10.5 GB', context: '128K', architecture: 'MoE', capabilities: ['multimodal', 'reasoning', 'vision', 'audio'], lastUsed: '15 min ago' },
    { id: 3, name: 'Custom-RSI-1', type: 'Custom', status: 'training' as ModelStatus, params: '3B', quantization: '4-bit', vram: '2.1 GB', context: '16K', architecture: 'Transformer', capabilities: ['rsi', 'self-improvement', 'meta-learning'], lastUsed: '2 hours ago' },
    { id: 4, name: 'Custom-AGI-1', type: 'Custom', status: 'queued' as ModelStatus, params: '1B', quantization: '4-bit', vram: '0.8 GB', context: '8K', architecture: 'Transformer', capabilities: ['agi', 'general-reasoning', 'autonomous'], lastUsed: 'Never' },
    { id: 5, name: 'Needle3-Small', type: 'Custom', status: 'loaded' as ModelStatus, params: '1.5B', quantization: '4-bit', vram: '1.1 GB', context: '8K', architecture: 'Transformer', capabilities: ['fast-inference', 'edge-deployment'], lastUsed: '1 hour ago' },
    { id: 6, name: 'Custom-Code-1', type: 'Custom', status: 'training' as ModelStatus, params: '7B', quantization: '4-bit', vram: '4.2 GB', context: '32K', architecture: 'Transformer', capabilities: ['code-generation', 'code-review', 'refactoring'], lastUsed: '3 hours ago' },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'loaded' | 'training' | 'custom'>('all');
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState<typeof models[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(search.toLowerCase()) ||
                         model.type.toLowerCase().includes(search.toLowerCase()) ||
                         model.architecture.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'loaded' && model.status === 'loaded') ||
                      (activeTab === 'training' && model.status === 'training') ||
                      (activeTab === 'custom' && model.type === 'Custom');
    return matchesSearch && matchesTab;
  });

  const handleModelClick = (model: typeof models[0]) => {
    setSelectedModel(model);
    setDialogOpen(true);
  };

  return (
    <VStack gap={4} padding={4}>
      <HStack gap={3} hAlign="between">
        <HStack gap={3} vAlign="center">
          <Heading level={2}>Model Manager</Heading>
          <Badge label={`${models.length} models`} variant="neutral" />
        </HStack>
        <HStack gap={2}>
          <TextInput label="Search" placeholder="Search models..." value={search} onChange={(v: string) => setSearch(v)} width={280} startIcon={<Icon icon="search" size="sm" />} />
          <ToolButton label="New Model" variant="primary" icon={<Icon icon="check" size="sm" />} onClick={() => alert('Create/import new model')} />
        </HStack>
      </HStack>

      <HStack gap={3}>
        <SimpleCard variant="muted" width={200}>
          <Text type="supporting" color="secondary">Loaded Models</Text>
          <Text weight="bold" type="display-1">{models.filter(m => m.status === 'loaded').length}</Text>
        </SimpleCard>
        <SimpleCard variant="muted" width={200}>
          <Text type="supporting" color="secondary">Training</Text>
          <Text weight="bold" type="display-1">{models.filter(m => m.status === 'training').length}</Text>
        </SimpleCard>
        <SimpleCard variant="muted" width={200}>
          <Text type="supporting" color="secondary">Total VRAM Used</Text>
          <Text weight="bold" type="display-1">22.1 GB</Text>
        </SimpleCard>
        <SimpleCard variant="muted" width={200}>
          <Text type="supporting" color="secondary">Custom Models</Text>
          <Text weight="bold" type="display-1">{models.filter(m => m.type === 'Custom').length}</Text>
        </SimpleCard>
      </HStack>

      <TabList value={activeTab} onChange={(v: string | null) => setActiveTab(v as any)}>
        <Tab value="all" label="All Models" />
        <Tab value="loaded" label={`Loaded (${models.filter(m => m.status === 'loaded').length})`} />
        <Tab value="training" label={`Training (${models.filter(m => m.status === 'training').length})`} />
        <Tab value="custom" label={`Custom (${models.filter(m => m.type === 'Custom').length})`} />
      </TabList>

      <VStack gap={4}>
        {filteredModels.map(model => (
          <SimpleCard key={model.id} variant="default" onClick={() => handleModelClick(model)} style={{ cursor: 'pointer' }}>
            <HStack gap={3} hAlign="between" vAlign="center">
              <HStack gap={3} vAlign="center">
                <HStack hAlign="center" vAlign="center" width={40} height={40}>
                  <Text weight="bold" color="accent" type="display-1">{model.name.charAt(0)}</Text>
                </HStack>
                <VStack gap={0.5} hAlign="start">
                  <Text weight="medium">{model.name}</Text>
                  <Text type="supporting" color="secondary">{model.architecture}</Text>
                </VStack>
              </HStack>
              <HStack gap={3} vAlign="center">
                <Text weight="medium">{model.params}</Text>
                <Text type="supporting" color="secondary">{model.quantization}</Text>
                <Text type="supporting" color="secondary">{model.vram}</Text>
                <Text type="supporting" color="secondary">{model.context}</Text>
                <Text type="supporting" color="secondary">{model.lastUsed}</Text>
              </HStack>
              <HStack gap={1}>
                <Tooltip content="Load/Unload">
                  <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label={model.status === 'loaded' ? 'Unload' : 'Load'} />
                </Tooltip>
                <Tooltip content="Configure">
                  <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Configure" />
                </Tooltip>
              </HStack>
            </HStack>
          </SimpleCard>
        ))}
      </VStack>

      {dialogOpen && selectedModel && (
        <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen} width={700} maxHeight="80dvh" padding={4}>
          <DialogHeader title={selectedModel.name} subtitle={selectedModel.type} />
          <VStack gap={4}>
            <HStack gap={4}>
              <SimpleCard variant="muted" width={300}>
                <SectionTitle>Configuration</SectionTitle>
                <VStack gap={2}>
                  <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Parameters</Text><Text weight="medium">{selectedModel.params}</Text></HStack>
                  <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Quantization</Text><Text weight="medium">{selectedModel.quantization}</Text></HStack>
                  <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">VRAM Usage</Text><Text weight="medium">{selectedModel.vram}</Text></HStack>
                  <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Context Window</Text><Text weight="medium">{selectedModel.context}</Text></HStack>
                  <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Architecture</Text><Text weight="medium">{selectedModel.architecture}</Text></HStack>
                </VStack>
              </SimpleCard>
              <SimpleCard variant="muted" width={300}>
                <SectionTitle>Capabilities</SectionTitle>
                <HStack gap={1}>
                  {selectedModel.capabilities.map((cap, i) => (
                    <Badge key={i} variant="neutral" label={cap} />
                  ))}
                </HStack>
              </SimpleCard>
            </HStack>

            <SimpleCard variant="muted">
              <SectionTitle>Training Progress</SectionTitle>
              {selectedModel.status === 'training' ? (
                <VStack gap={3}>
                  <HStack gap={2} hAlign="between">
                    <Text>Epoch 47/100</Text>
                    <Text weight="medium">47%</Text>
                  </HStack>
                  <ProgressBar label="Progress" value={47} max={100} variant="warning" />
                  <HStack gap={3}>
                    <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Loss</Text><Text weight="medium" color="secondary">1.234</Text></VStack>
                    <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Accuracy</Text><Text weight="medium" color="secondary">0.782</Text></VStack>
                    <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Learning Rate</Text><Text weight="medium" color="secondary">2e-4</Text></VStack>
                  </HStack>
                </VStack>
              ) : selectedModel.status === 'queued' ? (
                <Text color="secondary">Model queued for training. Will start when GPU resources available.</Text>
              ) : (
                <Text color="secondary">Model is loaded and ready for inference.</Text>
              )}
            </SimpleCard>
          </VStack>
          <HStack gap={2} hAlign="end">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} label="Close" />
            <Button variant={selectedModel.status === 'loaded' ? 'destructive' : 'primary'} icon={<Icon icon="check" size="sm" />} label={selectedModel.status === 'loaded' ? 'Unload' : 'Load'} onClick={() => {}} />
          </HStack>
        </Dialog>
      )}
    </VStack>
  );
}

// ============================================
// VelvetToolIntegrator Component (Main Tools)
// ============================================
export function VelvetToolIntegrator() {
  const [tools] = useState([
    { id: 1, name: 'ARTEX', category: 'Penetration Testing', status: 'active' as ToolStatus, version: '2.4.1', modules: 142, description: 'AI autonomous penetration testing system with dual-graph architecture', capabilities: ['reconnaissance', 'vulnerability-scanning', 'exploitation', 'post-exploitation', 'reporting'], config: { targetScope: '192.168.1.0/24', aggressiveness: 'medium', stealth: true, reporting: 'detailed' } },
    { id: 2, name: 'Dolphy', category: 'AI Framework', status: 'active' as ToolStatus, version: '1.8.0', modules: 89, description: 'AI model and framework with uncensored model support', capabilities: ['model-training', 'weight-generation', 'local-inference', 'multi-model'], config: { defaultModel: 'Needle3', trainingEpochs: 100, batchSize: 32, precision: 'bf16' } },
    { id: 3, name: 'Nethunter', category: 'Mobile Kali', status: 'active' as ToolStatus, version: '2024.4', modules: 67, description: 'Full Kali Linux toolset on Android with touch-friendly interface', capabilities: ['mobile-pentest', 'wifi-testing', 'bluetooth', 'nfc', 'usb-otg'], config: { deviceMode: 'tablet', autoUpdate: true, vncEnabled: false, chrootPath: '/data/local/nh' } },
    { id: 4, name: 'Needle', category: 'Custom Models', status: 'training' as ToolStatus, version: '3.2.0', modules: 45, description: 'Small, efficient models with tool calling and custom weight creation', capabilities: ['custom-training', 'rsi', 'agi-weights', 'edge-deployment'], config: { rsiEnabled: true, agiEnabled: true, quantization: '4-bit', contextWindow: '32K' } },
    { id: 5, name: 'Jarvis', category: 'Main Shell', status: 'active' as ToolStatus, version: '1.0.0', modules: 23, description: 'Main application shell integrating all components', capabilities: ['orchestration', 'agent-management', 'memory-sync', 'tool-routing'], config: { autoSync: true, logLevel: 'info', theme: 'dark', notifications: true } },
    { id: 6, name: 'Ghostman', category: 'Stealth Ops', status: 'idle' as ToolStatus, version: '0.9.0', modules: 34, description: 'Stealth operations and covert channel framework', capabilities: ['covert-comms', 'evasion', 'persistence', 'data-exfil'], config: { encryption: 'aes-256', beaconInterval: 300, domainFronting: true } },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'idle' | 'training'>('all');
  const [search, setSearch] = useState('');
  const [selectedTool, setSelectedTool] = useState<typeof tools[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                         tool.category.toLowerCase().includes(search.toLowerCase()) ||
                         tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || tool.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleToolClick = (tool: typeof tools[0]) => {
    setSelectedTool(tool);
    setDialogOpen(true);
  };

  return (
    <VStack gap={4} padding={4}>
      <HStack gap={3} hAlign="between">
        <HStack gap={3} vAlign="center">
          <Heading level={2}>Tool Integrator</Heading>
          <Badge label={`${tools.length} tools integrated`} variant="neutral" />
        </HStack>
        <HStack gap={2}>
          <TextInput label="Search" placeholder="Search tools..." value={search} onChange={(v: string) => setSearch(v)} width={280} startIcon={<Icon icon="search" size="sm" />} />
          <ToolButton label="Add Tool" variant="primary" icon={<Icon icon="check" size="sm" />} onClick={() => alert('Add new tool integration')} />
        </HStack>
      </HStack>

      <HStack gap={3}>
        <SimpleCard variant="muted" width={200}>
          <Text type="supporting" color="secondary">Active Tools</Text>
          <Text weight="bold" type="display-1">{tools.filter(t => t.status === 'active').length}</Text>
        </SimpleCard>
        <SimpleCard variant="muted" width={200}>
          <Text type="supporting" color="secondary">Total Modules</Text>
          <Text weight="bold" type="display-1">{tools.reduce((sum, t) => sum + t.modules, 0)}</Text>
        </SimpleCard>
        <SimpleCard variant="muted" width={200}>
          <Text type="supporting" color="secondary">Categories</Text>
          <Text weight="bold" type="display-1">{new Set(tools.map(t => t.category)).size}</Text>
        </SimpleCard>
        <SimpleCard variant="muted" width={200}>
          <Text type="supporting" color="secondary">Training</Text>
          <Text weight="bold" type="display-1">{tools.filter(t => t.status === 'training').length}</Text>
        </SimpleCard>
      </HStack>

      <TabList value={activeTab} onChange={(v: string | null) => setActiveTab(v as any)}>
        <Tab value="all" label="All Tools" />
        <Tab value="active" label={`Active (${tools.filter(t => t.status === 'active').length})`} />
        <Tab value="idle" label={`Idle (${tools.filter(t => t.status === 'idle').length})`} />
        <Tab value="training" label={`Training (${tools.filter(t => t.status === 'training').length})`} />
      </TabList>

      <VStack gap={4}>
        {filteredTools.map(tool => (
          <SimpleCard key={tool.id} variant="default" onClick={() => handleToolClick(tool)} style={{ cursor: 'pointer' }}>
            <HStack gap={3} hAlign="between" vAlign="start">
              <HStack gap={3} vAlign="center">
                <HStack hAlign="center" vAlign="center" width={48} height={48}>
                  <Text weight="bold" color="accent" type="display-1">{tool.name.charAt(0)}</Text>
                </HStack>
                <VStack gap={0.5} hAlign="start">
                  <Text weight="semibold">{tool.name}</Text>
                  <Text type="supporting" color="secondary">{tool.category}</Text>
                </VStack>
              </HStack>
              <Badge label={tool.status.charAt(0).toUpperCase() + tool.status.slice(1)} variant={tool.status === 'active' ? 'success' : tool.status === 'training' ? 'warning' : 'neutral'} />
            </HStack>
            <VStack gap={3}>
              <Text type="supporting" color="secondary" style={{ lineHeight: 1.5 }}>{tool.description}</Text>
              <HStack gap={2} hAlign="between">
                <HStack gap={1}>
                  {tool.capabilities.slice(0, 4).map((cap, i) => (
                    <Badge key={i} variant="neutral" label={cap} />
                  ))}
                  {tool.capabilities.length > 4 && (
                    <Badge variant="neutral" label={`+${tool.capabilities.length - 4} more`} />
                  )}
                </HStack>
                <Text type="supporting" color="secondary">v{tool.version}</Text>
              </HStack>
              <Divider />
              <HStack gap={2} hAlign="between">
                <HStack gap={2} vAlign="center">
                  <Icon icon="check" size="sm" color="secondary" />
                  <Text type="supporting" color="secondary">{tool.modules} modules</Text>
                </HStack>
                <HStack gap={1}>
                  <Tooltip content="Configure">
                    <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Configure" />
                  </Tooltip>
                  <Tooltip content="View Logs">
                    <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="View Logs" />
                  </Tooltip>
                  <Tooltip content={tool.status === 'active' ? 'Disable' : 'Enable'}>
                    <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label={tool.status === 'active' ? 'Disable' : 'Enable'} />
                  </Tooltip>
                </HStack>
              </HStack>
            </VStack>
          </SimpleCard>
        ))}
      </VStack>

      {dialogOpen && selectedTool && (
        <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen} width={800} maxHeight="85dvh" padding={4}>
          <DialogHeader title={selectedTool.name} subtitle={selectedTool.category} />
          <VStack gap={4}>
            <SimpleCard variant="muted">
              <SectionTitle>Description</SectionTitle>
              <Text style={{ lineHeight: 1.6 }}>{selectedTool.description}</Text>
            </SimpleCard>

            <HStack gap={4}>
              <SimpleCard variant="muted" width={300}>
                <SectionTitle>Capabilities</SectionTitle>
                <HStack gap={1}>
                  {selectedTool.capabilities.map((cap, i) => (
                    <Badge key={i} variant="neutral" label={cap} />
                  ))}
                </HStack>
              </SimpleCard>
              <SimpleCard variant="muted" width={300}>
                <SectionTitle>Module Stats</SectionTitle>
                <HStack gap={3} hAlign="between">
                  <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Total Modules</Text><Text weight="medium">{selectedTool.modules}</Text></VStack>
                  <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Version</Text><Text weight="medium">{selectedTool.version}</Text></VStack>
                  <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Status</Text><Text weight="medium">{selectedTool.status}</Text></VStack>
                </HStack>
              </SimpleCard>
            </HStack>

            <SimpleCard variant="muted">
              <SectionTitle>Configuration</SectionTitle>
              <VStack gap={3}>
                {Object.entries(selectedTool.config).map(([key, value]) => (
                  <HStack key={key} gap={2} hAlign="between" vAlign="center">
                    <Text weight="medium">{key}</Text>
                    <Text type="code" color="secondary" style={{ fontFamily: 'monospace' }}>{String(value)}</Text>
                  </HStack>
                ))}
              </VStack>
            </SimpleCard>

            <SimpleCard variant="muted">
              <SectionTitle>Integration Health</SectionTitle>
              <HStack gap={3}>
                <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">API Latency</Text><Text weight="medium" color="secondary">12ms</Text></VStack>
                <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Success Rate</Text><Text weight="medium" color="secondary">99.2%</Text></VStack>
                <VStack gap={0.5} hAlign="start"><Text type="supporting" color="secondary">Last Sync</Text><Text weight="medium" color="secondary">2 min ago</Text></VStack>
              </HStack>
            </SimpleCard>
          </VStack>
          <HStack gap={2} hAlign="end">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} label="Close" />
            <Button variant={selectedTool.status === 'active' ? 'destructive' : 'primary'} icon={<Icon icon="check" size="sm" />} label={selectedTool.status === 'active' ? 'Disable' : 'Enable'} onClick={() => {}} />
          </HStack>
        </Dialog>
      )}
    </VStack>
  );
}

// ============================================
// VelvetMemory Component
// ============================================
export function VelvetMemory() {
  const memoryTypes = [
    { id: 'embeddings', label: 'Embeddings', count: 847, size: '2.4 GB', icon: 'check' },
    { id: 'agent-memories', label: 'Agent Memories', count: 234, size: '512 MB', icon: 'check' },
    { id: 'tool-interactions', label: 'Tool Interactions', count: 156, size: '287 MB', icon: 'check' },
    { id: 'training-samples', label: 'Training Samples', count: 1245, size: '1.2 GB', icon: 'check' },
    { id: 'conversations', label: 'Conversations', count: 89, size: '145 MB', icon: 'check' },
    { id: 'scans', label: 'Scan Results', count: 47, size: '89 MB', icon: 'search' },
  ];

  const memoryEntries = [
    { id: 1, type: 'embedding', content: 'Port scan results for 192.168.1.0/24 - 23 open ports found', agent: 'PenTest-01', timestamp: '2024-01-15 09:15:22', tags: ['recon', 'network', 'ports'], vectors: 384, relevance: 0.94 },
    { id: 2, type: 'agent-memory', content: 'Successfully exploited CVE-2024-XXXX on target server via buffer overflow', agent: 'RedTeam-03', timestamp: '2024-01-15 08:58:12', tags: ['exploit', 'cve', 'privilege-escalation'], vectors: 768, relevance: 0.98 },
    { id: 3, type: 'tool-interaction', content: 'ARTEX module vuln-scan completed with 4 critical findings', agent: 'System', timestamp: '2024-01-15 09:18:45', tags: ['artex', 'vuln-scan', 'critical'], vectors: 512, relevance: 0.87 },
    { id: 4, type: 'training-sample', content: 'RSI optimization pattern: gradient clipping at 1.0 improves convergence', agent: 'Needle-Trainer', timestamp: '2024-01-15 06:32:10', tags: ['rsi', 'training', 'optimization'], vectors: 1024, relevance: 0.92 },
    { id: 5, type: 'conversation', content: 'User requested full network scan of 10.0.0.0/8 with stealth mode', agent: 'Jarvis', timestamp: '2024-01-15 10:05:33', tags: ['user-request', 'scan', 'stealth'], vectors: 384, relevance: 0.76 },
    { id: 6, type: 'scan-result', content: 'Nmap scan of app.example.com: 80, 443, 8080, 8443 open', agent: 'WebApp-02', timestamp: '2024-01-14 16:22:11', tags: ['web', 'nmap', 'ports'], vectors: 384, relevance: 0.81 },
    { id: 7, type: 'agent-memory', content: 'Memory dump analysis complete - 3 malware artifacts identified', agent: 'Forensics-01', timestamp: '2024-01-15 04:48:22', tags: ['forensics', 'malware', 'memory-analysis'], vectors: 768, relevance: 0.95 },
    { id: 8, type: 'training-sample', content: 'AGI weight initialization: orthogonal initialization with gain=1.414', agent: 'Needle-Trainer', timestamp: '2024-01-15 03:15:00', tags: ['agi', 'weights', 'initialization'], vectors: 1024, relevance: 0.89 },
    { id: 9, type: 'embedding', content: 'Bluetooth device enumeration: 12 devices discovered in range', agent: 'Nethunter-01', timestamp: '2024-01-15 11:30:00', tags: ['bluetooth', 'mobile', 'enum'], vectors: 384, relevance: 0.72 },
    { id: 10, type: 'tool-interaction', content: 'Dolphy model Needle3 loaded successfully with 4-bit quantization', agent: 'System', timestamp: '2024-01-15 07:00:00', tags: ['dolphy', 'model-load', 'quantization'], vectors: 512, relevance: 0.88 },
  ];

  const [activeType, setActiveType] = useState<'all' | string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedEntry, setSelectedEntry] = useState<typeof memoryEntries[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredEntries = useMemo(() => {
    return memoryEntries.filter(entry => {
      const matchesSearch = entry.content.toLowerCase().includes(search.toLowerCase()) ||
                           entry.agent.toLowerCase().includes(search.toLowerCase()) ||
                           entry.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesType = activeType === 'all' || entry.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [search, activeType]);

  const paginatedEntries = filteredEntries.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredEntries.length / pageSize);

  const handleEntryClick = (entry: typeof memoryEntries[0]) => {
    setSelectedEntry(entry);
    setDialogOpen(true);
  };

  return (
    <VStack gap={4} padding={4}>
      <HStack gap={3} hAlign="between">
        <HStack gap={3} vAlign="center">
          <Heading level={2}>Vector Memory</Heading>
          <Badge label={`${memoryEntries.length} entries`} variant="neutral" />
        </HStack>
        <HStack gap={2}>
          <TextInput label="Search" placeholder="Search memory..." value={search} onChange={(v: string) => { setSearch(v); setPage(1); }} width={280} startIcon={<Icon icon="search" size="sm" />} />
          <ToolButton label="Add Entry" variant="primary" icon={<Icon icon="check" size="sm" />} onClick={() => alert('Create new memory entry')} />
        </HStack>
      </HStack>

      <HStack gap={3}>
        {memoryTypes.map(type => (
          <SimpleCard key={type.id} variant={activeType === type.id ? 'default' : 'muted'} onClick={() => setActiveType(activeType === type.id ? 'all' : type.id)} style={{ cursor: 'pointer', minWidth: '200px' }}>
            <HStack gap={3} hAlign="between">
              <HStack gap={3} vAlign="center">
                <HStack hAlign="center" vAlign="center" width={48} height={48}>
                  <Icon icon={type.icon as any} size="lg" color="accent" />
                </HStack>
                <VStack gap={0.5} hAlign="start">
                  <Text type="supporting" color="secondary">{type.label}</Text>
                  <Text weight="bold" type="display-1">{type.count}</Text>
                </VStack>
              </HStack>
              <Text type="supporting" color="secondary">{type.size}</Text>
            </HStack>
          </SimpleCard>
        ))}
      </HStack>

      <SimpleCard variant="muted">
        <HStack gap={3} hAlign="between" vAlign="center">
          <HStack gap={3} vAlign="center">
            <Icon icon="check" size="lg" color="accent" />
            <VStack gap={0.5} hAlign="start">
              <Text weight="semibold">Total Memory Size</Text>
              <Text weight="bold" type="display-1">5.2 GB</Text>
            </VStack>
          </HStack>
          <HStack gap={2} vAlign="center">
            <VStack gap={0.5} hAlign="end">
              <Text type="supporting" color="secondary">Index Size</Text>
              <Text weight="medium" color="secondary">2.4 GB</Text>
            </VStack>
            <VStack gap={0.5} hAlign="end">
              <Text type="supporting" color="secondary">Last Sync</Text>
              <Text weight="medium" color="secondary">2 hours ago</Text>
            </VStack>
            <Button variant="secondary" size="sm" icon={<Icon icon="check" size="sm" />} label="Sync Now" onClick={() => alert('Syncing memory...')} />
          </HStack>
        </HStack>
      </SimpleCard>

      <TabList value={activeType} onChange={(v: string | null) => setActiveType(v as any)}>
        <Tab value="all" label="All Types" />
        {memoryTypes.map(type => (
          <Tab key={type.id} value={type.id} label={`${type.label} (${type.count})`} />
        ))}
      </TabList>

      <VStack gap={4}>
        {paginatedEntries.map(entry => (
          <SimpleCard key={entry.id} variant="default" onClick={() => handleEntryClick(entry)} style={{ cursor: 'pointer' }}>
            <HStack gap={3} hAlign="between">
              <Badge label={entry.type} variant="neutral" />
              <Text type="supporting" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.content}
              </Text>
              <HStack gap={1} vAlign="center">
                <Avatar name={entry.agent} size="sm" />
                <Text size="sm" weight="medium">{entry.agent}</Text>
              </HStack>
              <HStack gap={1}>
                {entry.tags.map((tag, i) => (
                  <Badge key={i} variant="neutral" label={tag} />
                ))}
              </HStack>
              <Text size="sm" weight="medium" style={{ fontFamily: 'monospace' }}>{entry.vectors}d</Text>
              <ProgressBar label="Relevance" value={Math.round(entry.relevance * 100)} max={100} />
              <Text type="code" color="secondary" style={{ fontFamily: 'monospace' }}>{entry.timestamp}</Text>
              <HStack gap={1} hAlign="end">
                <Tooltip content="View Details">
                  <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="View" />
                </Tooltip>
                <Tooltip content="Delete">
                  <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Delete" />
                </Tooltip>
              </HStack>
            </HStack>
          </SimpleCard>
        ))}
      </VStack>

      {totalPages > 1 && (
        <HStack gap={1} hAlign="center" padding={3}>
          <HStack gap={1}>
            <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Previous" onClick={() => setPage(p => Math.max(1, p - 1))} isDisabled={page === 1} />
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              return (
                <Button key={pageNum} variant={page === pageNum ? 'primary' : 'ghost'} size="sm" label={String(pageNum)} onClick={() => setPage(pageNum)} />
              );
            })}
            <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Next" onClick={() => setPage(p => Math.min(totalPages, p + 1))} isDisabled={page === totalPages} />
          </HStack>
        </HStack>
      )}

      {dialogOpen && selectedEntry && (
        <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen} width={600} maxHeight="80dvh" padding={4}>
          <DialogHeader title={selectedEntry.type} subtitle={`${selectedEntry.vectors}d`} />
          <VStack gap={4}>
            <SimpleCard variant="muted">
              <SectionTitle>Content</SectionTitle>
              <Text style={{ lineHeight: 1.6 }}>{selectedEntry?.content}</Text>
            </SimpleCard>

            <HStack gap={4}>
              <SimpleCard variant="muted" width={300}>
                <SectionTitle>Metadata</SectionTitle>
                <VStack gap={2}>
                  <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Agent</Text><Text weight="medium">{selectedEntry?.agent}</Text></HStack>
                  <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Timestamp</Text><Text weight="medium" style={{ fontFamily: 'monospace' }}>{selectedEntry?.timestamp}</Text></HStack>
                  <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Vector Dimensions</Text><Text weight="medium">{selectedEntry?.vectors}d</Text></HStack>
                  <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Relevance Score</Text><Text weight="medium" color="secondary">{Math.round((selectedEntry?.relevance || 0) * 100)}%</Text></HStack>
                </VStack>
              </SimpleCard>
              <SimpleCard variant="muted" width={300}>
                <SectionTitle>Tags</SectionTitle>
                <HStack gap={1}>
                  {selectedEntry?.tags.map((tag, i) => (
                    <Badge key={i} variant="neutral" label={tag} />
                  ))}
                </HStack>
              </SimpleCard>
            </HStack>

            <SimpleCard variant="muted">
              <SectionTitle>Vector Visualization</SectionTitle>
              <Text type="supporting" color="secondary">Vector visualization would show {selectedEntry?.vectors}-dimensional embedding space projection</Text>
            </SimpleCard>
          </VStack>
          <HStack gap={2} hAlign="end">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} label="Close" />
            <Button variant="destructive" icon={<Icon icon="check" size="sm" />} label="Delete" onClick={() => { setDialogOpen(false); alert('Delete entry'); }} />
          </HStack>
        </Dialog>
      )}
    </VStack>
  );
}

// ============================================
// VelvetSettings Component
// ============================================
export function VelvetSettings({ theme, onThemeChange }: { theme: 'light' | 'dark'; onThemeChange: (theme: 'light' | 'dark') => void }) {
  const [settings, setSettings] = useState({
    language: 'en',
    autoSave: true,
    notifications: true,
    compactMode: false,
    startupTab: 'dashboard',
    theme: theme,
    accentColor: '#bb86fc',
    fontSize: 'medium',
    animations: true,
    reducedMotion: false,
    terminalFont: 'JetBrains Mono',
    terminalFontSize: 14,
    terminalCursorBlink: true,
    terminalScrollback: 10000,
    maxConcurrentAgents: 10,
    agentAutoRestart: true,
    agentLogLevel: 'info',
    agentTimeout: 300,
    defaultModel: 'Needle3',
    modelQuantization: '4-bit',
    autoLoadModels: true,
    modelCacheSize: 20,
    vectorDimensions: 768,
    memoryRetention: 30,
    autoSync: true,
    syncInterval: 60,
    encryptMemory: true,
    auditLogging: true,
    requireAuth: false,
    sessionTimeout: 60,
    apiKey: '',
    debugMode: false,
    telemetry: false,
    experimentalFeatures: false,
    gpuAcceleration: true,
    maxVramUsage: 80,
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'theme') onThemeChange(value);
  };

  return (
    <VStack gap={4} padding={4}>
      <Heading level={2}>Settings</Heading>
      
      <SimpleCard variant="default">
        <SectionTitle>General</SectionTitle>
        <VStack gap={3}>
          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Language</Text>
              <Text type="supporting" color="secondary">Interface language</Text>
            </VStack>
            <Selector
              label="Language"
              value={settings.language}
              onChange={(v: string | null) => handleChange('language', v || '')}
              width={200}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' },
                { value: 'zh', label: 'Chinese' },
                { value: 'ja', label: 'Japanese' },
              ]}
              hasClear
            />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Startup Tab</Text>
              <Text type="supporting" color="secondary">Default tab on launch</Text>
            </VStack>
            <Selector
              label="Startup Tab"
              value={settings.startupTab}
              onChange={(v: string | null) => handleChange('startupTab', v || '')}
              width={200}
              options={[
                { value: 'dashboard', label: 'Dashboard' },
                { value: 'terminal', label: 'Terminal' },
                { value: 'agents', label: 'Agents' },
                { value: 'models', label: 'Models' },
              ]}
              hasClear
            />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Auto-save</Text>
              <Text type="supporting" color="secondary">Automatically save changes</Text>
            </VStack>
            <Switch label="Auto-save" value={settings.autoSave} onChange={(checked: boolean) => handleChange('autoSave', checked)} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Notifications</Text>
              <Text type="supporting" color="secondary">Enable desktop notifications</Text>
            </VStack>
            <Switch label="Notifications" value={settings.notifications} onChange={(checked: boolean) => handleChange('notifications', checked)} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Compact Mode</Text>
              <Text type="supporting" color="secondary">Reduce spacing for more content</Text>
            </VStack>
            <Switch label="Compact Mode" value={settings.compactMode} onChange={(checked: boolean) => handleChange('compactMode', checked)} />
          </HStack>
        </VStack>
      </SimpleCard>

      <SimpleCard variant="default">
        <SectionTitle>Appearance</SectionTitle>
        <VStack gap={3}>
          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Color Theme</Text>
              <Text type="supporting" color="secondary">Light or dark mode</Text>
            </VStack>
            <HStack gap={2}>
              <Button variant={settings.theme === 'light' ? 'primary' : 'ghost'} onClick={() => handleChange('theme', 'light')} icon={<Icon icon="check" size="sm" />} label="Light" />
              <Button variant={settings.theme === 'dark' ? 'primary' : 'ghost'} onClick={() => handleChange('theme', 'dark')} icon={<Icon icon="check" size="sm" />} label="Dark" />
              <Button variant={settings.theme === 'dark' ? 'primary' : 'ghost'} onClick={() => handleChange('theme', 'system')} icon={<Icon icon="check" size="sm" />} label="System" />
            </HStack>
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Accent Color</Text>
              <Text type="supporting" color="secondary">Primary accent color</Text>
            </VStack>
            <TextInput label="Accent Color" value={settings.accentColor} onChange={(v: string) => handleChange('accentColor', v)} placeholder="#bb86fc" width={120} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Font Size</Text>
              <Text type="supporting" color="secondary">UI font size</Text>
            </VStack>
            <Selector label="Font Size" value={settings.fontSize} onChange={(v: string | null) => handleChange('fontSize', v || '')} width={180} options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ]}
            hasClear
          />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Animations</Text>
              <Text type="supporting" color="secondary">Enable UI animations</Text>
            </VStack>
            <Switch label="Animations" value={settings.animations} onChange={(checked: boolean) => handleChange('animations', checked)} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Reduced Motion</Text>
              <Text type="supporting" color="secondary">Respect prefers-reduced-motion</Text>
            </VStack>
            <Switch label="Reduced Motion" value={settings.reducedMotion} onChange={(checked: boolean) => handleChange('reducedMotion', checked)} />
          </HStack>
        </VStack>
      </SimpleCard>

      <SimpleCard variant="default">
        <SectionTitle>Terminal Settings</SectionTitle>
        <VStack gap={3}>
          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Font Family</Text>
              <Text type="supporting" color="secondary">Monospace font for terminal</Text>
            </VStack>
            <Selector label="Font Family" value={settings.terminalFont} onChange={(v: string | null) => handleChange('terminalFont', v || '')} width={250} options={[
              { value: 'JetBrains Mono', label: 'JetBrains Mono' },
              { value: 'Fira Code', label: 'Fira Code' },
              { value: 'Cascadia Code', label: 'Cascadia Code' },
              { value: 'Source Code Pro', label: 'Source Code Pro' },
              { value: 'Monospace', label: 'System Monospace' },
            ]}
            hasClear
          />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Font Size</Text>
              <Text type="supporting" color="secondary">Terminal font size in px</Text>
            </VStack>
            <Slider label="Font Size" value={settings.terminalFontSize} onChange={(v: number) => handleChange('terminalFontSize', String(v))} min={10} max={24} step={1} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Cursor Blink</Text>
              <Text type="supporting" color="secondary">Animate cursor</Text>
            </VStack>
            <Switch label="Cursor Blink" value={settings.terminalCursorBlink} onChange={(checked: boolean) => handleChange('terminalCursorBlink', checked)} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Scrollback Lines</Text>
              <Text type="supporting" color="secondary">Lines to keep in history</Text>
            </VStack>
            <Selector label="Scrollback" value={String(settings.terminalScrollback)} onChange={(v: string | null) => handleChange('terminalScrollback', Number(v || '0'))} width={180} options={[
              { value: '1000', label: '1,000' },
              { value: '5000', label: '5,000' },
              { value: '10000', label: '10,000' },
              { value: '50000', label: '50,000' },
              { value: '100000', label: '100,000' },
            ]}
            hasClear
          />
          </HStack>
        </VStack>
      </SimpleCard>

      <SimpleCard variant="default">
        <SectionTitle>Agent Configuration</SectionTitle>
        <VStack gap={3}>
          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Max Concurrent Agents</Text>
              <Text type="supporting" color="secondary">Maximum agents running simultaneously</Text>
            </VStack>
            <Slider label="Max Agents" value={settings.maxConcurrentAgents} onChange={(v: number) => handleChange('maxConcurrentAgents', String(v))} min={1} max={50} step={1} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Auto Restart</Text>
              <Text type="supporting" color="secondary">Restart agents on failure</Text>
            </VStack>
            <Switch label="Auto Restart" value={settings.agentAutoRestart} onChange={(checked: boolean) => handleChange('agentAutoRestart', checked)} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Log Level</Text>
              <Text type="supporting" color="secondary">Agent logging verbosity</Text>
            </VStack>
            <Selector label="Log Level" value={settings.agentLogLevel} onChange={(v: string | null) => handleChange('agentLogLevel', v || '')} width={180} options={[
              { value: 'debug', label: 'Debug' },
              { value: 'info', label: 'Info' },
              { value: 'warn', label: 'Warn' },
              { value: 'error', label: 'Error' },
            ]}
            hasClear
          />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Default Timeout (seconds)</Text>
              <Text type="supporting" color="secondary">Agent execution timeout</Text>
            </VStack>
            <Slider label="Timeout" value={settings.agentTimeout} onChange={(v: number) => handleChange('agentTimeout', String(v))} min={30} max={3600} step={30} />
          </HStack>
        </VStack>
      </SimpleCard>

      <SimpleCard variant="default">
        <SectionTitle>Model Settings</SectionTitle>
        <VStack gap={3}>
          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Default Model</Text>
              <Text type="supporting" color="secondary">Primary model for inference</Text>
            </VStack>
            <Selector label="Default Model" value={settings.defaultModel} onChange={(v: string | null) => handleChange('defaultModel', v || '')} width={250} options={[
              { value: 'Needle3', label: 'Needle3 (7B)' },
              { value: 'LFM3-OMNI', label: 'LFM3-OMNI (13B)' },
              { value: 'Custom-RSI-1', label: 'Custom-RSI-1 (3B)' },
              { value: 'Needle3-Small', label: 'Needle3-Small (1.5B)' },
            ]}
            hasClear
          />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Default Quantization</Text>
              <Text type="supporting" color="secondary">Model weight quantization</Text>
            </VStack>
            <Selector label="Quantization" value={settings.modelQuantization} onChange={(v: string | null) => handleChange('modelQuantization', v || '')} width={200} options={[
              { value: '4-bit', label: '4-bit (Recommended)' },
              { value: '8-bit', label: '8-bit' },
              { value: '16-bit', label: '16-bit (FP16)' },
              { value: 'none', label: 'None (FP32)' },
            ]}
            hasClear
          />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Auto Load Models</Text>
              <Text type="supporting" color="secondary">Load models on startup</Text>
            </VStack>
            <Switch label="Auto Load Models" value={settings.autoLoadModels} onChange={(checked: boolean) => handleChange('autoLoadModels', checked)} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Model Cache Size (GB)</Text>
              <Text type="supporting" color="secondary">Cache for loaded models</Text>
            </VStack>
            <Slider label="Cache Size" value={settings.modelCacheSize} onChange={(v: number) => handleChange('modelCacheSize', String(v))} min={5} max={100} step={5} />
          </HStack>
        </VStack>
      </SimpleCard>

      <SimpleCard variant="default">
        <SectionTitle>Vector Memory</SectionTitle>
        <VStack gap={3}>
          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Vector Dimensions</Text>
              <Text type="supporting" color="secondary">Embedding vector size</Text>
            </VStack>
            <Selector label="Dimensions" value={String(settings.vectorDimensions)} onChange={(v: string | null) => handleChange('vectorDimensions', Number(v || '0'))} width={180} options={[
              { value: '384', label: '384' },
              { value: '512', label: '512' },
              { value: '768', label: '768' },
              { value: '1024', label: '1024' },
              { value: '1536', label: '1536' },
              { value: '3072', label: '3072' },
            ]}
            hasClear
          />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Memory Retention (days)</Text>
              <Text type="supporting" color="secondary">Auto-delete old entries</Text>
            </VStack>
            <Slider label="Retention" value={settings.memoryRetention} onChange={(v: number) => handleChange('memoryRetention', String(v))} min={1} max={365} step={1} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Auto Sync</Text>
              <Text type="supporting" color="secondary">Automatically sync memory</Text>
            </VStack>
            <Switch label="Auto Sync" value={settings.autoSync} onChange={(checked: boolean) => handleChange('autoSync', checked)} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Sync Interval (minutes)</Text>
              <Text type="supporting" color="secondary">How often to sync</Text>
            </VStack>
            <Slider label="Sync Interval" value={settings.syncInterval} onChange={(v: number) => handleChange('syncInterval', String(v))} min={1} max={1440} step={5} />
          </HStack>

          <Divider />
          <HStack gap={2} hAlign="end">
            <Button variant="secondary" icon={<Icon icon="check" size="sm" />} label="Sync Now" onClick={() => alert('Syncing memory...')} />
            <Button variant="ghost" icon={<Icon icon="check" size="sm" />} label="Rebuild Index" onClick={() => alert('Rebuilding index...')} />
            <Button variant="ghost" icon={<Icon icon="check" size="sm" />} label="Clear All" onClick={() => alert('Clearing memory...')} />
          </HStack>
        </VStack>
      </SimpleCard>

      <SimpleCard variant="default">
        <SectionTitle>Security</SectionTitle>
        <VStack gap={3}>
          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Encrypt Memory</Text>
              <Text type="supporting" color="secondary">Encrypt vector memory at rest</Text>
            </VStack>
            <Switch label="Encrypt Memory" value={settings.encryptMemory} onChange={(checked: boolean) => handleChange('encryptMemory', checked)} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Audit Logging</Text>
              <Text type="supporting" color="secondary">Log all security events</Text>
            </VStack>
            <Switch label="Audit Logging" value={settings.auditLogging} onChange={(checked: boolean) => handleChange('auditLogging', checked)} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Require Authentication</Text>
              <Text type="supporting" color="secondary">Require login for UI access</Text>
            </VStack>
            <Switch label="Require Authentication" value={settings.requireAuth} onChange={(checked: boolean) => handleChange('requireAuth', checked)} />
          </HStack>

          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">Session Timeout (minutes)</Text>
              <Text type="supporting" color="secondary">Auto-logout after inactivity</Text>
            </VStack>
            <Slider label="Timeout" value={settings.sessionTimeout} onChange={(v: number) => handleChange('sessionTimeout', String(v))} min={5} max={480} step={5} />
          </HStack>

          <Divider />
          <HStack gap={3} hAlign="between" vAlign="center">
            <VStack gap={0.5} hAlign="start">
              <Text weight="medium">API Key</Text>
              <Text type="supporting" color="secondary">External API access key</Text>
            </VStack>
            <TextInput type="password" label="API Key" value={settings.apiKey} onChange={(v: string) => handleChange('apiKey', v)} placeholder="Enter API key" width={300} />
          </HStack>
          <HStack gap={2} hAlign="end">
            <Button variant="secondary" icon={<Icon icon="check" size="sm" />} label="Regenerate Key" onClick={() => alert('Generating new API key...')} />
          </HStack>
        </VStack>
      </SimpleCard>

      <SimpleCard variant="default">
        <SectionTitle>Advanced</SectionTitle>
        <VStack gap={4}>
          <SimpleCard variant="muted">
            <SectionTitle>Debug</SectionTitle>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Debug Mode</Text>
                <Text type="supporting" color="secondary">Enable debug logging and diagnostics</Text>
              </VStack>
              <Switch label="Debug Mode" value={settings.debugMode} onChange={(checked: boolean) => handleChange('debugMode', checked)} />
            </HStack>
          </SimpleCard>

          <SimpleCard variant="muted">
            <SectionTitle>Telemetry</SectionTitle>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Telemetry</Text>
                <Text type="supporting" color="secondary">Anonymous usage statistics</Text>
              </VStack>
              <Switch label="Telemetry" value={settings.telemetry} onChange={(checked: boolean) => handleChange('telemetry', checked)} />
            </HStack>
            <Text type="supporting" color="secondary">Telemetry helps improve Velvet OS by sending anonymous usage data. No personal information is collected.</Text>
          </SimpleCard>

          <SimpleCard variant="muted">
            <SectionTitle>Experimental Features</SectionTitle>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Experimental Features</Text>
                <Text type="supporting" color="secondary">Enable beta features (may be unstable)</Text>
              </VStack>
              <Switch label="Experimental Features" value={settings.experimentalFeatures} onChange={(checked: boolean) => handleChange('experimentalFeatures', checked)} />
            </HStack>
          </SimpleCard>

          <SimpleCard variant="muted">
            <SectionTitle>Performance</SectionTitle>
            <VStack gap={3}>
              <HStack gap={3} hAlign="between" vAlign="center">
                <VStack gap={0.5} hAlign="start">
                  <Text weight="medium">GPU Acceleration</Text>
                  <Text type="supporting" color="secondary">Use GPU for inference</Text>
                </VStack>
                <Switch label="GPU Acceleration" value={settings.gpuAcceleration} onChange={(checked: boolean) => handleChange('gpuAcceleration', checked)} />
              </HStack>
              <HStack gap={3} hAlign="between" vAlign="center">
                <VStack gap={0.5} hAlign="start">
                  <Text weight="medium">Max VRAM Usage (%)</Text>
                  <Text type="supporting" color="secondary">Limit VRAM consumption</Text>
                </VStack>
                <Slider label="VRAM Limit" value={settings.maxVramUsage} onChange={(v: number) => handleChange('maxVramUsage', String(v))} min={50} max={95} step={5} />
              </HStack>
              <HStack gap={3} hAlign="between" vAlign="center">
                <VStack gap={0.5} hAlign="start">
                  <Text weight="medium">Mixed Precision</Text>
                  <Text type="supporting" color="secondary">Use BF16/FP16 for training</Text>
                </VStack>
                <Switch label="Mixed Precision" value={true} onChange={() => {}} />
              </HStack>
              <HStack gap={3} hAlign="between" vAlign="center">
                <VStack gap={0.5} hAlign="start">
                  <Text weight="medium">Tensor Cores</Text>
                  <Text type="supporting" color="secondary">Enable tensor core acceleration</Text>
                </VStack>
                <Switch label="Tensor Cores" value={true} onChange={() => {}} />
              </HStack>
              <HStack gap={3} hAlign="between" vAlign="center">
                <VStack gap={0.5} hAlign="start">
                  <Text weight="medium">Flash Attention</Text>
                  <Text type="supporting" color="secondary">Optimized attention computation</Text>
                </VStack>
                <Switch label="Flash Attention" value={true} onChange={() => {}} />
              </HStack>
            </VStack>
          </SimpleCard>
        </VStack>
      </SimpleCard>
    </VStack>
  );
}

// ============================================
// VelvetApp Component - Main Entry Point
// ============================================
export function VelvetApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'check' },
    { id: 'terminal', label: 'Terminal', icon: 'upload' },
    { id: 'agents', label: 'Agents', icon: 'check' },
    { id: 'models', label: 'Models', icon: 'check' },
    { id: 'tools', label: 'Tools', icon: 'wrench' },
    { id: 'memory', label: 'Memory', icon: 'check' },
    { id: 'settings', label: 'Settings', icon: 'wrench' },
    { id: 'security', label: 'Security', icon: 'wrench' },
    { id: 'a2ui', label: 'A2UI Stream', icon: 'upload' },
    { id: 'exact', label: 'Exact Native', icon: 'check' },
    { id: 'elephant', label: 'Elephant Goldfish', icon: 'check' },
    { id: 'artex', label: 'ARTEX', icon: 'wrench' },
    { id: 'nethunter', label: 'Nethunter', icon: 'upload' },
    { id: 'dolphy', label: 'Dolphy', icon: 'check' },
    { id: 'flipper', label: 'Flipper Zero', icon: 'wrench' },
    { id: 'sapper', label: 'Sapper v2', icon: 'upload' },
    { id: 'competitor-models', label: 'Competitor Models', icon: 'check' },
    { id: 'native-build', label: 'Native Builds', icon: 'wrench' },
    { id: 'rea', label: 'REA / Craft Anything', icon: 'check' },
    { id: 'context7', label: 'Context7 API', icon: 'upload' },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <VelvetDashboard />;
      case 'terminal': return <VelvetTerminal />;
      case 'agents': return <VelvetAgentManager />;
      case 'models': return <VelvetModelManager />;
      case 'tools': return <VelvetToolIntegrator />;
      case 'memory': return <VelvetMemory />;
      case 'settings': return <VelvetSettings theme={theme} onThemeChange={setTheme} />;
      case 'security': return <SecurityToolsPanel />;
      case 'a2ui': return <A2uiAgentStream />;
      case 'exact': return <ExactNativePanel />;
      case 'elephant': return <ElephantGoldfishPanel />;
      case 'artex': return <ArtexDetailPanel />;
      case 'nethunter': return <NethunterDetailPanel />;
      case 'dolphy': return <DolphyDetailPanel />;
      case 'flipper': return <FlipperZeroDetailPanel />;
      case 'sapper': return <SapperDetailPanel />;
      case 'competitor-models': return <CompetitorModelsPanel />;
      case 'native-build': return <NativeBuildPanel />;
      case 'rea': return <ReaIntegrationPanel />;
      case 'context7': return <Context7Panel />;
      default: return <VelvetDashboard />;
    }
  };

  if (!isAuthenticated) {
    return <VelvetLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <VStack gap={0} style={{ minHeight: '100vh', background: 'var(--velvet-bg-primary)' }}>
      <HStack gap={3} hAlign="between" vAlign="center" style={{ borderBottom: '1px solid var(--velvet-border)', background: 'var(--velvet-bg-secondary)' }}>
        <HStack gap={3} vAlign="center">
          <Tooltip content="Toggle sidebar">
            <IconButton
              label="Toggle sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              size="lg"
              icon={<Icon icon={sidebarOpen ? 'chevronLeft' : 'chevronRight'} size="md" />}
            />
          </Tooltip>
          <Heading level={4} weight="semibold">Velvet OS</Heading>
        </HStack>
        <HStack gap={2} vAlign="center">
          <Switch label="Dark mode" value={theme === 'dark'} onChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')} />
          <Button variant="ghost" size="sm" icon={<Icon icon="check" size="sm" />} label="Logout" onClick={() => setIsAuthenticated(false)} />
        </HStack>
      </HStack>
      <HStack gap={0} style={{ flex: 1, minHeight: 'calc(100vh - 72px)' }}>
        <VStack style={{ background: 'var(--velvet-bg-secondary)', borderRight: '1px solid var(--velvet-border)', minHeight: 'calc(100vh - 72px)', transition: 'width 0.3s ease' }}>
          <nav style={{ padding: '16px 0' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {tabs.map((tab) => (
                <li key={tab.id} style={{ marginBottom: '4px' }}>
                  <Button
                    variant={activeTab === tab.id ? 'primary' : 'ghost'}
                    label={tab.label}
                    icon={<Icon icon={tab.icon as any} size="sm" />}
                    onClick={() => setActiveTab(tab.id as TabId)}
                    style={{ borderRadius: '0 8px 8px 0', padding: '12px 16px' }}
                    width="100%"
                  />
                </li>
              ))}
            </ul>
          </nav>
        </VStack>
        <VStack style={{ overflow: 'auto' }}>
          <Heading level={2}>{tabs.find(t => t.id === activeTab)?.label}</Heading>
          <Divider />
          {renderTabContent()}
        </VStack>
      </HStack>
    </VStack>
  );
}

export default VelvetApp;

// ============================================
// ARTEX Security Tool Detail Panel
// ============================================
function ArtexDetailPanel() {
  return (
    <Card variant="default">
      <SectionTitle>ARTEX - AI Autonomous Penetration Testing</SectionTitle>
      <VStack gap={4}>
        <SimpleCard variant="muted">
          <SectionTitle>Dual-Graph Architecture</SectionTitle>
          <VStack gap={3}>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Knowledge Graph</Text>
                <Text type="supporting" color="secondary">Maps target infrastructure, services, and vulnerabilities</Text>
              </VStack>
              <Badge label="Active" variant="success" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Attack Graph</Text>
                <Text type="supporting" color="secondary">Models exploit chains and post-exploitation paths</Text>
              </VStack>
              <Badge label="Active" variant="success" />
            </HStack>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Module Status (142 Modules)</SectionTitle>
          <HStack gap={3} wrap="wrap">
            <Badge label="reconnaissance" variant="neutral" />
            <Badge label="vulnerability-scanning" variant="neutral" />
            <Badge label="exploitation" variant="neutral" />
            <Badge label="post-exploitation" variant="neutral" />
            <Badge label="reporting" variant="neutral" />
            <Badge label="port-scan" variant="neutral" />
            <Badge label="service-enum" variant="neutral" />
            <Badge label="vuln-scan" variant="neutral" />
            <Badge label="exploit-validation" variant="neutral" />
          </HStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Configuration</SectionTitle>
          <VStack gap={2}>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Target Scope</Text><Text weight="medium">192.168.1.0/24</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Aggressiveness</Text><Text weight="medium">medium</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Stealth</Text><Text weight="medium">enabled</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Reporting</Text><Text weight="medium">detailed</Text></HStack>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Recent Activity</SectionTitle>
          <VStack gap={2}>
            <Text type="code" color="secondary">[09:12] Port scan complete: 23 open ports</Text>
            <Text type="code" color="secondary">[09:15] Service enumeration: SSH, HTTP, RDP</Text>
            <Text type="code" color="secondary">[09:18] Vulnerability scan: 4 critical, 12 high, 28 medium</Text>
            <Text type="code" color="secondary">[09:20] Exploit validation: 3 confirmed</Text>
          </VStack>
        </SimpleCard>
      </VStack>
    </Card>
  );
}

// ============================================
// Nethunter Detail Panel
// ============================================
function NethunterDetailPanel() {
  return (
    <Card variant="default">
      <SectionTitle>Kali Nethunter - Mobile Penetration Testing</SectionTitle>
      <VStack gap={4}>
        <SimpleCard variant="muted">
          <SectionTitle>Mobile Platform</SectionTitle>
          <VStack gap={3}>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Platform</Text>
                <Text type="supporting" color="secondary">Android</Text>
              </VStack>
              <Badge label="Tablet Mode" variant="neutral" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Version</Text>
                <Text type="supporting" color="secondary">2024.4</Text>
              </VStack>
              <Badge label="67 Modules" variant="neutral" />
            </HStack>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Capabilities</SectionTitle>
          <HStack gap={2} wrap="wrap">
            <Badge label="mobile-pentest" variant="neutral" />
            <Badge label="wifi-testing" variant="neutral" />
            <Badge label="bluetooth" variant="neutral" />
            <Badge label="nfc" variant="neutral" />
            <Badge label="usb-otg" variant="neutral" />
            <Badge label="wifi-pentest" variant="neutral" />
            <Badge label="bluetooth-pentest" variant="neutral" />
            <Badge label="nfc-pentest" variant="neutral" />
          </HStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Configuration</SectionTitle>
          <VStack gap={2}>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Device Mode</Text><Text weight="medium">tablet</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Auto Update</Text><Text weight="medium">enabled</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">VNC Enabled</Text><Text weight="medium">disabled</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Chroot Path</Text><Text weight="medium" style={{ fontFamily: 'monospace' }}>/data/local/nh</Text></HStack>
          </VStack>
        </SimpleCard>
      </VStack>
    </Card>
  );
}

// ============================================
// Dolphy Detail Panel
// ============================================
function DolphyDetailPanel() {
  return (
    <Card variant="default">
      <SectionTitle>Dolphy - AI Model Framework</SectionTitle>
      <VStack gap={4}>
        <SimpleCard variant="muted">
          <SectionTitle>Framework Status</SectionTitle>
          <VStack gap={3}>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Version</Text>
                <Text type="supporting" color="secondary">1.8.0</Text>
              </VStack>
              <Badge label="Training" variant="warning" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Modules</Text>
                <Text type="supporting" color="secondary">89</Text>
              </VStack>
              <Badge label="Uncensored Models" variant="neutral" />
            </HStack>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Capabilities</SectionTitle>
          <HStack gap={2} wrap="wrap">
            <Badge label="model-training" variant="neutral" />
            <Badge label="weight-generation" variant="neutral" />
            <Badge label="local-inference" variant="neutral" />
            <Badge label="multi-model" variant="neutral" />
            <Badge label="custom-training" variant="neutral" />
            <Badge label="rsi" variant="neutral" />
            <Badge label="agi-weights" variant="neutral" />
            <Badge label="edge-deployment" variant="neutral" />
          </HStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Configuration</SectionTitle>
          <VStack gap={2}>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Default Model</Text><Text weight="medium">Needle3</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Training Epochs</Text><Text weight="medium">100</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Batch Size</Text><Text weight="medium">32</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Precision</Text><Text weight="medium">bf16</Text></HStack>
          </VStack>
        </SimpleCard>
      </VStack>
    </Card>
  );
}

// ============================================
// Flipper Zero Detail Panel
// ============================================
function FlipperZeroDetailPanel() {
  return (
    <Card variant="default">
      <SectionTitle>Flipper Zero - Hardware Hacking</SectionTitle>
      <VStack gap={4}>
        <SimpleCard variant="muted">
          <SectionTitle>Hardware Capabilities</SectionTitle>
          <VStack gap={3}>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Sub-GHz RFID</Text>
                <Text type="supporting" color="secondary">Reader/Writer/Emulator</Text>
              </VStack>
              <Badge label="Active" variant="success" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">NFC</Text>
                <Text type="supporting" color="secondary">Read/Write/Emulate</Text>
              </VStack>
              <Badge label="Active" variant="success" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">GPIO Pins</Text>
                <Text type="supporting" color="secondary">Hardware Hacking</Text>
              </VStack>
              <Badge label="Active" variant="success" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Infrared</Text>
                <Text type="supporting" color="secondary">Transmitter/Receiver</Text>
              </VStack>
              <Badge label="Active" variant="success" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Bluetooth</Text>
                <Text type="supporting" color="secondary">Wireless Communication</Text>
              </VStack>
              <Badge label="Active" variant="success" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">BadUSB</Text>
                <Text type="supporting" color="secondary">USB Attack Vector</Text>
              </VStack>
              <Badge label="Active" variant="success" />
            </HStack>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Configuration</SectionTitle>
          <VStack gap={2}>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Frequency</Text><Text weight="medium">433MHz</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Protocol</Text><Text weight="medium">FAP</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">BT Enabled</Text><Text weight="medium">true</Text></HStack>
          </VStack>
        </SimpleCard>
      </VStack>
    </Card>
  );
}

// ============================================
// Sapper v2 Detail Panel
// ============================================
function SapperDetailPanel() {
  return (
    <Card variant="default">
      <SectionTitle>Sapper v2 - Agent Orchestration</SectionTitle>
      <VStack gap={4}>
        <SimpleCard variant="muted">
          <SectionTitle>Framework Status</SectionTitle>
          <VStack gap={3}>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Version</Text>
                <Text type="supporting" color="secondary">2.0.0</Text>
              </VStack>
              <Badge label="Active" variant="success" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Modules</Text>
                <Text type="supporting" color="secondary">23</Text>
              </VStack>
              <Badge label="Model-Agnostic" variant="neutral" />
            </HStack>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Capabilities</SectionTitle>
          <HStack gap={2} wrap="wrap">
            <Badge label="agent-coordination" variant="neutral" />
            <Badge label="tool-use" variant="neutral" />
            <Badge label="function-calling" variant="neutral" />
            <Badge label="multi-agent" variant="neutral" />
            <Badge label="model-agnostic" variant="neutral" />
          </HStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Configuration</SectionTitle>
          <VStack gap={2}>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Max Agents</Text><Text weight="medium">10</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Coordination Mode</Text><Text weight="medium">parallel</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Model Provider</Text><Text weight="medium">auto</Text></HStack>
          </VStack>
        </SimpleCard>
      </VStack>
    </Card>
  );
}

// ============================================
// Competitor Models Detail Panel
// ============================================
function CompetitorModelsPanel() {
  const models = [
    { id: 'claude-code', name: 'Claude Code', provider: 'Anthropic', type: 'Agentic Coding', status: 'loaded', capabilities: ['terminal', 'git', 'file-ops', 'multi-file-edit', 'testing'], lastUsed: '2 min ago' },
    { id: 'codex', name: 'Codex CLI', provider: 'OpenAI', type: 'Coding Agent', status: 'loaded', capabilities: ['code-gen', 'completion', 'explanation', 'ide-integration'], lastUsed: '5 min ago' },
    { id: 'grok', name: 'Grok', provider: 'xAI', type: 'Multi-Agent Reasoning', status: 'loaded', capabilities: ['multi-agent', 'web-search', 'x-search', 'image-gen', 'video-gen', 'voice', 'code'], lastUsed: '10 min ago' },
    { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', type: 'Reasoning', status: 'loaded', capabilities: ['chain-of-thought', 'reasoning', 'math', 'code'], lastUsed: '15 min ago' },
    { id: 'hermes-3', name: 'Hermes 3', provider: 'Nous Research', type: 'Open-Weight', status: 'loaded', capabilities: ['function-calling', 'json-mode', 'roleplaying', 'conversational'], lastUsed: '20 min ago' },
    { id: 'opus', name: 'Claude Opus 5.5', provider: 'Anthropic', type: 'Complex Reasoning', status: 'queued', capabilities: ['complex-reasoning', 'advanced-coding', 'deep-analysis', 'multimodal'], lastUsed: 'Never' },
    { id: 'kimi', name: 'Kimi 1.5', provider: 'Moonshot AI', type: 'Long Context', status: 'training', capabilities: ['long-context', 'multimodal', 'document-processing', 'web-search'], lastUsed: '30 min ago' },
    { id: 'muse', name: 'Muse', provider: 'Microsoft Research', type: 'Game Generation', status: 'idle', capabilities: ['gameplay-video', 'controller-prediction', 'game-state'], lastUsed: '1 hour ago' },
    { id: 'fable', name: 'Fable', provider: 'Fable Simulation', type: 'World Simulation', status: 'idle', capabilities: ['character-simulation', 'narrative-modeling', 'showrunner-ai'], lastUsed: '2 hours ago' },
  ];

  return (
    <Card variant="default">
      <SectionTitle>Competitor Model Integration</SectionTitle>
      <VStack gap={4}>
        {models.map((model) => (
          <SimpleCard key={model.id} variant="default" width={280}>
            <HStack gap={3} hAlign="between" vAlign="start">
              <VStack gap={0.5} hAlign="start">
                <Text weight="semibold">{model.name}</Text>
                <Text type="supporting" color="secondary">{model.provider} • {model.type}</Text>
              </VStack>
              <Badge label={model.status} variant={model.status === 'loaded' ? 'success' : model.status === 'training' ? 'warning' : 'neutral'} />
            </HStack>
            <VStack gap={2}>
              <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Parameters</Text><Text weight="medium">{model.capabilities.join(', ')}</Text></HStack>
              <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Last Used</Text><Text weight="medium" style={{ fontFamily: 'monospace' }}>{model.lastUsed}</Text></HStack>
            </VStack>
          </SimpleCard>
        ))}
      </VStack>
    </Card>
  );
}

// ============================================
// Native Build Configuration Panel
// ============================================
function NativeBuildPanel() {
  const platforms = [
    { id: 'web', name: 'Web (PWA)', status: 'ready', icon: 'upload' },
    { id: 'ios', name: 'iOS', status: 'pending', icon: 'upload' },
    { id: 'macos', name: 'macOS', status: 'pending', icon: 'upload' },
    { id: 'android', name: 'Android', status: 'pending', icon: 'upload' },
    { id: 'linux', name: 'Linux', status: 'pending', icon: 'upload' },
    { id: 'windows', name: 'Windows', status: 'pending', icon: 'upload' },
  ];

  return (
    <Card variant="default">
      <SectionTitle>Native Platform Builds</SectionTitle>
      <VStack gap={4}>
        <SimpleCard variant="muted">
          <SectionTitle>Build Status</SectionTitle>
          <VStack gap={3}>
            {platforms.map((platform) => (
              <HStack key={platform.id} gap={3} hAlign="between" vAlign="center">
                <Text weight="medium">{platform.name}</Text>
                <Badge label={platform.status} variant={platform.status === 'ready' ? 'success' : 'neutral'} />
              </HStack>
            ))}
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Exact Framework Configuration</SectionTitle>
          <VStack gap={2}>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Contract UI</Text><Text weight="medium">Enabled</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Agent-Native</Text><Text weight="medium">Enabled</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Deterministic Time</Text><Text weight="medium">Enabled</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">No WebViews</Text><Text weight="medium">Enabled</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">60+ First-Party Packages</Text><Text weight="medium">Available</Text></HStack>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Target Platforms</SectionTitle>
          <HStack gap={2} wrap="wrap">
            <Badge label="PWA (Web)" variant="neutral" />
            <Badge label="iOS (Swift)" variant="neutral" />
            <Badge label="macOS (AppKit)" variant="neutral" />
            <Badge label="Android (Kotlin)" variant="neutral" />
            <Badge label="Linux (Rust)" variant="neutral" />
            <Badge label="Windows (DirectX 11)" variant="neutral" />
          </HStack>
        </SimpleCard>
      </VStack>
    </Card>
  );
}

// ============================================
// REA / Craft Anything Integration Panel
// ============================================
function ReaIntegrationPanel() {
  return (
    <Card variant="default">
      <SectionTitle>REA / Craft Anything - Reverse Engineering</SectionTitle>
      <VStack gap={4}>
        <SimpleCard variant="muted">
          <SectionTitle>Integrated Tools</SectionTitle>
          <VStack gap={3}>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">REA (Reverse Engineering Analysis)</Text>
                <Text type="supporting" color="secondary">Binary analysis, Ghidra, Hopper, Rizin, Cutter</Text>
              </VStack>
              <Badge label="Integrated" variant="success" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Craft Anything</Text>
                <Text type="supporting" color="secondary">Custom tool and skill creation</Text>
              </VStack>
              <Badge label="Integrated" variant="success" />
            </HStack>
            <HStack gap={3} hAlign="between" vAlign="center">
              <VStack gap={0.5} hAlign="start">
                <Text weight="medium">Ghostman</Text>
                <Text type="supporting" color="secondary">Stealth operations framework</Text>
              </VStack>
              <Badge label="Integrated" variant="success" />
            </HStack>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Target Applications</SectionTitle>
          <HStack gap={2} wrap="wrap">
            <Badge label="Nethunter" variant="neutral" />
            <Badge label="Jarvis" variant="neutral" />
            <Badge label="ARTEX" variant="neutral" />
            <Badge label="Needle" variant="neutral" />
            <Badge label="Dolphy" variant="neutral" />
          </HStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Reverse Engineering Capabilities</SectionTitle>
          <VStack gap={2}>
            <Text type="code" color="secondary">• Binary analysis with Ghidra</Text>
            <Text type="code" color="secondary">• Hopper disassembly</Text>
            <Text type="code" color="secondary">• Rizin debugger integration</Text>
            <Text type="code" color="secondary">• Cutter GUI support</Text>
            <Text type="code" color="secondary">• JavaScript application analysis</Text>
            <Text type="code" color="secondary">• CDP web page inspection</Text>
            <Text type="code" color="secondary">• Frida instrumentation</Text>
            <Text type="code" color="secondary">• ADB device management</Text>
          </VStack>
        </SimpleCard>
      </VStack>
    </Card>
  );
}

// ============================================
// Context7 API Integration Panel
// ============================================
function Context7Panel() {
  return (
    <Card variant="default">
      <SectionTitle>Context7 API - Documentation Lookup</SectionTitle>
      <VStack gap={4}>
        <SimpleCard variant="muted">
          <SectionTitle>Configuration</SectionTitle>
          <VStack gap={2}>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">API Endpoint</Text><Text weight="medium" style={{ fontFamily: 'monospace' }}>context7.com</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Status</Text><Text weight="medium">Active</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Usage</Text><Text weight="medium">Permanent</Text></HStack>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Capabilities</SectionTitle>
          <VStack gap={2}>
            <Text type="code" color="secondary">• Documentation lookup</Text>
            <Text type="code" color="secondary">• Library documentation retrieval</Text>
            <Text type="code" color="secondary">• Version-specific docs</Text>
            <Text type="code" color="secondary">• Code examples</Text>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Integrated Repositories</SectionTitle>
          <VStack gap={2}>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Astryx</Text><Text weight="medium">Documented</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">A2UI</Text><Text weight="medium">Documented</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Infinity</Text><Text weight="medium">Documented</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Exact</Text><Text weight="medium">Documented</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Elephant Goldfish</Text><Text weight="medium">Documented</Text></HStack>
          </VStack>
        </SimpleCard>
      </VStack>
    </Card>
  );
}

// ============================================
// VelvetLogin Component - Astryx-based authentication
// ============================================
export function VelvetLogin({ onLogin }: { onLogin: () => void }) {
  return (
    <Card variant="default">
      <SectionTitle>Velvet Login</SectionTitle>
      <VStack gap={4}>
        <SimpleCard variant="muted">
          <SectionTitle>Authentication</SectionTitle>
          <VStack gap={2}>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Status</Text><Text weight="medium">Not authenticated</Text></HStack>
            <HStack gap={2} hAlign="between"><Text type="supporting" color="secondary">Provider</Text><Text weight="medium">Astryx</Text></HStack>
          </VStack>
        </SimpleCard>

        <SimpleCard variant="muted">
          <SectionTitle>Action</SectionTitle>
          <VStack gap={2}>
            <Button variant="primary" onClick={() => onLogin()} label="Sign In" />
          </VStack>
        </SimpleCard>
      </VStack>
    </Card>
  );
}
