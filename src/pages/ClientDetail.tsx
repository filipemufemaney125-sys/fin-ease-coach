import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clientTypeLabel, clientStatusLabel } from "@/lib/clientLabels";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{value || "—"}</div>
    </div>
  );
}

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, isAdmin } = useAuth();

  const { data: c, isLoading } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("*").eq("id", id!).maybeSingle();
      return data;
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  }
  if (!c) {
    return <div className="text-muted-foreground">Cliente não encontrado.</div>;
  }

  const canEdit = isAdmin || (user && c.manager_id === user.id);

  async function remove() {
    const { error } = await supabase.from("clients").delete().eq("id", id!);
    if (error) return toast({ variant: "destructive", title: "Erro", description: error.message });
    toast({ title: "Cliente eliminado" });
    qc.invalidateQueries({ queryKey: ["clients"] });
    navigate("/clientes");
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link to="/clientes" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3 mt-2">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{c.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{clientTypeLabel(c.client_type)}</Badge>
              <Badge
                variant="outline"
                className={
                  c.status === "ativo"
                    ? "border-success/40 text-success"
                    : c.status === "suspenso"
                    ? "border-warning/40 text-warning"
                    : "border-muted-foreground/30 text-muted-foreground"
                }
              >
                {clientStatusLabel(c.status)}
              </Badge>
            </div>
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to={`/clientes/${c.id}/editar`}><Pencil className="h-4 w-4 mr-1" /> Editar</Link>
              </Button>
              {isAdmin && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash2 className="h-4 w-4 mr-1" /> Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Eliminar cliente?</AlertDialogTitle>
                      <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={remove}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </div>

      <Card className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Field label="NUIT" value={c.nuit} />
        <Field label="Número Gaia" value={c.gaia_number} />
        <Field label="Código BSCS" value={c.bscs_code} />
        <Field label="Plataforma" value={c.platform} />
        <Field label="Data de Angariação" value={c.acquisition_date ? new Date(c.acquisition_date).toLocaleDateString("pt-PT") : null} />
        <Field label="Criado em" value={new Date(c.created_at).toLocaleDateString("pt-PT")} />
      </Card>

      <Card className="p-6 grid sm:grid-cols-2 gap-5">
        <Field label="Pessoa de Contacto" value={c.contact_name} />
        <Field label="Email" value={c.contact_email} />
        <Field label="Telefone" value={c.contact_phone} />
        <Field label="Endereço" value={c.address} />
        {c.notes && (
          <div className="sm:col-span-2">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Observações</div>
            <p className="mt-1 text-sm whitespace-pre-wrap">{c.notes}</p>
          </div>
        )}
      </Card>
    </div>
  );
}