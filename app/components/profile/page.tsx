"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p className="text-center">Loading...</p>;
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-6">Your Profile</h1>
        <div className="space-y-4">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}