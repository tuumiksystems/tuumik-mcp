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
    name: 'inout_board',
    description: 'Load current in/out board data for users. Filter by teamId to get all users in a team, or by searchedUserId to get a specific user.',
    inputSchema: {
      teamId: z.string().optional().describe('Filter by team ID'),
      searchedUserId: z.string().optional().describe('Filter to a specific user ID'),
    },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, '/api/inout/board', { teamId: args.teamId, searchedUserId: args.searchedUserId }),
  },
  {
    name: 'inout_board_history',
    description: 'Load in/out board history for one or more users over a date range. Returns status records from the Statuses collection (each record has userId, start, end, status, note, eta, updaters).',
    inputSchema: {
      userIds: z.array(z.string()).min(1).describe('User IDs to load history for'),
      startLocal: z.string().describe('Start of date range as ISO string'),
      endLocal: z.string().describe('End of date range as ISO string'),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/inout/board-history', { userIds: args.userIds, startLocal: args.startLocal, endLocal: args.endLocal }),
  },
  {
    name: 'inout_set_self',
    description: 'Set in/out board data for the authenticated user. Provide any combination of status, note, and eta — only supplied fields are updated.',
    inputSchema: { board: boardSchema },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, '/api/inout/set/self', { board: args.board }),
  },
  {
    name: 'inout_set_user',
    description: 'Set in/out board data for another user (requires permission). Provide any combination of status, note, and eta — only supplied fields are updated.',
    inputSchema: {
      userId: z.string(),
      board: boardSchema,
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/inout/set/${args.userId}`, { board: args.board }),
  },
];
