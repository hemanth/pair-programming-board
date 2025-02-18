import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Feature, TeamMember, Sprint } from "@/types"
import { v4 as uuidv4 } from "uuid"

interface BoardState {
  features: Feature[]
  teamMembers: TeamMember[]
  sprints: Sprint[]
  addFeature: (feature: Omit<Feature, "id" | "lastUpdated">) => string
  updateFeature: (feature: Feature) => void
  deleteFeature: (id: string) => void
  addTeamMember: (member: Omit<TeamMember, "id">) => string
  removeTeamMember: (id: string) => void
  addSprint: (sprint: Omit<Sprint, "id">) => string
  updateSprint: (sprint: Sprint) => void
  loadDemoData: () => void
  getSprintNumber: (sprintId: string) => number
  clearDemoData: () => void
  loadBoardData: (data: { features: Feature[]; teamMembers: TeamMember[]; sprints: Sprint[] }) => void
}

const demoTeamMembers: TeamMember[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", email: "bob@example.com" },
  { id: "3", name: "Carol Williams", email: "carol@example.com" },
  { id: "4", name: "David Brown", email: "david@example.com" },
  { id: "5", name: "Eva Martinez", email: "eva@example.com" },
  { id: "6", name: "Frank Chen", email: "frank@example.com" },
]

const demoSprints: Sprint[] = [
  {
    id: "sprint1",
    name: "1",
    startDate: new Date(2024, 0, 1).toISOString(),
    endDate: new Date(2024, 0, 14).toISOString(),
    status: "completed",
    goals: ["Set up core infrastructure", "Implement basic auth", "Create MVP dashboard"],
  },
  {
    id: "sprint2",
    name: "2",
    startDate: new Date(2024, 0, 15).toISOString(),
    endDate: new Date(2024, 0, 28).toISOString(),
    status: "completed",
    goals: ["Add user management", "Implement file upload", "Create reporting system"],
  },
  {
    id: "sprint3",
    name: "3",
    startDate: new Date(2024, 1, 1).toISOString(),
    endDate: new Date(2024, 1, 14).toISOString(),
    status: "active",
    goals: ["Optimize performance", "Add analytics", "Implement real-time updates"],
  },
  {
    id: "sprint4",
    name: "4",
    startDate: new Date(2024, 1, 15).toISOString(),
    endDate: new Date(2024, 1, 28).toISOString(),
    status: "planned",
    goals: ["Mobile responsiveness", "Dark mode", "Accessibility improvements"],
  },
]

const demoFeatures: Feature[] = [
  {
    id: "feature1",
    title: "User Authentication System",
    sprintNumber: "sprint1",
    pair1: demoTeamMembers[0],
    pair2: demoTeamMembers[1],
    notes: "Implement OAuth 2.0 with support for Google and GitHub",
    status: "done",
    lastUpdated: new Date(2024, 0, 10).toISOString(),
    goal: "Create a secure authentication system with social login support",
  },
  {
    id: "feature2",
    title: "Dashboard Layout",
    sprintNumber: "sprint1",
    pair1: demoTeamMembers[2],
    pair2: demoTeamMembers[3],
    notes: "Design and implement responsive dashboard with key metrics",
    status: "done",
    lastUpdated: new Date(2024, 0, 12).toISOString(),
    goal: "Create an intuitive dashboard layout that works on all devices",
  },
  {
    id: "feature3",
    title: "User Management Interface",
    sprintNumber: "sprint2",
    pair1: demoTeamMembers[0],
    pair2: demoTeamMembers[4],
    notes: "CRUD operations for user management with role-based access",
    status: "done",
    lastUpdated: new Date(2024, 0, 25).toISOString(),
    goal: "Implement comprehensive user management system",
  },
  {
    id: "feature4",
    title: "File Upload System",
    sprintNumber: "sprint2",
    pair1: demoTeamMembers[1],
    pair2: demoTeamMembers[5],
    notes: "Support for drag-and-drop uploads with progress tracking",
    status: "done",
    lastUpdated: new Date(2024, 0, 27).toISOString(),
    goal: "Create robust file upload system with progress indicators",
  },
  {
    id: "feature5",
    title: "Performance Optimization",
    sprintNumber: "sprint3",
    pair1: demoTeamMembers[2],
    pair2: demoTeamMembers[5],
    notes: "Implement code splitting and lazy loading",
    status: "in-progress",
    lastUpdated: new Date(2024, 1, 5).toISOString(),
    goal: "Improve application performance and loading times",
  },
  {
    id: "feature6",
    title: "Analytics Dashboard",
    sprintNumber: "sprint3",
    pair1: demoTeamMembers[3],
    pair2: demoTeamMembers[4],
    notes: "Integration with Google Analytics and custom event tracking",
    status: "todo",
    lastUpdated: new Date(2024, 1, 1).toISOString(),
    goal: "Create comprehensive analytics dashboard",
  },
  {
    id: "feature7",
    title: "Real-time Updates",
    sprintNumber: "sprint3",
    pair1: demoTeamMembers[0],
    pair2: demoTeamMembers[2],
    notes: "Implement WebSocket connection for live updates",
    status: "review",
    lastUpdated: new Date(2024, 1, 7).toISOString(),
    goal: "Add real-time functionality to the application",
  },
  {
    id: "feature8",
    title: "Mobile Responsive Design",
    sprintNumber: "sprint4",
    pair1: demoTeamMembers[1],
    pair2: demoTeamMembers[3],
    notes: "Ensure all components work well on mobile devices",
    status: "todo",
    lastUpdated: new Date(2024, 1, 15).toISOString(),
    goal: "Make application fully responsive on all devices",
  },
  {
    id: "feature9",
    title: "Dark Mode Implementation",
    sprintNumber: "sprint4",
    pair1: demoTeamMembers[4],
    pair2: demoTeamMembers[5],
    notes: "Add system-preferred and user-selected theme options",
    status: "todo",
    lastUpdated: new Date(2024, 1, 15).toISOString(),
    goal: "Implement dark mode with smooth transitions",
  },
]

