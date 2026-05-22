import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Hero from "@/components/site/Hero";
import CategoriesSection from "@/components/site/CategoriesSection";
import FeaturedArticles from "@/components/site/FeaturedArticles";
import TrendingAITools from "@/components/site/TrendingAITools";
import Newsletter from "@/components/site/Newsletter";
import SEO from "@/components/site/SEO";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="NextGen Moz — Technology, AI and Digital Opportunities"
        description="Independent tech publication covering AI tools, technology, trading, digital money and online opportunities for the next generation."
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CategoriesSection />
        <FeaturedArticles />
        <TrendingAITools />
        <Newsletter />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
