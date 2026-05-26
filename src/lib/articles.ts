import { supabase } from "@/integrations/supabase/client";
import { categories as staticCategories } from "@/data/categories";
import fallbackCover from "@/assets/article-ai.jpg";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: string;
  categoryName: string;
  author: string;
  authorBio: string;
  date: string;
  readingTime: string;
  tags: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
}

const slugByCategoryId = new Map<string, string>();

export const categorySlugById = (id: string | null): string => {
  if (!id) return "technology";
  return slugByCategoryId.get(id) || "technology";
};

const ensureCategoryMap = async () => {
  if (slugByCategoryId.size > 0) return;
  const { data } = await supabase.from("categories").select("id, slug");
  data?.forEach((c) => slugByCategoryId.set(c.id, c.slug));
};

const categoryNameBySlug = (slug: string) =>
  staticCategories.find((c) => c.slug === slug)?.name ?? slug;

const toArticle = (row: any): Article => {
  const catSlug = categorySlugById(row.category_id);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    cover: row.cover_url || fallbackCover,
    category: catSlug,
    categoryName: categoryNameBySlug(catSlug),
    author: row.author,
    authorBio: "The NextGen Moz editorial team covers AI, technology and digital opportunities for the next generation.",
    date: row.published_at || row.created_at,
    readingTime: `${row.reading_minutes || 5} min read`,
    tags: row.tags || [],
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
};

export const fetchArticles = async (opts?: { limit?: number; categorySlug?: string }) => {
  await ensureCategoryMap();
  let query = supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (opts?.categorySlug) {
    const catId = [...slugByCategoryId.entries()].find(([, s]) => s === opts.categorySlug)?.[0];
    if (catId) query = query.eq("category_id", catId);
  }
  if (opts?.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(toArticle);
};

export const fetchArticleBySlug = async (slug: string): Promise<Article | null> => {
  await ensureCategoryMap();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? toArticle(data) : null;
};

export const fetchRelated = async (article: Article, limit = 3) => {
  const all = await fetchArticles({ categorySlug: article.category });
  return all.filter((a) => a.slug !== article.slug).slice(0, limit);
};