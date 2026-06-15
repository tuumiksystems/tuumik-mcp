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
    description: "Update a project's details. This is a full replacement — all fields must be provided. Call projects_get first to read the current values, then send the full document with your changes applied. Requires the \"projectsEdit\" permission.",
    inputSchema: {
      projectId: z.string(),
      name: z.string().min(2),
      clientId: z.string(),
      taskGroupIds: z.array(z.string()),
      useTaskTypes: z.boolean(),
      reminder: z.string(),
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
