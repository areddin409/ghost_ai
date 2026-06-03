---
type: rangar
project: ghost_ai
created: 2026-06-02
updated: 2026-06-02 (session 3)
thresholds:
  fix_implemented_lag_days: 7
  stale_active_days: 14
---

# Rangar

> *"I am no builder. So take your time. We will wait."*

## Current State

ghost_ai is a Next.js AI canvas editor. Phase 1 (Foundation) is complete — all canvas features shipped (nodes, edges, bezier routing, bend-point drag handles, edge insert, user settings). Active work is spec 25 (Canvas Presence — participant avatars and live cursors).

## Last Battles

- Shipped spec 22 (Edge Enhancements): bezier routing, midpoint drag handles, drop-onto-edge split
- Shipped spec 20 (User Settings): DB-persisted canvas prefs, settings modal
- Vault housekeeping: README Dataview queries fixed, progress.md sync'd

## Active

- [[specs/25-canvas-presence]] — in progress

## Next

1. [[specs/25-canvas-presence]] — participant avatar group + live cursors
2. Verify edge insert fix (manual test in browser) and mark issue Resolved

## Open Questions

_None_

## Session Log

---

### 2026-06-02 (session 3)

**Focus:** Vault sync + closing specs 20 and 22

**Done:**
- Fixed README Dataview queries (Active Specs: added `planned` clause; Open Issues: fixed `fix-implemented` → `Fix Implemented`)
- Promoted spec 22 to `active`, spec 23/24 unchecked tasks bulk-checked
- Closed spec 20 (User Settings) — status shipped, Shipped section written, progress.md entry added
- Closed spec 22 (Edge Enhancements) — status shipped, Shipped section written, progress.md entry added

**Opened:**
- _None_

**Closed:**
- Spec 20 — User Settings
- Spec 22 — Edge Enhancements

**Notes:**
Phase 1 Foundation is now complete. Spec 25 (Canvas Presence) is the active spec.

---

### 2026-06-02 (session 2)

**Focus:** Spec cleanup + edge insert bug fix

**Done:**
- Closed spec 23 (Rangar Vault Migration) — shipped
- Closed spec 24 (Rangar Skills Package) — shipped
- Fixed edge insert bug: ghost "Insert here" indicator now clears on drop; node is correctly spliced between source and target with two replacement edges inheriting the original label
- Marked edge-insert-ghost-indicator issue as Fix Implemented

**Opened:**
- _None_

**Closed:**
- Spec 23 — Rangar Vault Migration
- Spec 24 — Rangar Skills Package

**Notes:**
Spec 22 Task 6 (drop-onto-edge split) is now implemented. Remaining open tasks on spec 22: Tasks 1–3 (bezier routing option, CanvasEdgeData type + path helper, midpoint drag handle).

---

### 2026-06-02

**Focus:** Rangar standard design and vault migration

**Done:**
- Approved all 8 sections of the Rangar standard
- Wrote `rangar-standard-design.md`
- Migrated `.obsidian/` to `.obsidian-template/`, purged from git history
- Applied vault migration (spec 23)

**Opened:**
- Spec 23 — Rangar Vault Migration
- Spec 24 — Rangar Skills Package

**Closed:**
- _None_

**Notes:**
Rangar v1.0 design locked. Skills package (spec 24) is the major remaining deliverable to make the standard portable and self-sustaining.
