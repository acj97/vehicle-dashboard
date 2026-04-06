"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
}: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[80vh] flex flex-col",
          "neon-card glow-box-cyan",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-neon-cyan/15 shrink-0">
          <div className="space-y-0.5">
            <h2 className="font-display text-sm font-bold tracking-[0.15em] text-neon-cyan uppercase glow-cyan">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] text-text-secondary">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-neon-cyan transition-colors mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
