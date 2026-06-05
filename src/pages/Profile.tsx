import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ROLE_LABELS } from "@/lib/clientLabels";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, roles } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      setFullName(data?.full_name ?? "");
      setEmployeeNumber(data?.employee_number ?? "");
      setLoading(false);
    });
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, employee_number: employeeNumber || null })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast({ variant: "destructive", title: "Erro", description: error.message });
    else toast({ title: "Perfil atualizado" });
  }

  if (loading) return <div className="flex items-center justify-center p-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold">Perfil</h1>
      <Card className="p-6 space-y-4">
        <form onSubmit={save} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
          <div>
            <Label>Perfil de acesso</Label>
            <Input value={roles.map((r) => ROLE_LABELS[r] ?? r).join(", ") || "—"} disabled />
          </div>
          <div>
            <Label>Nome completo</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <Label>Número de Trabalhador</Label>
            <Input value={employeeNumber} onChange={(e) => setEmployeeNumber(e.target.value)} />
          </div>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Guardar
          </Button>
        </form>
      </Card>
    </div>
  );
}