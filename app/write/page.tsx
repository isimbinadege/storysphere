// app/write/page.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Write() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: "<p>Start writing your amazing story...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-96 p-10 bg-white rounded-xl border-2 border-gray-300",
      },
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-stone-600">Loading...</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please add a title!");
      return;
    }
    if (!editor || editor.isEmpty) {
      alert("Please write some content!");
      return;
    }

    setSaving(true);

    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      || "untitled";

    const slug = `${baseSlug}-${Date.now()}`;

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      title: title.trim(),
      content: editor.getHTML(),
      slug: slug,
      excerpt: editor.getText().slice(0, 200) + "...",
    });

    setSaving(false);

    if (error) {
      console.error("Supabase error:", error);
      alert("Failed to publish: " + error.message);
    } else {
      alert("Story published successfully!");
      router.push("/stories");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-12 text-stone-800">Write Your Story</h1>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your story title..."
          className="w-full text-5xl font-bold bg-transparent border-none outline-none placeholder-stone-400 text-stone-800 mb-8"
        />

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("bold") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("italic") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("heading", { level: 1 }) ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("heading", { level: 2 }) ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("heading", { level: 3 }) ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("bulletList") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            • Bullets
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("orderedList") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            1. Numbers
          </button>
        </div>

        <EditorContent editor={editor} />

        <div className="mt-10 text-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xl font-bold rounded-full shadow-xl transition"
          >
            {saving ? "Publishing..." : "Publish Story"}
          </button>
        </div>
      </div>
    </div>
  );
}