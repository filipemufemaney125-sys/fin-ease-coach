import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Loader2, Wand2, Save, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

type GeneratedArticle = {
  title: string;
  slug: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  tags: string[];
  reading_minutes: number;
  content: string;
};

const MODELS = [
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro (best quality)" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash (faster)" },
  { value: "openai/gpt-5", label: "GPT-5 (premium reasoning)" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini (balanced)" },
];

const AdminAIGenerate = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [model, setModel] = useState(MODELS[0].value);
  const [categoryId, setCategoryId] = useState<string>("");
  const [publishNow, setPublishNow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState<GeneratedArticle | null>(null);

  const { data: cats = [] } = useQuery({
    queryKey: ["cats"],
    queryFn: async () => (await supabase.from("categories").select("*").order("sort_order")).data || [],
  });

  const generate = async () => {
    const trimmed = topic.trim();
    if (trimmed.length < 3) {
      toast({ title: "Topic too short", description: "Enter at least 3 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setArticle(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-article-structured", {
        body: { topic: trimmed, model },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setArticle((data as any).article);
      toast({ title: "Article generated", description: "Review and save below." });
    } catch (err: any) {
      toast({ title: "Generation failed", description: err?.message || "Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!article) return;
    setSaving(true);
    const { data: userRes } = await supabase.auth.getUser();
    const payload: any = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category_id: categoryId || null,
      author: "NextGen AI",
      tags: article.tags || [],
      seo_title: article.seo_title,
      seo_description: article.seo_description,
      reading_minutes: article.reading_minutes || 6,
      published: publishNow,
      published_at: publishNow ? new Date().toISOString() : null,
      created_by: userRes.user?.id ?? null,
    };
    const { data, error } = await supabase.from("articles").insert(payload).select().single();
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: publishNow ? "Article published" : "Draft saved" });
    navigate(`/admin/articles/${data.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-display font-bold flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" /> AI Article Generator
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate SEO-optimized long-form articles and save them straight to your blog.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <Label>Article topic</Label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How AI agents are reshaping personal finance in 2026"
            disabled={loading}
            maxLength={250}
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>AI model</Label>
            <Select value={model} onValueChange={setModel} disabled={loading}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Category (optional)</Label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={loading}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {cats.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <div className="flex items-center gap-3 h-10">
              <Switch checked={publishNow} onCheckedChange={setPublishNow} id="pub" />
              <Label htmlFor="pub" className="cursor-pointer">Publish on save</Label>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="hero" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? "Generating…" : "Generate article"}
          </Button>
        </div>
      </Card>

      {loading && (
        <Card className="p-10 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 font-medium">Researching, structuring and writing your article…</p>
          <p className="text-sm text-muted-foreground mt-1">This can take 20–40 seconds for premium models.</p>
        </Card>
      )}

      {article && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5" /> Review &amp; edit
            </h2>
            <Button variant="hero" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {publishNow ? "Save & publish" : "Save as draft"}
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Title</Label><Input value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })} /></div>
            <div><Label>Slug</Label><Input value={article.slug} onChange={(e) => setArticle({ ...article, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} /></div>
          </div>
          <div><Label>Excerpt</Label><Textarea rows={2} value={article.excerpt} onChange={(e) => setArticle({ ...article, excerpt: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>SEO Title</Label><Input value={article.seo_title} onChange={(e) => setArticle({ ...article, seo_title: e.target.value })} /></div>
            <div><Label>SEO Description</Label><Input value={article.seo_description} onChange={(e) => setArticle({ ...article, seo_description: e.target.value })} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Tags (comma separated)</Label><Input value={article.tags.join(", ")} onChange={(e) => setArticle({ ...article, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} /></div>
            <div><Label>Reading minutes</Label><Input type="number" value={article.reading_minutes} onChange={(e) => setArticle({ ...article, reading_minutes: Number(e.target.value) || 5 })} /></div>
          </div>
          <div>
            <Label>Content (Markdown)</Label>
            <Textarea rows={18} className="font-mono text-sm" value={article.content} onChange={(e) => setArticle({ ...article, content: e.target.value })} />
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-xs text-muted-foreground mb-2">Preview</p>
            <article className="prose prose-invert max-w-none prose-sm prose-headings:font-display">
              <h1>{article.title}</h1>
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </article>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminAIGenerate;