import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Upload, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminArticleEdit = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState({
    slug: "", title: "", excerpt: "", content: "", cover_url: "",
    category_id: "", author: "NextGen Editorial", tags: "",
    seo_title: "", seo_description: "", reading_minutes: 5, published: false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: cats = [] } = useQuery({
    queryKey: ["cats"],
    queryFn: async () => (await supabase.from("categories").select("*").order("sort_order")).data || [],
  });

  useEffect(() => {
    if (isNew) return;
    supabase.from("articles").select("*").eq("id", id!).single().then(({ data }) => {
      if (data) setForm({
        slug: data.slug, title: data.title, excerpt: data.excerpt || "",
        content: data.content || "", cover_url: data.cover_url || "",
        category_id: data.category_id || "", author: data.author,
        tags: (data.tags || []).join(", "),
        seo_title: data.seo_title || "", seo_description: data.seo_description || "",
        reading_minutes: data.reading_minutes, published: data.published,
      });
    });
  }, [id, isNew]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("article-images").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    setForm((f) => ({ ...f, cover_url: data.publicUrl }));
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    const payload: any = {
      slug: form.slug || slugify(form.title),
      title: form.title, excerpt: form.excerpt, content: form.content,
      cover_url: form.cover_url || null, category_id: form.category_id || null,
      author: form.author,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      seo_title: form.seo_title || null, seo_description: form.seo_description || null,
      reading_minutes: Number(form.reading_minutes) || 5,
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
    };
    const res = isNew
      ? await supabase.from("articles").insert(payload).select().single()
      : await supabase.from("articles").update(payload).eq("id", id!).select().single();
    setSaving(false);
    if (res.error) toast({ title: "Save failed", description: res.error.message, variant: "destructive" });
    else { toast({ title: "Saved" }); navigate("/admin/articles"); }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={() => navigate("/admin/articles")}><ArrowLeft className="h-4 w-4" /> Back</Button>
      <h1 className="text-3xl font-display font-bold">{isNew ? "New article" : "Edit article"}</h1>
      <Card className="p-6 space-y-4">
        <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: isNew ? slugify(e.target.value) : form.slug })} /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} /></div>
          <div><Label>Category</Label>
            <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{cats.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Excerpt</Label><Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
        <div><Label>Cover image</Label>
          <div className="flex gap-3 items-center">
            <Input value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://..." />
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              <Button type="button" variant="outline" disabled={uploading} asChild><span>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload</span></Button>
            </label>
          </div>
          {form.cover_url && <img src={form.cover_url} alt="" className="mt-3 h-40 rounded-md object-cover" />}
        </div>
        <div><Label>Content (Markdown)</Label><Textarea rows={18} className="font-mono text-sm" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
        {form.content && (
          <div className="rounded-md border border-border p-4">
            <p className="text-xs text-muted-foreground mb-2">Preview</p>
            <article className="prose prose-invert max-w-none prose-sm"><ReactMarkdown>{form.content}</ReactMarkdown></article>
          </div>
        )}
        <div className="grid sm:grid-cols-3 gap-4">
          <div><Label>Author</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
          <div><Label>Tags (comma)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
          <div><Label>Reading min</Label><Input type="number" value={form.reading_minutes} onChange={(e) => setForm({ ...form, reading_minutes: Number(e.target.value) })} /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>SEO Title</Label><Input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} /></div>
          <div><Label>SEO Description</Label><Input value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} /></div>
        </div>
        <div className="flex items-center gap-3"><Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} /><Label>Published</Label></div>
        <div className="flex gap-2 pt-3 border-t border-border">
          <Button variant="hero" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save article</Button>
          <Button variant="outline" onClick={() => navigate("/admin/articles")}>Cancel</Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminArticleEdit;