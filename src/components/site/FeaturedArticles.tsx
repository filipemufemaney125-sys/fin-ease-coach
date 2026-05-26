import { Link } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "./ArticleCard";
import { fetchArticles } from "@/lib/articles";

const FeaturedArticles = () => {
  const { data: featured = [], isLoading } = useQuery({
    queryKey: ["articles", "featured"],
    queryFn: () => fetchArticles({ limit: 5 }),
  });
  return (
    <section className="border-b border-border/60 py-20 md:py-28">
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-sm text-primary font-medium mb-2">Latest</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Articles</h2>
          </div>
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            All articles <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading || featured.length === 0 ? (
          <div className="py-20 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ArticleCard post={featured[0]} featured />
            {featured.slice(1).map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedArticles;