import React from 'react';
import { Box, Button, Card, Text, Heading, HStack, VStack, Badge } from '@astryxdesign/core';
import { reaIntegration } from './rea-integration';
import { fridaIntegration } from './frida-integration';
import { qemuIntegration } from './qemu-integration';
import { binaryPatcher } from './binary-patching';
export function ReaDashboard() {
  const [analyses, setAnalyses] = React.useState<any[]>([]);
  const [binaryPath, setBinaryPath] = React.useState('');
  const [devices, setDevices] = React.useState<any[]>([]);
  const [vms, setVms] = React.useState<any[]>([]);
  React.useEffect(() => { setAnalyses(reaIntegration.getAnalyses()); fridaIntegration.listDevices().then(setDevices); qemuIntegration.getVms().then(setVms); }, []);
  const handleAnalyze = async () => { if (!binaryPath) return; const result = await reaIntegration.analyzeBinary(binaryPath); setAnalyses([...reaIntegration.getAnalyses(), result]); };
  return (
    <Box p={4}>
      <Heading size='lg'>REA Reverse Engineering Dashboard</Heading>
      <VStack gap={4}>
        <Card p={4}>
          <Heading size='md'>Binary Analysis</Heading>
          <HStack gap={2}>
            <TextInput placeholder='Binary path' value={binaryPath} onChange={(e) => setBinaryPath(e.target.value)} flex={1} />
            <Button onClick={handleAnalyze}>Analyze</Button>
          </HStack>
          <div>{analyses.map((a: any) => (
            <div key={a.binary.id} style={{ marginBottom: 10 }}>
              <Text>{a.binary.path}</Text>
              <Text small>{a.binary.format} / {a.binary.architecture}</Text>
            </div>
          ))}</div>
        </Card>
        <Card p={4}>
          <Heading size='md'>Frida Devices</Heading>
          <div>{devices.map((d: any) => <div key={d.id}>{d.name} ({d.type})</div>)}</div>
        </Card>
        <Card p={4}>
          <Heading size='md'>QEMU VMs</Heading>
          <div>{vms.map((vm: any) => <div key={vm.id}>{vm.name} ({vm.arch})</div>)}</div>
        </Card>
      </VStack>
    </Box>
  );
}
export default ReaDashboard;
