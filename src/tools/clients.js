/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

export const clientTools = [
  {
    name: 'clients_list',
    description: 'List all clients visible to the authenticated user.',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/clients'),
  },
  {
    name: 'clients_get',
    description: 'Get details of a single client.',
    inputSchema: { clientId: z.string() },
    handler: async (apiKey, args) => appClient.get(apiKey, `/api/clients/${args.clientId}`),
  },
  {
    name: 'clients_get_projects',
    description: 'Get all projects belonging to a client.',
    inputSchema: { clientId: z.string() },
    handler: async (apiKey, args) => appClient.get(apiKey, `/api/clients/${args.clientId}/projects`),
  },
  /*
  {
    name: 'clients_get_times',
    description: 'Get time entries logged against a client.',
    inputSchema: { clientId: z.string() },
    handler: async (apiKey, args) => appClient.get(apiKey, `/api/clients/${args.clientId}/times`),
  },
  {
    name: 'clients_history',
    description: 'Get recently created clients for the authenticated user.',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/clients/history'),
  },
  */
  {
    name: 'clients_create',
    description: 'Create a new client.',
    inputSchema: { name: z.string().describe('Client name') },
    handler: async (apiKey, args) => appClient.post(apiKey, '/api/clients', { name: args.name }),
  },
  {
    name: 'clients_update',
    description: "Update a client's details.",
    inputSchema: {
      clientId: z.string(),
      name: z.string().optional(),
    },
    handler: async (apiKey, args) => {
      const { clientId, ...body } = args;
      return appClient.put(apiKey, `/api/clients/${clientId}`, body);
    },
  },
  {
    name: 'clients_delete',
    description: 'Delete a client.',
    inputSchema: { clientId: z.string() },
    handler: async (apiKey, args) => appClient.delete(apiKey, `/api/clients/${args.clientId}`),
  },
];
