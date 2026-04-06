"use client";

import { unstable_catchError as catchError, type ErrorInfo } from "next/error";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

function ErrorFallback(_props: object, { error, unstable_retry }: ErrorInfo) {
  return (
    <ErrorDisplay
      error={error as Error & { digest?: string }}
      retry={unstable_retry}
    />
  );
}

export const ErrorBoundary = catchError(ErrorFallback);
