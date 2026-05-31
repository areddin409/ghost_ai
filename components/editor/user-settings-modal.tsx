"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useUserSettings } from "./user-settings-context"
import { NODE_COLORS, NODE_SHAPES } from "@/types/canvas"

const BACKGROUND_PRESETS = [
  { label: "Subtle", hex: "#1e1e23" },
  { label: "Default", hex: "#2a2a30" },
  { label: "Bright", hex: "#3a3a45" },
  { label: "Vivid", hex: "#52525e" },
]

const EDGE_ROUTING_OPTIONS = ["smoothstep", "step", "straight"] as const
const BACKGROUND_VARIANTS = ["dots", "lines", "cross", "none"] as const

interface UserSettingsModalProps {
  open: boolean
  onClose: () => void
}

export function UserSettingsModal({ open, onClose }: UserSettingsModalProps) {
  const { settings, updatePending, saveSettings, cancelSettings, isSaving } = useUserSettings()

  async function handleSave() {
    try {
      await saveSettings()
      onClose()
    } catch {
      // saveSettings threw (network error or non-ok response) — keep modal open
    }
  }

  function handleCancel() {
    cancelSettings()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Canvas */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Canvas</h3>

            <div className="space-y-1">
              <Label>Background pattern</Label>
              <div className="flex gap-1">
                {BACKGROUND_VARIANTS.map((v) => (
                  <Button
                    key={v}
                    variant={settings.backgroundVariant === v ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePending("backgroundVariant", v)}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label className={settings.backgroundVariant === "none" ? "opacity-50" : ""}>
                Background brightness
              </Label>
              <div className="flex gap-2">
                {BACKGROUND_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    disabled={settings.backgroundVariant === "none"}
                    onClick={() => updatePending("backgroundPatternColor", p.hex)}
                    title={p.label}
                    className="h-6 w-6 rounded-full border-2 disabled:opacity-40"
                    style={{
                      backgroundColor: p.hex,
                      borderColor: settings.backgroundPatternColor === p.hex ? "#00c8d4" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Snap to grid</Label>
              <Switch
                checked={settings.snapToGrid}
                onCheckedChange={(v) => updatePending("snapToGrid", v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Minimap</Label>
              <Switch
                checked={settings.minimapVisible}
                onCheckedChange={(v) => updatePending("minimapVisible", v)}
              />
            </div>
          </section>

          {/* Connections */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Connections</h3>
            <div className="space-y-1">
              <Label>Edge routing</Label>
              <div className="flex gap-1">
                {EDGE_ROUTING_OPTIONS.map((r) => (
                  <Button
                    key={r}
                    variant={settings.edgeRouting === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePending("edgeRouting", r)}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Node Defaults */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Node Defaults</h3>

            <div className="space-y-1">
              <Label>Default shape</Label>
              <div className="flex gap-1 flex-wrap">
                {NODE_SHAPES.map((shape) => (
                  <Button
                    key={shape}
                    variant={settings.defaultNodeShape === shape ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePending("defaultNodeShape", shape)}
                  >
                    {shape}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Default color</Label>
              <div className="flex gap-2 flex-wrap">
                {NODE_COLORS.map(({ fill }) => (
                  <button
                    key={fill}
                    onClick={() => updatePending("defaultNodeColor", fill)}
                    className="h-6 w-6 rounded-full border-2"
                    style={{
                      backgroundColor: fill,
                      borderColor: settings.defaultNodeColor === fill ? "#00c8d4" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
          <Button onClick={() => void handleSave()} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
