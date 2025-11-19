// app/page.tsx
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

async function getStories() {
  const { data } = await supabase
    .from("posts")
    .select("id, title, excerpt, slug, created_at, content")
    .order("created_at", { ascending: false })
    .limit(12);

  return data || [];
}

export const revalidate = 30;

export default async function HomePage() {
  const stories = await getStories();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pt-4">
      {/* TOP BAR — Join / Start Writing */}
      <div className="bg-stone-800 text-white py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">StorySphere</h1>
        <p className="text-xl text-stone-300 mb-8 max-w-2xl mx-auto">
          A quiet place for thoughtful writing.
        </p>
        <div className="space-x-4">
          <Link
            href="/write"
            className="inline-block px-10 py-4 bg-white text-stone-900 font-semibold text-lg rounded-full hover:bg-stone-100 transition"
          >
            Start Writing
          </Link>
          <Link
            href="/stories"
            className="inline-block px-10 py-4 border-2 border-white text-white font-semibold text-lg rounded-full hover:bg-white/10 transition"
          >
            Explore Stories
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Latest Stories Title */}
        <h2 className="text-4xl font-bold text-stone-800 mb-12 text-center">
          Latest Stories
        </h2>

        {/* No stories yet */}
        {stories.length === 0 && (
          <div className="text-center py-24">
            <p className="text-2xl text-stone-600 mb-8">
              No stories yet — be the first to share yours.
            </p>
            <Link
              href="/write"
              className="px-10 py-4 bg-stone-800 text-white font-semibold text-lg rounded-full hover:bg-stone-900 transition"
            >
              Write the First Story
            </Link>
          </div>
        )}

        {/* Stories Grid */}
        {stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Image placeholder */}
                <div className="h-56 bg-stone-200 border-2 border-dashed border-stone-300 rounded-t-xl" />

                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-800 group-hover:text-stone-600 transition line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="mt-3 text-stone-600 line-clamp-3 text-sm">
                    {story.excerpt || story.content.replace(/<[^>]*>/g, "").slice(0, 130) + "..."}
                  </p>
                  <p className="mt-5 text-xs text-stone-500">
                    {new Date(story.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* More button */}
        {stories.length > 0 && (
          <div className="text-center mt-16">
            <Link
              href="/stories"
              className="inline-block px-12 py-4 bg-stone-800 text-white font-medium rounded-full hover:bg-stone-900 transition"
            >
              View All Stories →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}