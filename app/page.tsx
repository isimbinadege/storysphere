// app/page.tsx
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

async function getLatestStories() {
  const { data } = await supabase
    .from("posts")
    .select("id, title, excerpt, slug, created_at, content")
    .order("created_at", { ascending: false })
    .limit(9);

  return data || [];
}

export const revalidate = 30; // refresh every 30 seconds

export default async function HomePage() {
  const stories = await getLatestStories();

  const heroStory = stories[0];
  const featuredStories = stories.slice(1, 7);
  const moreStories = stories.slice(7);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* HERO SECTION */}
      {heroStory && (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 text-white">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <p className="text-stone-300 tracking-widest uppercase mb-4 text-sm">
              Today’s Highlight
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              {heroStory.title}
            </h1>
            <p className="text-xl md:text-2xl text-stone-200 mb-10 max-w-3xl mx-auto line-clamp-3">
              {heroStory.excerpt || heroStory.content.replace(/<[^>]*>/g, "").slice(0, 180) + "..."}
            </p>
            <Link
              href={`/stories/${heroStory.slug}`}
              className="inline-block px-12 py-5 bg-white text-stone-900 font-bold text-lg rounded-full hover:bg-stone-100 transition shadow-2xl"
            >
              Read Full Story
            </Link>
          </div>

          {/* Decorative subtle pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 to-transparent" />
        </section>
      )}

      {/* FEATURED STORIES GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-12 text-center">
          Latest Stories
        </h2>

        {featuredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredStories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                {/* Placeholder for future cover image */}
                <div className="h-64 bg-gradient-to-br from-stone-200 to-stone-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-stone-800 group-hover:text-stone-600 transition">
                    {story.title}
                  </h3>
                  <p className="mt-4 text-stone-600 line-clamp-3">
                    {story.excerpt || story.content.replace(/<[^>]*>/g, "").slice(0, 160) + "..."}
                  </p>
                  <p className="mt-6 text-sm text-stone-500">
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
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-stone-600 mb-8">No stories yet — be the first to write one!</p>
            <Link
              href="/write"
              className="px-10 py-5 bg-stone-800 text-white font-bold text-lg rounded-full hover:bg-stone-900 transition"
            >
              Start Writing
            </Link>
          </div>
        )}

        {/* MORE STORIES (smaller cards) */}
        {moreStories.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-stone-800 mt-24 mb-10 text-center">
              More for You
            </h2>
            <div className="space-y-6 max-w-4xl mx-auto">
              {moreStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.slug}`}
                  className="flex items-center gap-8 p-6 bg-white rounded-xl shadow hover:shadow-xl transition group"
                >
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-stone-800 group-hover:text-stone-600">
                      {story.title}
                    </h4>
                    <p className="text-stone-500 text-sm mt-2">
                      {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="w-32 h-32 bg-gradient-to-br from-stone-200 to-stone-400 rounded-lg" />
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-stone-800 text-white py-20">
        <div className="text-center max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-6">Join the StorySphere Community</h2>
          <p className="text-xl text-stone-300 mb-10">
            Share your voice. Inspire the world. Start writing today.
          </p>
          <Link
            href="/write"
            className="inline-block px-12 py-5 bg-white text-stone-900 font-bold text-lg rounded-full hover:bg-stone-100 transition shadow-2xl"
          >
            Start Writing — It’s Free
          </Link>
        </div>
      </section>
    </div>
  );
}