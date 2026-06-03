/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

export const inoutTools = [
  {
    name: 'inout_set_status_self',
    description: 'Set the in/out status for the authenticated user.',
    inputSchema: { status: z.string().describe('Status value (e.g. "in", "out")') },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, '/api/inout/self/status', { status: args.status }),
  },
  {
    name: 'inout_set_note_self',
    description: 'Set the in/out note for the authenticated user.',
    inputSchema: { note: z.string() },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, '/api/inout/self/note', { note: args.note }),
  },
  {
    name: 'inout_set_eta_self',
    description: 'Set the ETA (estimated time of arrival/return) for the authenticated user.',
    inputSchema: { eta: z.string().describe('ETA value') },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, '/api/inout/self/eta', { eta: args.eta }),
  },
  {
    name: 'inout_set_status_user',
    description: 'Set the in/out status for another user (requires permission).',
    inputSchema: {
      userId: z.string(),
      status: z.string(),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/inout/${args.userId}/status`, { status: args.status }),
  },
  {
    name: 'inout_set_note_user',
    description: 'Set the in/out note for another user (requires permission).',
    inputSchema: {
      userId: z.string(),
      note: z.string(),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/inout/${args.userId}/note`, { note: args.note }),
  },
  {
    name: 'inout_set_eta_user',
    description: 'Set the ETA for another user (requires permission).',
    inputSchema: {
      userId: z.string(),
      eta: z.string(),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/inout/${args.userId}/eta`, { eta: args.eta }),
  },
];
