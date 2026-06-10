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
      appClient.post(apiKey, '/api/times/insert', { date: args.date, startMinute: args.startMinute }),
  },
  {
    name: 'times_delete',
    description: 'Delete a time entry.',
    inputSchema: {
      id: z.string().describe('ID of the time entry to delete'),
    },
    handler: async (apiKey, args) =>
      appClient.delete(apiKey, `/api/times/${args.id}/delete`),
  },
  {
    name: 'times_set_plan',
    description: 'Set the plan text on a time entry.',
    inputSchema: {
      id: z.string(),
      plan: z.string().describe('Plan text'),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/times/${args.id}/plan/set`, { plan: args.plan }),
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
      appClient.patch(apiKey, `/api/times/${args.id}/timing/set`, {
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
      appClient.patch(apiKey, `/api/times/${args.id}/project/set`, {
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
      appClient.patch(apiKey, `/api/times/${args.id}/client/set`, {
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
      appClient.patch(apiKey, `/api/times/${args.id}/task/set`, {
        taskDesc: args.taskDesc,
        taskType: args.taskType,
        intCom: args.intCom,
        hideHistory: args.hideHistory,
      }),
  },
  {
    name: 'times_set_date',
    description: 'Move a time entry to a different date.',
    inputSchema: {
      id: z.string(),
      date: z.string().describe('New date in YYYY-MM-DD format'),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/times/${args.id}/date/set`, { date: args.date }),
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
];
