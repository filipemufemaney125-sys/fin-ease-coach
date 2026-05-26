import { useState } from "react";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  trigger: React.ReactNode;
  source?: string;
}

export const NewsletterDialog = ({ trigger, source = "header" }: Props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: { email: trimmed, source },
      });
      if (error) throw error;
      setDone(true);
      toast({ title: "You're in!", description: "Welcome to NextGen Moz." });
    } catch (err: any) {
      toast({ title: "Subscription failed", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setDone(false); setEmail(""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-primary-foreground">
            {done ? <CheckCircle2 className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
          </div>
          <DialogTitle className="text-center font-display text-2xl">
            {done ? "Welcome aboard" : "Join the NextGen Moz newsletter"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {done
              ? "Look out for our next email — concise, weekly, never spammy."
              : "One weekly email. New AI tools, deep dives and digital opportunities."}
          </DialogDescription>
        </DialogHeader>
        {!done && (
          <form onSubmit={submit} className="space-y-3 pt-2">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-11 bg-background"
              disabled={loading}
              autoFocus
            />
            <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</> : "Subscribe"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">We respect your inbox. Unsubscribe anytime.</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterDialog;