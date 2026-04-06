import { Loader2 } from "lucide-react";

interface SpinnerProps {
  label?: string;
  size?: number;
}

export default function Spinner({ label, size = 16 }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 size={size} className="animate-spin text-neon-cyan" />
      {label && <span className="text-xs text-text-secondary">{label}</span>}
    </div>
  );
}
