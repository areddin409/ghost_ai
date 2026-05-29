<%*
const title = await tp.system.prompt("Issue title");
if (title === null) { const f = tp.file.find_tfile(tp.file.path(true)); if (f) await app.vault.trash(f, true); return; }

const description = await tp.system.prompt("Brief description");
if (description === null) { const f = tp.file.find_tfile(tp.file.path(true)); if (f) await app.vault.trash(f, true); return; }

const baseSlug = title.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "");
let slug = baseSlug;
let counter = 1;
while (app.vault.getAbstractFileByPath(`issues/${slug}.md`)) {
  slug = `${baseSlug}-${counter}`;
  counter++;
}
await tp.file.rename(slug);

const bt = "`";

tR += `---
type: issue
title: "${title}"
status: Open
priority: Medium
opened: ${tp.date.now("YYYY-MM-DD")}
updated: ${tp.date.now("YYYY-MM-DD")}
description: "${description}"
---

> [!bug] ${title}
> **Status:** ${bt}INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]${bt} · **Priority:** ${bt}INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]${bt}
>
> Opened **${tp.date.now("YYYY-MM-DD")}** · Updated ${bt}INPUT[date:updated]${bt}

**Description:** ${description}

---

> [!note]- Investigation
>
> #### Checklist
>
> - [ ]
>
> **Root Cause:** _TBD_
>
> **Fix Applied:** _TBD_

> [!info]- Verification Log
>
> | Date | By | Result | Evidence |
> |------|----|--------|----------|
> | — | — | Pending | — |

---

_Part of [[README|Ghost AI Vault]]_`;
%>
