---
type: hub
updated: 2026-06-02
---

# Ghost AI Vault

> *"I am no builder. So take your time. We will wait."*

Welcome to the Rangar vault for ghost_ai. Start with [[rangar]] for current context.

---

## Active Specs

```dataview
TABLE title, status, phase, updated
FROM "specs"
WHERE type = "spec" AND status = "active"
SORT updated DESC
```

## Open Issues

```dataview
TABLE title, status, spec_ref, updated
FROM "issues"
WHERE type = "issue" AND (status = "open" OR status = "in-progress" OR status = "fix-implemented")
SORT updated DESC
```

## Stale Context Notes

```dataview
TABLE title, updated
FROM ""
WHERE type = "context" AND status = "stale"
SORT updated ASC
```

---

## Quick Links

- [[rangar]] — living log
- [[progress]] — tasks dashboard
- [[active-issues]] — open issues
- [[rangar-standard-design]] — vault standard reference
