"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { Heart } from "lucide-react";

interface ClapButtonProps {
  postId: string;
  initialCount: number;
}

export default function ClapButton({ postId, initialCount }: ClapButtonProps) {
  const { user } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [hasClapped, setHasClapped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (async () => {
      if (user) {
        const { data } = await supabase
          .from("claps")
          .select("count")
          .eq("user_id", user.id)
          .eq("post_id", postId)
          .single();

        if (data) {
          setHasClapped(true);
          setCount(data.count + initialCount);
        }
      }
    })();
  }, [user, postId, initialCount]);

  const handleClap = async () => {
    if (!user) {
      alert("Please login to clap!");
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    const newCount = count + 1;

    const { data, error } = await supabase
      .from("claps")
      .upsert(
        {
          user_id: user.id,
          post_id: postId,
          count: newCount - initialCount,
        },
        { onConflict: "user_id,post_id" }
      );

    if (!error) {
      setCount(newCount);
      setHasClapped(true);

      // Update posts table total
      await supabase.rpc("increment_claps", { post_id: postId });
    }
  };

  return (
    <button
      onClick={handleClap}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
        hasClapped
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
      } ${isAnimating ? "animate-ping-once" : ""}`}
    >
      <Heart
        size={24}
        className={hasClapped ? "fill-red-700" : ""}
      />
      <span className="text-lg">{count}</span>
    </button>
  );
}