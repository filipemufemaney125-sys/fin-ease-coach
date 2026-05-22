import { Brain, Cpu, LineChart, GraduationCap, Wallet, Rocket } from "lucide-react";

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: typeof Brain;
}

export const categories: Category[] = [
  { slug: "ai-tools", name: "AI Tools", description: "Discover the most powerful AI tools shaping the future.", icon: Brain },
  { slug: "technology", name: "Technology", description: "Insights on emerging tech, gadgets and innovation.", icon: Cpu },
  { slug: "trading", name: "Trading", description: "Markets, strategies and digital trading intelligence.", icon: LineChart },
  { slug: "tutorials", name: "Tutorials", description: "Step-by-step guides to master modern tools.", icon: GraduationCap },
  { slug: "digital-money", name: "Digital Money", description: "Crypto, fintech and the new economy.", icon: Wallet },
  { slug: "opportunities", name: "Opportunities", description: "Remote work, side hustles and online earning.", icon: Rocket },
];