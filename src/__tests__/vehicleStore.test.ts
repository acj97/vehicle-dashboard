import { useVehicleStore } from "@/lib/store/vehicleStore";
import type { VehicleMake } from "@/types";

// Reset Zustand store state between tests
beforeEach(() => {
  useVehicleStore.setState({
    searchQuery: "",
    selectedMake: null,
    activeVehicleTypes: new Set(),
  });
});

const make: VehicleMake = { Make_ID: 1, Make_Name: "Toyota" };

describe("searchQuery", () => {
  it("initialises to empty string", () => {
    expect(useVehicleStore.getState().searchQuery).toBe("");
  });

  it("setSearchQuery updates the value", () => {
    useVehicleStore.getState().setSearchQuery("ford");
    expect(useVehicleStore.getState().searchQuery).toBe("ford");
  });

  it("setSearchQuery can be cleared", () => {
    useVehicleStore.getState().setSearchQuery("ford");
    useVehicleStore.getState().setSearchQuery("");
    expect(useVehicleStore.getState().searchQuery).toBe("");
  });
});

describe("selectedMake", () => {
  it("initialises to null", () => {
    expect(useVehicleStore.getState().selectedMake).toBeNull();
  });

  it("setSelectedMake stores the make", () => {
    useVehicleStore.getState().setSelectedMake(make);
    expect(useVehicleStore.getState().selectedMake).toEqual(make);
  });

  it("setSelectedMake(null) clears the selection", () => {
    useVehicleStore.getState().setSelectedMake(make);
    useVehicleStore.getState().setSelectedMake(null);
    expect(useVehicleStore.getState().selectedMake).toBeNull();
  });
});

describe("activeVehicleTypes", () => {
  it("initialises to an empty set", () => {
    expect(useVehicleStore.getState().activeVehicleTypes.size).toBe(0);
  });

  it("toggleVehicleType adds a type that is not present", () => {
    useVehicleStore.getState().toggleVehicleType("Truck");
    expect(useVehicleStore.getState().activeVehicleTypes.has("Truck")).toBe(true);
  });

  it("toggleVehicleType removes a type that is already present", () => {
    useVehicleStore.getState().toggleVehicleType("Truck");
    useVehicleStore.getState().toggleVehicleType("Truck");
    expect(useVehicleStore.getState().activeVehicleTypes.has("Truck")).toBe(false);
  });

  it("toggleVehicleType handles multiple types independently", () => {
    useVehicleStore.getState().toggleVehicleType("Truck");
    useVehicleStore.getState().toggleVehicleType("Motorcycle");
    const { activeVehicleTypes } = useVehicleStore.getState();
    expect(activeVehicleTypes.has("Truck")).toBe(true);
    expect(activeVehicleTypes.has("Motorcycle")).toBe(true);
  });

  it("clearVehicleTypeFilter empties the set", () => {
    useVehicleStore.getState().toggleVehicleType("Truck");
    useVehicleStore.getState().toggleVehicleType("Motorcycle");
    useVehicleStore.getState().clearVehicleTypeFilter();
    expect(useVehicleStore.getState().activeVehicleTypes.size).toBe(0);
  });
});
