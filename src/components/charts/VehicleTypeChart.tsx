"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQueries } from "@tanstack/react-query";
import { getMakesForVehicleType, queryKeys } from "@/lib/api/nhtsa";
import { useVehicleStore } from "@/lib/store/vehicleStore";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const VEHICLE_TYPES = [
  "Passenger Car",
  "Truck",
  "Multipurpose Passenger Vehicle (MPV)",
  "Motorcycle",
  "Bus",
  "Low Speed Vehicle (LSV)",
];

const SHORT_LABELS: Record<string, string> = {
  "Passenger Car": "Cars",
  "Truck": "Trucks",
  "Multipurpose Passenger Vehicle (MPV)": "MPV",
  "Motorcycle": "Moto",
  "Bus": "Bus",
  "Low Speed Vehicle (LSV)": "LSV",
};

const BAR_COLORS = ["#00e5ff", "#c060ff", "#00ff87", "#ffb800", "#ff3d9a", "#60c0ff"];

export default function VehicleTypeChart() {
  const { activeVehicleTypes, toggleVehicleType, clearVehicleTypeFilter } =
    useVehicleStore();

  const results = useQueries({
    queries: VEHICLE_TYPES.map((type) => ({
      queryKey: queryKeys.makesForVehicleType(type),
      queryFn: () => getMakesForVehicleType(type),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isFetching = results.some((r) => r.isFetching);
  const isError = results.some((r) => r.isError);
  const hasAnyData = results.some((r) => r.data !== undefined);
  const isStale = isError && hasAnyData;

  const chartData = VEHICLE_TYPES.map((type, i) => ({
    type,
    label: SHORT_LABELS[type],
    count: results[i].data?.length ?? 0,
    color: BAR_COLORS[i],
  }));

  const visibleData =
    activeVehicleTypes.size === 0
      ? chartData
      : chartData.filter((d) => activeVehicleTypes.has(d.type));

  return (
    <Card className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            "w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,229,255,1)]",
            isFetching && "animate-pulse"
          )} />
          <p className="font-display text-[10px] tracking-[0.18em] text-neon-cyan uppercase glow-cyan">
            Vehicle Types Distribution
          </p>
          {isFetching && !isLoading && (
            <span className="text-[9px] text-text-muted">Refreshing...</span>
          )}
        </div>
        <Badge color="green">Admin</Badge>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={clearVehicleTypeFilter}
          className={cn(
            "neon-badge transition-all",
            activeVehicleTypes.size === 0
              ? "text-neon-cyan border-neon-cyan/60 bg-neon-cyan/10"
              : "text-text-muted border-border hover:text-neon-cyan hover:border-neon-cyan/40"
          )}
        >
          All
        </button>
        {VEHICLE_TYPES.map((type, i) => {
          const active = activeVehicleTypes.has(type);
          return (
            <button
              key={type}
              onClick={() => toggleVehicleType(type)}
              className={cn(
                "neon-badge transition-all",
                active
                  ? "bg-opacity-10"
                  : "text-text-muted border-border hover:border-current"
              )}
              style={
                active
                  ? { color: BAR_COLORS[i], borderColor: BAR_COLORS[i] + "80", backgroundColor: BAR_COLORS[i] + "15" }
                  : undefined
              }
            >
              {SHORT_LABELS[type]}
            </button>
          );
        })}
      </div>

      {/* Stale data warning */}
      {isStale && (
        <p className="text-[9px] text-neon-amber">Showing cached data — refresh failed</p>
      )}

      {/* Chart */}
      <div className="h-60">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="space-y-2 w-full px-4">
              {[70, 45, 85, 55, 30, 60].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-6 rounded bg-surface-3 animate-pulse" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
          </div>
        ) : isError && !hasAnyData ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-neon-pink">Failed to load chart data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={visibleData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.08)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#8080cc", fontSize: 9, fontFamily: "var(--font-orbitron)" }}
                axisLine={{ stroke: "rgba(0,229,255,0.15)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8080cc", fontSize: 9, fontFamily: "var(--font-space-mono)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,229,255,0.04)" }}
                contentStyle={{
                  background: "#07071a",
                  border: "1px solid rgba(0,229,255,0.3)",
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: "var(--font-space-mono)",
                  color: "#e8eaff",
                }}
                formatter={(value, _name, entry) => [
                  <span style={{ color: entry.payload?.color }}>{Number(value).toLocaleString()} makes</span>,
                  entry.payload?.type ?? "",
                ]}
                labelStyle={{ display: "none" }}
              />
              <Bar
                dataKey="count"
                radius={[3, 3, 0, 0]}
                maxBarSize={56}
                shape={(props: any) => (
                  <rect
                    x={props.x}
                    y={props.y}
                    width={props.width}
                    height={props.height}
                    fill={props.color}
                    fillOpacity={0.85}
                    rx={3}
                  />
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
