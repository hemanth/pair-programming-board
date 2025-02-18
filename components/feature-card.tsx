"use client"

import { useState, useEffect, useCallback } from "react"
import type { Feature } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Users, Eye, EyeOff, Copy } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import debounce from "lodash/debounce"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "./ui/use-toast"

interface FeatureCardProps {
  feature: Feature
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const { updateFeature, deleteFeature, teamMembers, sprints, addFeature, getSprintNumber } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editedFeature, setEditedFeature] = useState(feature)
  const { toast } = useToast()

  const statusColors = {
    todo: "bg-slate-500",
    "in-progress": "bg-blue-500",
    review: "bg-yellow-500",
    done: "bg-green-500",
  }

  // Debounced auto-save function
  const debouncedSave = useCallback(
    debounce((feature: Feature) => {
      updateFeature(feature)
    }, 1000),
    [],
  )

  // Auto-save when editedFeature changes
  useEffect(() => {
    if (isEditing) {
      debouncedSave(editedFeature)
    }
  }, [editedFeature, isEditing, debouncedSave])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

  const handleClose = () => {
    setIsEditing(false)
    setShowPreview(false)
  }

  const handleClone = (targetSprintId?: string) => {
    const newFeature = {
      ...feature,
      status: "todo" as const,
      sprintNumber: targetSprintId || feature.sprintNumber,
    }
    addFeature(newFeature)
    toast({
      title: "Feature Cloned",
      description: `Successfully cloned "${feature.title}"`,
    })
  }

  const sprintNumber = getSprintNumber(feature.sprintNumber)

  return (
    <>
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{feature.title}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleClone()}>Clone in Current Sprint</DropdownMenuItem>
                  {sprints
                    .filter((sprint) => sprint.id !== feature.sprintNumber)
                    .map((sprint) => (
                      <DropdownMenuItem key={sprint.id} onClick={() => handleClone(sprint.id)}>
                        Clone to Sprint #{sprint.name}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={() => deleteFeature(feature.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Sprint #{sprintNumber}</Badge>
            <Badge className={statusColors[feature.status]}>{feature.status}</Badge>
            {(feature.pair1 || feature.pair2) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {[feature.pair1?.name, feature.pair2?.name].filter(Boolean).join(" & ")}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Assigned Pair</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Goal</h3>
            <div className="prose prose-sm dark:prose-invert">
              <ReactMarkdown>{feature.goal}</ReactMarkdown>
            </div>
          </div>
          {feature.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold">Notes</h3>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{feature.notes}</ReactMarkdown>
              </div>
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            Last updated {formatDistanceToNow(new Date(feature.lastUpdated))} ago
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Feature</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedFeature.title}
                onChange={(e) => setEditedFeature({ ...editedFeature, title: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editedFeature.status}
                  onValueChange={(value) =>
                    setEditedFeature({
                      ...editedFeature,
                      status: value as Feature["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assigned Pairs</Label>
                <div className="grid gap-2">
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
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="goal">Goal</Label>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show Preview
                    </>
                  )}
                </Button>
              </div>
              {!showPreview ? (
                <Textarea
                  id="goal"
                  value={editedFeature.goal}
                  onChange={(e) => setEditedFeature({ ...editedFeature, goal: e.target.value })}
                  className="min-h-[100px]"
                />
              ) : (
                <div
                  className={cn(
                    "prose prose-sm dark:prose-invert rounded-md border p-4",
                    !editedFeature.goal && "italic text-muted-foreground",
                  )}
                >
                  <ReactMarkdown>{editedFeature.goal || "No goal set"}</ReactMarkdown>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notes">Notes</Label>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show Preview
                    </>
                  )}
                </Button>
              </div>
              {!showPreview ? (
                <Textarea
                  id="notes"
                  value={editedFeature.notes}
                  onChange={(e) => setEditedFeature({ ...editedFeature, notes: e.target.value })}
                  className="min-h-[100px]"
                  placeholder="Add notes..."
                />
              ) : (
                <div
                  className={cn(
                    "prose prose-sm dark:prose-invert rounded-md border p-4",
                    !editedFeature.notes && "italic text-muted-foreground",
                  )}
                >
                  <ReactMarkdown>{editedFeature.notes || "No notes added"}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

