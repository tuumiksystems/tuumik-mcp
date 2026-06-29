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
- useTaskType — optional boolean; if true, a taskType is expected on this entry (derived from the linked project's useTaskTypes, or the tenant default when no project is linked)
- intCom — optional internal comment
- hideHistory — boolean; if true, the entry is excluded from history suggestions
- plan — boolean; if true, the entry represents planned time rather than actual tracked time

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

Use clients_autocomplete to find a client ID by name. clients_update is a partial update: pass the client ID plus only the fields you want to change; omitted fields are left unchanged.

## Projects
Projects belong to a client and are the direct target of time entries. Each project document contains:
- name — display name (min 2 characters)
- clientId — parent client
- taskGroupIds — array of task group IDs assigned to this project; determines which task types are available when logging time
- useTaskTypes — boolean; if true, a taskType should be set on time entries for this project
- reminder — free-text reminder note (may be empty string)

Use projects_autocomplete to find a project ID by name. projects_update is a partial update: pass the project ID plus only the fields you want to change; omitted fields are left unchanged.

## Task groups and task types
Task groups and task types are optional — tenants may choose not to use them at all. If a project has useTaskTypes set to false, taskType on time entries is not required: the entry is described entirely by the free-form taskDesc field, and the user provides all information themselves.

A task type is a short, predefined label, defined by the tenant, that precedes the task description on an entry. On a project that uses task types, the user picks a task type from a predefined list and then writes the task description manually. For example, an entry might read "review of document: Loan Agreement", where "review of document:" is the task type and "Loan Agreement" is the task description.

Task types are organised into task groups. Call task_groups_list to retrieve them. Each task group contains:
- name — display name of the group; some tenants use it to denote a language (e.g. "English", "Estonian"), but that is only a naming convention, not a required meaning
- position — sort order
- showByDefault — whether the group is shown by default in the UI
- types — array of task type objects, each with a txt field holding the task type's text

The taskType field on a time entry holds the txt string of a type (e.g. "review of document:"), not an id. To set a task type on an entry, copy the txt value from the appropriate task group returned by task_groups_list. Only task types from groups assigned to the entry's project (via the project's taskGroupIds) are valid for that entry. If a project has useTaskTypes set to true, always set taskType when logging time against it.

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
