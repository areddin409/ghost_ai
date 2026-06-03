---
type: feature-spec
feature: "01 — AI Sidebar"
status: planned
updated: 2026-06-02
---

# Feature 01 — AI Sidebar

> [!abstract] Goal
> Rebuild the existing AI sidebar placeholder into a full UI: header, tabbed layout (AI Architect + Specs), a chat interface with empty state, starter chips, message bubbles, and an auto-resizing input, plus a Specs tab with a generate button and a demo spec card.

**References:** [[architecture-context]] · [[code-standards]]

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Architecture:** The AI sidebar is a controlled panel component. `WorkspaceShell` owns `aiOpen` state and passes `isOpen` + `onClose` down to `AiSidebar`. The component manages its own local chat message state and textarea value. No backend calls or Liveblocks integration in this spec.

**Tech Stack:** React 19, TypeScript strict, shadcn/ui (`Button`, `Textarea`), Lucide React icons, Tailwind v4 CSS tokens from `globals.css`.

> [!note] Tab implementation
> The spec requests shadcn `Tabs`. Due to how Tailwind v4 generates CSS (stylesheet position determines winner for equal-specificity utilities), overriding the default active-state background of `TabsTrigger` requires the `!` important modifier: `data-[state=active]:!bg-accent-ai`. This is applied in the plan below.

---

## Scope

- Do not modify sidebar `position`, `width`, `z-index`, or `transition-transform` — only replace content.
- Do not add API calls, AI streaming, or Liveblocks connections.
- Only touch two files: `components/editor/panels/ai-sidebar.tsx` and `components/editor/shell/workspace-shell.tsx`.

---

## Token reference

All class names below use this project's actual Tailwind utility names (mapped from CSS custom properties in `globals.css`):

| Intent | Tailwind utility |
|---|---|
| Page background | `bg-bg-base` |
| Surface | `bg-bg-surface` |
| Elevated surface | `bg-bg-elevated` |
| Subtle surface | `bg-bg-subtle` |
| Default border | `border-border-default` |
| Primary text | `text-text-primary` |
| Muted text | `text-text-muted` |
| Faint text | `text-text-faint` |
| AI accent bg | `bg-accent-ai` (`#6457f9`) |
| AI accent text | `text-accent-ai-text` (`#8b82ff`) |
| AI dim bg | `bg-accent-ai-dim` |
| Brand dim bg | `bg-accent-primary-dim` |
| Brand border | `border-accent-primary` |

---

## Implementation

### Task 1: Rebuild `ai-sidebar.tsx`

**Files:**
- Modify: `components/editor/panels/ai-sidebar.tsx` (full replacement)

The `<aside>` wrapper and all its positioning/animation classes must remain unchanged. Everything inside is replaced.

- [ ] **Step 1: Replace the file with the full component**

```tsx
"use client"

import { useState, useCallback } from "react"
import { Bot, X, Send, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface AiSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  role: "user" | "assistant"
  content: string
}

const STARTER_PROMPTS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
] as const

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { role: "user", content: trimmed }])
    setInput("")
  }, [input])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen || undefined}
      className={cn(
        "fixed right-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] w-80 flex-col border-l border-border-default bg-bg-surface shadow-xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center border-b border-border-default px-4 py-3">
        <div className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-ai-dim">
          <Bot className="h-4 w-4 text-accent-ai-text" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="text-sm font-semibold leading-none text-text-primary">
            AI Workspace
          </h2>
          <p className="mt-0.5 text-xs text-text-muted">
            Collaborate with Ghost AI
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close AI sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="architect" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="h-auto w-full shrink-0 rounded-none border-b border-border-default bg-bg-surface p-0">
          <TabsTrigger
            value="architect"
            className="flex-1 rounded-none border-0 py-2.5 text-xs font-medium text-text-muted shadow-none data-[state=active]:!bg-accent-ai data-[state=active]:!text-white"
          >
            AI Architect
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="flex-1 rounded-none border-0 py-2.5 text-xs font-medium text-text-muted shadow-none data-[state=active]:!bg-accent-ai data-[state=active]:!text-white"
          >
            Specs
          </TabsTrigger>
        </TabsList>

        {/* AI Architect tab */}
        <TabsContent
          value="architect"
          className="mt-0 flex min-h-0 flex-1 flex-col"
        >
          {/* Chat scroll area */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-ai-dim">
                  <Bot className="h-6 w-6 text-accent-ai-text" />
                </div>
                <div className="px-2 text-center">
                  <p className="mb-1 text-sm font-medium text-text-primary">
                    Ghost AI Architect
                  </p>
                  <p className="text-xs leading-relaxed text-text-muted">
                    Describe a system and I&apos;ll help you design the
                    architecture.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setInput(prompt)}
                      className="rounded-full bg-bg-subtle px-3 py-1.5 text-left text-xs text-accent-ai-text transition-colors hover:bg-border-default"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) =>
                  msg.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-sm border-2 border-accent-primary/50 bg-accent-primary-dim px-3 py-2 text-sm text-text-primary">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border-default bg-bg-elevated px-3 py-2 text-sm text-accent-ai-text">
                        {msg.content}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="shrink-0 border-t border-border-default p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe a system to design…"
                style={{ minHeight: "72px", maxHeight: "160px" }}
                className="resize-none overflow-y-auto border-border-default bg-bg-elevated text-sm text-text-primary placeholder:text-text-faint"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                size="icon"
                className="h-9 w-9 shrink-0 bg-accent-ai text-white hover:bg-accent-ai/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Specs tab */}
        <TabsContent
          value="specs"
          className="mt-0 flex min-h-0 flex-1 flex-col p-3"
        >
          <Button className="mb-4 w-full bg-accent-ai text-white hover:bg-accent-ai/90">
            Generate Spec
          </Button>
          <div className="rounded-2xl border border-border-default bg-bg-elevated p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-bg-subtle">
                <FileText className="h-4 w-4 text-text-muted" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">
                  E-Commerce Architecture
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                  Microservices-based platform with cart service, inventory
                  management, and payment processing.
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="text-xs text-text-faint"
              >
                <Download className="mr-1 h-3 w-3" />
                Download
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
```

