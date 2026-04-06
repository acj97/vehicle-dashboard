import type {
  NHTSAResponse,
  VehicleMake,
  VehicleModel,
  VehicleType,
  MakeForType,
} from "@/types";

const BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

async function nhtsaFetch<T>(path: string): Promise<T[]> {
  const res = await fetch(`${BASE_URL}${path}?format=json`, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`NHTSA API error ${res.status}: ${path}`);
  const json: NHTSAResponse<T> = await res.json();
  return json.Results;
}

export async function getAllMakes(): Promise<VehicleMake[]> {
  return nhtsaFetch<VehicleMake>("/GetAllMakes");
}

export async function getModelsForMake(make: string): Promise<VehicleModel[]> {
  return nhtsaFetch<VehicleModel>(
    `/GetModelsForMake/${encodeURIComponent(make)}`
  );
}

export async function getVehicleTypesForMake(
  make: string
): Promise<VehicleType[]> {
  return nhtsaFetch<VehicleType>(
    `/GetVehicleTypesForMake/${encodeURIComponent(make)}`
  );
}

export async function getMakesForVehicleType(
  type: string
): Promise<MakeForType[]> {
  return nhtsaFetch<MakeForType>(
    `/GetMakesForVehicleType/${encodeURIComponent(type)}`
  );
}

/* ── Query keys (stable references for TanStack Query) ─────── */
export const queryKeys = {
  allMakes: ["makes"] as const,
  modelsForMake: (make: string) => ["models", make] as const,
  vehicleTypesForMake: (make: string) => ["vehicleTypes", make] as const,
  makesForVehicleType: (type: string) => ["makesByType", type] as const,
};
