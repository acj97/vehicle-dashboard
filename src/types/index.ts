/* ── NHTSA API ─────────────────────────────────────────────── */

export interface NHTSAResponse<T> {
  Count: number;
  Message: string;
  SearchCriteria: string | null;
  Results: T[];
}

export interface VehicleMake {
  Make_ID: number;
  Make_Name: string;
}

export interface VehicleModel {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

export interface VehicleType {
  VehicleTypeId: number;
  VehicleTypeName: string;
}

export interface MakeForType {
  MakeId: number;
  MakeName: string;
  VehicleTypeId: number;
  VehicleTypeName: string;
}

/* ── Auth ──────────────────────────────────────────────────── */

export type UserRole = "admin" | "viewer";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/* ── UI ────────────────────────────────────────────────────── */

export interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}