- [ ] **Step 2: Verify the file saved correctly** — open it in your editor and confirm there are no obvious syntax errors before proceeding.

---

### Task 2: Wire `onClose` in `workspace-shell.tsx`

**Files:**
- Modify: `components/editor/shell/workspace-shell.tsx` (one line change, line 76)

- [ ] **Step 1: Update the `AiSidebar` render call**

Find (line 76):
```tsx
<AiSidebar isOpen={aiOpen} />
```

Replace with:
```tsx
<AiSidebar isOpen={aiOpen} onClose={() => setAiOpen(false)} />
```

No other changes needed — `setAiOpen` is already in scope.

---

### Task 3: Build check and manual smoke test

**Files:** None.

- [ ] **Step 1: Run TypeScript build**

```bash
npm run build
```

Expected: Exits 0. No type errors. If you see `Property 'onClose' does not exist on type 'AiSidebarProps'`, the `workspace-shell.tsx` change from Task 2 is missing.

- [ ] **Step 2: Run dev server and smoke-test**

```bash
npm run dev
```

Open a workspace page and verify:

1. AI sidebar toggle button in the navbar opens the sidebar with a slide-in animation
2. Header shows bot icon (indigo dim bg), "AI Workspace" (white), "Collaborate with Ghost AI" (muted), and X button
3. X button closes the sidebar with the slide-out animation
4. Two tabs: "AI Architect" and "Specs"; active tab has indigo background
5. AI Architect tab (empty state): bot icon, description, and 3 starter chips with indigo text
6. Clicking a chip populates the textarea
7. Typing and pressing **Enter** adds a user message — right-aligned, cyan dim bg with cyan border
8. **Shift+Enter** inserts a newline instead of sending
9. Textarea grows as you type (min 72px, max 160px then scrolls)
10. Send button disabled when textarea is empty
11. Specs tab: "Generate Spec" button (indigo), demo spec card with icon, title, snippet, disabled Download button

- [ ] **Step 3: Commit**

```bash
git add components/editor/panels/ai-sidebar.tsx components/editor/shell/workspace-shell.tsx
git commit -m "feat: build out AI sidebar UI with header, tabs, chat interface, and specs tab"
```

---

## Check when done

- [ ] `components/editor/panels/ai-sidebar.tsx` is fully replaced with the new UI
- [ ] Sidebar slide-in/slide-out animation preserved (same `translate-x-0`/`translate-x-full` transition)
- [ ] Header: bot icon, "AI Workspace", "Collaborate with Ghost AI", close button
- [ ] Close button calls `onClose` and the sidebar slides out
- [ ] Two tabs (AI Architect, Specs) — active tab renders with indigo background
- [ ] AI Architect empty state: bot icon, description, 3 starter chips
- [ ] Starter chips populate the textarea on click
- [ ] User messages: right-aligned, cyan dim bg + border
- [ ] Textarea auto-resizes 72px → 160px; Enter submits, Shift+Enter newlines
- [ ] Send button disabled when input is empty
- [ ] Specs tab: Generate Spec button + demo spec card with disabled download
- [ ] `npm run build` passes without type errors

---

_Tracked in [[progress-tracker]]_