export const useStore = create<BoardState>()(
  persist(
    (set, get) => ({
      features: [],
      teamMembers: [],
      sprints: [],
      addFeature: (feature) => {
        const id = uuidv4()
        set((state) => ({
          features: [
            ...state.features,
            {
              ...feature,
              id,
              lastUpdated: new Date().toISOString(),
            },
          ],
          // Clear demo data when adding new items
          teamMembers: state.teamMembers.some((m) => m.id.length > 5) ? state.teamMembers : [],
          sprints: state.sprints.some((s) => s.id !== "sprint1") ? state.sprints : [],
        }))
        return id
      },
      updateFeature: (updatedFeature) =>
        set((state) => ({
          features: state.features.map((feature) =>
            feature.id === updatedFeature.id ? { ...updatedFeature, lastUpdated: new Date().toISOString() } : feature,
          ),
        })),
      deleteFeature: (id) =>
        set((state) => ({
          features: state.features.filter((feature) => feature.id !== id),
        })),
      addTeamMember: (member) => {
        const id = uuidv4()
        set((state) => ({
          teamMembers: [...state.teamMembers, { ...member, id }],
          // Clear demo data when adding new items
          features: state.features.some((f) => f.id === "feature1") ? [] : state.features,
          sprints: state.sprints.some((s) => s.id === "sprint1") ? [] : state.sprints,
        }))
        return id
      },
      removeTeamMember: (id) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((member) => member.id !== id),
        })),
      addSprint: (sprint) => {
        const id = uuidv4()
        set((state) => ({
          sprints: [...state.sprints, { ...sprint, id }],
          // Clear demo data when adding new items
          features: state.features.some((f) => f.id === "feature1") ? [] : state.features,
          teamMembers: state.teamMembers.some((m) => m.id.length > 5) ? state.teamMembers : [],
        }))
        return id
      },
      updateSprint: (updatedSprint) =>
        set((state) => ({
          sprints: state.sprints.map((sprint) => (sprint.id === updatedSprint.id ? updatedSprint : sprint)),
        })),
      loadDemoData: () => {
        set({
          teamMembers: demoTeamMembers,
          sprints: demoSprints,
          features: demoFeatures,
        })
      },
      getSprintNumber: (sprintId) => {
        const { sprints } = get()
        const sprint = sprints.find((s) => s.id === sprintId)
        return sprint ? Number.parseInt(sprint.name) : 0
      },
      clearDemoData: () => {
        set({
          teamMembers: [],
          sprints: [],
          features: [],
        })
      },
      loadBoardData: (data) => {
        set({
          features: data.features,
          teamMembers: data.teamMembers,
          sprints: data.sprints,
        })
      },
    }),
    {
      name: "board-storage",
    },
  ),
)

