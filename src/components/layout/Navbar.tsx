"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";

const pageMeta: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Dashboard", sub: "System Overview" },
  "/vehicles": { title: "Makes", sub: "Make Registry" },
};

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? { title: "VehicleOS", sub: "" };

  return (
    <header className="shrink-0 h-14 flex items-center gap-3 px-4 sm:px-6 bg-surface/80 border-b border-neon-cyan/15 backdrop-blur-sm">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden flex items-center justify-center w-8 h-8 rounded border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 transition-colors shrink-0"
        aria-label="Toggle menu"
      >
        <Menu size={15} />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="font-display text-[9px] tracking-[0.2em] text-neon-purple uppercase hidden sm:block">
          VehicleOS
        </span>
        <ChevronRight size={10} className="text-neon-purple/50 hidden sm:block" />
        <span className="font-display text-[10px] tracking-[0.15em] text-neon-cyan uppercase glow-cyan">
          {meta.title}
        </span>
        <span className="mx-2 w-px h-3 bg-neon-cyan/20" />
        <span className="text-[10px] text-text-secondary hidden sm:block">
          {meta.sub}
        </span>
      </div>
    </header>
  );
}
