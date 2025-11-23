"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple validation
    if (!email || !password || !fullName) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Success! Account created. You can now log in.");
      router.push("/login");
    }
    setLoading(false);
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
            Join thousands of writers sharing their stories
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="isimbi nadege     "
                required
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-stone-800 placeholder-stone-500 focus:outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-100 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nana@example.com"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-stone-800 placeholder-stone-500 focus:outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-100 transition"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-700 hover:bg-stone-800 disabled:bg-stone-500 text-white font-semibold rounded-xl transition duration-200 shadow-md transform hover:scale-[1.02] active:scale-100"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-stone-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-stone-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-stone-700 font-semibold hover:underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Bottom text */}
        <p className="text-center text-stone-500 text-xs mt-10">
          By signing up, you agree to our{" "}
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