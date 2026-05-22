import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";

const CategoriesSection = () => {
  return (
    <section className="border-b border-border/60 py-20 md:py-28">
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-sm text-primary font-medium mb-2">Explore</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Categories</h2>
          </div>
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            View all articles <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                to={`/category/${c.slug}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:-translate-y-0.5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background text-primary group-hover:gradient-brand group-hover:text-primary-foreground group-hover:border-transparent transition-all">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                <ArrowUpRight className="absolute top-6 right-6 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;