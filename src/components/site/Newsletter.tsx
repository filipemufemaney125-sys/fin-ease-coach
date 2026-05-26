import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      toast({ title: "Invalid email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("subscribe-newsletter", { body: { email: trimmed, source: "footer-cta" } });
      if (error) throw error;
      toast({ title: "Subscribed!", description: "Welcome to NextGen Moz." });
      setEmail("");
    } catch (err: any) {
      toast({ title: "Subscription failed", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-14 text-center">
          <div className="absolute inset-0 grid-bg opacity-30 -z-10" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-primary/20 blur-3xl -z-10" />

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-primary-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">
            Stay Updated With <span className="text-gradient-brand">Future Tech</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            One concise email every week. New AI tools, deep dives and digital opportunities — no spam, ever.
          </p>

          <form onSubmit={onSubmit} className="mt-8 mx-auto max-w-md flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-12 bg-background"
              aria-label="Email address"
            />
            <Button type="submit" variant="hero" size="lg" className="h-12" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</> : "Subscribe"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">Join 12,000+ readers from 80+ countries.</p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;