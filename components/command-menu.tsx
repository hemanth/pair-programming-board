"use client"

import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useStore } from "@/lib/store"
import { TeamMemberProfile } from "./team-member-profile"
import type { TeamMember } from "@/types"
import { useSearchStore } from "@/lib/search-store"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null)
  const { features, teamMembers } = useStore()
  const setSelectedFeature = useSearchStore((state) => state.setSelectedFeature)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search features or team members..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Features">
            {features.map((feature) => (
              <CommandItem
                key={feature.id}
                onSelect={() => {
                  setSelectedFeature(feature)
                  setOpen(false)
                }}
              >
                {feature.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Team Members">
            {teamMembers.map((member) => (
              <CommandItem
                key={member.id}
                onSelect={() => {
                  setSelectedMember(member)
                  setOpen(false)
                }}
              >
                {member.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {selectedMember && (
        <TeamMemberProfile
          member={selectedMember}
          open={!!selectedMember}
          onOpenChange={(open) => !open && setSelectedMember(null)}
        />
      )}
    </>
  )
}

