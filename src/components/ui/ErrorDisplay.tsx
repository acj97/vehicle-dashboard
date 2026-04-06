import { AlertTriangle, RefreshCw, Terminal } from "lucide-react";
import Button from "@/components/ui/Button";

interface ErrorDisplayProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorDisplay({ error, retry }: ErrorDisplayProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-64 p-8 rounded-lg overflow-hidden border border-neon-pink/30 bg-neon-pink/5">
      <div className="absolute inset-0 bg-linear-to-br from-neon-pink/8 via-transparent to-neon-purple/5 pointer-events-none" />

      <div className="relative space-y-5 w-full max-w-md text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-neon-pink/50 bg-neon-pink/10 mx-auto">
          <AlertTriangle size={24} className="text-neon-pink drop-shadow-[0_0_10px_rgba(255,61,154,1)]" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <p className="font-display text-[9px] tracking-[0.3em] text-neon-pink/60 uppercase">
            System Fault
          </p>
          <h2
            className="font-display text-base font-black tracking-widest text-neon-pink uppercase"
            style={{ textShadow: "0 0 10px rgba(255,61,154,0.8), 0 0 30px rgba(255,61,154,0.4)" }}
          >
            Error Detected
          </h2>
        </div>

        {/* Error message */}
        <div className="flex items-start gap-2 px-4 py-3 rounded border border-neon-pink/20 bg-surface-2 text-left">
          <Terminal size={12} className="text-neon-pink shrink-0 mt-0.5" />
          <p className="text-[11px] text-neon-pink/90 font-mono leading-relaxed break-all">
            {error.message || "An unexpected error occurred."}
          </p>
        </div>

        {/* Digest */}
        {error.digest && (
          <p className="text-[9px] text-text-muted font-mono">digest: {error.digest}</p>
        )}

        <Button onClick={retry} className="mx-auto">
          <RefreshCw size={12} />
          Retry
        </Button>
      </div>
    </div>
  );
}
