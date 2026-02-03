"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplets, ArrowRight, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate network delay for effect
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-muted to-background">
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-50 animate-fade-in" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-50 animate-fade-in delay-75" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="glass-panel p-8 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl bg-white/40 dark:bg-black/40">
                    <div className="flex flex-col items-center mb-8">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 text-primary">
                            <Droplets className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground mt-2 text-center text-sm">
                            Sign in to access your Automated Irrigation System
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder="admin@ecoflow.com"
                                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground">
                            Don't have an account? <span className="text-primary cursor-pointer hover:underline">Contact Admin</span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
