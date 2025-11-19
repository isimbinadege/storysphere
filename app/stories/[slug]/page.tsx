// app/stories/[slug]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import ClapButton from "../../components/ClapButton";   


async function getStoryBySlug(slug: string) {
  const { data } = await supabase
    .from("posts")
    .select("id, title, content, cover_image, created_at, claps_count")
    .eq("slug", slug)
    .single();

  return data;
}

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const story = await getStoryBySlug(params.slug);

  if (!story) {
    return <div className="pt-40 text-center text-4xl">Story not found</div>;
  }

  return (
    <article className="min-h-screen bg-stone-50 pt-24 px-6 pb-32">
      <div className="max-w-4xl mx-auto">
        {story.cover_image && (
          <img
            src={story.cover_image}
            alt={story.title}
            className="w-full h-96 object-cover rounded-2xl shadow-2xl mb-12"
          />
        )}

        <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-8">
          {story.title}
        </h1>

        <div
          className="prose prose-lg max-w-none mb-20"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        {/* HEART BUTTON — ALWAYS VISIBLE */}
        <div className="flex justify-center py-12 border-t-2 border-stone-200">
          <ClapButton postId={story.id} initialCount={story.claps_count || 0} />
        </div>
      </div>
    </article>
  );
}