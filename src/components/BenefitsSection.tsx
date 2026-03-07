import { Check } from "lucide-react";

const benefits = [
  "Controle total das suas finanças pessoais",
  "Planeamento financeiro claro e realista",
  "Conhecimento para investir com confiança",
  "Eliminação definitiva de dívidas",
  "Construção de estabilidade e independência financeira",
  "Mentalidade de abundância e crescimento",
];

const BenefitsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <span className="text-sm font-medium text-primary font-body uppercase tracking-widest">Benefícios</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">
              O que você ganha com este curso
            </h2>
            <p className="text-muted-foreground font-body text-lg mb-10">
              Mais do que teoria — resultados concretos na sua vida financeira.
            </p>
            <ul className="space-y-5">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full gradient-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-body text-foreground text-lg">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual element */}
          <div className="relative">
            <div className="aspect-square rounded-3xl gradient-navy p-10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl md:text-8xl font-bold text-gradient-gold font-display mb-4">100%</div>
                <p className="text-secondary-foreground/70 font-body text-xl">Conteúdo prático e aplicável</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl gradient-gold opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-2xl gradient-gold opacity-10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
