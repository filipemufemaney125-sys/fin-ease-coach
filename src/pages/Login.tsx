import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/", { replace: true });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast({ title: "Conta criada", description: "Verifique o seu email para confirmar." });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({ title: "Email enviado", description: "Verifique a caixa de entrada para redefinir a senha." });
        setMode("signin");
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-secondary">
      <div className="hidden lg:flex flex-1 tmcel-gradient items-center justify-center p-12 text-primary-foreground">
        <div className="max-w-md">
          <div className="text-5xl font-bold mb-4">TMCEL CRM</div>
          <p className="text-lg opacity-90 leading-relaxed">
            Sistema de Gestão da Carteira de Clientes Corporativos. Controle clientes, faturação,
            dívida e cobranças num só lugar.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div>
            <div className="lg:hidden h-10 w-10 rounded-md tmcel-gradient flex items-center justify-center text-primary-foreground font-bold mb-4">
              T
            </div>
            <h1 className="text-2xl font-bold">
              {mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar senha"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "signin"
                ? "Aceda ao sistema TMCEL CRM."
                : mode === "signup"
                ? "Registo de novo utilizador."
                : "Enviamos um link para o seu email."}
            </p>
          </div>
          <form onSubmit={handle} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label>Nome completo</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {mode !== "forgot" && (
              <div>
                <Label>Senha</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
            </Button>
          </form>
          <div className="text-sm text-center space-y-2 text-muted-foreground">
            {mode === "signin" && (
              <>
                <button onClick={() => setMode("forgot")} className="hover:text-foreground">
                  Esqueceu a senha?
                </button>
                <div>
                  Sem conta?{" "}
                  <button onClick={() => setMode("signup")} className="text-primary hover:underline">
                    Registar
                  </button>
                </div>
              </>
            )}
            {mode !== "signin" && (
              <button onClick={() => setMode("signin")} className="text-primary hover:underline">
                Voltar para entrar
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}