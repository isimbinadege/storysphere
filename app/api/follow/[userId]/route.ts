// app/api/follow/[userId]/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }  // ← THIS IS THE FIX
) {
  const { userId: followingId } = await params;  // ← Await the promise
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!followingId) {
    return new Response("Bad Request", { status: 400 });
  }

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

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  return Response.redirect(`${baseUrl}/profile/${followingId}`);
}