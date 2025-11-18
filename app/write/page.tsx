// app/write/page.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Individual extensions — FULL CONTROL
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function Write() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-emerald-600 underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto mx-auto my-8" },
      }),
    ],
    content: `
      <h1>Your Amazing Title</h1>
      <p>Start writing your story here...</p>
      <ul><li>This bullet list works!</li></ul>
    `,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-96 p-10 bg-white rounded-xl",
      },
    },
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <div className="pt-20 text-center text-2xl">Loading...</div>;
  }

  const handleSave = async () => {
    if (!title.trim() || !editor?.getHTML()) {
      alert("Please add a title and content");
      return;
    }

    setSaving(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      title,
      content: editor.getHTML(),
      slug,
    });

    setSaving(false);
    if (error) alert("Error: " + error.message);
    else {
      alert("Story published successfully!");
      router.push("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-stone-800 mb-10 text-center">
          Write Your Story
        </h1>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your story title..."
          className="w-full text-5xl font-bold bg-transparent border-none outline-none placeholder-stone-400 text-stone-800 mb-8"
        />

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <EditorContent editor={editor} />
        </div>

        {/* TOOLBAR — ALL WORKING 100% */}
        <div className="flex flex-wrap gap-3 mb-10 p-4 bg-white rounded-xl shadow">
          <button onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${editor?.isActive("bold") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            Bold
          </button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${editor?.isActive("italic") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            Italic
          </button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${editor?.isActive("heading", { level: 1 }) ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            H1
          </button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${editor?.isActive("heading", { level: 2 }) ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            H2
          </button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${editor?.isActive("heading", { level: 3 }) ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            H3
          </button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${editor?.isActive("bulletList") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            Bullets
          </button>
          <button onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`px-5 py-3 rounded-lg font-medium transition ${editor?.isActive("orderedList") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            Numbers
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleSave}
            disabled={saving || !title}
            className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold text-lg rounded-full transition shadow-lg"
          >
            {saving ? "Publishing..." : "Publish Story"}
          </button>
        </div>
      </div>
    </div>
  );
}