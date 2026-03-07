import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Você receberá um email com os detalhes de acesso ao curso.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen gradient-navy flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-secondary-foreground/60 hover:text-secondary-foreground mb-8 font-body transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à página inicial
        </button>

        <Card className="border-secondary-foreground/10 bg-secondary text-secondary-foreground shadow-gold">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl md:text-3xl font-display text-gradient-gold">
              Inscreva-se no Curso
            </CardTitle>
            <CardDescription className="text-secondary-foreground/60 font-body">
              Preencha os dados abaixo para garantir a sua vaga
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-secondary-foreground/80 font-body">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  required
                  maxLength={100}
                  className="bg-secondary-foreground/5 border-secondary-foreground/15 text-secondary-foreground placeholder:text-secondary-foreground/30 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-secondary-foreground/80 font-body">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  maxLength={255}
                  className="bg-secondary-foreground/5 border-secondary-foreground/15 text-secondary-foreground placeholder:text-secondary-foreground/30 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-secondary-foreground/80 font-body">
                  Telefone / WhatsApp
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+258 84 000 0000"
                  required
                  maxLength={20}
                  className="bg-secondary-foreground/5 border-secondary-foreground/15 text-secondary-foreground placeholder:text-secondary-foreground/30 focus-visible:ring-primary"
                />
              </div>

              {/* Order summary */}
              <div className="rounded-xl bg-secondary-foreground/5 border border-secondary-foreground/10 p-5 space-y-3 mt-6">
                <h3 className="font-display font-semibold text-secondary-foreground">Resumo do pedido</h3>
                <div className="flex justify-between font-body text-sm text-secondary-foreground/70">
                  <span>Curso de Educação Financeira</span>
                  <span>1x</span>
                </div>
                <div className="border-t border-secondary-foreground/10 pt-3 flex justify-between font-body font-semibold text-lg">
                  <span className="text-secondary-foreground">Total</span>
                  <span className="text-gradient-gold">2.500 MT</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full h-14 rounded-full text-lg gap-2"
                disabled={isSubmitting}
              >
                <CreditCard className="w-5 h-5" />
                {isSubmitting ? "Processando..." : "Finalizar inscrição"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-secondary-foreground/40 font-body text-xs">
                <ShieldCheck className="w-4 h-4" />
                Pagamento seguro · Dados protegidos
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
