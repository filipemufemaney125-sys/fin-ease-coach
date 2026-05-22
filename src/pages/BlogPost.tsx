import { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import PageShell from "@/components/site/PageShell";
import SEO from "@/components/site/SEO";
import Sidebar from "@/components/site/Sidebar";
import ArticleCard from "@/components/site/ArticleCard";
import { getPostBySlug, getRelatedPosts } from "@/data/posts";

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  const toc = useMemo(() => {
    if (!post) return [];
    return post.content
      .split("\n")
      .filter((l) => l.startsWith("## "))
      .map((l) => {
        const text = l.replace(/^##\s+/, "").trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return { text, id };
      });
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;
  const related = getRelatedPosts(post);

  const blocks = post.content.trim().split("\n\n").map((b) => b.trim());

  return (
    <PageShell>
      <SEO
        title={`${post.title} — NextGen Moz`}
        description={post.excerpt}
        image={post.cover}
        type="article"
      />

      <article className="border-b border-border/60">
        <div className="container max-w-4xl py-12 md:py-16">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to articles
          </Link>
          <Link to={`/category/${post.category}`} className="text-sm text-primary font-medium">{post.categoryName}</Link>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight tracking-tight">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readingTime}</span>
          </div>
        </div>
        <div className="container max-w-5xl pb-8">
          <img src={post.cover} alt={post.title} width={1024} height={640} className="w-full aspect-[16/9] object-cover rounded-xl border border-border" />
        </div>
      </article>

      <section className="py-12 md:py-16">
        <div className="container grid lg:grid-cols-[1fr_300px] gap-12">
          <div className="max-w-3xl">
            {toc.length > 0 && (
              <div className="mb-10 rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Table of contents</h2>
                <ol className="space-y-2 text-sm">
                  {toc.map((t, i) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-foreground/80 hover:text-primary">
                        <span className="text-muted-foreground mr-2">{String(i + 1).padStart(2, "0")}.</span>{t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="prose-content space-y-5 text-foreground/90 leading-relaxed">
              {blocks.map((b, i) => {
                if (b.startsWith("## ")) {
                  const text = b.replace(/^##\s+/, "");
                  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                  return <h2 key={i} id={id} className="text-2xl md:text-3xl font-display font-bold mt-10 mb-2 scroll-mt-24">{text}</h2>;
                }
                return <p key={i} className="text-base md:text-lg">{b}</p>;
              })}
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-border bg-card text-muted-foreground">#{t}</span>
              ))}
            </div>

            <div className="mt-12 rounded-xl border border-border bg-card p-6 flex gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full gradient-brand text-primary-foreground font-bold text-lg flex-shrink-0">N</div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Written by</p>
                <h3 className="font-display font-semibold text-lg">{post.author}</h3>
                <p className="text-sm text-muted-foreground mt-1">{post.authorBio}</p>
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-display font-bold mb-6">Related articles</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {related.map((p) => <ArticleCard key={p.slug} post={p} />)}
                </div>
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </section>
    </PageShell>
  );
};

export default BlogPost;