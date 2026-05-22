import PageShell from "@/components/site/PageShell";
import SEO from "@/components/site/SEO";

const Terms = () => (
  <PageShell>
    <SEO title="Terms of Service — NextGen Moz" description="The terms that govern your use of NextGen Moz." />
    <section className="py-20 md:py-28">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>By accessing NextGen Moz you agree to these terms. The site is provided for informational and educational purposes only.</p>
          <h2 className="text-xl font-display font-semibold text-foreground mt-8">Content</h2>
          <p>All content is provided "as is" without warranty of any kind. Articles about trading, finance and digital money do not constitute financial advice. Always do your own research before making decisions.</p>
          <h2 className="text-xl font-display font-semibold text-foreground mt-8">Intellectual property</h2>
          <p>All original content on this site is the property of NextGen Moz. You may share excerpts with attribution, but you may not republish full articles without permission.</p>
          <h2 className="text-xl font-display font-semibold text-foreground mt-8">Changes</h2>
          <p>We may update these terms from time to time. Continued use of the site means you accept the latest version.</p>
        </div>
      </div>
    </section>
  </PageShell>
);

export default Terms;