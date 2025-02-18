"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"

export function useKeyboardShortcuts(
  setIsAddingFeature: (value: boolean) => void,
  setIsAddingMember: (value: boolean) => void,
  setIsAddingSprint: (value: boolean) => void,
  setIsCopyingSprint: (value: boolean) => void,
) {
  const { loadDemoData } = useStore()
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === "n" && e.altKey) {
        e.preventDefault()
        setIsAddingFeature(true)
      } else if (e.key === "m" && e.altKey) {
        e.preventDefault()
        setIsAddingMember(true)
      } else if (e.key === "s" && e.altKey) {
        e.preventDefault()
        setIsAddingSprint(true)
      } else if (e.key === "c" && e.altKey) {
        e.preventDefault()
        setIsCopyingSprint(true)
      } else if (e.key === "d" && e.altKey) {
        e.preventDefault()
        loadDemoData()
        toast({
          title: "Demo data loaded",
          description: "Sample sprints, features, and team members have been loaded.",
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setIsAddingFeature, setIsAddingMember, setIsAddingSprint, setIsCopyingSprint, loadDemoData, toast])
}

