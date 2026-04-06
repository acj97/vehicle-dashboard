import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("neon-input w-auto cursor-pointer", className)}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = "Select";

export default Select;
