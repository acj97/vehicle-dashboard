import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { Lock } from "lucide-react";
import KpiCards from "@/components/dashboard/KpiCards";
import VehicleTypeChart from "@/components/charts/VehicleTypeChart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-xl font-black tracking-widest text-neon-cyan uppercase glow-cyan">
          Dashboard
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          System overview &amp; analytics
        </p>
      </div>

      {/* KPI cards — real data, all roles */}
      <KpiCards />

      {/* Chart — admin only */}
      {isAdmin ? (
        <VehicleTypeChart />
      ) : (
        <div className="neon-card-purple p-6 relative overflow-hidden min-h-70">
          <div className="absolute inset-0 bg-linear-to-br from-neon-purple/5 to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-center gap-4 py-10">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border border-neon-purple/50 bg-neon-purple/10 glow-box-purple">
              <Lock size={20} className="text-neon-purple" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-display text-sm tracking-[0.2em] text-neon-purple uppercase glow-purple">
                Admin Only
              </p>
              <p className="text-[10px] text-text-secondary">
                Vehicle type analytics require admin role
              </p>
            </div>
            <span className="neon-badge text-neon-purple border-neon-purple/40">
              Restricted
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
