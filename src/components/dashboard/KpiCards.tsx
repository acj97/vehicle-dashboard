"use client";

import { useQueries } from "@tanstack/react-query";
import { Car, Layers, Bike, Truck } from "lucide-react";
import { getAllMakes, getMakesForVehicleType, queryKeys } from "@/lib/api/nhtsa";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import type { CardColor } from "@/components/ui/Card";

const KPI_CONFIG = [
  {
    label: "Total Makes",
    icon: Car,
    color: "cyan" as CardColor,
    queryKey: queryKeys.allMakes,
    queryFn: getAllMakes,
  },
  {
    label: "Passenger Cars",
    icon: Layers,
    color: "purple" as CardColor,
    queryKey: queryKeys.makesForVehicleType("Passenger Car"),
    queryFn: () => getMakesForVehicleType("Passenger Car"),
  },
  {
    label: "Motorcycles",
    icon: Bike,
    color: "green" as CardColor,
    queryKey: queryKeys.makesForVehicleType("Motorcycle"),
    queryFn: () => getMakesForVehicleType("Motorcycle"),
  },
  {
    label: "Trucks",
    icon: Truck,
    color: "amber" as CardColor,
    queryKey: queryKeys.makesForVehicleType("Truck"),
    queryFn: () => getMakesForVehicleType("Truck"),
  },
];

const textStyles: Record<CardColor, string> = {
  cyan:   "text-neon-cyan   glow-cyan",
  purple: "text-neon-purple glow-purple",
  green:  "text-neon-green  glow-green",
  amber:  "text-neon-amber  glow-amber",
};

const dotStyles: Record<CardColor, string> = {
  cyan:   "bg-neon-cyan   shadow-[0_0_8px_rgba(0,229,255,1)]",
  purple: "bg-neon-purple shadow-[0_0_8px_rgba(192,96,255,1)]",
  green:  "bg-neon-green  shadow-[0_0_8px_rgba(0,255,135,1)]",
  amber:  "bg-neon-amber  shadow-[0_0_8px_rgba(255,184,0,1)]",
};

export default function KpiCards() {
  const results = useQueries({
    queries: KPI_CONFIG.map(({ queryKey, queryFn }) => ({ queryKey, queryFn })),
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {KPI_CONFIG.map(({ label, icon: Icon, color }, i) => {
        const { data, isLoading, isFetching, isError } = results[i];
        const hasStaleData = isError && data !== undefined;
        const count = data?.length ?? 0;

        return (
          <Card key={label} color={color} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className={cn("font-display text-[9px] tracking-[0.18em] uppercase", textStyles[color])}>
                {label}
              </p>
              <Icon size={14} className={cn(textStyles[color], isFetching && "animate-pulse")} />
            </div>

            <div className="flex items-end gap-2">
              {isLoading ? (
                <div className="h-8 w-16 rounded bg-surface-3 animate-pulse" />
              ) : isError && !hasStaleData ? (
                <span className="font-display text-xl font-black text-neon-pink">ERR</span>
              ) : (
                <span className={cn(
                  "font-display text-2xl font-black",
                  hasStaleData ? "text-neon-amber" : textStyles[color]
                )}>
                  {count.toLocaleString()}
                </span>
              )}
              <span className={cn("w-1.5 h-1.5 rounded-full mb-2 shrink-0", dotStyles[color])} />
            </div>

            <p className="text-[9px] text-text-muted">
              {isLoading
                ? "Fetching..."
                : hasStaleData
                ? "Stale — refresh failed"
                : isError
                ? "Failed to load"
                : isFetching
                ? "Refreshing..."
                : "Makes registered"}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
