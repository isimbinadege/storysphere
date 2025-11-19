// app/profile/page.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [storyCount, setStoryCount] = useState(0);
  const [stories, setStories] = useState<any[]>([]);

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Writer";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      // Fetch user's stories count and list
      supabase
        .from("posts")
        .select("id, title, slug, created_at", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data, count }) => {
          setStories(data || []);
          setStoryCount(count || 0);
        });
    }
  }, [user, loading, router]);

  if (loading) return <p className="text-center pt-20 text-stone-600">Loading...</p>;
  if (!user) return null;

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
            <p className="text-stone-500 text-sm mt-2">
              Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-10 w-full max-w-md">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">{storyCount}</p>
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

            {/* Your Stories List */}
            {stories.length > 0 && (
              <div className="w-full mt-12">
                <h3 className="text-2xl font-bold text-stone-800 mb-6 text-center">Your Stories</h3>
                <div className="space-y-4">
                  {stories.map((story) => (
                    <Link
                      key={story.id}
                      href={`/stories/${story.slug}`}
                      className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
                    >
                      <h4 className="font-semibold text-stone-800 group-hover:text-emerald-700">
                        {story.title}
                      </h4>
                      <p className="text-sm text-stone-500 mt-1">
                        {new Date(story.created_at).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Write New Story Button */}
            <Link
              href="/write"
              className="mt-10 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition shadow-lg"
            >
              Write a New Story
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-6 px-8 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-800 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}