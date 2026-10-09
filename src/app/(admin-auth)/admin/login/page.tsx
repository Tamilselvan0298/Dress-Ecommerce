"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ShieldAlert, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to authenticate administrator.");
      }

      setSuccessMessage("Administrator access granted! Redirecting to console...");
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid administrator credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@vaishiri.com",
          name: "Vaishiri Admin",
          isAdminLogin: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Google Admin SSO failed.");
      }

      setSuccessMessage("Signed in with Google Admin SSO! Redirecting...");
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate with Google Admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAdminLogin = () => {
    setEmail("admin@vaishiri.com");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen bg-[#1F1A17] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-3">
          <div className="flex flex-col items-center">
            <span className="font-serif tracking-[0.25em] text-2xl font-normal text-white uppercase leading-tight">
              VAISHIRI
            </span>
            <span className="text-[9px] tracking-[0.45em] uppercase font-sans text-[#C47B69] font-semibold -mt-0.5">
              MANAGEMENT CONSOLE
            </span>
          </div>
        </Link>
        <h2 className="text-xl font-serif text-white/90 font-normal">
          Administrator Sign In
        </h2>
        <p className="mt-1 text-xs text-white/50">
          Strictly for authorized Vaishiri store personnel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#2B2420] py-8 px-6 sm:px-10 border border-white/10 shadow-2xl rounded-xs">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-950/60 border border-red-500/50 text-red-200 text-xs rounded-2xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs rounded-2xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Admin SSO Button */}
          <button
            type="button"
            onClick={handleGoogleAdminLogin}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-colors mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.26v3.13C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.61H1.26C.46 8.21 0 10.05 0 12s.46 3.79 1.26 5.39l4.02-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.61l4.02 3.13c.95-2.84 3.6-4.99 6.72-4.99z"
              />
            </svg>
            <span>Sign in with Google Admin SSO</span>
          </button>

          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#2B2420] px-3 text-[10px] text-white/40 uppercase tracking-widest absolute">
              or enter admin password
            </span>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-white/70 block mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@vaishiri.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#C47B69]"
                />
                <Mail className="w-3.5 h-3.5 text-white/30 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-white/70 block mb-1">
                Secret Key / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#C47B69]"
                />
                <Lock className="w-3.5 h-3.5 text-white/30 absolute right-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#86412D] hover:bg-[#6B3323] text-white text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? "Verifying Authority..." : "Authorize Admin Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Admin Helper */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="text-xs text-[#C47B69] hover:underline font-medium"
            >
              Fill Demo Admin Credentials (admin@vaishiri.com / admin123)
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-white/40 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Role-Based Access Control • 256-Bit Signed Sessions</span>
        </div>
      </div>
    </div>
  );
}

