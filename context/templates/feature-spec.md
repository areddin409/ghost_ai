<%*
// Auto-detect the next feature number from existing specs
const files = app.vault.getFiles();
const specFiles = files.filter(f =>
  f.path.startsWith("feature-specs/") &&
  /^\d{2}/.test(f.name) &&
  f.extension === "md"
);
const nums = specFiles.map(f => parseInt(f.name.slice(0, 2)));
const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
const suggested = String(nextNum).padStart(2, "0");

const cancel = async () => {
  const f = tp.file.find_tfile(tp.file.path(true));
  if (f) await app.vault.trash(f, true);
};

const numRaw = await tp.system.prompt("Feature number", suggested);
if (numRaw === null) { await cancel(); return; }

const num = numRaw.padStart(2, "0");

const name = await tp.system.prompt("Feature name (e.g. Custom Nodes)");
if (name === null) { await cancel(); return; }

const goal = await tp.system.prompt("One-line goal");
if (goal === null) { await cancel(); return; }

const slug = num + "-" + name.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "");
await tp.file.rename(slug);

tR += `---
type: feature-spec
feature: "${num} — ${name}"
status: planned
updated: ${tp.date.now("YYYY-MM-DD")}
---

# Feature ${num} — ${name}

> [!abstract] Goal
> ${goal}

**References:** [[architecture-context]] · [[code-standards]]

---

## Implementation

- [ ] 

## Scope

## Check when done

- [ ] \`npm run build\` passes

---

_Tracked in [[progress-tracker]]_`;
%>
