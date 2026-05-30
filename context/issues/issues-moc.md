---
type: moc
title: Issues MOC
---

# Issues

```meta-bind-button
id: new-issue
label: "+ New Issue"
icon: plus
style: primary
action:
  type: templaterCreateNote
  templateFile: "templates/issue.md"
  folderPath: "issues"
  fileName: "_new-issue"
  openNote: true
```

---

```dataviewjs
const issues = dv.pages('"issues"').where(p => p.type === "issue");
const total = issues.length;
const count = s => issues.where(p => p.status === s).length;
const resolved = count("Resolved");
const pct = total > 0 ? Math.round(resolved / total * 100) : 0;

const wrap = dv.container.createDiv();

const row = wrap.createDiv({ attr: { style: "display:flex;gap:20px;margin-bottom:10px;font-size:0.85em" } });
[
  ["🔴", count("Open"),             "Open"],
  ["🟡", count("In Progress"),      "In Progress"],
  ["🔵", count("Fix Implemented"),  "Fix Implemented"],
  ["🟢", resolved,                  "Resolved"],
].forEach(([e, n, l]) => row.createSpan({ text: `${e} ${n} ${l}` }));

const track = wrap.createDiv({ attr: { style: "background:var(--background-modifier-border);border-radius:4px;height:6px;overflow:hidden;margin-bottom:4px" } });
track.createDiv({ attr: { style: `background:var(--interactive-accent);height:100%;width:${pct}%` } });
wrap.createDiv({ attr: { style: "font-size:0.75em;opacity:0.5" }, text: `${resolved} of ${total} resolved` });
```

## Active

```dataviewjs
const statusOrder   = { "Open": 0, "In Progress": 1, "Fix Implemented": 2 };
const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };

const issues = dv.pages('"issues"')
  .where(p => p.type === "issue" && p.status !== "Resolved")
  .array()
  .sort((a, b) => {
    const s = (statusOrder[a.status]   ?? 9) - (statusOrder[b.status]   ?? 9);
    if (s !== 0) return s;
    return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9);
  });

dv.table(
  ["Issue", "Status", "Priority", "Opened"],
  issues.map(p => [p.file.link, p.status, p.priority, p.opened])
);
```

## Resolved

```dataview
TABLE WITHOUT ID
  link(file.link, title) AS Issue,
  priority AS Priority,
  opened AS Opened
FROM "issues"
WHERE type = "issue" AND status = "Resolved"
SORT opened DESC
```

---

_Part of [[README|Ghost AI Vault]]_
