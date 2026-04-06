"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, Car, Zap, LogOut, Shield, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";
import Button from "@/components/ui/Button";

const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vehicles", label: "Makes", icon: Car },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const initials = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <aside className="w-56 h-full shrink-0 flex flex-col bg-surface border-r border-neon-cyan/20">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-neon-cyan/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded border border-neon-cyan/50 bg-neon-cyan/10 glow-box-cyan">
              <Zap size={15} className="text-neon-cyan" />
            </div>
            <div>
              <span className="font-display text-[11px] font-bold tracking-[0.2em] text-neon-cyan uppercase glow-cyan block">
                VehicleOS
              </span>
              <span className="text-[8px] text-neon-purple tracking-widest uppercase">
                Intelligence
              </span>
            </div>
          </div>

          {/* Close button — mobile only */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden flex items-center justify-center w-7 h-7 rounded border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
              aria-label="Close menu"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 pb-3 font-display text-[8px] tracking-[0.25em] text-neon-cyan/50 uppercase">
          Navigation
        </p>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150",
                "border-l-2",
                active
                  ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan glow-box-cyan"
                  : "border-transparent text-text-secondary hover:text-neon-cyan hover:bg-neon-cyan/5 hover:border-neon-cyan/40"
              )}
            >
              <Icon
                size={15}
                className={cn(
                  "shrink-0 transition-all",
                  active && "drop-shadow-[0_0_8px_rgba(0,229,255,0.9)]"
                )}
              />
              <span className={cn("font-display text-[10px] tracking-[0.15em] uppercase", active && "glow-cyan")}>
                {label}
              </span>
              {active && (
                <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,229,255,1)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Neon divider */}
      <div className="neon-divider mx-3" />

      {/* User / Logout */}
      <div className="px-3 py-4 space-y-2">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded border border-neon-purple/20 bg-neon-purple/5">
          <div className={cn(
            "w-7 h-7 rounded border flex items-center justify-center shrink-0",
            isAdmin
              ? "bg-neon-cyan/10 border-neon-cyan/50"
              : "bg-neon-purple/10 border-neon-purple/50"
          )}>
            <span className={cn(
              "font-display text-[9px] font-bold",
              isAdmin ? "text-neon-cyan" : "text-neon-purple"
            )}>
              {initials}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[9px] tracking-widest text-text-primary uppercase truncate">
              {user?.name ?? "—"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {isAdmin
                ? <Shield size={8} className="text-neon-cyan" />
                : <Eye size={8} className="text-neon-purple" />
              }
              <p className={cn(
                "text-[8px] uppercase tracking-widest font-display",
                isAdmin ? "text-neon-cyan glow-cyan" : "text-neon-purple glow-purple"
              )}>
                {user?.role ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut size={13} className="shrink-0" />
          <span className="font-display text-[9px] tracking-[0.14em] uppercase">
            Sign Out
          </span>
        </Button>
      </div>
    </aside>
  );
}
