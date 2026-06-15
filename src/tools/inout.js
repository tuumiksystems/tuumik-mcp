/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

const boardSchema = z.object({
  status: z.string().optional().describe('In/out status value'),
  note: z.string().optional().describe('Note text'),
  eta: z.string().optional().describe('ETA value'),
});

export const inoutTools = [
  {
    name: 'inout_board_current',
    description: 'Load current in/out board data for users. Filter by teamId to get all users in a team, or by searchedUserId to get a specific user. Requires the "inOutView" permission.',
    inputSchema: {
      teamId: z.string().optional().describe('Filter by team ID'),
      searchedUserId: z.string().optional().describe('Filter to a specific user ID'),
    },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, '/api/inout/board/current', { teamId: args.teamId, searchedUserId: args.searchedUserId }),
  },
  {
    name: 'inout_board_history_full',
    description: 'Returns individual in/out status change records. Most questions about time spent in each status are answered more cheaply by inout_board_history_totals — use this tool only when the user needs to see the individual status records themselves (e.g. when a status changed, or its note/eta/updaters), not just aggregate time-in-status numbers. Load in/out board history for one or more users over a date range. Returns status records from the Statuses collection (each record has userId, start, end, status, note, eta, updaters), joined with text and work from the tenant\'s in/out options. Records are clamped to the requested period; a clamped record gets a "modified" field describing which bounds were adjusted. The response also includes meta (echoes back the queried users and period), limit (limitReached flag with an explanation if the query limit was hit), and inOutOptions (the tenant\'s status option definitions). Requires the "inOutView" permission.',
    inputSchema: {
      userIds: z.array(z.string()).min(1).describe('User IDs to load history for'),
      startLocal: z.string().describe('Start of date range as ISO string'),
      endLocal: z.string().describe('End of date range as ISO string'),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/inout/board-history/full', { userIds: args.userIds, startLocal: args.startLocal, endLocal: args.endLocal }),
  },
  {
    name: 'inout_board_history_totals',
    description: 'Default tool for in/out history questions — try this first. It is cheaper and faster than inout_board_history_full because it returns aggregated totals instead of every status record. Load in/out board history totals for one or more users over a date range. Returns per-user totals of time spent in each status: each user has userId, name and statusTotals (an array of statusId, minutesTotal, hoursTotal, plus text and work joined from the tenant\'s in/out options). The response also includes meta (echoes back the queried users and period), limit (limitReached flag with an explanation if the query limit was hit), and inOutOptions (the tenant\'s status option definitions). Only use inout_board_history_full instead if the user needs to see the individual status records themselves rather than totals. Requires the "inOutView" permission.',
    inputSchema: {
      userIds: z.array(z.string()).min(1).describe('User IDs to load history for'),
      startLocal: z.string().describe('Start of date range as ISO string'),
      endLocal: z.string().describe('End of date range as ISO string'),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/inout/board-history/totals', { userIds: args.userIds, startLocal: args.startLocal, endLocal: args.endLocal }),
  },
  {
    name: 'inout_set_self',
    description: 'Set in/out board data for the authenticated user. Provide any combination of status, note, and eta — only supplied fields are updated. Requires the "inOutSelf" permission.',
    inputSchema: { board: boardSchema },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, '/api/inout/set/self', { board: args.board }),
  },
  {
    name: 'inout_set_user',
    description: 'Set in/out board data for another user. Provide any combination of status, note, and eta — only supplied fields are updated. Requires the "inOutEditOthers" permission, unless userId is the authenticated user\'s own ID.',
    inputSchema: {
      userId: z.string(),
      board: boardSchema,
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/inout/set/${args.userId}`, { board: args.board }),
  },
];
