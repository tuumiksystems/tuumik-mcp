/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

export const adminTools = [
  // ── Users ──────────────────────────────────────────────────────────────────

  {
    name: 'admin_users_list',
    description: 'List all users in the workspace (admin only).',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/admin/users'),
  },
  {
    name: 'admin_users_get',
    description: 'Get details of a specific user for editing (admin only).',
    inputSchema: { userId: z.string() },
    handler: async (apiKey, args) => appClient.get(apiKey, `/api/admin/users/${args.userId}`),
  },
  {
    name: 'admin_users_create',
    description: 'Create a new user (admin only).',
    inputSchema: {
      name: z.string(),
      email: z.string(),
      password: z.string(),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/admin/users', {
        name: args.name,
        email: args.email,
        password: args.password,
      }),
  },
  {
    name: 'admin_users_update',
    description: 'Update general details of a user (admin only).',
    inputSchema: {
      userId: z.string(),
      name: z.string().optional(),
      role: z.string().optional(),
      teamId: z.string().optional(),
    },
    handler: async (apiKey, args) => {
      const { userId, ...body } = args;
      return appClient.put(apiKey, `/api/admin/users/${userId}`, body);
    },
  },
  {
    name: 'admin_users_set_username',
    description: 'Change the username of a user (admin only).',
    inputSchema: {
      userId: z.string(),
      username: z.string(),
    },
    handler: async (apiKey, args) =>
      appClient.put(apiKey, `/api/admin/users/${args.userId}/username`, { username: args.username }),
  },
  {
    name: 'admin_users_set_password',
    description: 'Set a new password for a user (admin only).',
    inputSchema: {
      userId: z.string(),
      password: z.string(),
    },
    handler: async (apiKey, args) =>
      appClient.put(apiKey, `/api/admin/users/${args.userId}/password`, { password: args.password }),
  },
  {
    name: 'admin_users_add_email',
    description: 'Add an email address to a user account (admin only).',
    inputSchema: {
      userId: z.string(),
      email: z.string(),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, `/api/admin/users/${args.userId}/emails`, { email: args.email }),
  },
  {
    name: 'admin_users_remove_email',
    description: 'Remove an email address from a user account (admin only).',
    inputSchema: {
      userId: z.string(),
      email: z.string(),
    },
    handler: async (apiKey, args) =>
      appClient.delete(apiKey, `/api/admin/users/${args.userId}/emails`, { email: args.email }),
  },
  {
    name: 'admin_users_send_verify_email',
    description: 'Send an email verification link to a user (admin only).',
    inputSchema: {
      userId: z.string(),
      email: z.string(),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, `/api/admin/users/${args.userId}/verify-email`, { email: args.email }),
  },
  {
    name: 'admin_users_disable',
    description: 'Disable a user account (admin only).',
    inputSchema: { userId: z.string() },
    handler: async (apiKey, args) =>
      appClient.put(apiKey, `/api/admin/users/${args.userId}/disable`, {}),
  },
  {
    name: 'admin_users_enable',
    description: 'Re-enable a disabled user account (admin only).',
    inputSchema: { userId: z.string() },
    handler: async (apiKey, args) =>
      appClient.put(apiKey, `/api/admin/users/${args.userId}/enable`, {}),
  },
  {
    name: 'admin_users_delete',
    description: 'Permanently delete a user account (admin only).',
    inputSchema: { userId: z.string() },
    handler: async (apiKey, args) =>
      appClient.delete(apiKey, `/api/admin/users/${args.userId}`),
  },

  // ── Teams ──────────────────────────────────────────────────────────────────

  {
    name: 'admin_teams_get',
    description: 'Load the team configuration (admin only).',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/admin/teams'),
  },
  {
    name: 'admin_teams_save',
    description: 'Save the full teams configuration (admin only). Replaces existing teams.',
    inputSchema: {
      teams: z.array(z.record(z.unknown())).describe('Array of team objects'),
    },
    handler: async (apiKey, args) =>
      appClient.put(apiKey, '/api/admin/teams', { teams: args.teams }),
  },

  // ── Task groups (admin) ────────────────────────────────────────────────────

  {
    name: 'admin_task_groups_list',
    description: 'List all task groups (admin view, admin only).',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/admin/task-groups'),
  },
  {
    name: 'admin_task_groups_get',
    description: 'Get a task group for editing (admin only).',
    inputSchema: { taskGroupId: z.string() },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, `/api/admin/task-groups/${args.taskGroupId}`),
  },
  {
    name: 'admin_task_groups_create',
    description: 'Create a new task group (admin only).',
    inputSchema: { name: z.string() },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/admin/task-groups', { name: args.name }),
  },
  {
    name: 'admin_task_groups_update',
    description: 'Update a task group (admin only).',
    inputSchema: {
      taskGroupId: z.string(),
      name: z.string().optional(),
      tasks: z.array(z.record(z.unknown())).optional().describe('Task definitions'),
    },
    handler: async (apiKey, args) => {
      const { taskGroupId, ...body } = args;
      return appClient.put(apiKey, `/api/admin/task-groups/${taskGroupId}`, body);
    },
  },
  {
    name: 'admin_task_groups_delete',
    description: 'Delete a task group (admin only).',
    inputSchema: { taskGroupId: z.string() },
    handler: async (apiKey, args) =>
      appClient.delete(apiKey, `/api/admin/task-groups/${args.taskGroupId}`),
  },

  // ── In/Out options ─────────────────────────────────────────────────────────

  {
    name: 'admin_inout_options_get',
    description: 'Load the in/out status options configuration (admin only).',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/admin/inout-options'),
  },
  {
    name: 'admin_inout_options_save',
    description: 'Save the in/out status options configuration (admin only).',
    inputSchema: {
      inOutOptions: z.array(z.record(z.unknown())).describe('Array of in/out option objects'),
    },
    handler: async (apiKey, args) =>
      appClient.put(apiKey, '/api/admin/inout-options', { inOutOptions: args.inOutOptions }),
  },

  // ── Main settings ──────────────────────────────────────────────────────────

  {
    name: 'admin_settings_get',
    description: 'Load the main workspace settings (admin only).',
    inputSchema: {},
    handler: async (apiKey) => appClient.get(apiKey, '/api/admin/settings'),
  },
  {
    name: 'admin_settings_save',
    description: 'Save the main workspace settings (admin only).',
    inputSchema: {
      settings: z.record(z.unknown()).describe('Settings object to save'),
    },
    handler: async (apiKey, args) => appClient.put(apiKey, '/api/admin/settings', args.settings),
  },
];
