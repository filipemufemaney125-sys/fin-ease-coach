import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wallet,
  Receipt,
  AlertCircle,
  CreditCard,
  FileBarChart,
  UserCog,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/clientLabels";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/servicos", label: "Serviços", icon: Briefcase, soon: true },
  { to: "/carteiras", label: "Carteiras", icon: Wallet, soon: true, adminOnly: true },
  { to: "/faturacao", label: "Faturação", icon: Receipt, soon: true },
  { to: "/dividas", label: "Dívidas", icon: AlertCircle, soon: true },
  { to: "/cobrancas", label: "Cobranças", icon: CreditCard, soon: true },
  { to: "/relatorios", label: "Relatórios", icon: FileBarChart, soon: true },
  { to: "/utilizadores", label: "Utilizadores", icon: UserCog, soon: true, adminOnly: true },
  { to: "/auditoria", label: "Auditoria", icon: ShieldCheck, soon: true, adminOnly: true },
  { to: "/configuracoes", label: "Configurações", icon: Settings, soon: true },
];

export default function AppShell() {
  const { user, roles, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const primaryRole = roles[0] ? ROLE_LABELS[roles[0]] : "—";

  const items = navItems.filter((i) => !i.adminOnly || isAdmin);

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform lg:relative lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between gap-2 px-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md tmcel-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
              T
            </div>
            <div className="leading-tight">
              <div className="font-bold text-sm">TMCEL</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">CRM Corporate</div>
            </div>
          </div>
          <button className="lg:hidden text-muted-foreground" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{it.label}</span>
                {it.soon && (
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground border border-border rounded px-1 py-0.5">
                    em breve
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-border p-3 space-y-1">
          <button
            onClick={() => {
              navigate("/perfil");
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <UserIcon className="h-4 w-4" />
            <div className="flex-1 text-left leading-tight">
              <div className="text-foreground text-xs font-medium truncate max-w-[140px]">{user?.email}</div>
              <div className="text-[10px]">{primaryRole}</div>
            </div>
          </button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-20">
          <button className="lg:hidden text-muted-foreground" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="hidden sm:block text-sm text-muted-foreground">
            {new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}