"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users } from "lucide-react"
import type { TeamMember, Feature } from "@/types"
import { useStore } from "@/lib/store"

interface TeamMemberProfileProps {
  member: TeamMember
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamMemberProfile({ member, open, onOpenChange }: TeamMemberProfileProps) {
  const { features, getSprintNumber } = useStore()

  // Get all features where the member is part of a pair
  const memberFeatures = features.filter(
    (feature) => feature.pair1?.id === member.id || feature.pair2?.id === member.id,
  )

  // Group features by sprint
  const featuresBySprint = memberFeatures.reduce(
    (acc, feature) => {
      const sprintNumber = getSprintNumber(feature.sprintNumber)
      if (!acc[sprintNumber]) {
        acc[sprintNumber] = []
      }
      acc[sprintNumber].push(feature)
      return acc
    },
    {} as Record<number, Feature[]>,
  )

  // Get unique pair partners
  const pairPartners = new Set(
    memberFeatures
      .map((feature) => {
        if (feature.pair1?.id === member.id) return feature.pair2
        return feature.pair1
      })
      .filter(Boolean)
      .map((partner) => partner?.name),
  )

  const statusColors = {
    todo: "bg-slate-500",
    "in-progress": "bg-blue-500",
    review: "bg-yellow-500",
    done: "bg-green-500",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{member.name}&apos;s Profile</DialogTitle>
          <DialogDescription>
            View team member&apos;s pair programming history and feature contributions
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[600px] pr-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5" />
                  Pair Programming Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(pairPartners).map((partner) => (
                    <Badge key={partner} variant="secondary">
                      {partner}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {Object.entries(featuresBySprint)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([sprint, sprintFeatures]) => (
                  <Card key={sprint}>
                    <CardHeader>
                      <CardTitle className="text-base">Sprint #{sprint}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {sprintFeatures.map((feature, idx) => (
                        <div key={feature.id}>
                          {idx > 0 && <Separator className="my-4" />}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{feature.title}</h3>
                              <Badge className={statusColors[feature.status]}>{feature.status}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>
                                Paired with{" "}
                                {feature.pair1?.id === member.id ? feature.pair2?.name : feature.pair1?.name}
                              </span>
                            </div>
                            {feature.goal && <p className="text-sm text-muted-foreground">Goal: {feature.goal}</p>}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

