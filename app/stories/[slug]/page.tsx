"use client";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { Heart, MessageCircle } from "lucide-react";
import { useState, useEffect, use } from "react"; 

export default function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); // ← THIS FIXES THE PROMISE ERROR

  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStory() {
      const { data } = await supabase
        .from("posts")
        .select("id, title, content, cover_image, created_at, claps_count, comments_count")
        .eq("slug", slug)
        .single();

      setStory(data);
      setLoading(false);
    }
    if (slug) fetchStory();
  }, [slug]);

  if (loading) return <div className="pt-40 text-center text-2xl">Loading...</div>;
  if (!story) return <div className="pt-40 text-center text-4xl text-stone-800">Story not found</div>;

  return (
    <article className="min-h-screen bg-stone-50 pt-24 px-6 pb-32">
      <div className="max-w-4xl mx-auto">
        {story.cover_image && (
          <img src={story.cover_image} alt={story.title} className="w-full h-96 object-cover rounded-2xl shadow-2xl mb-12" />
        )}

        <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-8">{story.title}</h1>

        <div className="prose prose-lg max-w-none mb-20 text-stone-700" dangerouslySetInnerHTML={{ __html: story.content }} />

        <div className="border-t-2 border-stone-300 pt-12">
          <ClientInteractions story={story} />
        </div>
      </div>
    </article>
  );
}

function ClientInteractions({ story }: { story: any }) {
  const { user } = useAuth();
  const [claps, setClaps] = useState(story.claps_count || 0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState(story.comments_count || 0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    supabase
      .from("comments")
      .select("id, content, created_at, user_id, profiles:auth.users(email)")
      .eq("post_id", story.id)
      .then(({ data }) => setComments(data || []));
  }, [story.id]);

  const addClap = async () => {
    if (!user) return alert("Login to clap");
    setClaps(c => c + 1);
    await supabase.rpc("increment_claps", { post_id: story.id });
  };

  const postComment = async () => {
    if (!newComment.trim() || !user) return;

    await supabase.from("comments").insert({
      post_id: story.id,
      user_id: user.id,
      content: newComment.trim(),
    });

    setNewComment("");
    setCommentCount(c => c + 1);
    setComments(c => [...c, { content: newComment, profiles: { email: user.email } }]);
    await supabase.rpc("increment_comments", { post_id: story.id });
  };

  return (
    <div className="space-y-16">
      <div className="flex justify-center">
        <button onClick={addClap} className="flex items-center gap-4 px-12 py-6 bg-red-100 hover:bg-red-200 rounded-full text-2xl font-bold transition shadow-xl">
          <Heart size={40} className="fill-red-600 text-red-600" />
          {claps} Claps
        </button>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl">
        <h3 className="text-3xl font-bold mb-10 flex items-center gap-3">
          <MessageCircle size={40} /> Comments ({commentCount})
        </h3>

        {user ? (
          <div className="mb-12">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-6 border-2 border-stone-300 rounded-2xl focus:border-stone-600 focus:outline-none text-lg"
              rows={5}
            />
            <button onClick={postComment} className="mt-6 px-12 py-5 bg-stone-800 text-white font-bold text-xl rounded-full hover:bg-stone-900 transition shadow-lg">
              Post Comment
            </button>
          </div>
        ) : (
          <p className="text-center py-12 text-stone-600 text-xl">Login to comment</p>
        )}

        <div className="space-y-8">
          {comments.length === 0 ? (
            <p className="text-center text-stone-500 py-12 text-xl">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="bg-stone-50 p-8 rounded-2xl">
                <p className="font-bold text-stone-800 text-lg">{c.profiles?.email?.split("@")[0] || "User"}</p>
                <p className="mt-3 text-stone-700 text-lg">{c.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}