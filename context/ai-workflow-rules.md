---
type: context
status: active
updated: 2026-05-06
---

# Development Workflow

> [!info] Purpose
> Spec-driven workflow rules, scoping guidelines, and delivery standards for all Ghost AI implementation.

## Approach

Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and what the current state of progress is. Always implement against these specs — do not infer or invent behavior from scratch.

## Scoping Rules

- Work on one feature unit or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.

## When To Split Work

Split an implementation step if it combines:

- UI changes and background task changes
- Real-time canvas state and database persistence
- Multiple unrelated API routes
- Behavior that is not clearly defined in the context files

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior that is not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.

## Protected Foundation Components

Do not modify generated third-party foundation components unless explicitly instructed.

This includes:

- `components/ui/*` (shadcn/ui components)
- third-party library internals

These should remain default and reusable.

Project-specific styling, layout changes, and feature logic must be implemented in app-level components instead of modifying foundation components.

Only modify these files when a task explicitly requires it.

## Keeping Docs In Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries
- Storage model decisions
- Code conventions or standards
- Feature scope

Progress state must reflect the actual state of the implementation, not the intended state.

## Before Moving To The Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `architecture-context.md` was violated.
3. `progress-tracker.md` reflects the completed work.

---

## Diagram Standards

All diagrams in this vault use Mermaid. Follow these rules whenever adding or updating a diagram.

### Theme

Always use `%%{init: {'theme': 'dark'}}%%` as the init block. Never use `theme: base` with raw `themeVariables` overrides — they produce invisible edges and unreadable nodes in most renderers.

```
%%{init: {'theme': 'dark'}}%%
```

For sequence diagrams only, extend the init block to override actor/signal colors using the named `themeVariables` keys that apply to `sequenceDiagram`. Do not set `lineColor`, `background`, `mainBkg`, or other flowchart-specific variables.

### Color Coding with classDef

Use `classDef` for semantic color groups rather than inline `style` on every node. Define classes once and apply them. Keep fills dark with clearly contrasting strokes and white text.

Recommended palette:

| Role                 | Fill      | Stroke    |
| -------------------- | --------- | --------- |
| Entry / root         | `#2d1f63` | `#7c6ef9` |
| Service / external   | `#0d2e2e` | `#00c8d4` |
| In-progress / WIP    | `#2d1a00` | `#f59e0b` |
| Shipped / done       | `#0a2a15` | `#10b981` |
| Neutral / planned    | `#1e1e2e` | `#9ca3af` |
| Danger / destructive | `#2a0a0a` | `#ef4444` |

### Diagram Type Selection

Choose the diagram type that matches the content:

| Content                                                 | Type                 |
| ------------------------------------------------------- | -------------------- |
| System topology, component tree, data flow              | `flowchart TD`       |
| Auth flows, request/response sequences                  | `sequenceDiagram`    |
| Feature lifecycle, state transitions                    | `stateDiagram-v2`    |
| Requirements and their relationships to system elements | `requirementDiagram` |

For `stateDiagram-v2`: use `direction LR` for readability, declare states explicitly with `state "label" as id` for consistent box sizing, and apply a single `classDef state` to all nodes for unified styling.

### Requirement Diagrams

Use `requirementDiagram` when documenting feature requirements and their connections to implementation elements. Structure:

- Define requirements with `requirement`, `functionalRequirement`, `performanceRequirement`, `interfaceRequirement`, `physicalRequirement`, or `designConstraint`.
- Each requirement must have `id`, `text`, `risk` (`Low`/`Medium`/`High`), and `verifymethod` (`Analysis`/`Inspection`/`Test`/`Demonstration`).
- Define `element` nodes for implementation artifacts (components, APIs, services) that satisfy requirements.
- Link them with relationship types: `satisfies`, `verifies`, `traces`, `contains`, `derives`, `refines`, `copies`.
- Use `direction LR` for wide requirement trees.
- Apply `style` or `classDef` to color-code by risk level.

Risk color convention:

```
style req_high fill:#2a0a0a,stroke:#ef4444,color:#fff
style req_medium fill:#2d1a00,stroke:#f59e0b,color:#fff
style req_low fill:#0a2a15,stroke:#10b981,color:#fff
```

### What to Avoid

- Do not use `theme: base` with `themeVariables` — edges become invisible.
- Do not apply `style` inline on every node when a `classDef` would do.
- Do not embed diagrams without an `%%{init}%%` block — theme defaults vary by renderer.
- Do not use light fills (e.g. `#fff`, `#ffa`) — diagrams render on dark backgrounds in this vault.
- Do not mix multiple semantic colors across status nodes in the same diagram — use one unified `classDef` unless the color difference carries specific meaning.

### Obsidian Rendering

Diagrams are centered and scroll horizontally when wider than the pane via the CSS snippet at `.obsidian/snippets/mermaid.css`. If a diagram is clipped, check that the snippet is enabled in **Settings → Appearance → CSS Snippets**.

The snippet applies:

- `display: flex; justify-content: center` on `.mermaid` — centers diagrams
- `overflow-x: auto` — wide diagrams scroll rather than clip
- `max-width: none` on the SVG — prevents Obsidian's width constraint from squashing the diagram

### Reference

- Flowchart syntax: https://mermaid.js.org/syntax/flowchart.html
- Sequence diagram syntax + styling: https://mermaid.js.org/syntax/sequenceDiagram.html
- State diagram syntax + classDefs: https://mermaid.js.org/syntax/stateDiagram.html
- Requirement diagram syntax: https://mermaid.js.org/syntax/requirementDiagram.html
- Theme variables reference: https://mermaid.js.org/config/theming.html
- Live editor: https://mermaid.live

_Part of [[README|Ghost AI Vault]]_
