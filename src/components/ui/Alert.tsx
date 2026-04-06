import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  message: string;
  className?: string;
}

export default function Alert({ message, className }: AlertProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2.5 rounded border border-neon-pink/40 bg-neon-pink/8",
        className
      )}
    >
      <AlertCircle size={12} className="text-neon-pink shrink-0" />
      <p className="text-[10px] text-neon-pink">{message}</p>
    </div>
  );
}
