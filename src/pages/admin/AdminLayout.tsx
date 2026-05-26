import { Navigate, NavLink, Outlet, Link } from "react-router-dom";
import { Loader2, LayoutDashboard, FileText, Tags, Mail, Users, LogOut, Cpu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/articles", label: "Articles", icon: FileText },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-muted-foreground">You are signed in but not an admin.</p>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr] bg-muted/20">
      <aside className="border-r border-border bg-background lg:sticky lg:top-0 lg:h-screen flex flex-col">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg px-6 h-16 border-b border-border">
          <span className="flex h-8 w-8 items-center justify-center rounded-md gradient-brand text-primary-foreground">
            <Cpu className="h-4 w-4" />
          </span>
          <span>NextGen<span className="text-primary"> Moz</span></span>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition",
                isActive && "bg-muted text-foreground font-medium"
              )}>
              <it.icon className="h-4 w-4" /> {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="p-6 md:p-10"><Outlet /></main>
    </div>
  );
};

export default AdminLayout;