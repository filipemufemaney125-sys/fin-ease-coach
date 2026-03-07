import { AlertTriangle, CreditCard, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Falta de organização",
    description: "Você não sabe para onde vai o seu dinheiro no final do mês. Ganha, gasta, e nunca sobra nada.",
  },
  {
    icon: CreditCard,
    title: "Dívidas acumuladas",
    description: "Cartões de crédito, empréstimos e contas atrasadas que parecem nunca ter fim.",
  },
  {
    icon: TrendingDown,
    title: "Sem conhecimento de investimentos",
    description: "Você quer fazer o dinheiro trabalhar para si, mas não sabe por onde começar.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary font-body uppercase tracking-widest">O problema</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">
            Você se identifica com alguma dessas situações?
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            A maioria das pessoas nunca aprendeu a lidar com dinheiro. E isso custa caro.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-8 shadow-card border border-border hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mb-6 group-hover:shadow-gold transition-shadow">
                <problem.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">{problem.title}</h3>
              <p className="text-muted-foreground font-body leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
