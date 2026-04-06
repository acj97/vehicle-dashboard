"use client";

import { useState, useTransition } from "react";
import { Zap } from "lucide-react";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";

function BrokenComponent(): never {
  throw new Error(
    "SYSTEM_FAILURE: Endpoint /api/vehicle-data returned 503 Service Unavailable. The upstream data provider is unreachable."
  );
}

export default function ErrorSimulator() {
  const [triggered, setTriggered] = useState(false);
  const [, startTransition] = useTransition();

  const trigger = () => startTransition(() => setTriggered(true));

  return (
    <ErrorBoundary>
      {triggered ? (
        <BrokenComponent />
      ) : (
        <button onClick={trigger} className="neon-btn neon-btn-red">
          <Zap size={12} />
          Error Simulator
        </button>
      )}
    </ErrorBoundary>
  );
}
