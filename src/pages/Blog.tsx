import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageShell from "@/components/site/PageShell";
import SEO from "@/components/site/SEO";
import ArticleCard from "@/components/site/ArticleCard";
import Sidebar from "@/components/site/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { posts } from "@/data/posts";

const Blog = () => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesQuery = !query || (p.title + p.excerpt).toLowerCase().includes(query.toLowerCase());
      const matchesCat = !active || p.category === active;
      return matchesQuery && matchesCat;
    });
  }, [query, active]);

  return (
    <PageShell>
      <SEO title="Articles — NextGen Moz" description="Browse the latest articles on AI tools, technology, trading, digital money and online opportunities." />

      <section className="border-b border-border/60 py-16 md:py-20">
        <div className="container max-w-3xl text-center">
          <p className="text-sm text-primary font-medium mb-2">The Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">All Articles</h1>
          <p className="mt-4 text-muted-foreground">Deep dives, guides and editorial coverage from the NextGen Moz team.</p>
          <div className="mt-8 relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="h-12 pl-10 bg-card"
              aria-label="Search articles"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container grid lg:grid-cols-[1fr_300px] gap-10">
          <div>
            <div className="flex gap-2 flex-wrap mb-8">
              <Button variant={active === null ? "hero" : "heroOutline"} size="sm" onClick={() => setActive(null)}>All</Button>
              {categories.map((c) => (
                <Button
                  key={c.slug}
                  variant={active === c.slug ? "hero" : "heroOutline"}
                  size="sm"
                  onClick={() => setActive(c.slug)}
                >
                  {c.name}
                </Button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="text-muted-foreground py-12 text-center">No articles found.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filtered.map((p) => <ArticleCard key={p.slug} post={p} />)}
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </section>
    </PageShell>
  );
};

export default Blog;