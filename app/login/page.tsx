
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in both email and password");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Login successful → redirect to profile
      router.push("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo + Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-stone-800 tracking-tight">
            StorySphere
          </h1>
          <p className="text-stone-600 mt-3 text-lg">
            Welcome back! Share your stories with the world
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">
            Log in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-stone-800 placeholder-stone-500 focus:outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-100 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-stone-800 placeholder-stone-500 focus:outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-100 transition"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-stone-700 rounded" />
                <span className="text-stone-700">Remember me</span>
              </label>
              <a href="#" className="text-stone-600 hover:text-stone-800 underline underline-offset-2">
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-700 hover:bg-stone-800 disabled:bg-stone-500 text-white font-semibold rounded-xl transition duration-200 shadow-md transform hover:scale-[1.02] active:scale-100"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-stone-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-stone-600">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-stone-700 font-semibold hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Bottom text */}
        <p className="text-center text-stone-500 text-xs mt-10">
          By logging in, you agree to our{" "}
          <a href="#" className="underline hover:text-stone-700">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-stone-700">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}