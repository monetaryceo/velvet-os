import React from 'react';
import { Box, Button, Card, Text, Heading, HStack, VStack, Badge } from '@astryxdesign/core';
import { elephantGoldfishIntegration } from './elephant-goldfish-integration';
export function ElephantDashboard() {
  const [context, setContext] = React.useState('');
  const [workflow, setWorkflow] = React.useState<any[]>([]);
  const [episodes, setEpisodes] = React.useState<any[]>([]);
  const handleWorkflow = async () => { if (!context) return; const result = await elephantGoldfishIntegration.runWorkflow(context); setWorkflow(result); setEpisodes(elephantGoldfishIntegration.getEpisodes().slice(0, 10)); };
  return (
    <Box p={4}>
      <Heading size='lg'>Elephant Goldfish Dashboard</Heading>
      <VStack gap={4}>
        <Card p={4}>
          <Heading size='md'>Workflow</Heading>
          <HStack gap={2}>
            <TextInput placeholder='Enter context...' value={context} onChange={(e) => setContext(e.target.value)} flex={1} />
            <Button onClick={handleWorkflow}>Run Workflow</Button>
          </HStack>
          <div>{workflow.map((s: any) => (
            <div key={s.skillId} style={{ marginBottom: 8 }}>
              <Badge>{s.type}</Badge>
              <Text small>{JSON.stringify(s.output).slice(0, 100)}...</Text>
            </div>
          ))}</div>
        </Card>
        <Card p={4}>
          <Heading size='md'>Recent Episodes</Heading>
          <div>{episodes.map((e: any) => (
            <div key={e.id} style={{ marginBottom: 6 }}>
              <Text>{e.type}</Text>
              <Text small>{new Date(e.timestamp).toLocaleTimeString()}</Text>
            </div>
          ))}</div>
        </Card>
      </VStack>
    </Box>
  );
}
export default ElephantDashboard;
