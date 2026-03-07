import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 md:py-28 gradient-navy relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full gradient-gold opacity-5 blur-3xl" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-6">
            Pronto para mudar a sua{" "}
            <span className="text-gradient-gold">vida financeira</span>?
          </h2>
          <p className="text-secondary-foreground/60 font-body text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Não espere mais. Cada dia sem educação financeira é um dia de oportunidades perdidas. Comece hoje.
          </p>
          <Button variant="hero" size="lg" className="h-16 px-12 rounded-full text-lg gap-3" asChild>
            <Link to="/checkout">Comece hoje <ArrowRight className="w-5 h-5" /></Link>
          </Button>
          <p className="text-secondary-foreground/40 font-body text-sm mt-6">
            Acesso imediato · Suporte dedicado · Garantia de satisfação
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
