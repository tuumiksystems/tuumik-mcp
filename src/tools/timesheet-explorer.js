/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

export const timesheetExplorerTools = [
  {
    name: 'timesheet_explorer_full',
    description: 'Returns individual time entries. Most questions about hours/minutes are answered more cheaply by timesheet_explorer_totals — use this tool only when the user needs to see, list, or review the individual entries themselves (e.g. specific tasks, descriptions, or tags), not just aggregate numbers. Search time entries with rich filters (clients, projects, users, date range, task description, tag color/text) and return the matching Times documents joined with owner, project and client names (ownerName, projectName, clientName). The response also includes meta (echoes back the resolved filters, including the matched clients/projects and users) and limit (limitReached flag with an explanation if the query limit was hit). Requires the "composer" permission.',
    inputSchema: {
      clientIds: z.array(z.string()).optional().describe('Filter to times whose project belongs to one of these clients'),
      projectIds: z.array(z.string()).optional().describe('Filter to times assigned to one of these projects'),
      userIds: z.array(z.string()).optional().describe('Filter to times owned by one of these users'),
      startDate: z.string().describe('Start of date range as ISO string (inclusive). Required.'),
      endDate: z.string().describe('End of date range as ISO string (inclusive). Required.'),
      taskDesc: z.string().optional().describe('Filter by task description substring'),
      tagColor: z.object({
        green: z.boolean().optional(),
        yellow: z.boolean().optional(),
        red: z.boolean().optional(),
        grey: z.boolean().optional(),
        clear: z.boolean().optional().describe('Include times with no tag color set'),
      }).optional().describe('Filter by tag color(s). Combine multiple to match any of them.'),
      tagText: z.string().optional().describe('Filter by exact tag text'),
      sort: z.object({
        first: z.enum(['none', 'date', 'project', 'user', 'task', 'tag-color', 'tag-text']).optional().describe('Primary sort field, defaults to "date"'),
        second: z.enum(['none', 'date', 'project', 'user', 'task', 'tag-color', 'tag-text']).optional().describe('Secondary sort field, defaults to "none"'),
        third: z.enum(['none', 'date', 'project', 'user', 'task', 'tag-color', 'tag-text']).optional().describe('Tertiary sort field, defaults to "none"'),
      }).optional(),
      limit: z.number().optional().describe('Maximum number of time entries to consider'),
    },
    handler: async (apiKey, args) => appClient.post(apiKey, '/api/timesheet-explorer/full', args),
  },
  {
    name: 'timesheet_explorer_totals',
    description: 'Default tool for time-tracking questions — try this first. It is cheaper and faster than timesheet_explorer_full because it returns aggregated totals instead of every matching entry. Search time entries with the same filters as timesheet_explorer_full, but instead of returning the matching documents, return aggregated totals: for each user, minutesTotal/hoursTotal, broken down further by minutesPerProject (each with projectName, clientName, minutesTotal, hoursTotal, tasksTotal). The response also includes meta (echoes back the resolved filters) and limit (limitReached flag with an explanation if the query limit was hit). Only use timesheet_explorer_full instead if the user needs to see the individual time entries themselves rather than totals. Requires the "composer" permission.',
    inputSchema: {
      clientIds: z.array(z.string()).optional().describe('Filter to times whose project belongs to one of these clients'),
      projectIds: z.array(z.string()).optional().describe('Filter to times assigned to one of these projects'),
      userIds: z.array(z.string()).optional().describe('Filter to times owned by one of these users'),
      startDate: z.string().describe('Start of date range as ISO string (inclusive). Required.'),
      endDate: z.string().describe('End of date range as ISO string (inclusive). Required.'),
      taskDesc: z.string().optional().describe('Filter by task description substring'),
      tagColor: z.object({
        green: z.boolean().optional(),
        yellow: z.boolean().optional(),
        red: z.boolean().optional(),
        grey: z.boolean().optional(),
        clear: z.boolean().optional().describe('Include times with no tag color set'),
      }).optional().describe('Filter by tag color(s). Combine multiple to match any of them.'),
      tagText: z.string().optional().describe('Filter by exact tag text'),
      sort: z.object({
        first: z.enum(['none', 'date', 'project', 'user', 'task', 'tag-color', 'tag-text']).optional().describe('Primary sort field, defaults to "date"'),
        second: z.enum(['none', 'date', 'project', 'user', 'task', 'tag-color', 'tag-text']).optional().describe('Secondary sort field, defaults to "none"'),
        third: z.enum(['none', 'date', 'project', 'user', 'task', 'tag-color', 'tag-text']).optional().describe('Tertiary sort field, defaults to "none"'),
      }).optional(),
      limit: z.number().optional().describe('Maximum number of time entries to consider'),
    },
    handler: async (apiKey, args) => appClient.post(apiKey, '/api/timesheet-explorer/totals', args),
  },
];
