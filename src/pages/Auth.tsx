import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Cpu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/site/SEO";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => { if (user) navigate("/admin"); }, [user, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    else navigate("/admin");
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setLoading(false);
    if (error) toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    else toast({ title: "Account created", description: "You can now sign in." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SEO title="Sign in — NextGen Moz" />
      <Card className="w-full max-w-md p-8">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg justify-center mb-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-md gradient-brand text-primary-foreground">
            <Cpu className="h-4 w-4" />
          </span>
          <span>NextGen<span className="text-primary"> Moz</span></span>
        </Link>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={signIn} className="space-y-3 pt-4">
              <Input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-3 pt-4">
              <Input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password (min 6 chars)" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">The first account becomes admin.</p>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;