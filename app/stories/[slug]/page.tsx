// app/stories/[slug]/page.tsx
import { supabase } from "@/lib/supabaseClient";

async function getStoryBySlug(slug: string) {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  return data;
}

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const story = await getStoryBySlug(params.slug);

  if (!story) {
    return (
      <div className="pt-40 text-center">
        <h1 className="text-4xl font-bold text-stone-800">Story not found</h1>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-stone-50 pt-24 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* COVER IMAGE AT THE TOP */}
        {story.cover_image && (
          <img
            src={story.cover_image}
            alt={story.title}
            className="w-full h-96 object-cover rounded-2xl shadow-2xl mb-12"
          />
        )}

        <h1 className="text-5xl md:text-6xl font-bold text-stone-800 leading-tight mb-8">
          {story.title}
        </h1>

        <p className="text-stone-500 text-lg mb-12">
          Published on{" "}
          {new Date(story.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div
          className="prose prose-lg max-w-none prose-stone prose-headings:text-stone-800 prose-p:text-stone-700 prose-a:text-stone-600 prose-strong:font-bold prose-blockquote:border-l-stone-400 prose-blockquote:pl-6 prose-blockquote:italic prose-img:rounded-xl prose-img:my-10"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />
      </div>
    </article>
  );
}