import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ana M.",
    text: "Antes do curso, eu vivia endividada e sem esperança. Hoje, consigo poupar 20% do meu salário todos os meses!",
    role: "Professora",
  },
  {
    name: "Carlos T.",
    text: "O curso mudou completamente a minha relação com o dinheiro. Finalmente comecei a investir e a pensar no futuro.",
    role: "Empreendedor",
  },
  {
    name: "Marta S.",
    text: "Linguagem simples, exemplos práticos. Recomendo a todos que querem organizar as suas finanças.",
    role: "Estudante universitária",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary font-body uppercase tracking-widest">Depoimentos</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">O que dizem os nossos alunos</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground font-body leading-relaxed mb-6">"{t.text}"</p>
              <div>
                <p className="font-bold font-display">{t.name}</p>
                <p className="text-sm text-muted-foreground font-body">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
