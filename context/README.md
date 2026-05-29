---
type: moc
updated: 2026-05-24
---

# Ghost AI — Vault

> The context layer for Ghost AI. All architectural decisions, feature specs, and progress tracking live here.

---

## Agent Context — Read First

| | |
|---|---|
| **Phase** | Phase 1 — Foundation |
| **Active Feature** | 13 — TBD |
| **Open Issues** | `$= dv.pages('"issues"').where(p => p.type === "issue" && p.status !== "Resolved").length` |

**Before implementing, read in order:**
`project-overview` → `architecture-context` → `ui-context` → `code-standards` → `ai-workflow-rules` → `progress-tracker`

**Critical constraints:**
- Do NOT import `tw-animate-css` — copy keyframes manually into `globals.css`
- Tailwind v4 — CSS-first config, no `tailwind.config.js`
- Next.js 16 — read `node_modules/next/dist/docs/` before writing any Next.js code

---

## Current Phase

```dataview
TABLE WITHOUT ID
  phase AS "Phase",
  status AS "Status",
  updated AS "Last Updated"
FROM ""
WHERE type = "tracker"
```

---

## Open Tasks

```tasks
not done
path includes feature-specs
```

---

## Recent Activity

```dataview
TABLE WITHOUT ID
  file.link AS "File",
  file.mtime AS "Modified"
FROM ""
WHERE file.name != "README"
SORT file.mtime DESC
LIMIT 5
```

---

## Feature Specs

```meta-bind-button
id: new-feature-spec
style: primary
label: "＋ New Feature Spec"
icon: file-plus
tooltip: Creates a new spec from the standard template
action:
  type: templaterCreateNote
  templateFile: "templates/feature-spec.md"
  folderPath: "feature-specs"
  fileName: "_new-spec"
  openNote: true
```

```dataview
TABLE feature AS "Feature", status, updated AS "Updated"
FROM "feature-specs"
WHERE type = "feature-spec"
SORT feature ASC
```

---

## Issues & Tracking

```meta-bind-button
id: new-issue
style: default
label: "＋ New Issue"
icon: circle-plus
tooltip: Creates a new issue from the standard template
action:
  type: templaterCreateNote
  templateFile: "templates/issue.md"
  folderPath: "issues"
  fileName: "_new-issue"
  openNote: true
```

```meta-bind-button
id: resolved-issues
style: plain
label: "Resolved Issues"
icon: scroll-text
hidden: true
action:
  type: open
  link: "templates/current-issues"
  newTab: false
```

`BUTTON[resolved-issues]`

```dataview
TABLE WITHOUT ID
  file.link AS "Issue",
  status AS "Status",
  priority AS "Priority",
  description AS "Description",
  opened AS "Opened"
FROM "issues"
WHERE type = "issue" AND status != "Resolved"
SORT opened DESC
```

---

## Context Docs

```dataview
TABLE status, updated AS "Updated"
FROM ""
WHERE type = "context" AND status != "archived"
SORT file.name ASC
```

---

[[progress-tracker]] · [[current-issues]]**
