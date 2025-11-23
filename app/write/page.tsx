// app/write/page.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Upload, X, Bold, Italic, List, ListOrdered, Save, Globe } from "lucide-react";

export default function Write() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: false })],
    content: "<p>Start writing your story here...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-96 p-10 bg-white rounded-2xl border-2 border-gray-300",
      },
    },
  });

  // Load drafts only for this user
  useEffect(() => {
    if (user) loadDrafts();
  }, [user]);

  const loadDrafts = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("posts")
      .select("id, title, content, cover_image, updated_at, published")
      .eq("user_id", user.id)  // ← FIXED: only this user's drafts
      .order("updated_at", { ascending: false });

    setDrafts(data || []);
  };

  // Auto-save draft every time user types
  useEffect(() => {
    if (!title && editor?.isEmpty) return;

    const timer = setTimeout(() => {
      saveDraft();  // ← FIXED: call the function
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, editor?.getHTML(), coverImage]);

  const saveDraft = async () => {
    if (!user || !title.trim()) return;

    setSavingDraft(true);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 50) + "-" + Date.now();

    const { data } = await supabase
      .from("posts")
      .upsert({
        id: currentDraftId || undefined,
        user_id: user.id,
        title: title.trim(),
        content: editor?.getHTML() || "",
        slug,
        excerpt: editor?.getText().slice(0, 200) + "...",
        cover_image: coverImage,
        published: false,
      }, { onConflict: "id" })
      .select()
      .single();

    if (data && !currentDraftId) setCurrentDraftId(data.id);
    setSavingDraft(false);
    loadDrafts();
  };

  const publishStory = async () => {
    if (!title.trim() || !editor || editor.isEmpty) {
      alert("Please add a title and content!");
      return;
    }

    setPublishing(true);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 100);

    await supabase
      .from("posts")
      .update({
        title: title.trim(),
        content: editor.getHTML(),
        slug,
        excerpt: editor.getText().slice(0, 200) + "...",
        cover_image: coverImage,
        published: true,
        claps_count: 0,
        comments_count: 0,
      })
      .eq("id", currentDraftId || undefined)
      .eq("user_id", user.id);

    setPublishing(false);
    alert("Story published successfully!");
    router.push("/stories");
  };

  const loadDraft = (draft: any) => {
    setTitle(draft.title);
    setCoverImage(draft.cover_image);
    editor?.commands.setContent(draft.content || "");
    setCurrentDraftId(draft.id);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage
      .from("covers")
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("covers").getPublicUrl(filePath);
    setCoverImage(publicUrl);
    setUploading(false);
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

        {/* COVER IMAGE */}
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
              <Upload size={80} className="text-stone-400 mb-6" />
              <p className="text-2xl font-medium text-stone-600">Upload Cover Image</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              {uploading && <p className="mt-6 text-stone-700 font-medium">Uploading...</p>}
            </label>
          )}
        </div>

        {/* TOOLBAR */}
        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          <button onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-4 rounded-lg transition ${editor?.isActive("bold") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            <Bold size={24} />
          </button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-4 rounded-lg transition ${editor?.isActive("italic") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            <Italic size={24} />
          </button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-4 rounded-lg transition ${editor?.isActive("bulletList") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            <List size={24} />
          </button>
          <button onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-4 rounded-lg transition ${editor?.isActive("orderedList") ? "bg-stone-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
            <ListOrdered size={24} />
          </button>
        </div>

        <EditorContent editor={editor} className="bg-white rounded-2xl shadow-lg mb-12" />

        {/* SAVE DRAFT + PUBLISH BUTTONS */}
        <div className="flex justify-center gap-8 mb-16">
          <button
            onClick={saveDraft}
            disabled={savingDraft}
            className="flex items-center gap-3 px-10 py-5 bg-stone-200 hover:bg-stone-300 disabled:bg-stone-100 rounded-full font-bold text-xl transition shadow-lg"
          >
            <Save size={28} />
            {savingDraft ? "Saving Draft..." : "Save as Draft"}
          </button>

          <button
            onClick={publishStory}
            disabled={publishing || !title.trim() || editor?.isEmpty}
            className="flex items-center gap-3 px-12 py-5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-full font-bold text-xl transition shadow-lg"
          >
            <Globe size={28} />
            {publishing ? "Publishing..." : "Publish Story"}
          </button>
        </div>

        {/* YOUR DRAFTS — ONLY YOU SEE THEM */}
        {drafts.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">Your Drafts</h2>
            <div className="grid gap-6">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  onClick={() => loadDraft(draft)}
                  className="p-6 bg-stone-50 rounded-2xl hover:bg-stone-100 cursor-pointer transition border border-stone-300 hover:border-stone-500"
                >
                  <h3 className="text-2xl font-bold text-stone-800">{draft.title || "Untitled Draft"}</h3>
                  <p className="text-stone-600 mt-2">Last saved: {new Date(draft.updated_at).toLocaleString()}</p>
                  {!draft.published && <span className="inline-block mt-3 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">Draft</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}