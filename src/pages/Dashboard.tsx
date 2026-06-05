import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function KpiCard({ title, value, icon: Icon, accent }: any) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-md flex items-center justify-center ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, status, acquisition_date, created_at");
      const rows = data ?? [];
      const year = new Date().getFullYear();
      const monthly: Record<number, number> = {};
      for (let i = 0; i < 12; i++) monthly[i] = 0;
      let newYear = 0;
      for (const r of rows as any[]) {
        const d = r.acquisition_date ? new Date(r.acquisition_date) : new Date(r.created_at);
        if (d.getFullYear() === year) {
          newYear++;
          monthly[d.getMonth()] = (monthly[d.getMonth()] ?? 0) + 1;
        }
      }
      const months = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez",
      ];
      return {
        total: rows.length,
        active: rows.filter((r: any) => r.status === "ativo").length,
        inactive: rows.filter((r: any) => r.status === "inativo").length,
        newYear,
        chart: months.map((m, i) => ({ mes: m, novos: monthly[i] ?? 0 })),
      };
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da carteira de clientes corporativos.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Clientes" value={stats?.total ?? "—"} icon={Users} accent="bg-accent text-accent-foreground" />
        <KpiCard title="Clientes Ativos" value={stats?.active ?? "—"} icon={UserCheck} accent="bg-success/10 text-success" />
        <KpiCard title="Clientes Inativos" value={stats?.inactive ?? "—"} icon={UserX} accent="bg-warning/10 text-warning" />
        <KpiCard title={`Novos em ${new Date().getFullYear()}`} value={stats?.newYear ?? "—"} icon={UserPlus} accent="bg-primary/10 text-primary" />
      </div>

      <Card className="p-5">
        <h2 className="font-semibold mb-4">Novos clientes por mês</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.chart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="novos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5 border-dashed">
        <p className="text-sm text-muted-foreground">
          📊 <strong className="text-foreground">Em breve:</strong> Receita mensal, dívida total, taxa de cobrança,
          aging, performance por gestora e cumprimento de metas — disponíveis quando o módulo de Faturação for ativado.
        </p>
      </Card>
    </div>
  );
}