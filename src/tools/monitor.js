/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

const teamDatesSchema = z.object({
  startLocal: z.string(),
  endLocal: z.string(),
  monitorDate: z.string(),
}).describe('Date range with startLocal, endLocal, monitorDate (ISO strings)');

const userDatesSchema = z.object({
  startLocal: z.string(),
  endLocal: z.string(),
  startUTC: z.string(),
  endUTC: z.string(),
}).describe('Date range with startLocal, endLocal, startUTC, endUTC (ISO strings)');

export const monitorTools = [
  {
    name: 'monitor_team',
    description: 'Load team monitor data for a date range, optionally filtered by team or user. Returns both timesheet entries (times) and in/out board statuses (statuses). Times are billable work entries with date, startMinute, and endMinute fields — duration in minutes is endMinute minus startMinute. Statuses are in/out board availability records with start and end fields (UTC timestamps) that log the periods during which a user held a given in/out board state; they are not billable.',
    inputSchema: {
      dates: teamDatesSchema,
      teamId: z.string().optional().describe('Filter by team ID'),
      userId: z.string().optional().describe('Filter by user ID'),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/monitor/team', {
        dates: args.dates,
        teamId: args.teamId,
        userId: args.userId,
      }),
  },
  {
    name: 'monitor_user',
    description: 'Load monitor data for a specific user over a date range. Returns both timesheet entries (times) and in/out board statuses (statuses). Times are billable work entries with date, startMinute, and endMinute fields — duration in minutes is endMinute minus startMinute. Statuses are in/out board availability records with start and end fields (UTC timestamps) that log the periods during which a user held a given in/out board state; they are not billable.',
    inputSchema: {
      userId: z.string(),
      dates: userDatesSchema,
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/monitor/user', { userId: args.userId, dates: args.dates }),
  },
];
