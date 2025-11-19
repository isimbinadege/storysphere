// app/write/page.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function Write() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: false })],
    content: "<p>Start writing your story here...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-96 p-10 bg-white rounded-xl border-2 border-gray-300",
      },
    },
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`; // organized folder

    const { error } = await supabase.storage
      .from("covers")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    // THIS LINE WAS MISSING BEFORE — NOW IT WORKS!
    const { data: { publicUrl } } = supabase.storage
      .from("covers")
      .getPublicUrl(filePath);

    setCoverImage(publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !editor || editor.isEmpty) {
      alert("Please add a title and some content!");
      return;
    }

    setSaving(true);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 50) + "-" + Date.now();

    const { error } = await supabase.from("posts").insert({
      user_id: user!.id,
      title: title.trim(),
      content: editor.getHTML(),
      slug,
      excerpt: editor.getText().slice(0, 200) + "...",
      cover_image: coverImage || null,
    });

    setSaving(false);

    if (error) {
      console.error("Publish error:", error);
      alert("Publish failed: " + error.message);
    } else {
      alert("Story published successfully!");
      router.push("/stories");
    }
  };

  if (authLoading || !user) return <div className="pt-32 text-center text-2xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-stone-800 text-center mb-12">Write Your Story</h1>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your story title..."
          className="w-full text-5xl font-bold bg-transparent border-none outline-none placeholder-stone-400 text-stone-800 text-center mb-10"
        />

        {/* COVER IMAGE UPLOADER — NOW WORKS 100% */}
        <div className="mb-12">
          {coverImage ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={coverImage} alt="Cover" className="w-full h-96 object-cover" />
              <button
                onClick={() => setCoverImage(null)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition"
              >
                <X size={28} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-96 border-4 border-dashed border-stone-300 rounded-2xl cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition bg-white">
              <ImageIcon size={80} className="text-stone-400 mb-6" />
              <p className="text-2xl font-medium text-stone-600">Upload Cover Image</p>
              <p className="text-stone-500 mt-2">Click or drag & drop</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading && (
                <p className="mt-6 text-stone-700 font-medium">Uploading... Please wait</p>
              )}
            </label>
          )}
        </div>

        <EditorContent editor={editor} className="bg-white rounded-2xl shadow-lg mb-12" />

        <div className="text-center">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="px-16 py-6 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-500 text-white text-2xl font-bold rounded-full transition shadow-2xl"
          >
            {saving ? "Publishing..." : "Publish Story"}
          </button>
        </div>
      </div>
    </div>
  );
}