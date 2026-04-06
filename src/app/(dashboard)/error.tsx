"use client";

import { useEffect } from "react";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="w-full max-w-lg">
        <ErrorDisplay error={error} retry={unstable_retry} />
      </div>
    </div>
  );
}
