/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

export const projectTools = [
  {
    name: 'projects_list',
    description: 'List all projects for a given client.',
    inputSchema: { clientId: z.string().describe('Client ID to filter projects by') },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, '/api/projects', { clientId: args.clientId }),
  },
  {
    name: 'projects_get',
    description: 'Get details of a single project.',
    inputSchema: { projectId: z.string() },
    handler: async (apiKey, args) => appClient.get(apiKey, `/api/projects/${args.projectId}`),
  },
  /*
  {
    name: 'projects_get_times',
    description: 'Get time entries logged against a project.',
    inputSchema: { projectId: z.string() },
    handler: async (apiKey, args) => appClient.get(apiKey, `/api/projects/${args.projectId}/times`),
  },
  {
    name: 'projects_history',
    description: 'Get recently created projects for the authenticated user.',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/projects/history'),
  },
  */
  {
    name: 'projects_create',
    description: 'Create a new project.',
    inputSchema: {
      name: z.string().describe('Project name'),
      clientId: z.string().describe('Client to associate this project with'),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/projects', { name: args.name, clientId: args.clientId }),
  },
  {
    name: 'projects_update',
    description: "Update a project's details.",
    inputSchema: {
      projectId: z.string(),
      name: z.string().optional(),
      clientId: z.string().optional(),
    },
    handler: async (apiKey, args) => {
      const { projectId, ...body } = args;
      return appClient.put(apiKey, `/api/projects/${projectId}`, body);
    },
  },
  {
    name: 'projects_delete',
    description: 'Delete a project.',
    inputSchema: { projectId: z.string() },
    handler: async (apiKey, args) => appClient.delete(apiKey, `/api/projects/${args.projectId}`),
  },
];
