import { create } from "zustand";
import type { VehicleMake } from "@/types";

interface VehicleStore {
  // Vehicles table
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Detail modal
  selectedMake: VehicleMake | null;
  setSelectedMake: (make: VehicleMake | null) => void;

  // Chart — multi-select vehicle type filter (empty = show all)
  activeVehicleTypes: Set<string>;
  toggleVehicleType: (type: string) => void;
  clearVehicleTypeFilter: () => void;
}

export const useVehicleStore = create<VehicleStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  selectedMake: null,
  setSelectedMake: (selectedMake) => set({ selectedMake }),

  activeVehicleTypes: new Set<string>(),
  toggleVehicleType: (type) =>
    set((state) => {
      const next = new Set(state.activeVehicleTypes);
      next.has(type) ? next.delete(type) : next.add(type);
      return { activeVehicleTypes: next };
    }),
  clearVehicleTypeFilter: () => set({ activeVehicleTypes: new Set() }),
}));
