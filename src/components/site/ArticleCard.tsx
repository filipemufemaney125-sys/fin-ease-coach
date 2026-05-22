import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import type { Post } from "@/data/posts";

interface Props {
  post: Post;
  featured?: boolean;
}

const ArticleCard = ({ post, featured }: Props) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:-translate-y-0.5 ${
        featured ? "md:col-span-2 md:flex-row" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "md:w-1/2 aspect-[16/10] md:aspect-auto" : "aspect-[16/10]"}`}>
        <img
          src={post.cover}
          alt={post.title}
          loading="lazy"
          width={1024}
          height={640}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-background/80 backdrop-blur-sm border border-border/60 px-2.5 py-1 text-xs font-medium">
            {post.categoryName}
          </span>
        </div>
      </div>
      <div className={`flex flex-col p-5 md:p-6 ${featured ? "md:w-1/2 md:justify-center" : ""}`}>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTime}</span>
        </div>
        <h3 className={`font-display font-semibold leading-snug group-hover:text-primary transition-colors ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
          {post.title}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
        <span className="mt-4 text-sm font-medium text-primary inline-flex items-center gap-1">
          Read more <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
};

export default ArticleCard;