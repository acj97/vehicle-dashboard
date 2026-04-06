import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "neon-btn neon-btn-cyan",
  danger:  "neon-btn neon-btn-red",
  ghost:   "w-full flex items-center gap-2.5 px-3 py-2 rounded border border-transparent text-text-muted hover:text-neon-amber hover:border-neon-amber/30 hover:bg-neon-amber/5 transition-all duration-150",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", loading, disabled, className, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        variantStyles[variant],
        (disabled || loading) && "opacity-40 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={12} className="animate-spin shrink-0" />}
      {children}
    </button>
  )
);

Button.displayName = "Button";

export default Button;
