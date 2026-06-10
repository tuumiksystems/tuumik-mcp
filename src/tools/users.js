/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

export const userTools = [
  {
    name: 'users_autocomplete',
    description: 'Search users by name substring. Returns up to 15 matching users with their _id and name. Useful for resolving a user name to an ID.',
    inputSchema: { q: z.string().describe('Search string') },
    handler: async (apiKey, args) => appClient.get(apiKey, '/api/autocomplete/users', { q: args.q }),
  },
  {
    name: 'users_list',
    description: 'Load all users belonging to the tenant.',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/users/load-all'),
  },
];
