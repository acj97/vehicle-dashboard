import { cn } from "@/lib/utils";

export type CardColor = "cyan" | "purple" | "green" | "amber";

interface CardProps {
  color?: CardColor;
  className?: string;
  children: React.ReactNode;
}

const colorStyles: Record<CardColor, string> = {
  cyan:   "neon-card",
  purple: "neon-card-purple",
  green:  "neon-card-green",
  amber:  "neon-card-amber",
};

export default function Card({ color = "cyan", className, children }: CardProps) {
  return (
    <div className={cn(colorStyles[color], className)}>
      {children}
    </div>
  );
}
