import articleAi from "@/assets/article-ai.jpg";
import articleTrading from "@/assets/article-trading.jpg";
import articleProductivity from "@/assets/article-productivity.jpg";
import articleMoney from "@/assets/article-money.jpg";
import articleTech from "@/assets/article-tech.jpg";
import articleTutorial from "@/assets/article-tutorial.jpg";

export interface Post {
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
}

export const posts: Post[] = [
  {
    slug: "best-ai-tools-2026",
    title: "The 10 Best AI Tools Redefining Productivity in 2026",
    excerpt: "From writing assistants to autonomous agents, these AI tools are quietly reshaping how modern teams build, sell, and ship.",
    cover: articleAi,
    category: "ai-tools",
    categoryName: "AI Tools",
    author: "NextGen Editorial",
    authorBio: "The NextGen Moz editorial team covers AI, technology and digital opportunities for the next generation.",
    date: "2026-05-12",
    readingTime: "8 min read",
    tags: ["AI", "Productivity", "Tools"],
    content: `
## A new era of intelligent software

Artificial intelligence has moved from novelty to infrastructure. In 2026, the best teams are not the ones with the most tools — they are the ones with the right ones. Below we break down the AI platforms quietly reshaping how modern work gets done.

## 1. Conversational copilots

Modern copilots no longer just answer questions; they act. They draft, summarize, and execute tasks across your stack with surprising autonomy.

## 2. Autonomous research agents

Instead of searching for hours, you brief an agent and receive a structured report. The result is dense, sourced, and ready to ship.

## 3. Visual AI for creators

Image and video generation has matured. Storyboards, ad creatives and product shots now ship in minutes, not days.

## Final thoughts

The winners of this cycle will be the operators who combine taste with leverage. Pick fewer tools, master them deeply, and ship faster than the competition.`,
  },
  {
    slug: "ai-trading-strategies",
    title: "How AI Is Quietly Rewriting the Rules of Modern Trading",
    excerpt: "Quantitative funds have used machine learning for years. Today, the same edge is reaching retail traders — here is what changes.",
    cover: articleTrading,
    category: "trading",
    categoryName: "Trading",
    author: "NextGen Editorial",
    authorBio: "The NextGen Moz editorial team covers AI, technology and digital opportunities for the next generation.",
    date: "2026-05-05",
    readingTime: "6 min read",
    tags: ["Trading", "AI", "Markets"],
    content: `
## From quants to everyone

The institutional edge of pattern recognition is becoming accessible to anyone willing to learn. Models that once required a research desk now run from a laptop.

## Risk first, returns later

The most under-discussed shift is not signal generation, but risk management. AI excels at modelling tail events and adjusting position sizing in real time.

## What retail traders should focus on

Use AI to remove emotion from execution, not to predict the future. The discipline still matters more than the model.`,
  },
  {
    slug: "ultimate-productivity-stack",
    title: "The Ultimate Productivity Stack for Modern Knowledge Workers",
    excerpt: "A quiet, deliberate setup beats a noisy, bloated one. Here is the minimal stack we recommend in 2026.",
    cover: articleProductivity,
    category: "tutorials",
    categoryName: "Tutorials",
    author: "NextGen Editorial",
    authorBio: "The NextGen Moz editorial team covers AI, technology and digital opportunities for the next generation.",
    date: "2026-04-28",
    readingTime: "7 min read",
    tags: ["Productivity", "Tools", "Workflow"],
    content: `
## Less, but better

The most productive operators of 2026 use fewer apps, not more. Their stack is fast, keyboard-driven and intentionally minimal.

## Capture, process, execute

Every effective system has three layers: a frictionless capture surface, a calm processing inbox, and a fast execution environment.

## Our recommended stack

A note-taking app with markdown, a single calendar, one task manager, and a focused writing environment. That is usually enough.`,
  },
  {
    slug: "digital-money-guide",
    title: "Digital Money in 2026: A Beginner's Guide That Actually Helps",
    excerpt: "Stablecoins, custodial wallets, on-chain identity. We cut through the noise and explain what a beginner truly needs to know.",
    cover: articleMoney,
    category: "digital-money",
    categoryName: "Digital Money",
    author: "NextGen Editorial",
    authorBio: "The NextGen Moz editorial team covers AI, technology and digital opportunities for the next generation.",
    date: "2026-04-20",
    readingTime: "9 min read",
    tags: ["Crypto", "Fintech", "Beginner"],
    content: `
## The simple mental model

Think of digital money as programmable cash. Once you accept that, the rest of the ecosystem becomes much easier to navigate.

## What beginners often miss

Custody is everything. If you do not control the keys, you do not control the money. Understand that trade-off before you move size.

## Practical first steps

Open a reputable wallet, move a small amount, and learn by doing. Theory without practice rarely sticks.`,
  },
  {
    slug: "future-of-work-ai",
    title: "The Future of Work Is Human-AI Collaboration, Not Replacement",
    excerpt: "The narrative of AI taking jobs misses the bigger story: a new class of operators who work side-by-side with intelligent systems.",
    cover: articleTech,
    category: "technology",
    categoryName: "Technology",
    author: "NextGen Editorial",
    authorBio: "The NextGen Moz editorial team covers AI, technology and digital opportunities for the next generation.",
    date: "2026-04-14",
    readingTime: "5 min read",
    tags: ["AI", "Future of Work", "Careers"],
    content: `
## Augmentation, not replacement

The jobs being transformed are not disappearing — they are being rebuilt around AI leverage. The skill that compounds is judgment.

## What to learn now

Critical thinking, taste, and the ability to brief AI clearly. These soft skills are quietly becoming the highest-leverage ones in the market.`,
  },
  {
    slug: "online-earning-opportunities",
    title: "Real Online Opportunities to Earn Income in 2026",
    excerpt: "Forget the gurus. Here are real, durable ways to build digital income that align with the AI era.",
    cover: articleTutorial,
    category: "opportunities",
    categoryName: "Opportunities",
    author: "NextGen Editorial",
    authorBio: "The NextGen Moz editorial team covers AI, technology and digital opportunities for the next generation.",
    date: "2026-04-02",
    readingTime: "6 min read",
    tags: ["Side Hustle", "Online Income", "Remote Work"],
    content: `
## Skill stacking beats hustle

The most reliable online income comes from compounding two or three skills that few people combine. AI accelerates the process.

## Build in public

Distribution is the new moat. Sharing your work consistently will outperform credentials in most digital fields.`,
  },
];

export const getPostBySlug = (slug: string) => posts.find((p) => p.slug === slug);
export const getPostsByCategory = (cat: string) => posts.filter((p) => p.category === cat);
export const getRelatedPosts = (post: Post, limit = 3) =>
  posts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, limit);