/* Copyright (C) 2026 Tuumik Systems OÜ */

import { appClient } from '../appClient.js';

export const taskGroupTools = [
  {
    name: 'task_groups_list',
    description: 'Get task groups available to the authenticated user.',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/task-groups'),
  },
];
