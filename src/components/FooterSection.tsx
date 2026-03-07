import { Mail, Phone, MapPin } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-12 md:py-16 bg-secondary text-secondary-foreground">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold font-display mb-4 text-gradient-gold">Educação Financeira</h3>
            <p className="text-secondary-foreground/60 font-body text-sm leading-relaxed">
              Transformando vidas através do conhecimento financeiro acessível e prático.
            </p>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-bold font-display mb-4">Contactos</h4>
            <ul className="space-y-3 font-body text-sm text-secondary-foreground/60">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>contacto@educacaofinanceira.co.mz</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>+258 84 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Moçambique</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold font-display mb-4">Redes Sociais</h4>
            <ul className="space-y-3 font-body text-sm text-secondary-foreground/60">
              <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 text-center">
          <p className="text-secondary-foreground/40 font-body text-sm">
            © {new Date().getFullYear()} Educação Financeira. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
