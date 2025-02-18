"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDays, format, isBefore } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface CopySprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CopySprintDialog({ open, onOpenChange }: CopySprintDialogProps) {
  const { sprints, features, addSprint, addFeature } = useStore()
  const { toast } = useToast()
  const [selectedSprintId, setSelectedSprintId] = useState<string>("")
  const [newSprintName, setNewSprintName] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const handleSourceSprintChange = (sprintId: string) => {
    setSelectedSprintId(sprintId)
    const sourceSprint = sprints.find((sprint) => sprint.id === sprintId)
    if (sourceSprint) {
      // Get the next sprint number
      const currentSprintNumber = Number.parseInt(sourceSprint.name)
      const nextSprintNumber = currentSprintNumber + 1
      setNewSprintName(nextSprintNumber.toString())

      // Set default dates to two weeks after the source sprint
      const sourceStart = new Date(sourceSprint.startDate)
      const sourceEnd = new Date(sourceSprint.endDate)
      setStartDate(addDays(sourceStart, 14))
      setEndDate(addDays(sourceEnd, 14))
    }
  }

  const handleCopySprint = () => {
    if (!startDate || !endDate || !newSprintName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (isBefore(endDate, startDate)) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date.",
        variant: "destructive",
      })
      return
    }

    const sourceSprint = sprints.find((sprint) => sprint.id === selectedSprintId)
    if (!sourceSprint) return

    // Create new sprint with provided details
    const newSprint = {
      name: newSprintName,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: "planned" as const,
      goals: [...sourceSprint.goals],
    }

    const newSprintId = addSprint(newSprint)

    // Copy features from selected sprint
    const sprintFeatures = features.filter((feature) => feature.sprintNumber === selectedSprintId)

    sprintFeatures.forEach((feature) => {
      addFeature({
        ...feature,
        sprintNumber: newSprintId,
        status: "todo",
      })
    })

    toast({
      title: "Sprint Copied",
      description: `Successfully copied Sprint #${sourceSprint.name} to Sprint #${newSprintName}`,
    })

    onOpenChange(false)
    setSelectedSprintId("")
    setNewSprintName("")
    setStartDate(undefined)
    setEndDate(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Copy Sprint</DialogTitle>
          <DialogDescription>Copy features from an existing sprint to a new one</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Source Sprint</Label>
            <Select value={selectedSprintId} onValueChange={handleSourceSprintChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sprint to copy" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    Sprint #{sprint.name} ({format(new Date(sprint.startDate), "MMM d")} -{" "}
                    {format(new Date(sprint.endDate), "MMM d")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newSprintName">Sprint Number</Label>
            <Input
              id="newSprintName"
              value={newSprintName}
              onChange={(e) => setNewSprintName(e.target.value)}
              placeholder="Enter sprint number"
            />
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCopySprint} disabled={!selectedSprintId || !newSprintName || !startDate || !endDate}>
              Copy Sprint
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

