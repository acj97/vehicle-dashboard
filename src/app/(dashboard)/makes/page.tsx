import MakesToolbar from "@/components/table/MakesToolbar";
import MakesTable from "@/components/table/MakesTable";
import MakeDetailModal from "@/components/vehicles/MakeDetailModal";

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-black tracking-widest text-neon-cyan uppercase glow-cyan">
          Makes
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Vehicle makes &amp; model registry — NHTSA vPIC
        </p>
      </div>

      <MakesToolbar />
      <MakesTable />
      <MakeDetailModal />
    </div>
  );
}
