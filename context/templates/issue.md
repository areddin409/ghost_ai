<%*
const title = await tp.system.prompt("Issue title");
if (title === null) { const f = tp.file.find_tfile(tp.file.path(true)); if (f) await app.vault.trash(f, true); return; }

const description = await tp.system.prompt("Brief description");
if (description === null) { const f = tp.file.find_tfile(tp.file.path(true)); if (f) await app.vault.trash(f, true); return; }

const baseSlug = (title.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "")) || "untitled";
let slug = baseSlug;
let counter = 1;
while (app.vault.getAbstractFileByPath("issues/" + slug + ".md")) {
  slug = baseSlug + "-" + counter;
  counter++;
}
await tp.file.rename(slug);

tR += `---
type: issue
title: "${title}"
status: Open
priority: Medium
opened: ${tp.date.now("YYYY-MM-DD")}
updated: ${tp.date.now("YYYY-MM-DD")}
description: "${description}"
verified_result: Pending
verified_date: ""
verified_evidence: ""

---

> [!bug] ${title}
> **Status:** \`INPUT[inlineSelect(option(Open), option(In Progress), option(Fix Implemented), option(Resolved)):status]\` · **Priority:** \`INPUT[inlineSelect(option(Low), option(Medium), option(High), option(Critical)):priority]\`
>
> Opened **${tp.date.now("YYYY-MM-DD")}** · Updated \`INPUT[date:updated]\`
>
> **Result:** \`INPUT[inlineSelect(option(Pending), option(Pass), option(Fail)):verified_result]\` · **Date:** \`INPUT[date:verified_date]\` · **Evidence:** \`INPUT[text:verified_evidence]\`

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
> | Date | By  | Result  | Evidence |
> | ---- | --- | ------- | -------- |
> | —    | —   | Pending | —        |

---

_Part of [[README|Ghost AI Vault]] | [[issues-moc]]_`;
%>
