import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Search, Cpu, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NewsletterDialog from "./NewsletterDialog";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Articles" },
  { to: "/category/ai-tools", label: "AI Tools" },
  { to: "/category/trading", label: "Trading" },
  { to: "/ai-generator", label: "AI Generator" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-md gradient-brand text-primary-foreground">
            <Cpu className="h-4 w-4" />
          </span>
          <span>NextGen<span className="text-primary"> Moz</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                  isActive && "text-foreground",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/blog" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" aria-label="Search articles">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          {isAdmin && (
            <Link to="/admin" className="hidden sm:inline-flex">
              <Button variant="ghost" size="icon" aria-label="Admin"><LayoutDashboard className="h-4 w-4" /></Button>
            </Link>
          )}
          <div className="hidden sm:inline-flex">
            <NewsletterDialog trigger={<Button variant="hero" size="sm">Subscribe</Button>} />
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <nav className="container flex flex-col py-4 gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-muted",
                    isActive && "text-foreground bg-muted",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;