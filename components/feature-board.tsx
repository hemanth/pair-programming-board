"use client"

import { useState } from "react"
import type { Feature, TeamMember, Sprint } from "@/types"
import { FeatureCard } from "@/components/feature-card"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchStore } from "@/lib/search-store"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeatureBoardProps {
  features: Feature[]
  teamMembers: TeamMember[]
  sprints: Sprint[]
}

export function FeatureBoard({ features, teamMembers, sprints }: FeatureBoardProps) {
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null)
  const { selectedFeature, setSelectedFeature } = useSearchStore()

  let filteredFeatures = selectedSprintId
    ? features.filter(
        (feature) => sprints.find((sprint) => sprint.id === selectedSprintId)?.id === feature.sprintNumber,
      )
    : features

  if (selectedFeature) {
    filteredFeatures = filteredFeatures.filter((feature) => feature.id === selectedFeature.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Features</h2>
        <div className="flex items-center gap-4">
          {selectedFeature && (
            <Button variant="outline" onClick={() => setSelectedFeature(null)} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear Filter
            </Button>
          )}
          <Select value={selectedSprintId || "all"} onValueChange={setSelectedSprintId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Sprints" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sprints</SelectItem>
              {sprints.map((sprint) => (
                <SelectItem key={sprint.id} value={sprint.id}>
                  Sprint {sprint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No features found. {selectedFeature ? "Try clearing the filter." : ""}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredFeatures.map((feature) => (
          <motion.div
            key={feature.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <FeatureCard feature={feature} teamMembers={teamMembers} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

