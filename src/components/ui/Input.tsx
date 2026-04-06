import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, className, ...props }, ref) => {
    if (!leftIcon) {
      return (
        <input
          ref={ref}
          className={cn("neon-input", className)}
          {...props}
        />
      );
    }

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-neon-cyan">
          {leftIcon}
        </span>
        <input
          ref={ref}
          className={cn("neon-input pl-9", className)}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
