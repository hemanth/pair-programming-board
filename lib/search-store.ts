import { create } from "zustand"
import type { Feature } from "@/types"

interface SearchState {
  selectedFeature: Feature | null
  setSelectedFeature: (feature: Feature | null) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  selectedFeature: null,
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
}))

