import { GraduationCap, BookOpen, Award } from "lucide-react";

const AboutCreatorSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary font-body uppercase tracking-widest">Sobre o criador</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3">Quem está por trás deste curso?</h2>
          </div>

          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border">
            <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
              {/* Avatar placeholder */}
              <div className="w-48 h-48 mx-auto md:mx-0 rounded-2xl gradient-navy flex items-center justify-center">
                <span className="text-6xl font-display font-bold text-gradient-gold">CF</span>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">Criador do Curso</h3>
                <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">
                  Licenciado pela <strong className="text-foreground">Universidade Católica de Moçambique</strong>, com uma paixão profunda pela educação financeira. Possui habilidades literárias em finanças, com a capacidade de explicar conceitos financeiros complexos de forma simples, prática e acessível para qualquer pessoa.
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-accent rounded-xl p-4">
                    <GraduationCap className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="font-body text-sm font-medium">Licenciado — UCM</span>
                  </div>
                  <div className="flex items-center gap-3 bg-accent rounded-xl p-4">
                    <BookOpen className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="font-body text-sm font-medium">Literacia Financeira</span>
                  </div>
                  <div className="flex items-center gap-3 bg-accent rounded-xl p-4">
                    <Award className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="font-body text-sm font-medium">Ensino Prático</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCreatorSection;
