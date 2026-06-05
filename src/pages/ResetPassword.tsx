import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      toast({ title: "Senha atualizada" });
      navigate("/", { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Nova senha</h1>
          <p className="text-sm text-muted-foreground mt-1">Defina uma nova senha de acesso.</p>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <div>
            <Label>Nova senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Atualizar senha
          </Button>
        </form>
      </Card>
    </div>
  );
}