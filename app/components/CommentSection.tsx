// app/components/CommentSection.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

export default function CommentSection({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments
  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        user_id,
        parent_id,
        profiles:auth.users(email)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    setComments(data || []);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const postComment = async () => {
    if (!newComment.trim() || !user) return;

    await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      content: newComment.trim(),
    });

    setNewComment("");
    fetchComments();
  };

  // PERFECTLY FIXED TIME AGO FUNCTION — BUILD WILL PASS
  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="mt-20 pt-10 border-t-2 border-stone-200">
      <h3 className="text-3xl font-bold text-stone-800 mb-8">Comments ({comments.length})</h3>

      {user ? (
        <div className="mb-12 bg-white p-6 rounded-xl shadow">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full p-4 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 resize-none"
            rows={4}
          />
          <button
            onClick={postComment}
            disabled={!newComment.trim()}
            className="mt-4 px-8 py-3 bg-stone-800 text-white font-bold rounded-full hover:bg-stone-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p className="text-center text-stone-600 mb-8">Please login to comment</p>
      )}

      <div className="space-y-8">
        {comments.length === 0 ? (
          <p className="text-center text-stone-500">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-stone-600 to-stone-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {c.profiles?.email?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-stone-800">
                    {c.profiles?.email?.split("@")[0] || "Anonymous"}
                  </p>
                  <p className="text-xs text-stone-500">{timeAgo(c.created_at)}</p>
                </div>
              </div>
              <p className="mt-4 text-stone-700 leading-relaxed">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}