"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Droplets, Mail, Lock, ArrowRight, Leaf } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1400);
  };

  return (
    <div
      className="min-h-screen w-full flex relative"
      style={{ background: "var(--login-bg)" }}
    >
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden">
        {/* Background organic shapes */}
        <div
          className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(45,122,79,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(45,122,79,0.08) 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            <Droplets size={20} />
          </div>
          <span className="font-display text-2xl" style={{ color: "var(--foreground)" }}>
            EcoFlow
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div>
            <p className="section-label mb-3" style={{ color: "var(--primary)" }}>Smart Irrigation</p>
            <h1 className="font-display text-5xl leading-tight" style={{ color: "var(--foreground)" }}>
              Less water.<br />
              More <span style={{ color: "var(--primary)" }}>growth.</span>
            </h1>
          </div>
          <p className="text-lg" style={{ color: "var(--muted-foreground)", maxWidth: 400, lineHeight: 1.7 }}>
            Automate your irrigation zones with precision moisture sensing, cloud intelligence, and real-time AWS IoT connectivity.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 pt-4">
            {[
              { value: "40%", label: "Water saved" },
              { value: "24/7", label: "AWS monitoring" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl" style={{ color: "var(--primary)" }}>{s.value}</div>
                <div className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="relative z-10 flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
          <Leaf size={14} style={{ color: "var(--primary)" }} />
          Powered by AWS IoT Core &amp; Lambda
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              <Droplets size={18} />
            </div>
            <span className="font-display text-xl">EcoFlow</span>
          </div>

          <div className="ease-card-elevated p-8">
            <div className="mb-8">
              <h2 className="font-display text-3xl mb-2" style={{ color: "var(--foreground)" }}>
                Welcome back
              </h2>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Sign in to your irrigation dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ecoflow.com"
                    className="ease-input"
                    style={{ paddingLeft: "44px" }}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Password
                  </label>
                  <span
                    className="text-xs font-medium cursor-pointer hover:underline"
                    style={{ color: "var(--primary)" }}
                  >
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="ease-input"
                    style={{ paddingLeft: "44px" }}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full h-11 text-[0.95rem]"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* AWS badge */}
            <div
              className="mt-6 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-medium"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "#22c55e" }}
              />
              AWS IoT Core · Connected &amp; Secure
            </div>
          </div>

          <p className="text-center text-xs mt-5" style={{ color: "var(--muted-foreground)" }}>
            Don't have access?{" "}
            <span className="font-medium cursor-pointer hover:underline" style={{ color: "var(--primary)" }}>
              Contact your administrator
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
