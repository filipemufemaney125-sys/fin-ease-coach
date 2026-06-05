import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CLIENT_TYPES, CLIENT_STATUSES, clientTypeLabel, clientStatusLabel } from "@/lib/clientLabels";

export default function Clients() {
  const { isAdmin, isGestora } = useAuth();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter((c: any) => {
      if (type !== "all" && c.client_type !== type) return false;
      if (status !== "all" && c.status !== status) return false;
      if (!term) return true;
      return [c.name, c.nuit, c.gaia_number, c.bscs_code, c.platform, c.contact_name]
        .filter(Boolean)
        .some((v: string) => v.toLowerCase().includes(term));
    });
  }, [data, q, type, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin
              ? "Carteira completa de clientes corporativos."
              : isGestora
              ? "A sua carteira de clientes."
              : "Carteira de clientes corporativos."}
          </p>
        </div>
        {(isAdmin || isGestora) && (
          <Button asChild>
            <Link to="/clientes/novo">
              <Plus className="h-4 w-4 mr-1" /> Novo Cliente
            </Link>
          </Button>
        )}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar nome, NUIT, Gaia, BSCS…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {CLIENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              {CLIENT_STATUSES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Sem clientes para mostrar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">NUIT</TableHead>
                  <TableHead className="hidden lg:table-cell">Gaia / BSCS</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Plataforma</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c: any) => (
                  <TableRow key={c.id} className="cursor-pointer">
                    <TableCell>
                      <Link to={`/clientes/${c.id}`} className="font-medium hover:text-primary">
                        {c.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{c.nuit ?? "—"}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                      {c.gaia_number ?? "—"} / {c.bscs_code ?? "—"}
                    </TableCell>
                    <TableCell>{clientTypeLabel(c.client_type)}</TableCell>
                    <TableCell className="hidden md:table-cell">{c.platform ?? "—"}</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}