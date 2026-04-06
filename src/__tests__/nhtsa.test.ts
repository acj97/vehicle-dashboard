import {
  getAllMakes,
  getModelsForMake,
  getMakesForVehicleType,
  queryKeys,
} from "@/lib/api/nhtsa";

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockResponse<T>(data: T[], ok = true) {
  mockFetch.mockResolvedValueOnce({
    ok,
    status: ok ? 200 : 500,
    json: async () => ({
      Count: Array.isArray(data) ? data.length : 0,
      Message: "Response returned successfully",
      SearchCriteria: null,
      Results: data,
    }),
  });
}

beforeEach(() => mockFetch.mockClear());

describe("queryKeys", () => {
  it("allMakes is a stable tuple", () => {
    expect(queryKeys.allMakes).toEqual(["makes"]);
  });

  it("modelsForMake includes the make name", () => {
    expect(queryKeys.modelsForMake("Toyota")).toEqual(["models", "Toyota"]);
  });

  it("makesForVehicleType includes the type", () => {
    expect(queryKeys.makesForVehicleType("Truck")).toEqual(["makesByType", "Truck"]);
  });
});

describe("getAllMakes()", () => {
  it("returns the Results array from the API response", async () => {
    const makes = [
      { Make_ID: 1, Make_Name: "Toyota" },
      { Make_ID: 2, Make_Name: "Ford" },
    ];
    mockResponse(makes);

    const result = await getAllMakes();

    expect(result).toEqual(makes);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/GetAllMakes?format=json"),
      expect.objectContaining({ signal: expect.any(Object) })
    );
  });

  it("throws when the API returns a non-ok status", async () => {
    mockResponse([], false);
    await expect(getAllMakes()).rejects.toThrow("NHTSA API error 500");
  });
});

describe("getModelsForMake()", () => {
  it("returns models for the given make", async () => {
    const models = [
      { Make_ID: 1, Make_Name: "Toyota", Model_ID: 10, Model_Name: "Camry" },
      { Make_ID: 1, Make_Name: "Toyota", Model_ID: 11, Model_Name: "Corolla" },
    ];
    mockResponse(models);

    const result = await getModelsForMake("Toyota");

    expect(result).toEqual(models);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/GetModelsForMake/Toyota?format=json"),
      expect.objectContaining({ signal: expect.any(Object) })
    );
  });

  it("URL-encodes make names with spaces", async () => {
    mockResponse([]);
    await getModelsForMake("Land Rover");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("Land%20Rover"),
      expect.objectContaining({ signal: expect.any(Object) })
    );
  });

  it("returns empty array when make has no models", async () => {
    mockResponse([]);
    const result = await getModelsForMake("UnknownMake");
    expect(result).toEqual([]);
  });
});

describe("getMakesForVehicleType()", () => {
  it("returns makes filtered by vehicle type", async () => {
    const makes = [
      { MakeId: 1, MakeName: "Harley-Davidson", VehicleTypeId: 3, VehicleTypeName: "Motorcycle" },
    ];
    mockResponse(makes);

    const result = await getMakesForVehicleType("Motorcycle");

    expect(result).toEqual(makes);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/GetMakesForVehicleType/Motorcycle?format=json"),
      expect.objectContaining({ signal: expect.any(Object) })
    );
  });
});
