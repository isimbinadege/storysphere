// app/profile/page.tsx  ← Replace your current one with this
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p className="text-center pt-20 text-stone-600">Loading...</p>;
  if (!user) {
    router.push("/login");
    return null;
  }

  // Optional: Get full name from metadata (if you saved it during register)
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Writer";

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-stone-800 mb-10 text-center">
          Welcome back, {fullName}!
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-10">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-stone-600 to-stone-800 rounded-full flex items-center justify-center text-5xl text-white font-bold shadow-lg">
              {fullName[0].toUpperCase()}
            </div>

            {/* Info */}
            <h2 className="mt-6 text-2xl font-semibold text-stone-800">{fullName}</h2>
            <p className="text-stone-600">{user.email}</p>
            <p className="text-stone-500 text-sm mt-2">Member since {new Date(user.created_at).toLocaleDateString()}</p>

            {/* Stats  */}
            <div className="grid grid-cols-3 gap-8 mt-10 w-full max-w-md">
              <div className="text-center">
                <p className="text-3xl font-bold text-stone-800">0</p>
                <p className="text-stone-600">Stories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-stone-800">0</p>
                <p className="text-stone-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-stone-800">0</p>
                <p className="text-stone-600">Following</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-12 px-8 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-800 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}