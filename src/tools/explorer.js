/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

export const explorerTools = [
  {
    name: 'explorer_query',
    description: 'Query the timesheet explorer to retrieve and aggregate time entries with filters (date range, clients, projects, users, etc.).',
    inputSchema: {
      startDate: z.string().optional().describe('Start date as ISO string e.g. 2026-05-01T00:00:00.000Z'),
      endDate: z.string().optional().describe('End date as ISO string e.g. 2026-05-31T23:59:59.999Z'),
      clientIds: z.array(z.string()).optional().describe('Filter by client IDs'),
      projectIds: z.array(z.string()).optional().describe('Filter by project IDs'),
      userIds: z.array(z.string()).optional().describe('Filter by user IDs'),
      taskDesc: z.string().optional().describe('Filter by task description (substring match)'),
      tagColor: z.object({
        green: z.boolean().optional(),
        yellow: z.boolean().optional(),
        red: z.boolean().optional(),
        grey: z.boolean().optional(),
        clear: z.boolean().optional(),
      }).optional().describe('Filter by tag color'),
      tagText: z.string().optional().describe('Filter by tag text (exact match)'),
      limit: z.number().optional().describe('Max number of time entries to return (default 1000)'),
      sort: z.object({
        first: z.string().optional().describe('Primary sort field: date, project, user, task, tag-color, tag-text, or none'),
        second: z.string().optional().describe('Secondary sort field'),
        third: z.string().optional().describe('Tertiary sort field'),
      }).optional().describe('Sort order'),
    },
    handler: async (apiKey, args) => appClient.post(apiKey, '/api/explorer', args),
  },
  {
    name: 'explorer_export',
    description: 'Export timesheet explorer results using a configured exporter.',
    inputSchema: {
      exporterId: z.string().describe('ID of the exporter to use'),
      selTimes: z.array(z.string()).optional().describe('IDs of selected time entries to export'),
    },
    handler: async (apiKey, args) => appClient.post(apiKey, '/api/explorer/export', args),
  },
  {
    name: 'explorer_tag_color',
    description: 'Set a color tag on selected time entries.',
    inputSchema: {
      selTimes: z.array(z.string()).describe('IDs of time entries to tag'),
      color: z.string().describe('Color value'),
    },
    handler: async (apiKey, args) =>
      appClient.put(apiKey, '/api/explorer/tag-color/update', { selTimes: args.selTimes, color: args.color }),
  },
  {
    name: 'explorer_tag_text',
    description: 'Set a text tag on selected time entries.',
    inputSchema: {
      selTimes: z.array(z.string()).describe('IDs of time entries to tag'),
      text: z.string().describe('Tag text'),
    },
    handler: async (apiKey, args) =>
      appClient.put(apiKey, '/api/explorer/tag-text/update', { selTimes: args.selTimes, text: args.text }),
  },
];
