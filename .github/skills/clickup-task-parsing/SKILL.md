# Skill: ClickUp Task Parsing

## Description
This skill enables the Orchestrator Agent to fetch, parse, and structure information from ClickUp tasks into actionable development steps.

## Prerequisites
- ClickUp API Token configured in the environment (`CLICKUP_API_TOKEN`).
- ClickUp Workspace/Team ID.

## Execution Steps
1. **Fetch Task:** Use the ClickUp API (`GET /api/v2/task/{task_id}`) to retrieve the task payload.
2. **Extract Metadata:** Parse the `name`, `description`, `status`, `assignees`, and `custom_fields`.
3. **Identify Constraints:** Scan the description for technical constraints (e.g., "Must use headed mode", "10s validation").
4. **Generate Sub-tasks:** Break down the description into a JSON array of sub-tasks suitable for the Node.js Developer and DevOps agents.

## Output Format
The skill should return a structured JSON object:
```json
{
  "taskId": "string",
  "title": "string",
  "description": "string",
  "technicalConstraints": ["string"],
  "delegationPlan": [
    {
      "agent": "Node.js Developer | DevOps",
      "task": "string",
      "acceptanceCriteria": ["string"]
    }
  ]
}
```
