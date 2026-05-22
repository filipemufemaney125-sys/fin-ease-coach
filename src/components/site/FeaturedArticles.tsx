import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { posts } from "@/data/posts";
import ArticleCard from "./ArticleCard";

const FeaturedArticles = () => {
  const featured = posts.slice(0, 5);
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ArticleCard post={featured[0]} featured />
          {featured.slice(1).map((p) => (
            <ArticleCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;