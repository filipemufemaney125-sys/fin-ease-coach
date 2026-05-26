import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageShell from "@/components/site/PageShell";
import SEO from "@/components/site/SEO";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Twitter } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("submit-contact", { body: form });
      if (error) throw error;
      toast({ title: "Message sent", description: "We'll get back to you shortly." });
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast({ title: "Failed to send", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <PageShell>
      <SEO title="Contact — NextGen Moz" description="Get in touch with the NextGen Moz editorial team." />
      <section className="py-20 md:py-28">
        <div className="container grid md:grid-cols-2 gap-12 max-w-5xl">
          <div>
            <p className="text-sm text-primary font-medium mb-2">Contact</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Let's talk</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">Questions, partnerships, story tips or feedback — drop us a line. We read everything.</p>
            <div className="mt-8 space-y-3 text-sm">
              <p className="flex items-center gap-3 text-muted-foreground"><Mail className="h-4 w-4 text-primary" /> hello@nextgenmoz.com</p>
              <p className="flex items-center gap-3 text-muted-foreground"><Twitter className="h-4 w-4 text-primary" /> @nextgenmoz</p>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div>
              <label className="text-sm font-medium" htmlFor="name">Name</label>
              <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="message">Message</label>
              <Textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 bg-background" />
            </div>
            <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : "Send message"}
            </Button>
          </form>
        </div>
      </section>
    </PageShell>
  );
};

export default Contact;