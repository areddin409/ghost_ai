---
type: issue
title: Edge Insert — "Insert Here" Persists and Shape Not Always Inserted Between Nodes
status: Open
priority: High
spec_ref: "22"
opened: 2026-06-02
updated: 2026-06-02
description: After dropping a shape onto an edge, the "Insert Here" indicator never clears and the new node is not always spliced between the source and target nodes.
---

# Edge Insert — "Insert Here" Persists and Shape Not Always Inserted Between Nodes

**Status:** `INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]`

**Result:** `INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]` · **Date:** `INPUT[date:verified_date]` · **Evidence:** `INPUT[text:verified_evidence]`

|             |            |
| ----------- | ---------- |
| **Opened**  | 2026-06-02 |
| **Updated** | 2026-06-02 |
| **Spec**    | [[22-edge-enhancements\|Spec 22 — Edge Enhancements]] |

## Description

When dragging a shape from the panel and hovering over an edge, the dashed "Insert here" highlight appears correctly. However, after the drop:

1. The "Insert here" indicator is never cleared — it stays visible on the canvas permanently.
2. The dropped shape is not consistently inserted between the two connected nodes (i.e., the existing edge is not always split into two edges bridging through the new node).

## Root Cause

_Under investigation_

## Fix

_Not yet identified_

---

#### Verification Log

| Date | By  | Result  | Evidence |
| ---- | --- | ------- | -------- |
| —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] · [[issues-moc]]_
