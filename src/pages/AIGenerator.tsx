import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Loader2, Copy, Check, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageShell from "@/components/site/PageShell";
import SEO from "@/components/site/SEO";

const SUGGESTIONS = [
  "How AI agents will transform productivity in 2026",
  "Best AI tools for crypto trading beginners",
  "ChatGPT vs Gemini: which one to pick for content creation",
  "Passive income with AI side hustles",
];

const AIGenerator = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = topic.trim();
    if (trimmed.length < 3) {
      toast({ title: "Topic too short", description: "Enter at least 3 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setArticle("");
    try {
      const { data, error } = await supabase.functions.invoke("generate-article", {
        body: { topic: trimmed },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setArticle((data as any).article || "");
    } catch (err: any) {
      const msg = err?.message || "Failed to generate article.";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!article) return;
    await navigator.clipboard.writeText(article);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell>
      <SEO
        title="AI Article Generator — NextGen Moz"
        description="Generate SEO-optimized, professional blog articles in seconds with the NextGen Moz AI Generator."
      />
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="container relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Writing
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
              AI Article <span className="text-gradient-brand">Generator</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Turn any topic into a publish-ready, SEO-optimized article — complete with title, headings, FAQs and a strong conclusion.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="mx-auto mt-10 max-w-2xl">
            <Card className="p-2 flex flex-col sm:flex-row gap-2 border-border/60 bg-card/60 backdrop-blur">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The future of AI in digital finance"
                disabled={loading}
                maxLength={200}
                className="border-0 bg-transparent focus-visible:ring-0 text-base h-12"
              />
              <Button type="submit" variant="hero" size="lg" disabled={loading} className="sm:w-auto w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate Article
                  </>
                )}
              </Button>
            </Card>

            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTopic(s)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {loading && (
          <div className="mx-auto max-w-3xl">
            <Card className="p-10 text-center border-border/60">
              <div className="relative inline-flex">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />
                <Loader2 className="relative h-12 w-12 text-primary animate-spin" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">Crafting your article…</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Researching the topic, structuring sections and optimizing for SEO.
              </p>
              <div className="mt-6 space-y-3">
                <div className="h-3 rounded bg-muted animate-pulse" />
                <div className="h-3 rounded bg-muted animate-pulse w-5/6 mx-auto" />
                <div className="h-3 rounded bg-muted animate-pulse w-4/6 mx-auto" />
              </div>
            </Card>
          </div>
        )}

        {!loading && article && (
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground">Generated article</span>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy markdown"}
              </Button>
            </div>
            <Card className="p-6 md:p-10 border-border/60">
              <article className="prose prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-strong:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
                <ReactMarkdown>{article}</ReactMarkdown>
              </article>
            </Card>
          </div>
        )}

        {!loading && !article && (
          <div className="mx-auto max-w-3xl text-center text-muted-foreground text-sm">
            Your generated article will appear here.
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default AIGenerator;