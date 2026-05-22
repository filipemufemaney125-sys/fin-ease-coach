import PageShell from "@/components/site/PageShell";
import SEO from "@/components/site/SEO";

const Privacy = () => (
  <PageShell>
    <SEO title="Privacy Policy — NextGen Moz" description="Learn how NextGen Moz collects and uses information." />
    <section className="py-20 md:py-28">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>NextGen Moz respects your privacy. This policy explains what information we collect when you visit our website and how we use it.</p>
          <h2 className="text-xl font-display font-semibold text-foreground mt-8">Information we collect</h2>
          <p>We collect basic, anonymous analytics about how visitors use the site (pages visited, device type, country) to improve our content. If you subscribe to our newsletter, we store your email address.</p>
          <h2 className="text-xl font-display font-semibold text-foreground mt-8">Cookies and advertising</h2>
          <p>We may use third-party services such as Google AdSense to serve ads. These partners may use cookies to personalize advertising based on your visits to this and other sites. You can opt out at any time through your browser settings or the Google Ads Settings page.</p>
          <h2 className="text-xl font-display font-semibold text-foreground mt-8">Affiliate links</h2>
          <p>Some links on this site are affiliate links. If you click one and make a purchase, we may earn a commission at no extra cost to you. We only recommend tools we believe in.</p>
          <h2 className="text-xl font-display font-semibold text-foreground mt-8">Contact</h2>
          <p>For any privacy-related questions, contact us at hello@nextgenmoz.com.</p>
        </div>
      </div>
    </section>
  </PageShell>
);

export default Privacy;