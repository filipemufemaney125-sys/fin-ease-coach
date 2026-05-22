import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-tech.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 -z-10">
        <img src={heroImg} alt="" width={1920} height={1080} className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <div className="container py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-primary" />
            Independent tech publication
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            Technology, AI and{" "}
            <span className="text-gradient-brand">Digital Opportunities</span>{" "}
            for the Next Generation
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Explore modern technology, AI tools, trading insights and digital opportunities shaping the future — written for thinkers, builders and operators.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link to="/blog">
              <Button variant="hero" size="lg" className="h-12 px-7">
                Explore Articles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/category/ai-tools">
              <Button variant="heroOutline" size="lg" className="h-12 px-7">
                Browse AI Tools
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
            {[
              { value: "120+", label: "Articles" },
              { value: "50K", label: "Monthly readers" },
              { value: "6", label: "Categories" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-display font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;