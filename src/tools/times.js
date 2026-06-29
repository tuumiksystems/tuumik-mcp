/* Copyright (C) 2026 Tuumik Systems OÜ */

import { z } from 'zod';
import { appClient } from '../appClient.js';

export const timeTools = [
  {
    name: 'times_create',
    description: 'Create a new time entry for the authenticated user. Only date and startMinute are required; all other fields are optional and let you fully populate the entry in a single call. If endMinute is omitted, it defaults to the tenant tracker step after startMinute.',
    inputSchema: {
      date: z.string().describe('Date in YYYY-MM-DD format'),
      startMinute: z.number().describe('Start time as minutes from midnight (0–1439)'),
      endMinute: z.number().optional().describe('End time as minutes from midnight (1–1440); duration = endMinute - startMinute'),
      projectId: z.string().optional().describe('Project ID to assign'),
      clientId: z.string().optional().describe('Client ID to assign (ignored if projectId is given)'),
      taskType: z.string().optional().describe("Task type text — the txt value of a task type from task_groups_list, not an id. Relevant when the entry has useTaskType enabled: on insert this is enabled if the linked project has useTaskTypes set to true, or — if the entry is not linked to any project — if the tenant has useTaskTypesByDefault set to true."),
      taskDesc: z.string().optional().describe('Task description (max 500 chars)'),
      intCom: z.string().optional().describe('Internal comment (max 500 chars)'),
      hideHistory: z.boolean().optional().describe('Hide this entry from history suggestions'),
      plan: z.boolean().optional().describe('If true, mark the entry as planned time rather than actual tracked time. Defaults to false.'),
    },
    handler: async (apiKey, args) =>
      appClient.post(apiKey, '/api/times/insert', {
        date: args.date,
        startMinute: args.startMinute,
        endMinute: args.endMinute,
        projectId: args.projectId,
        clientId: args.clientId,
        taskType: args.taskType,
        taskDesc: args.taskDesc,
        intCom: args.intCom,
        hideHistory: args.hideHistory,
        plan: args.plan,
      }),
  },
  {
    name: 'times_update',
    description: 'Update an existing time entry. Provide the entry id plus at least one field or operation; omitted fields are left untouched. This is the single tool for editing an entry: set timing, project/client, task fields, plan, or date, and clear or move in the same call.',
    inputSchema: {
      id: z.string().describe('ID of the time entry to update'),
      date: z.string().optional().describe('Move the entry to this date (YYYY-MM-DD format)'),
      startMinute: z.number().optional().describe('Start time as minutes from midnight (0–1439)'),
      endMinute: z.number().optional().describe('End time as minutes from midnight (1–1440); duration = endMinute - startMinute'),
      move: z.boolean().optional().describe('If true, shift the entry so it starts at startMinute while preserving its duration. Requires startMinute; endMinute is ignored.'),
      projectId: z.string().optional().describe('Project ID to assign (clears any standalone client)'),
      clientId: z.string().optional().describe('Client ID to assign (ignored if projectId is given)'),
      clearProject: z.boolean().optional().describe("If true, remove the entry's project but keep that project's client"),
      clearAll: z.boolean().optional().describe('If true, remove both client and project from the entry'),
      taskType: z.string().optional().describe("Task type text — the txt value of a task type from task_groups_list, not an id. Relevant when the entry has useTaskType enabled: assigning a project enables it if that project has useTaskTypes set to true."),
      taskDesc: z.string().optional().describe('Task description (max 500 chars)'),
      intCom: z.string().optional().describe('Internal comment (max 500 chars)'),
      hideHistory: z.boolean().optional().describe('Hide this entry from history suggestions'),
      plan: z.boolean().optional().describe('If true, mark the entry as planned time rather than actual tracked time'),
    },
    handler: async (apiKey, args) =>
      appClient.patch(apiKey, `/api/times/${args.id}/update`, {
        date: args.date,
        startMinute: args.startMinute,
        endMinute: args.endMinute,
        move: args.move,
        projectId: args.projectId,
        clientId: args.clientId,
        clearProject: args.clearProject,
        clearAll: args.clearAll,
        taskType: args.taskType,
        taskDesc: args.taskDesc,
        intCom: args.intCom,
        hideHistory: args.hideHistory,
        plan: args.plan,
      }),
  },
  {
    name: 'times_delete',
    description: 'Delete a time entry.',
    inputSchema: {
      id: z.string().describe('ID of the time entry to delete'),
    },
    handler: async (apiKey, args) =>
      appClient.delete(apiKey, `/api/times/${args.id}/delete`),
  },
  {
    name: 'times_recent',
    description: 'Get recent time entries for the authenticated user.',
    inputSchema: {
      cutoff: z.string().optional().describe('How far back to look, e.g. "10days" or "30days". Defaults to "10days".'),
    },
    handler: async (apiKey, args) =>
      appClient.get(apiKey, '/api/times/recent', { cutoff: args.cutoff }),
  },
];
