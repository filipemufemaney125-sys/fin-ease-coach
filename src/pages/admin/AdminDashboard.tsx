import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, Mail, Tags } from "lucide-react";

const stat = async (table: "articles" | "newsletter_subscribers" | "contact_messages" | "categories") => {
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count || 0;
};

const AdminDashboard = () => {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => ({
      articles: await stat("articles"),
      subscribers: await stat("newsletter_subscribers"),
      messages: await stat("contact_messages"),
      categories: await stat("categories"),
    }),
  });
  const cards = [
    { label: "Articles", value: data?.articles, icon: FileText },
    { label: "Subscribers", value: data?.subscribers, icon: Users },
    { label: "Messages", value: data?.messages, icon: Mail },
    { label: "Categories", value: data?.categories, icon: Tags },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your publication.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-display font-bold">{c.value ?? "—"}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;