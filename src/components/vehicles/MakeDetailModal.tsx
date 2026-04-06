"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import { useVehicleStore } from "@/lib/store/vehicleStore";
import { getModelsForMake, queryKeys } from "@/lib/api/nhtsa";

export default function MakeDetailModal() {
  const { selectedMake, setSelectedMake } = useVehicleStore();

  const { data: models, isLoading, isError } = useQuery({
    queryKey: queryKeys.modelsForMake(selectedMake?.Make_Name ?? ""),
    queryFn: () => getModelsForMake(selectedMake!.Make_Name),
    enabled: !!selectedMake,
  });

  return (
    <Modal
      open={!!selectedMake}
      onClose={() => setSelectedMake(null)}
      title={selectedMake?.Make_Name ?? ""}
      subtitle={`Make ID — #${selectedMake?.Make_ID ?? ""}`}
    >
      {isLoading && <Spinner label="Fetching models..." />}

      {isError && <Alert message="Failed to load models" />}

      {models && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen size={12} className="text-neon-cyan" />
            <span className="font-display text-[9px] tracking-[0.18em] text-neon-cyan uppercase">
              {models.length} models registered
            </span>
          </div>

          {models.length === 0 ? (
            <p className="text-xs text-text-muted py-4 text-center">
              No models found for this make.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {models.map((model) => (
                <div
                  key={model.Model_ID}
                  className="flex items-center gap-2 px-3 py-2 rounded border border-neon-cyan/10 bg-surface-2 hover:border-neon-cyan/25 transition-colors"
                >
                  <span className="w-1 h-1 rounded-full bg-neon-cyan shrink-0 shadow-[0_0_4px_rgba(0,229,255,0.8)]" />
                  <span className="text-[10px] text-text-primary truncate">
                    {model.Model_Name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
