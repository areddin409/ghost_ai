"use client"

import { useState, useCallback, useRef } from "react"
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { role: "user", content: trimmed }])
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
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
          <div className="min-h-0 flex-1 overflow-y-auto p-3 [scrollbar-color:var(--border-default)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-default [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-border-subtle">
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
                      <div className="max-w-[85%] wrap-break-word rounded-2xl rounded-br-sm border-2 border-accent-primary/50 bg-accent-primary-dim px-3 py-2 text-sm text-text-primary">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex justify-start">
                      <div className="max-w-[85%] wrap-break-word rounded-2xl rounded-bl-sm border border-border-default bg-bg-elevated px-3 py-2 text-sm text-accent-ai-text">
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
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onInput={(e) => {
                  const el = e.currentTarget
                  el.style.height = "auto"
                  el.style.height = `${el.scrollHeight}px`
                }}
                placeholder="Describe a system to design…"
                style={{ minHeight: "72px", maxHeight: "160px" }}
                className="resize-none overflow-y-auto border-border-default bg-bg-elevated pb-10 text-sm text-text-primary placeholder:text-text-faint [scrollbar-color:var(--border-default)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-default [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-border-subtle"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                size="icon-sm"
                aria-label="Send"
                className="absolute bottom-2 right-2 bg-accent-ai text-white hover:bg-accent-ai/90 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
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
