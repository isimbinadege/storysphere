// app/search/page.tsx
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Search, User, BookOpen } from "lucide-react";

async function searchEverything(query: string) {
  if (!query.trim()) return { users: [], stories: [] };

  // Search users by email (or you can add username later)
  const { data: users } = await supabase
    .from("auth.users")
    .select("id, email")
    .ilike("email", `%${query}%`)
    .limit(5);

  // Search stories by title or content
  const { data: stories } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, user_id")
    .eq("published", true)
    .or(`title.ilike.%${query}%, content.ilike.%${query}%`)
    .limit(10);

  return {
    users: users || [],
    stories: stories || [],
  };
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  const { users, stories } = await searchEverything(query);

  return (
    <div className="min-h-screen bg-stone-50 pt-28 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-stone-800 mb-4">
            Search Results for "<span className="text-emerald-600">{query}</span>"
          </h1>
          <p className="text-xl text-stone-600">
            {users.length + stories.length} results found
          </p>
        </div>

        {/* Users Results */}
        {users.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-stone-800 mb-8 flex items-center gap-3">
              <User size={36} className="text-blue-600" /> People
            </h2>
            <div className="space-y-6">
              {users.map((user: any) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">
                      {user.email.split("@")[0]}
                    </h3>
                    <p className="text-stone-600">{user.email}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stories Results */}
        {stories.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-stone-800 mb-8 flex items-center gap-3">
              <BookOpen size={36} className="text-emerald-600" /> Stories
            </h2>
            <div className="grid gap-8">
              {stories.map((story: any) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.slug}`}
                  className="block group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                >
                  <div className="flex">
                    {story.cover_image && (
                      <img
                        src={story.cover_image}
                        alt={story.title}
                        className="w-48 h-32 object-cover"
                      />
                    )}
                    <div className="p-8 flex-1">
                      <h3 className="text-2xl font-bold text-stone-800 group-hover:text-emerald-600 transition">
                        {story.title}
                      </h3>
                      <p className="mt-3 text-stone-600 line-clamp-2">
                        {story.excerpt || "No preview available"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {users.length === 0 && stories.length === 0 && query && (
          <div className="text-center py-24">
            <Search size={80} className="mx-auto text-stone-400 mb-6" />
            <p className="text-2xl text-stone-600">No results found for "{query}"</p>
            <p className="text-stone-500 mt-4">Try searching for a user or story title</p>
          </div>
        )}
      </div>
    </div>
  );
}