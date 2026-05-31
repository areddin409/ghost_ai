"use client"

import { createContext, useContext, useState, useCallback } from "react"
import type { UserSettings } from "@/app/generated/prisma/client"

interface UserSettingsContextValue {
  settings: UserSettings
  updatePending: (key: keyof UserSettings, value: unknown) => void
  saveSettings: () => Promise<void>
  cancelSettings: () => void
  isSaving: boolean
}

const UserSettingsContext = createContext<UserSettingsContextValue | null>(null)

export function UserSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode
  initialSettings: UserSettings
}) {
  const [savedSettings, setSavedSettings] = useState(initialSettings)
  const [pendingSettings, setPendingSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const updatePending = useCallback((key: keyof UserSettings, value: unknown) => {
    setPendingSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  const saveSettings = useCallback(async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/user-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingSettings),
      })
      if (!res.ok) throw new Error(`Failed to save settings: ${res.status}`)
      const updated: UserSettings = await res.json()
      setSavedSettings(updated)
      setPendingSettings(updated)
    } finally {
      setIsSaving(false)
    }
  }, [pendingSettings])

  const cancelSettings = useCallback(() => {
    setPendingSettings(savedSettings)
  }, [savedSettings])

  return (
    <UserSettingsContext.Provider
      value={{ settings: pendingSettings, updatePending, saveSettings, cancelSettings, isSaving }}
    >
      {children}
    </UserSettingsContext.Provider>
  )
}

export function useUserSettings(): UserSettingsContextValue {
  const ctx = useContext(UserSettingsContext)
  if (!ctx) throw new Error("useUserSettings must be used within UserSettingsProvider")
  return ctx
}
