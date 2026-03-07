import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-md border-b border-secondary-foreground/10">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display font-bold text-lg text-gradient-gold">Educação Financeira</Link>
        <Button variant="hero" size="sm" className="rounded-full px-6" asChild>
          <Link to="/checkout">Inscreva-se</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
