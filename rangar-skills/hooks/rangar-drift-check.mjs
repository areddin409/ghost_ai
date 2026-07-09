#!/usr/bin/env node
// Rangar drift check — SessionStart hook.
// Detects work that ended without the close-out ritual (rangar-ship) and
// injects a warning into the session's starting context via stdout.
// Install: copy to .claude/hooks/ and register as a SessionStart hook.

import { execSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

if (process.env.CLAUDE_PROJECT_DIR) process.chdir(process.env.CLAUDE_PROJECT_DIR);

const run = (cmd) => {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};

const UNMERGED_BRANCH_WINDOW_DAYS = 14;
const warnings = [];
const info = [];

// 1. Dirty working tree — a session may have ended without committing.
const dirty = run("git status --porcelain");
if (dirty) {
  warnings.push(
    `Uncommitted changes on ${run("git branch --show-current") || "detached HEAD"} (${dirty.split("\n").length} paths) — a previous session may have ended without committing.`
  );
}

// 2. Extra git worktrees — work may be stranded on a worktree branch.
const worktreeBlocks = run("git worktree list --porcelain").split("\n\n").filter(Boolean);
if (worktreeBlocks.length > 1) {
  const extras = worktreeBlocks
    .slice(1)
    .map((b) => (b.match(/^branch refs\/heads\/(.+)$/m) || [, "(detached)"])[1]);
  warnings.push(
    `Git worktrees are active: ${extras.join(", ")} — check for unmerged work before starting anything new.`
  );
}

// 3. Recently active branches not merged into main.
const cutoff = Date.now() / 1000 - UNMERGED_BRANCH_WINDOW_DAYS * 86400;
const recentUnmerged = run('git for-each-ref refs/heads --format="%(refname:short)|%(committerdate:unix)"')
  .split("\n")
  .filter(Boolean)
  .map((l) => {
    const [name, ts] = l.replace(/"/g, "").split("|");
    return { name, ts: parseInt(ts, 10) };
  })
  .filter((b) => b.name !== "main" && b.ts > cutoff)
  .filter((b) => {
    try {
      execSync(`git merge-base --is-ancestor "${b.name}" main`, { stdio: "ignore" });
      return false; // already merged
    } catch {
      return true;
    }
  });
if (recentUnmerged.length) {
  warnings.push(
    `Unmerged branches with commits in the last ${UNMERGED_BRANCH_WINDOW_DAYS} days: ${recentUnmerged.map((b) => b.name).join(", ")} — flag these to the human for review/merge.`
  );
}

// 4. Vault log staleness — code moved but rangar.md did not.
if (existsSync("context/rangar.md")) {
  const fm = readFileSync("context/rangar.md", "utf8").match(/^updated:\s*(\d{4}-\d{2}-\d{2})/m);
  const lastCommitDate = run("git log -1 --format=%cs");
  if (fm && lastCommitDate && fm[1] < lastCommitDate) {
    warnings.push(
      `context/rangar.md 'updated' (${fm[1]}) is older than the latest commit (${lastCommitDate}) — the last session likely ended without the close-out ritual.`
    );
  }
}

// 5. Active specs — context, not a warning.
const specsDir = "context/specs";
if (existsSync(specsDir)) {
  for (const f of readdirSync(specsDir)) {
    if (!f.endsWith(".md")) continue;
    const head = readFileSync(join(specsDir, f), "utf8").slice(0, 400);
    if (/^status:\s*active\s*$/m.test(head)) info.push(f.replace(/\.md$/, ""));
  }
}

const lines = [];
if (warnings.length) {
  lines.push("RANGAR DRIFT CHECK — drift detected at session start:");
  lines.push(...warnings.map((w) => `- ${w}`));
  lines.push(
    "Before starting new work: run rangar-session-start, reconcile the items above, and if prior work is complete run rangar-ship. Do not silently continue on top of drift."
  );
} else {
  lines.push("Rangar drift check: clean.");
}
if (info.length) lines.push(`Active specs: ${info.join(", ")}.`);
console.log(lines.join("\n"));
