// app/profile/[id]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { Heart, MessageCircle, Users } from "lucide-react";
import Link from "next/link";

async function getProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("id, email, created_at")
    .eq("id", userId)
    .single();

  return data;
}

async function getUserStats(userId: string) {
  const { count: followers } = await supabase
    .from("follows")
    .select("*", { count: "exact" })
    .eq("following_id", userId);

  const { count: following } = await supabase
    .from("follows")
    .select("*", { count: "exact" })
    .eq("follower_id", userId);

  const { count: stories } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("published", true);

  return { followers: followers || 0, following: following || 0, stories: stories || 0 };
}

async function getUserStories(userId: string) {
  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, cover_image, created_at, claps_count, comments_count")
    .eq("user_id", userId)
    .eq("published", true)
    .order("created_at", { ascending: false });

  return data || [];
}

async function isFollowing(followerId: string, followingId: string) {
  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .single();

  return !!data;
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { data: { user } } = await supabase.auth.getUser();
  const profile = await getProfile(params.id);
  const stats = await getUserStats(params.id);
  const stories = await getUserStories(params.id);
  const following = user ? await isFollowing(user.id, params.id) : false;
  const isOwnProfile = user?.id === params.id;

  if (!profile) return <div>User not found</div>;

  return (
    <div className="min-h-screen bg-stone-50 pt-24 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="w-32 h-32 bg-stone-700 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-5xl font-bold">
            {profile.email[0].toUpperCase()}
          </div>
          <h1 className="text-4xl font-bold text-stone-800">
            {profile.email.split("@")[0]}
          </h1>
          <p className="text-stone-600 mt-2">Member since {new Date(profile.created_at).toLocaleDateString()}</p>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-8 text-stone-700">
            <div>
              <p className="text-3xl font-bold">{stats.stories}</p>
              <p className="text-sm">Stories</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.followers}</p>
              <p className="text-sm">Followers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.following}</p>
              <p className="text-sm">Following</p>
            </div>
          </div>

          {/* Follow Button */}
          {!isOwnProfile && user && (
            <form action={`/api/follow/${params.id}`} method="POST">
              <button
                type="submit"
                className={`mt-8 px-12 py-4 rounded-full font-bold text-xl transition ${
                  following
                    ? "bg-stone-300 hover:bg-stone-400 text-stone-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {following ? "Unfollow" : "Follow"}
              </button>
            </form>
          )}
        </div>

        {/* User's Stories */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-stone-800 mb-8 flex items-center gap-3">
            <Users size={36} /> Stories by this author
          </h2>

          {stories.length === 0 ? (
            <p className="text-center text-xl text-stone-600 py-16">No published stories yet.</p>
          ) : (
            <div className="grid gap-8">
              {stories.map((story) => (
                <Link key={story.id} href={`/stories/${story.slug}`} className="block group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                    {story.cover_image && (
                      <img src={story.cover_image} alt={story.title} className="w-full h-64 object-cover" />
                    )}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-stone-800 group-hover:text-stone-600 transition">
                        {story.title}
                      </h3>
                      <div className="flex items-center gap-6 mt-4 text-stone-600">
                        <div className="flex items-center gap-2">
                          <Heart size={20} className="fill-red-500 text-red-500" />
                          <span>{story.claps_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle size={20} />
                          <span>{story.comments_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}