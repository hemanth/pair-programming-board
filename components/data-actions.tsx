"use client"

import { Download, Upload } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"

export function DataActions() {
  const { features, teamMembers, sprints, loadBoardData } = useStore()
  const { toast } = useToast()

  const handleExport = () => {
    const data = {
      features,
      teamMembers,
      sprints,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pair-programming-board-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Data Exported",
      description: "Your board data has been exported successfully.",
    })
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            if (data.features && data.teamMembers && data.sprints) {
              loadBoardData(data)
              toast({
                title: "Data Imported",
                description: "Your board data has been imported successfully.",
              })
            } else {
              throw new Error("Invalid file format")
            }
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "The selected file is not a valid board data file.",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Data Management</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Export Data (Alt+E)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleImport} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span>Import Data (Alt+I)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

