import heroImg from "@/assets/hero-finance.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Educação financeira" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-navy opacity-80" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-gold-glow font-body text-sm font-medium mb-6 border border-primary/30">
            Curso de Educação Financeira
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-secondary-foreground mb-6">
            Transforme a sua{" "}
            <span className="text-gradient-gold">vida financeira</span>{" "}
            de uma vez por todas
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed mb-10 max-w-xl">
            Aprenda a controlar o seu dinheiro, eliminar dívidas e começar a investir com um método simples e prático que já mudou a vida de centenas de pessoas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="h-14 px-10 rounded-full text-lg" asChild>
              <Link to="/checkout">Inscreva-se agora</Link>
            </Button>
            <Button variant="heroOutline" size="lg" className="h-14 px-10 rounded-full text-lg border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
              Saiba mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
