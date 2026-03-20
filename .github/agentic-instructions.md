# Agentic Instructions

Welcome to the Human-like Playback QA Automation project. This document provides the core instructions for Agentic to assist developers in this repository.

## Project Overview
This project is an automated Quality Assurance system that mimics human behavior to validate video playback on OTT web platforms. It uses Node.js (v20+) and Playwright in a headed browser environment with randomized interactions to bypass basic bot detection.

## Tech Stack
- **Runtime:** Node.js (v20+)
- **Automation:** Playwright, Playwright-Extra (Stealth Plugin)
- **Logging:** Winston
- **Validation:** Zod
- **Testing Framework:** Jest or Playwright Test

## Standard Commands
- **Install Dependencies:** `npm install`
- **Install Browsers:** `npx playwright install chromium`
- **Lint:** `npm run lint` (ESLint)
- **Test:** `npm test`
- **Run Batch:** `npm start -- --batch input.json`

## Agents & Skills Reference

| Type  | Name | Description | Path |
|-------|------|-------------|------|
| Agent | Orchestrator | Plans tasks, parses ClickUp tickets, and delegates work. | `.github/agents/orchestrator.agent.md` |
| Agent | DevOps | Manages CI/CD, dependencies, and environment setup (e.g., xvfb). | `.github/agents/devops.agent.md` |
| Agent | Node.js Developer | Writes core automation logic, Playwright scripts, and validators. | `.github/agents/node.agent.md` |
| Skill | ClickUp Task Parsing | Parses ClickUp tickets into actionable agent sub-tasks. | `.github/skills/clickup-task-parsing/SKILL.md` |
