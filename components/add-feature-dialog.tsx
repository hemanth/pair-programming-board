"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"

interface AddFeatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddFeatureDialog({ open, onOpenChange }: AddFeatureDialogProps) {
  const { addFeature, teamMembers, sprints } = useStore()
  const [title, setTitle] = useState("")
  const [sprintNumber, setSprintNumber] = useState("")
  const [goal, setGoal] = useState("")
  const [notes, setNotes] = useState("")
  const [pair1Id, setPair1Id] = useState("")
  const [pair2Id, setPair2Id] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const pair1 = teamMembers.find((member) => member.id === pair1Id)
    const pair2 = teamMembers.find((member) => member.id === pair2Id)

    addFeature({
      title,
      sprintNumber: Number.parseInt(sprintNumber),
      goal,
      notes,
      status: "todo",
      pair1,
      pair2,
    })
    onOpenChange(false)
    setTitle("")
    setSprintNumber("")
    setGoal("")
    setNotes("")
    setPair1Id("")
    setPair2Id("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Feature</DialogTitle>
          <DialogDescription>Create a new feature and assign it to a pair</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sprint">Sprint</Label>
            <Select value={sprintNumber} onValueChange={setSprintNumber}>
              <SelectTrigger>
                <SelectValue placeholder="Select sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pair1">Pair 1</Label>
              <Select value={pair1Id} onValueChange={setPair1Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pair2">Pair 2</Label>
              <Select value={pair2Id} onValueChange={setPair2Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers
                    .filter((member) => member.id !== pair1Id)
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Textarea id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Feature</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

