import { Link } from "react-router-dom";
import { Cpu, Twitter, Github, Linkedin, Youtube } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
              <span className="flex h-8 w-8 items-center justify-center rounded-md gradient-brand text-primary-foreground">
                <Cpu className="h-4 w-4" />
              </span>
              <span>NextGen<span className="text-primary"> Moz</span></span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Technology, AI and digital opportunities for the next generation. Independent analysis and practical guides — no hype.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Github, label: "GitHub", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Youtube, label: "YouTube", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/blog" className="hover:text-foreground">All Articles</Link></li>
              <li><Link to="/category/ai-tools" className="hover:text-foreground">AI Tools</Link></li>
              <li><Link to="/category/technology" className="hover:text-foreground">Technology</Link></li>
              <li><Link to="/category/trading" className="hover:text-foreground">Trading</Link></li>
              <li><Link to="/category/digital-money" className="hover:text-foreground">Digital Money</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NextGen Moz. All rights reserved.</p>
          <p>Built for the next generation of thinkers and builders.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;