/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

export const projectTools = [
  {
    name: 'projects_list',
    description: 'List all projects for a given client. Requires the "catalog" permission.',
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
  {
    name: 'projects_autocomplete',
    description: 'Search projects by name substring. Returns up to 15 matching projects with their _id and name. Useful for resolving a project name to an ID.',
    inputSchema: { q: z.string().describe('Search string') },
    handler: async (apiKey, args) => appClient.get(apiKey, '/api/autocomplete/projects', { q: args.q }),
  },
  {
    name: 'projects_create',
    description: 'Create a new project. Requires the "projectsEdit" permission.',
    inputSchema: {
      name: z.string().describe('Project name'),
      clientId: z.string().describe('Client to associate this project with'),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/projects/insert', { name: args.name, clientId: args.clientId }),
  },
  {
    name: 'projects_update',
    description: "Update a project's details. Partial update: provide projectId plus only the fields you want to change; any field you omit is left unchanged. Requires the \"projectsEdit\" permission.",
    inputSchema: {
      projectId: z.string(),
      name: z.string().min(2).optional().describe('Project name (min 2 characters)'),
      clientId: z.string().optional().describe('Client this project belongs to'),
      taskGroupIds: z.array(z.string()).optional().describe('Task group IDs assigned to this project'),
      useTaskTypes: z.boolean().optional().describe('Whether a taskType is expected on entries for this project'),
      reminder: z.string().optional(),
    },
    handler: async (apiKey, args) => {
      const { projectId, ...body } = args;
      return appClient.put(apiKey, `/api/projects/${projectId}/update`, body);
    },
  },
  {
    name: 'projects_delete',
    description: 'Delete a project. Requires the "projectsEdit" permission.',
    inputSchema: { projectId: z.string() },
    handler: async (apiKey, args) => appClient.delete(apiKey, `/api/projects/${args.projectId}/delete`),
  },
];
