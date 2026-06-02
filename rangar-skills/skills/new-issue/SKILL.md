---
name: rangar:new-issue
description: Create a new issue file and add it to the active-issues log. Prompts for spec reference.
---

# Rangar: New Issue

1. Ask: "Issue title?"
2. Ask: "Spec reference? Enter the spec slug (e.g. `22-edge-enhancements`) or leave blank for an orphan issue."
3. Convert the title to a file slug: lowercase, spaces to hyphens, remove special characters
4. Determine the spec_ref value:
   - If a slug was given: `"[[specs/NN-slug]]"`
   - If blank: omit `spec_ref` and set `orphan: true` in frontmatter
5. Get today's date as YYYY-MM-DD
6. Create `context/issues/SLUG.md`:

```yaml
---
type: issue
title: TITLE
status: open
spec_ref: "[[specs/NN-slug]]"
updated: YYYY-MM-DD
---
```

```markdown
# TITLE

## Description

_Describe the issue_

## Root Cause

_Under investigation_

## Fix

_Not yet identified_

---

_Part of [[README|Ghost AI Vault]]_
```

7. Append to `context/active-issues.md` after the governance callout and any existing table header. If no table exists yet, create the header first:

```markdown
| Issue | Status | Spec | Updated |
|---|---|---|---|
```

Then append the row:
```
| [[issues/SLUG\|TITLE]] | open | [[specs/NN-slug]] | YYYY-MM-DD |
```

8. Report: "Created `context/issues/SLUG.md` and logged in `active-issues.md`"
