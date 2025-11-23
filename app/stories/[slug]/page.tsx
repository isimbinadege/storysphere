// app/stories/[slug]/page.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function StoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [story, setStory] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [claps, setClaps] = useState(0);
  const [hasClapped, setHasClapped] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;

      // Load story
      const { data: storyData } = await supabase
        .from("posts")
        .select("id, title, content, cover_image, created_at, claps_count, comments_count")
        .eq("slug", slug)
        .single();

      if (!storyData) {
        setLoading(false);
        return;
      }

      // Get comments with user emails
      const { data: commentsData } = await supabase
        .from("comments")
        .select("id, content, created_at, user_id, user_email, user_name")
        .eq("post_id", storyData.id)
        .order("created_at", { ascending: true });

      // Map comments with display names
      const commentsWithUser = commentsData?.map(c => ({
        ...c,
        displayName: c.user_name || c.user_email?.split("@")[0] || "User"
      })) || [];

      // Check if current user clapped
      let clapped = false;
      if (user) {
        const { data } = await supabase
          .from("claps")
          .select("id")
          .eq("user_id", user.id)
          .eq("post_id", storyData.id)
          .maybeSingle();
        clapped = !!data;
      }

      setStory(storyData);
      setComments(commentsWithUser);
      setClaps(storyData.claps_count || 0);
      setHasClapped(clapped);
      setLoading(false);
    }

    load();
  }, [slug, user]);

  const toggleClap = async () => {
    if (!user) return alert("Login to clap");

    if (hasClapped) {
      await supabase.from("claps").delete().eq("user_id", user.id).eq("post_id", story.id);
      await supabase.rpc("decrement_claps", { post_id: story.id });
      setClaps(c => c - 1);
      setHasClapped(false);
    } else {
      await supabase.from("claps").insert({ user_id: user.id, post_id: story.id });
      await supabase.rpc("increment_claps", { post_id: story.id });
      setClaps(c => c + 1);
      setHasClapped(true);
    }
  };

  const postComment = async () => {
    if (!newComment.trim() || !user) return;

    const { data } = await supabase
      .from("comments")
      .insert({
        post_id: story.id,
        user_id: user.id,
        content: newComment.trim(),
      })
      .select("id, content, created_at, user_id")
      .single();

    // Get current user's username from user table
    const { data: userData, error } = await supabase
      .from("Users")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("Current user data:", userData);
    console.log("Error:", error);

    const displayName = userData?.username || userData?.name || userData?.full_name || userData?.email?.split("@")[0] || "You";

    setComments(prev => [...prev, { ...data, displayName }]);
    setNewComment("");
    await supabase.rpc("increment_comments", { post_id: story.id });
  };

  if (loading) return <div className="pt-40 text-center text-2xl text-stone-600">Loading...</div>;
  if (!story) return <div className="pt-40 text-center text-4xl text-stone-800">Story not found</div>;

  return (
    <article className="min-h-screen bg-stone-50 pt-24 px-6 pb-40">
      <div className="max-w-4xl mx-auto">
        {story.cover_image && (
          <img src={story.cover_image} alt={story.title} className="w-full h-96 object-cover rounded-3xl shadow-2xl mb-12" />
        )}
        <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-10 leading-tight">{story.title}</h1>

        <div className="prose prose-lg max-w-none mb-20 text-stone-700" dangerouslySetInnerHTML={{ __html: story.content }} />

        {/* CLAP BUTTON */}
        <div className="flex justify-center mb-16">
          <button
            onClick={toggleClap}
            className={`flex items-center gap-4 px-14 py-7 rounded-full text-2xl font-bold transition-all shadow-2xl ${
              hasClapped ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-stone-200 text-stone-700 hover:bg-stone-300"
            }`}
          >
            <Heart size={44} className={hasClapped ? "fill-red-700" : ""} />
            {claps} {claps === 1 ? "Clap" : "Claps"}
          </button>
        </div>

        {/* COMMENTS SECTION */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 text-stone-800">
            <MessageCircle size={40} /> Comments ({comments.length})
          </h2>

          {user ? (
            <div className="mb-12">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full p-6 border-2 border-stone-300 rounded-2xl focus:border-stone-600 focus:outline-none text-lg resize-none"
                rows={4}
              />
              <button
                onClick={postComment}
                className="mt-6 px-12 py-5 bg-stone-800 text-white font-bold text-xl rounded-full hover:bg-stone-900 transition shadow-lg"
              >
                Post Comment
              </button>
            </div>
          ) : (
            <p className="text-center py-12 text-stone-600 text-xl">Please login to comment</p>
          )}

          <div className="space-y-8">
            {comments.length === 0 ? (
              <p className="text-center text-stone-500 py-12 text-xl">No comments yet. Be the first!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="bg-stone-50 p-8 rounded-2xl border border-stone-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {c.displayName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-stone-800 text-lg">
                        {c.displayName || "User"}
                      </p>
                      <p className="text-sm text-stone-500">
                        {new Date(c.created_at).toLocaleDateString()} at {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <p className="text-stone-700 text-lg leading-relaxed">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </article>
  );
}