/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

export const timeTools = [
  {
    name: 'times_create',
    description: 'Create a new time entry for the authenticated user on a given date.',
    inputSchema: {
      date: z.string().describe('Date in YYYY-MM-DD format'),
      startMinute: z.number().describe('Start time as minutes from midnight (0–1439)'),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/times', { date: args.date, startMinute: args.startMinute }),
  },
  /*
  {
    name: 'times_copy',
    description: 'Copy an existing time entry to a new start minute on the same date.',
    inputSchema: {
      id: z.string().describe('ID of the time entry to copy'),
      startMinute: z.number().describe('Start minute for the new copy'),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, `/api/times/${args.id}/copy`, { startMinute: args.startMinute }),
  },
  */
  {
    name: 'times_delete',
    description: 'Delete a time entry.',
    inputSchema: {
      id: z.string().describe('ID of the time entry to delete'),
    },
    handler: async (apiKey, args) =>
      appClient.delete(apiKey, `/api/times/${args.id}`),
  },
  {
    name: 'times_set_plan',
    description: 'Set the plan text on a time entry.',
    inputSchema: {
      id: z.string(),
      plan: z.string().describe('Plan text'),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/times/${args.id}/plan`, { plan: args.plan }),
  },
  {
    name: 'times_set_timing',
    description: 'Adjust the timing of a time entry. Provide startMinute only to resize the top, endMinute only to resize the bottom, both to set exact start and end, or startMinute with move:true to shift the whole entry.',
    inputSchema: {
      id: z.string(),
      startMinute: z.number().optional(),
      endMinute: z.number().optional(),
      move: z.boolean().optional().describe('If true, shift the entry while preserving its duration'),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/times/${args.id}/timing`, {
        startMinute: args.startMinute,
        endMinute: args.endMinute,
        move: args.move,
      }),
  },
  {
    name: 'times_set_project',
    description: 'Set, clear the project, or clear both client and project on a time entry.',
    inputSchema: {
      id: z.string(),
      projectId: z.string().optional().describe('Project ID to assign'),
      clearProject: z.boolean().optional().describe('If true, remove the project but keep the client'),
      clearAll: z.boolean().optional().describe('If true, remove both client and project'),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/times/${args.id}/project`, {
        projectId: args.projectId,
        clearProject: args.clearProject,
        clearAll: args.clearAll,
      }),
  },
  {
    name: 'times_set_client',
    description: 'Set or clear the client on a time entry.',
    inputSchema: {
      id: z.string(),
      clientId: z.string().optional().describe('Client ID to assign'),
      clear: z.boolean().optional().describe('If true, remove the client (and project)'),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/times/${args.id}/client`, {
        clientId: args.clientId,
        clear: args.clear,
      }),
  },
  {
    name: 'times_set_task',
    description: 'Set task fields on a time entry. Only include fields you want to change.',
    inputSchema: {
      id: z.string(),
      taskDesc: z.string().optional().describe('Task description'),
      taskType: z.string().optional().describe('Task type identifier'),
      intCom: z.string().optional().describe('Internal comment'),
      hideHistory: z.boolean().optional().describe('Hide this entry from history suggestions'),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/times/${args.id}/task`, {
        taskDesc: args.taskDesc,
        taskType: args.taskType,
        intCom: args.intCom,
        hideHistory: args.hideHistory,
      }),
  },
  /*
  {
    name: 'times_fill',
    description: 'Fill a time entry from history data (project, task type, task description).',
    inputSchema: {
      id: z.string(),
      projectId: z.string().optional(),
      taskType: z.string().optional(),
      taskDesc: z.string().optional(),
      useTaskType: z.boolean().optional(),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/times/${args.id}/fill`, {
        projectId: args.projectId,
        taskType: args.taskType,
        taskDesc: args.taskDesc,
        useTaskType: args.useTaskType,
      }),
  },
  */
  {
    name: 'times_set_date',
    description: 'Move a time entry to a different date.',
    inputSchema: {
      id: z.string(),
      date: z.string().describe('New date in YYYY-MM-DD format'),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/times/${args.id}/date`, { date: args.date }),
  },
  {
    name: 'times_recent',
    description: 'Get recent time entries for the authenticated user.',
    inputSchema: {
      cutoff: z.string().optional().describe('How far back to look, e.g. "10days" or "30days". Defaults to "10days".'),
    },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, '/api/times/recent', { cutoff: args.cutoff }),
  },
  /*
  {
    name: 'times_history_self',
    description: 'Get time history for the authenticated user.',
    inputSchema: {
      excludeTimeId: z.string().optional().describe('Exclude a specific time entry ID from results'),
      limit: z.number().optional().describe('Max results (default 50, max 200)'),
    },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, '/api/times/history/self', { excludeTimeId: args.excludeTimeId, limit: args.limit }),
  },
  {
    name: 'times_history_project_self',
    description: "Get the authenticated user's time history scoped to a specific project.",
    inputSchema: {
      projectId: z.string(),
      excludeTimeId: z.string().optional(),
      limit: z.number().optional(),
    },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, `/api/times/history/project/${args.projectId}/self`, {
        excludeTimeId: args.excludeTimeId,
        limit: args.limit,
      }),
  },
  {
    name: 'times_history_project_others',
    description: 'Get time history of other team members scoped to a specific project.',
    inputSchema: {
      projectId: z.string(),
      limit: z.number().optional(),
    },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, `/api/times/history/project/${args.projectId}/others`, { limit: args.limit }),
  },
  {
    name: 'times_history_client_self',
    description: "Get the authenticated user's time history scoped to a specific client.",
    inputSchema: {
      clientId: z.string(),
      excludeTimeId: z.string().optional(),
      limit: z.number().optional(),
    },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, `/api/times/history/client/${args.clientId}/self`, {
        excludeTimeId: args.excludeTimeId,
        limit: args.limit,
      }),
  },
  {
    name: 'times_history_client_others',
    description: 'Get time history of other team members scoped to a specific client.',
    inputSchema: {
      clientId: z.string(),
      limit: z.number().optional(),
    },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, `/api/times/history/client/${args.clientId}/others`, { limit: args.limit }),
  },
  {
    name: 'times_history_search',
    description: 'Search time history with filters.',
    inputSchema: {
      taskDesc: z.string().optional().describe('Filter by task description (substring match)'),
      owner: z.string().optional().describe('Filter by user ID'),
      scope: z.string().optional().describe('Scope filter (e.g. "self", "team")'),
      projectId: z.string().optional(),
      clientId: z.string().optional(),
      sort: z.string().optional().describe('Sort order'),
      limit: z.number().optional(),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/times/history/search', {
        taskDesc: args.taskDesc,
        owner: args.owner,
        scope: args.scope,
        projectId: args.projectId,
        clientId: args.clientId,
        sort: args.sort,
        limit: args.limit,
      }),
  },
  */
];
