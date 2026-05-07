---
type: moc
updated: 2026-05-06
---

# Ghost AI — Vault

> The context layer for Ghost AI. All architectural decisions, feature specs, and progress tracking live here.

---

## Context Docs

```dataview
TABLE status, updated AS "Updated"
FROM ""
WHERE type = "context" AND status != "archived"
SORT file.name ASC
```

---

## Feature Specs

```dataview
TABLE feature AS "Feature", status, updated AS "Updated"
FROM "feature-specs"
WHERE type = "feature-spec"
SORT feature ASC
```

---

## Issues & Tracking

```dataview
TABLE status, updated AS "Updated"
FROM "feature-specs"
WHERE type = "issue-log"
SORT file.name ASC
```

[[progress-tracker]] · [[current-issues]]
