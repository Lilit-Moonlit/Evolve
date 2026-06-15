# EVOLVE RULES UPDATE PROTOCOL

> This file defines HOW agents should propose and apply rule changes.
> All agents MUST follow this protocol.

---

## When to Update Rules

**Agents SHOULD propose rule updates when they discover:**

1. **New conventions** — patterns used consistently across 3+ files
2. **Bug patterns** — recurring mistakes that should be prevented
3. **Missing rules** — situations not covered by existing rules
4. **Better practices** — more efficient or safer approaches
5. **Tool changes** — new tools, deprecations, or configuration updates
6. **Architecture shifts** — significant changes to project structure

**Agents SHOULD NOT propose updates for:**

- One-time fixes
- Personal preferences
- Experimental changes
- Temporary workarounds

---

## How to Propose Rule Changes

### Step 1: Identify the Change

When you discover something that should be a global rule:

```
"I found that [pattern/issue]. This should be added to AGENTS.md because [reason]."
```

### Step 2: Propose to User

Clearly state what you want to change and why:

```
PROPOSE RULE CHANGE:
- File: AGENTS.md
- Section: [section name]
- Change: [exact text to add/modify]
- Reason: [why this matters]
- Impact: [which agents/tools are affected]
```

### Step 3: Apply to All Files

After user approves, update ALL relevant files:

| File                              | Location    | Format                     |
| --------------------------------- | ----------- | -------------------------- |
| `AGENTS.md`                       | Root        | Markdown (source of truth) |
| `CLAUDE.md`                       | Root        | Markdown                   |
| `.agents/rules/*.md`              | Antigravity | MD + YAML frontmatter      |
| `.windsurf/rules/*.md`            | Windsurf    | MD + YAML frontmatter      |
| `.clinerules/*.md`                | Cline       | MD + YAML frontmatter      |
| `.github/copilot-instructions.md` | Copilot     | Markdown                   |
| `.hermes.md`                      | Root        | Markdown                   |
| `opencode.json`                   | Root        | JSON                       |

### Step 4: Commit Changes

```bash
git add AGENTS.md CLAUDE.md .agents/ .windsurf/ .clinerules/ .github/ .hermes.md opencode.json
git commit -m "docs: update project rules - [brief description]"
```

---

## Rule Change Template

When proposing a rule change, use this format:

```markdown
## Rule Change Proposal

**Date:** [date]
**Agent:** [tool name, e.g., OpenCode, Claude Code]
**Section:** [which section of AGENTS.md]

### Current Rule

[existing text if modifying]

### Proposed Change

[new text]

### Reason

[why this change is needed]

### Examples

[concrete examples of when this applies]

### Impact

- [ ] AGENTS.md
- [ ] CLAUDE.md
- [ ] .agents/rules/
- [ ] .windsurf/rules/
- [ ] .clinerules/
- [ ] .github/copilot-instructions.md
- [ ] .hermes.md
- [ ] opencode.json
```

---

## Cross-Tool Awareness

### Problem

Different tools may have different sessions. Agent A in OpenCode might discover something that Agent B in Claude Code needs to know.

### Solution

1. **Git as shared memory** — all rule changes are committed
2. **Session start protocol** — agents should check `git log` for recent rule changes
3. **Explicit user bridging** — user tells agent "rules changed, read AGENTS.md"

### Agent Responsibility

When starting a session, agents SHOULD:

1. Read the rules file(s) for their tool
2. Check if there are recent commits: `git log --oneline -5 -- AGENTS.md`
3. If rules were recently updated, re-read them

---

## Conflict Resolution

If rules conflict between files:

1. **AGENTS.md is source of truth** — always
2. Tool-specific files extend (not override) AGENTS.md
3. If a tool-specific file contradicts AGENTS.md, AGENTS.md wins
4. User has final say on all conflicts

---

## Versioning

- Each rule change should be a separate git commit
- Commit messages should start with `docs:` prefix
- Include which section changed in the commit message
- Example: `docs: add mobile testing rules to AGENTS.md`

---

_This protocol ensures all agents stay synchronized._
_Last updated: 2026-06-11_
