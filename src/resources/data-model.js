/* Copyright (C) 2026 Tuumik Systems OÜ */

export const DATA_MODEL = `
# Tuumik data model

## Two types of tracking

### 1. Billable time (Times collection)
Users track tasks for billable hours. Each document contains:
- userId — owner of the entry
- date — UTC Date with time set to 00:00:00.001Z (represents the local calendar day)
- startMinute — integer, minutes from midnight (0–1439)
- endMinute — integer, minutes from midnight (0–1439); duration = endMinute - startMinute
- clientId — optional, linked client
- projectId — optional, linked project
- taskDesc — task description text
- taskType — task type identifier

### 2. In/out board (availability tracking)
Users track their availability status on an in/out board.

**Current status** is stored on each user document in the Meteor.users collection:
- inOutStatus — current status value (e.g. a tenant-defined option id)
- inOutNote — free-text note
- inOutETA — estimated time of arrival/return
- inOutUpdateAt — when the status was last changed
- inOutUpdateById — id of the user who made the last change
- inOutUpdateByName — name of the user who made the last change

**History** is stored in the Statuses collection. Each time a user's in/out data is updated, the previous state is written as a document:
- userId
- start — JS Date (UTC), when this state began
- end — JS Date (UTC), when this state ended
- status, note, eta — the values that were active during this period
- updaters — array of { id, name } of users who made changes during this period

## Clients
Clients are the top-level organisational unit for billable work. Each client document contains:
- name — display name (min 2 characters)
- reminder — free-text reminder note (may be empty string)
- tel, email, address — optional contact details
- hidden — if true, the client is not shown to most users
- allowAccess — array of user IDs who can access the client even when hidden

Use clients_autocomplete to find a client ID by name. Use clients_get to read the full document before calling clients_update, as the update requires all fields.

## Projects
Projects belong to a client and are the direct target of time entries. Each project document contains:
- name — display name (min 2 characters)
- clientId — parent client
- taskGroupIds — array of task group IDs assigned to this project; determines which task types are available when logging time
- useTaskTypes — boolean; if true, a taskType should be set on time entries for this project
- reminder — free-text reminder note (may be empty string)

Use projects_autocomplete to find a project ID by name. Use projects_get to read the full document before calling projects_update, as the update requires all fields.

## Task groups and task types
Task groups and task types are optional — tenants may choose not to use them at all. If a project has useTaskTypes set to false, taskType on time entries is not required and can be left unset.

When task types are used, they categorise work within a project. They are organised into task groups. Call task_groups_list to retrieve them.

Each task group contains:
- name — display name of the group
- position — sort order
- showByDefault — whether the group is shown by default in the UI
- types — array of task type objects, each with an id and name

The taskType field on a time entry holds the id of a type from one of these arrays. To set a task type on a time entry, look up the correct id from the task group returned by task_groups_list. Only task types from groups assigned to the time entry's project (via the project's taskGroupIds) are valid for that entry. If a project has useTaskTypes set to true, always set taskType when logging time against it.

## Key difference between Times and Statuses
Times use a date + startMinute/endMinute (integers) to represent when work happened.
Statuses use start and end as plain UTC Date objects to represent availability periods.

## Tools and the data they query
- timesheet_explorer_full — queries the Times collection with rich filters (date range, clients, projects, users, task description, tags) and returns matching documents
- timesheet_explorer_totals — same filters as timesheet_explorer_full, but returns aggregated hour/minute totals per user and per project instead of documents
- inout_board_current — returns current in/out status for users from Meteor.users
- inout_board_history_full — returns Statuses documents (in/out history) for specified users over a date range
- inout_board_history_totals — returns per-user totals of time spent in each in/out status over a date range

## Choosing between *_full and *_totals tools
For both pairs above, the *_totals tool is the default first choice: it is cheaper and faster since it returns aggregated numbers instead of every matching record. Only call the *_full tool when the user needs to see, list, or review the individual entries/records themselves (specific tasks, descriptions, tags, status notes, etc.) rather than aggregate totals.
`.trim();
