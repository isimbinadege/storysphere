// app/stories/page.tsx
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export const revalidate = 10;

async function getAllStories() {
  const { data } = await supabase
    .from("posts")
    .select("id, title, excerpt, slug, created_at, content")
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function StoriesPage() {
  const stories = await getAllStories();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-stone-800 text-center mb-12">
          All Stories
        </h1>

        {stories.length === 0 ? (
          <p className="text-center text-xl text-stone-600">
            No stories yet. Be the first to write one!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Cover placeholder */}
                  <div className="h-48 bg-gradient-to-br from-stone-300 to-stone-500" />

                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-stone-800 group-hover:text-emerald-700 transition">
                      {story.title}
                    </h2>
                    <p className="mt-3 text-stone-600 line-clamp-3">
                      {story.excerpt ||
                        story.content.replace(/<[^>]*>/g, "").slice(0, 150) + "..."}
                    </p>
                    <p className="mt-4 text-sm text-stone-500">
                      {new Date(story.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}