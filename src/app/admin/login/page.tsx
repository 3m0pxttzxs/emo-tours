"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1c1b1b] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight">
            EMO TOURS
          </h1>
          <span className="inline-block mt-2 text-[10px] font-medium bg-[#4CBB17] text-white px-2.5 py-0.5 rounded">
            Admin Panel
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-heading font-semibold text-[#1c1b1b] mb-6">
            Sign in
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#1c1b1b]/70 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1c1b1b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CBB17]/30 focus:border-[#4CBB17] transition-colors"
                placeholder="admin@emotours.mx"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[#1c1b1b]/70 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1c1b1b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CBB17]/30 focus:border-[#4CBB17] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#4CBB17] hover:bg-[#3a960e] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
