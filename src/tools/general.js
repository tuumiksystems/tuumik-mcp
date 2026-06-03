/* Copyright (C) 2026 Tuumik Systems OÜ */

import { appClient } from '../appClient.js';

export const generalTools = [
  {
    name: 'general_load_user_and_tenant_self',
    description: 'Load the current user (identified by the API key) and the tenant associated with that user. On user returns profile, role, permissions etc. On tenant returns number, date and time formats, teams, exporters, inOutOptions etc. Call this first to understand what actions the current user is allowed to perform before querying other endpoints.',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/general/load-user-and-tenant-self'),
  },
];
