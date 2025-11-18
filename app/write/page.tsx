"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Write() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: "<p>Start writing your story…</p>",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-96 p-6",
      },
    },
  });

  if (loading) return <p className="text-center pt-20">Loading…</p>;
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSave = async () => {
    if (!title.trim() || !editor?.getHTML()) return;

    setSaving(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      title,
      content: editor.getHTML(),
      slug,
    });

    setSaving(false);
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      alert("Story saved successfully!");
      router.push("/profile"); // or future /stories/slug
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-stone-800 mb-8">Write a New Story</h1>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Story Title..."
          className="w-full text-5xl font-bold bg-transparent border-none outline-none placeholder-stone-400 text-stone-800 mb-8"
        />

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <EditorContent editor={editor} />
        </div>

        {/* Toolbar */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`px-4 py-2 rounded-lg ${editor?.isActive("bold") ? "bg-stone-700 text-white" : "bg-gray-200"}`}
          >
            Bold
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`px-4 py-2 rounded-lg ${editor?.isActive("italic") ? "bg-stone-700 text-white" : "bg-gray-200"}`}
          >
            Italic
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-4 py-2 rounded-lg ${editor?.isActive("heading", { level: 2 }) ? "bg-stone-700 text-white" : "bg-gray-200"}`}
          >
            H2
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !title}
          className="px-8 py-4 bg-stone-700 text-white rounded-xl hover:bg-stone-800 disabled:bg-stone-400 font-semibold text-lg"
        >
          {saving ? "Saving..." : "Publish Story"}
        </button>
      </div>
    </div>
  );
}