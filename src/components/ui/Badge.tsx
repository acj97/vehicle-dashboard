import { cn } from "@/lib/utils";

type BadgeColor = "cyan" | "purple" | "green" | "amber" | "pink";

interface BadgeProps {
  color?: BadgeColor;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const colorStyles: Record<BadgeColor, string> = {
  cyan:   "text-neon-cyan   border-neon-cyan/40",
  purple: "text-neon-purple border-neon-purple/40",
  green:  "text-neon-green  border-neon-green/40",
  amber:  "text-neon-amber  border-neon-amber/40",
  pink:   "text-neon-pink   border-neon-pink/40",
};

export default function Badge({ color = "cyan", className, children, onClick }: BadgeProps) {
  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "neon-badge",
        colorStyles[color],
        onClick && "hover:bg-current/10 transition-colors cursor-pointer",
        className
      )}
    >
      {children}
    </Tag>
  );
}
