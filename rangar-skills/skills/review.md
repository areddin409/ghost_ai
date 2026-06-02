---
name: rangar:review
description: Full vault health check — runs all six review sub-skills and presents a single consolidated report. Run before planning sessions.
---

# Rangar: Review

Run the full vault health check. Invoke each sub-skill in order and collect their output.

Run in this order:
1. `rangar:review:specs`
2. `rangar:review:issues`
3. `rangar:review:links`
4. `rangar:review:sync`
5. `rangar:review:drift`
6. `rangar:review:debt`

After all six complete, present the consolidated report:

```
RANGAR VAULT REVIEW
===================
Date: YYYY-MM-DD
Vault: context/

── SPECS ──────────────────────────────
[paste rangar:review:specs output]

── ISSUES ─────────────────────────────
[paste rangar:review:issues output]

── LINKS ──────────────────────────────
[paste rangar:review:links output]

── SYNC ───────────────────────────────
[paste rangar:review:sync output]

── DRIFT ──────────────────────────────
[paste rangar:review:drift output]

── DEBT ───────────────────────────────
[paste rangar:review:debt output]

═══════════════════════════════════════
SUMMARY
Total findings: N
Clean categories: [list categories with ✓]
Needs attention: [list categories with findings]
```

Do not fix anything. Present findings only. The human decides what to act on.
