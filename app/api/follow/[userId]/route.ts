// app/api/follow/[userId]/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const followingId = params.userId;

  // Check if already following
  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", followingId)
    .single();

  if (existing) {
    // Unfollow
    await supabase.from("follows").delete().eq("id", existing.id);
  } else {
    // Follow
    await supabase.from("follows").insert({
      follower_id: user.id,
      following_id: followingId,
    });
  }

  return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/profile/${followingId}`);
}