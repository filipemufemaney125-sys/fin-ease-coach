import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-md border-b border-secondary-foreground/10">
      <div className="container flex items-center justify-between h-16">
        <span className="font-display font-bold text-lg text-gradient-gold">Educação Financeira</span>
        <Button variant="hero" size="sm" className="rounded-full px-6">
          Inscreva-se
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
