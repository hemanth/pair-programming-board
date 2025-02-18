export type TeamMember = {
  id: string
  name: string
  email: string
}

export type FeatureStatus = "todo" | "in-progress" | "review" | "done"

export type Feature = {
  id: string
  title: string
  sprintNumber: number
  pair1?: TeamMember
  pair2?: TeamMember
  notes: string
  status: FeatureStatus
  lastUpdated: string
  jiraLink?: string
  goal: string
}

export type Sprint = {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "planned"
  goals: string[]
}

export type PairSession = {
  id: string
  date: string
  startTime: string
  endTime: string
  participants: TeamMember[]
  notes: string
}

