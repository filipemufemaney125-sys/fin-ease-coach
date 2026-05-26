import { useParams, Navigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageShell from "@/components/site/PageShell";
import SEO from "@/components/site/SEO";
import ArticleCard from "@/components/site/ArticleCard";
import Sidebar from "@/components/site/Sidebar";
import { categories } from "@/data/categories";
import { fetchArticles } from "@/lib/articles";

const Category = () => {
  const { slug } = useParams();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return <Navigate to="/blog" replace />;
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["articles", "cat", cat.slug],
    queryFn: () => fetchArticles({ categorySlug: cat.slug }),
  });
  const Icon = cat.icon;

  return (
    <PageShell>
      <SEO title={`${cat.name} — NextGen Moz`} description={cat.description} />
      <section className="border-b border-border/60 py-16 md:py-20">
        <div className="container max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-primary-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">{cat.name}</h1>
          <p className="mt-4 text-muted-foreground">{cat.description}</p>
          <Link to="/blog" className="mt-6 inline-block text-sm text-primary hover:underline">← All articles</Link>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container grid lg:grid-cols-[1fr_300px] gap-10">
          <div>
            {isLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : posts.length === 0 ? (
              <p className="text-muted-foreground py-12 text-center">No articles in this category yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((p) => <ArticleCard key={p.slug} post={p} />)}
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </section>
    </PageShell>
  );
};

export default Category;