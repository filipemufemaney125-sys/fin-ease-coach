import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CLIENT_TYPES, CLIENT_STATUSES } from "@/lib/clientLabels";
import { toast } from "@/hooks/use-toast";

const empty = {
  name: "",
  gaia_number: "",
  bscs_code: "",
  nuit: "",
  client_type: "privado",
  platform: "",
  status: "ativo",
  acquisition_date: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  address: "",
  notes: "",
};

export default function ClientForm() {
  const { id } = useParams();
  const editing = !!id;
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [form, setForm] = useState<any>(empty);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    setLoading(true);
    supabase.from("clients").select("*").eq("id", id!).maybeSingle().then(({ data }) => {
      if (data) setForm({ ...data, acquisition_date: data.acquisition_date ?? "" });
      setLoading(false);
    });
  }, [id, editing]);

  function set(field: string, value: any) {
    setForm((f: any) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: any = {
      ...form,
      acquisition_date: form.acquisition_date || null,
      gaia_number: form.gaia_number || null,
      bscs_code: form.bscs_code || null,
      nuit: form.nuit || null,
      platform: form.platform || null,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      contact_phone: form.contact_phone || null,
      address: form.address || null,
      notes: form.notes || null,
    };
    let error;
    if (editing) {
      ({ error } = await supabase.from("clients").update(payload).eq("id", id!));
    } else {
      payload.manager_id = isAdmin ? form.manager_id ?? user?.id : user?.id;
      payload.created_by = user?.id;
      ({ error } = await supabase.from("clients").insert(payload));
    }
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Erro a guardar", description: error.message });
      return;
    }
    toast({ title: editing ? "Cliente atualizado" : "Cliente criado" });
    navigate("/clientes");
  }

  if (loading) {
    return <div className="flex items-center justify-center p-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link to="/clientes" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold mt-2">
          {editing ? "Editar Cliente" : "Novo Cliente"}
        </h1>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Identificação</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Nome do Cliente *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div>
              <Label>NUIT</Label>
              <Input value={form.nuit ?? ""} onChange={(e) => set("nuit", e.target.value)} />
            </div>
            <div>
              <Label>Número Gaia</Label>
              <Input value={form.gaia_number ?? ""} onChange={(e) => set("gaia_number", e.target.value)} />
            </div>
            <div>
              <Label>Código BSCS</Label>
              <Input value={form.bscs_code ?? ""} onChange={(e) => set("bscs_code", e.target.value)} />
            </div>
            <div>
              <Label>Plataforma</Label>
              <Input value={form.platform ?? ""} onChange={(e) => set("platform", e.target.value)} />
            </div>
            <div>
              <Label>Tipo de Cliente</Label>
              <Select value={form.client_type} onValueChange={(v) => set("client_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLIENT_TYPES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLIENT_STATUSES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data de Angariação</Label>
              <Input type="date" value={form.acquisition_date ?? ""} onChange={(e) => set("acquisition_date", e.target.value)} />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Contactos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Pessoa de Contacto</Label>
              <Input value={form.contact_name ?? ""} onChange={(e) => set("contact_name", e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.contact_email ?? ""} onChange={(e) => set("contact_email", e.target.value)} />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={form.contact_phone ?? ""} onChange={(e) => set("contact_phone", e.target.value)} />
            </div>
            <div>
              <Label>Endereço</Label>
              <Input value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Observações</Label>
              <Textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={3} />
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {editing ? "Guardar alterações" : "Criar cliente"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}