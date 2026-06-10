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
  {
    name: 'clients_autocomplete',
    description: 'Search clients by name substring. Returns up to 15 matching clients with their _id and name. Useful for resolving a client name to an ID.',
    inputSchema: { q: z.string().describe('Search string') },
    handler: async (apiKey, args) => appClient.get(apiKey, '/api/autocomplete/clients', { q: args.q }),
  },
  {
    name: 'clients_create',
    description: 'Create a new client.',
    inputSchema: { name: z.string().describe('Client name') },
    handler: async (apiKey, args) => appClient.post(apiKey, '/api/clients/insert', { name: args.name }),
  },
  {
    name: 'clients_update',
    description: "Update a client's details. This is a full replacement — all fields must be provided. Call clients_get first to read the current values, then send the full document with your changes applied.",
    inputSchema: {
      clientId: z.string(),
      name: z.string().min(2),
      reminder: z.string(),
      tel: z.string().optional(),
      email: z.string().optional(),
      address: z.string().optional(),
    },
    handler: async (apiKey, args) => {
      const { clientId, ...body } = args;
      return appClient.put(apiKey, `/api/clients/${clientId}/update`, body);
    },
  },
  {
    name: 'clients_delete',
    description: 'Delete a client.',
    inputSchema: { clientId: z.string() },
    handler: async (apiKey, args) => appClient.delete(apiKey, `/api/clients/${args.clientId}/delete`),
  },
];
