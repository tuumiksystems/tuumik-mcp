/* Copyright (C) 2026 Tuumik Systems OÜ */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';

import { generalTools } from './tools/general.js';
import { timeTools } from './tools/times.js';
import { clientTools } from './tools/clients.js';
import { projectTools } from './tools/projects.js';
import { inoutTools } from './tools/inout.js';
import { taskGroupTools } from './tools/taskgroups.js';
import { userTools } from './tools/users.js';
import { timesheetExplorerTools } from './tools/timesheet-explorer.js';
import { DATA_MODEL } from './resources/data-model.js';

const PORT = process.env.PORT || 3100;

const allTools = [
  ...generalTools,
  ...timeTools,
  ...clientTools,
  ...projectTools,
  ...inoutTools,
  ...taskGroupTools,
  ...userTools,
  ...timesheetExplorerTools,
];

function createServer() {
  const server = new McpServer(
    { name: 'tuumik', version: '1.0.3' },
    { instructions: 'At the start of every session, before calling any other tool, call session_init. It loads the current user\'s profile, role and permissions, and the tenant\'s settings (date/time formats, in/out options, teams, exporters, etc.), which are needed to interpret the data and permissions used by the other tools.' },
  );

  server.resource(
    'data-model',
    'docs://data-model',
    { description: 'Describes the two tracking types (billable times and in/out board), their collections, field schemas, and which tools query each.' },
    async () => ({
      contents: [{ uri: 'docs://data-model', text: DATA_MODEL, mimeType: 'text/plain' }],
    }),
  );

  for (const tool of allTools) {
    server.registerTool(
      tool.name,
      { description: tool.description, inputSchema: tool.inputSchema },
      async (args, extra) => {
        const rawKey = extra.requestInfo?.headers?.['x-api-key'];
        const apiKey = Array.isArray(rawKey) ? rawKey[0] : rawKey;

        if (!apiKey) {
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: 'Missing x-api-key header' }) }],
            isError: true,
          };
        }

        try {
          const result = await tool.handler(apiKey, args);
          return { content: [{ type: 'text', text: JSON.stringify(result) }] };
        } catch (err) {
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: err.message }) }],
            isError: true,
          };
        }
      },
    );
  }

  return server;
}

// host: '0.0.0.0' disables the localhost-only DNS rebinding protection
// so the container is reachable from outside.
const app = createMcpExpressApp({ host: '0.0.0.0' });

app.post('/mcp', async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
  res.on('close', () => { transport.close(); server.close(); });
});

// GET and DELETE are not used in stateless mode but must return proper errors.
app.get('/mcp', (_req, res) => {
  res.status(405).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed' }, id: null });
});
app.delete('/mcp', (_req, res) => {
  res.status(405).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed' }, id: null });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/hello', (req, res) => {
  res.send('Tuumik MCP')
});

app.listen(PORT, () => {
  console.log(`Tuumik MCP server listening on port ${PORT}`);
});

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
