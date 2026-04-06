"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username: data.get("username") as string,
      password: data.get("password") as string,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dot-grid relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm px-4 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl border-2 border-neon-cyan/60 bg-neon-cyan/10 glow-box-cyan mx-auto">
            <Zap size={28} className="text-neon-cyan drop-shadow-[0_0_10px_rgba(0,229,255,1)]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-black tracking-[0.25em] text-neon-cyan uppercase glow-cyan">
              VehicleOS
            </h1>
            <p className="text-[10px] text-neon-purple tracking-[0.3em] uppercase mt-1 glow-purple">
              Intelligence Dashboard
            </p>
          </div>
        </div>

        {/* Form card */}
        <Card className="p-6 space-y-5 glow-box-cyan">
          <div className="neon-divider" />

          <h2 className="font-display text-[10px] tracking-[0.25em] text-neon-cyan uppercase glow-cyan text-center">
            — Access Terminal —
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <label className="font-display text-[9px] tracking-[0.2em] text-neon-cyan uppercase">
                Username
              </label>
              <Input
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="enter username"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="font-display text-[9px] tracking-[0.2em] text-neon-cyan uppercase">
                Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neon-cyan/50 hover:text-neon-cyan transition-colors"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {error && <Alert message={error} />}

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center"
            >
              {loading ? "Authenticating..." : "Initialize Session"}
            </Button>
          </form>

          <div className="neon-divider" />
        </Card>

        {/* Credential hints */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_6px_rgba(0,229,255,1)]" />
              <p className="font-display text-[8px] tracking-[0.2em] text-neon-cyan uppercase glow-cyan">
                Admin
              </p>
            </div>
            <p className="text-[9px] text-text-secondary font-mono">admin / admin123</p>
            <p className="text-[8px] text-neon-green">Full access + charts</p>
          </Card>
          <Card color="purple" className="p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_6px_rgba(192,96,255,1)]" />
              <p className="font-display text-[8px] tracking-[0.2em] text-neon-purple uppercase glow-purple">
                Viewer
              </p>
            </div>
            <p className="text-[9px] text-text-secondary font-mono">viewer / viewer123</p>
            <p className="text-[8px] text-neon-amber">Read-only, no charts</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
