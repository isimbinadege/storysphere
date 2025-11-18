"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";

export default function Write() {
  const [title, setTitle] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: "<p>Start writing here...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-96 p-10 bg-white rounded-xl border-2 border-gray-300",
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-12 text-stone-800">📝 Write Your Story</h1>

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
            disabled={!editor}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("bold") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}>
            Bold
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("italic") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}>
            Italic
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            disabled={!editor}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("heading", { level: 1 }) ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}>
            H1
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={!editor}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("heading", { level: 2 }) ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}>
            H2
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={!editor}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("heading", { level: 3 }) ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}>
            H3
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={!editor}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("bulletList") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}>
            • Bullets
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={!editor}
            className={`px-5 py-3 rounded-lg font-medium transition ${
              editor?.isActive("orderedList") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}>
            1. Numbers
          </button>
        </div>

        <EditorContent editor={editor} />

        <button
          type="button"
          onClick={() => alert(editor?.getHTML())}
          className="mt-10 px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-full shadow-xl transition">
          Test Content
        </button>
      </div>
    </div>
  );
}