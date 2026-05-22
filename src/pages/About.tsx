import PageShell from "@/components/site/PageShell";
import SEO from "@/components/site/SEO";

const About = () => (
  <PageShell>
    <SEO title="About — NextGen Moz" description="NextGen Moz is an independent publication covering AI, technology, trading and digital opportunities." />
    <section className="py-20 md:py-28">
      <div className="container max-w-3xl">
        <p className="text-sm text-primary font-medium mb-2">About</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">An independent voice on technology and AI</h1>
        <div className="mt-10 space-y-5 text-lg text-muted-foreground leading-relaxed">
          <p>NextGen Moz is a modern publication built for the next generation of operators, creators and curious minds. We write about the tools, platforms and ideas shaping the digital economy.</p>
          <p>Our goal is simple: cut through the noise and deliver clear, honest, useful coverage of artificial intelligence, technology, trading, digital money and online opportunities. No hype, no fluff.</p>
          <p>The publication is editorially independent. We may include affiliate links to tools we genuinely recommend, but our opinions are our own and we never accept payment for coverage.</p>
        </div>
      </div>
    </section>
  </PageShell>
);

export default About;