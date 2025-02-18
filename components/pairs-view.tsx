"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { TeamMember, Feature } from "@/types"
import { Users, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface EditPairDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: Feature
  teamMembers: TeamMember[]
  onUpdate: (updatedFeature: Feature) => void
}

function EditPairDialog({ open, onOpenChange, feature, teamMembers, onUpdate }: EditPairDialogProps) {
  const [editedFeature, setEditedFeature] = useState(feature)

  const handleUpdate = () => {
    onUpdate(editedFeature)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pair Assignment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold">{feature.title}</h3>
            <Badge className="mr-2">{feature.status}</Badge>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>First Pair Member</Label>
              <Select
                value={editedFeature.pair1?.id || "none"}
                onValueChange={(value) =>
                  setEditedFeature({
                    ...editedFeature,
                    pair1: value === "none" ? null : teamMembers.find((m) => m.id === value) || null,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select first pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Second Pair Member</Label>
              <Select
                value={editedFeature.pair2?.id || "none"}
                onValueChange={(value) =>
                  setEditedFeature({
                    ...editedFeature,
                    pair2: value === "none" ? null : teamMembers.find((m) => m.id === value) || null,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select second pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {teamMembers
                    .filter((m) => m.id !== editedFeature.pair1?.id)
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpdate}>Update Assignment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PairsView() {
  const { features, teamMembers, updateFeature } = useStore()
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const statusColors = {
    todo: "bg-slate-500",
    "in-progress": "bg-blue-500",
    review: "bg-yellow-500",
    done: "bg-green-500",
  }

  // Get active pairs and their features
  const pairAssignments = features.reduce(
    (acc, feature) => {
      if (feature.pair1 && feature.pair2) {
        const pairKey = [feature.pair1.id, feature.pair2.id].sort().join("-")
        if (!acc[pairKey]) {
          acc[pairKey] = {
            pair: [feature.pair1, feature.pair2],
            features: [],
          }
        }
        acc[pairKey].features.push(feature)
      }
      return acc
    },
    {} as Record<string, { pair: TeamMember[]; features: typeof features }>,
  )

  const filteredPairAssignments = Object.entries(pairAssignments).filter(([_, { pair }]) => {
    const pairNames = pair.map((member) => member.name.toLowerCase()).join(" ")
    return pairNames.includes(searchQuery.toLowerCase())
  })

  // Get unassigned team members
  const assignedMemberIds = new Set(
    Object.values(pairAssignments).flatMap(({ pair }) => pair.map((member) => member.id)),
  )
  const unassignedMembers = teamMembers.filter((member) => !assignedMemberIds.has(member.id))

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Current Pair Assignments
          </CardTitle>
          <div className="relative w-full sm:w-[300px]">
            <Input
              placeholder="Search pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Users className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Pair</TableHead>
                <TableHead>Features</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(Object.fromEntries(filteredPairAssignments)).map(({ pair, features }) => (
                <TableRow key={pair.map((p) => p.id).join("-")}>
                  <TableCell className="font-medium">{pair.map((member) => member.name).join(" & ")}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature) => (
                        <div key={feature.id} className="group flex items-center gap-2 rounded-lg border p-2">
                          <span>{feature.title}</span>
                          <Badge className={statusColors[feature.status]}>{feature.status}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setEditingFeature(feature)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {unassignedMembers.length > 0 && (
                <TableRow>
                  <TableCell colSpan={2}>
                    <div className="text-sm text-muted-foreground">
                      Unassigned members: {unassignedMembers.map((member) => member.name).join(", ")}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingFeature && (
        <EditPairDialog
          open={!!editingFeature}
          onOpenChange={(open) => !open && setEditingFeature(null)}
          feature={editingFeature}
          teamMembers={teamMembers}
          onUpdate={updateFeature}
        />
      )}
    </div>
  )
}

