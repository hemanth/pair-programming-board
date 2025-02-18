"use client"

import * as React from "react"
import { Plus, Users, ListPlus, Copy, Database, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AddFeatureDialog } from "./add-feature-dialog"
import { AddTeamMemberDialog } from "./add-team-member-dialog"
import { AddSprintDialog } from "./add-sprint-dialog"
import { CopySprintDialog } from "./copy-sprint-dialog"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { useKeyboardShortcuts } from "@/lib/keyboard-shortcuts"

export function FloatingActions() {
  const [isAddingFeature, setIsAddingFeature] = React.useState(false)
  const [isAddingMember, setIsAddingMember] = React.useState(false)
  const [isAddingSprint, setIsAddingSprint] = React.useState(false)
  const [isCopyingSprint, setIsCopyingSprint] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const { loadDemoData } = useStore()
  const { toast } = useToast()

  useKeyboardShortcuts(setIsAddingFeature, setIsAddingMember, setIsAddingSprint, setIsCopyingSprint)

  const handleLoadDemo = () => {
    loadDemoData()
    toast({
      title: "Demo data loaded",
      description: "Sample sprints, features, and team members have been loaded.",
    })
  }

  React.useEffect(() => {
    const handleMouseEnter = () => setIsOpen(true)
    const handleMouseLeave = () => setIsOpen(false)
    const menuElement = menuRef.current

    if (menuElement) {
      menuElement.addEventListener("mouseenter", handleMouseEnter)
      menuElement.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (menuElement) {
        menuElement.removeEventListener("mouseenter", handleMouseEnter)
        menuElement.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  const menuItems = [
    {
      icon: Database,
      label: "Load Demo Data",
      onClick: handleLoadDemo,
      shortcut: "Alt+D",
    },
    {
      icon: Copy,
      label: "Copy Sprint",
      onClick: () => setIsCopyingSprint(true),
      shortcut: "Alt+C",
    },
    {
      icon: Plus,
      label: "Add Sprint",
      onClick: () => setIsAddingSprint(true),
      shortcut: "Alt+S",
    },
    {
      icon: Users,
      label: "Add Team Member",
      onClick: () => setIsAddingMember(true),
      shortcut: "Alt+M",
    },
    {
      icon: ListPlus,
      label: "Add Feature",
      onClick: () => setIsAddingFeature(true),
      shortcut: "Alt+N",
    },
  ]

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50" ref={menuRef}>
        <div className="relative">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full right-0 mb-4 flex flex-col gap-4"
              >
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-14 w-14 rounded-full shadow-lg dark:bg-secondary dark:hover:bg-secondary/80"
                          onClick={item.onClick}
                        >
                          <item.icon className="h-6 w-6" />
                          <span className="sr-only">{item.label}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>
                          {item.label} ({item.shortcut})
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg dark:bg-primary dark:hover:bg-primary/90"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <MoreVertical className="h-6 w-6" />
            </motion.div>
          </Button>
        </div>

        <AddFeatureDialog open={isAddingFeature} onOpenChange={setIsAddingFeature} />
        <AddTeamMemberDialog open={isAddingMember} onOpenChange={setIsAddingMember} />
        <AddSprintDialog open={isAddingSprint} onOpenChange={setIsAddingSprint} />
        <CopySprintDialog open={isCopyingSprint} onOpenChange={setIsCopyingSprint} />
      </div>
    </TooltipProvider>
  )
}

