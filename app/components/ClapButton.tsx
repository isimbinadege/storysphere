// components/ClapButton.tsx
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

  // FIXED: Check if user already clapped
  useEffect(() => {
    const checkUserClap = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("claps")
        .select("count")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .maybeSingle(); // important: use maybeSingle() in case no row

      if (data && !error) {
        setHasClapped(true);
        setCount(initialCount + data.count);
      }
    };

    checkUserClap();
  }, [user, postId, initialCount]);

  const handleClap = async () => {
    if (!user) {
      alert("Please login to clap!");
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    const newCount = count + 1;
    const clapsToSave = hasClapped ? newCount - initialCount : 1;

    const { error } = await supabase
      .from("claps")
      .upsert(
        {
          user_id: user.id,
          post_id: postId,
          count: clapsToSave,
        },
        { onConflict: "user_id,post_id" }
      );

    if (!error) {
      setCount(newCount);
      setHasClapped(true);

      // Increment total claps in posts table
      await supabase.rpc("increment_claps", { post_id: postId });
    } else {
      console.error("Clap error:", error);
    }
  };

  return (
    <button
      onClick={handleClap}
      className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg ${
        hasClapped
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
      } ${isAnimating ? "animate-pulse" : ""}`}
    >
      <Heart
        size={28}
        className={`transition-all ${hasClapped ? "fill-red-700" : ""}`}
      />
      <span>{count}</span>
      <span className="hidden sm:inline">Claps</span>
    </button>
  );
}