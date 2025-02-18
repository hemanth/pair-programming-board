"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { FeatureBoard } from "@/components/feature-board"
import { Header } from "@/components/header"
import { CommandMenu } from "@/components/command-menu"
import { FloatingActions } from "@/components/floating-actions"
import { PairsView } from "@/components/pairs-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, Users } from "lucide-react"

export function HomePage() {
  const { features, teamMembers, sprints } = useStore()
  const [activeView, setActiveView] = useState("board")

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-6">
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="board" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Board View
            </TabsTrigger>
            <TabsTrigger value="pairs" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pairs View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="board" className="m-0">
            <FeatureBoard features={features} teamMembers={teamMembers} sprints={sprints} />
          </TabsContent>
          <TabsContent value="pairs" className="m-0">
            <PairsView />
          </TabsContent>
        </Tabs>
      </div>
      <FloatingActions />
      <CommandMenu />
    </main>
  )
}

