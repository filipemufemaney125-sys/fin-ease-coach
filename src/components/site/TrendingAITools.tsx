import { ArrowUpRight } from "lucide-react";
import { aiTools } from "@/data/aiTools";

const TrendingAITools = () => {
  return (
    <section className="border-b border-border/60 py-20 md:py-28 relative">
      <div className="absolute inset-0 grid-bg opacity-20 -z-10" />
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm text-primary font-medium mb-2">Trending</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">AI Tools Worth Trying</h2>
          <p className="mt-3 text-muted-foreground">Curated AI platforms our editors use and recommend right now.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiTools.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.name} className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg gradient-brand text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">{t.category}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{t.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{t.description}</p>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2 transition-all"
                >
                  Visit Tool <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingAITools;