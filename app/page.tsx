// app/page.tsx
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Heart, MessageCircle } from "lucide-react";

async function getStories() {
  const { data } = await supabase
    .from("posts")
    .select("id, title, excerpt, slug, created_at, content, cover_image, claps_count, comments_count")
    .eq("published", true)           // ← ONLY PUBLISHED
    .order("created_at", { ascending: false })
    .limit(12);

  return data || [];
}

export const revalidate = 30;

export default async function HomePage() {
  const stories = await getStories();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-stone-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 opacity-90" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            StorySphere
          </h1>
          <p className="text-xl md:text-2xl text-stone-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            A calm space for thoughtful words and meaningful stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/write"
              className="px-10 py-5 bg-white text-stone-900 font-bold text-lg rounded-full hover:bg-stone-100 transition shadow-xl"
            >
              Start Writing
            </Link>
            <Link
              href="/stories"
              className="px-10 py-5 border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white/10 transition backdrop-blur-sm"
            >
              Explore Stories
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 md:h-32 text-stone-50">
            <path fill="currentColor" d="M0,0 C360,120 1080,120 1440,0 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {/* LATEST STORIES */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-stone-800 text-center mb-16">
          Latest Stories
        </h2>

        {stories.length === 0 ? (
          <div class="text-center py-24">
            <p class="text-2xl text-stone-600 mb-10">
              No stories yet — be the first to share yours.
            </p>
            <Link
              href="/write"
              className="px-10 py-5 bg-stone-800 text-white font-bold text-lg rounded-full hover:bg-stone-900 transition shadow-lg"
            >
              Write the First Story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group block bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {story.cover_image ? (
                  <img src={story.cover_image} alt={story.title} className="w-full h-56 object-cover" />
                ) : (
                  <div className="h-56 bg-gradient-to-br from-stone-200 to-stone-300" />
                )}

                <div className="p-8">
                  <h3 className="text-xl font-bold text-stone-800 group-hover:text-stone-600 transition line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="mt-4 text-stone-600 text-sm line-clamp-3">
                    {story.excerpt || story.content.replace(/<[^>]*>/g, "").slice(0, 140) + "..."}
                  </p>

                  <div className="mt-8 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-5 text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Heart size={18} className="fill-red-500 text-red-500" />
                        <span className="font-medium">{story.claps_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle size={18} />
                        <span className="font-medium">{story.comments_count || 0}</span>
                      </div>
                    </div>
                    <span className="text-stone-500">
                      {new Date(story.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {stories.length > 0 && (
          <div className="text-center mt-20">
            <Link
              href="/stories"
              className="inline-block px-12 py-5 bg-stone-800 text-white font-medium text-lg rounded-full hover:bg-stone-900 transition shadow-lg"
            >
              View All Stories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}