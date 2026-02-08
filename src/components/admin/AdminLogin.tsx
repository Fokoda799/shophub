"use client";

import { useState } from "react";
import { Shield, Lock, User } from "lucide-react";
import { createEmailPasswordSession, getCurrentAccount, deleteCurrentSession } from "@/lib/appwrite/client";

type AdminUser = {
  email: string;
  name?: string;
};

type AdminLoginProps = {
  onSuccess: (user: AdminUser) => void;
};

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create email session
      await createEmailPasswordSession(email, password);
      
      // Get current user
      const user = (await getCurrentAccount()) as AdminUser;
      
      // Check if user has admin label (you need to set this in Appwrite Console)
      // OR check if email is in allowed admin emails
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];
      
      if (!adminEmails.includes(user.email)) {
        await deleteCurrentSession();
        setError("You don't have admin access");
        setLoading(false);
        return;
      }

      onSuccess(user);
    } catch (err: unknown) {
      console.error("Login error:", err);
      const message = err instanceof Error ? err.message : "Invalid credentials";
      if (message.toLowerCase().includes("email / password authentication is disabled")) {
        setError("Email/password login is disabled in Appwrite. Enable it in Appwrite Console > Auth > Settings > Email/Password.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-white px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-black uppercase tracking-tight text-gray-900">
            Admin Login
          </h1>
          <p className="text-sm text-gray-600">
            Enter your credentials to access the dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6 border border-gray-200 bg-white p-8 shadow-lg">
          {error && (
            <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 py-3 pl-11 pr-4 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 py-3 pl-11 pr-4 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <Shield className="mx-auto mb-2 h-4 w-4" />
          <p>Secure admin access protected by Appwrite</p>
        </div>
      </div>
    </div>
  );
}
