import { BookOpen, Brain, TrendingUp, Wallet, Target, BarChart3 } from "lucide-react";

const modules = [
  { icon: Wallet, title: "Organização Financeira", desc: "Controle de gastos, orçamento pessoal e ferramentas práticas." },
  { icon: Brain, title: "Mentalidade Financeira", desc: "Reprogramação de crenças limitantes sobre dinheiro." },
  { icon: BarChart3, title: "Investimentos Básicos", desc: "Poupança, renda fixa, fundos e primeiros passos na bolsa." },
  { icon: TrendingUp, title: "Geração de Renda", desc: "Fontes extras de rendimento e empreendedorismo." },
  { icon: Target, title: "Metas Financeiras", desc: "Como definir e alcançar objetivos de curto, médio e longo prazo." },
  { icon: BookOpen, title: "Planeamento do Futuro", desc: "Reforma, fundo de emergência e proteção patrimonial." },
];

const CourseContentSection = () => {
  return (
    <section className="py-20 md:py-28 gradient-navy">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-gold-glow font-body uppercase tracking-widest">Conteúdo do curso</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6 text-secondary-foreground">
            O que vai aprender
          </h2>
          <p className="text-secondary-foreground/60 font-body text-lg">
            Um programa completo dividido em módulos práticos e objectivos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modules.map((mod, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border border-secondary-foreground/10 bg-secondary-foreground/5 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <mod.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-display text-secondary-foreground">{mod.title}</h3>
              <p className="text-secondary-foreground/60 font-body text-sm leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseContentSection;
