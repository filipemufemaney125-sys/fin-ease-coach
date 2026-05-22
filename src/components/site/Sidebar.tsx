import { Link } from "react-router-dom";
import { posts } from "@/data/posts";
import { categories } from "@/data/categories";

const Sidebar = () => {
  const popular = posts.slice(0, 4);
  return (
    <aside className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Categories</h3>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/category/${c.slug}`} className="text-sm text-foreground/80 hover:text-primary flex items-center justify-between group">
                <span>{c.name}</span>
                <span aria-hidden className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Popular Posts</h3>
        <ul className="space-y-4">
          {popular.map((p) => (
            <li key={p.slug}>
              <Link to={`/blog/${p.slug}`} className="flex gap-3 group">
                <img src={p.cover} alt="" loading="lazy" width={80} height={56} className="h-14 w-20 rounded-md object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug group-hover:text-primary line-clamp-2">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.readingTime}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-5 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Advertisement</p>
        <div className="mt-3 aspect-[3/4] rounded-md bg-background flex items-center justify-center text-xs text-muted-foreground">
          Ad space
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;