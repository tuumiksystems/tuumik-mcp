/* Copyright (C) 2026 Tuumik Systems OÜ */

import { appClient } from '../appClient.js';

export const generalTools = [
  {
    name: 'session_init',
    description: 'Call this first, before any other tool, at the start of every session. Loads the current user (identified by the API key) and the tenant associated with that user. On user returns profile, role, permissions etc. On tenant returns number, date and time formats, teams, exporters, inOutOptions etc. This data is required to understand what actions the current user is allowed to perform and to interpret the data returned by other tools.',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/general/load-user-and-tenant-self'),
  },
];
