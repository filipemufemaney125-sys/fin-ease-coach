import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const AdminSubscribers = () => {
  const { data: subs = [], isLoading } = useQuery({
    queryKey: ["subs"],
    queryFn: async () => (await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false })).data || [],
  });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Subscribers <span className="text-muted-foreground text-base font-normal">({subs.length})</span></h1>
      <Card>{isLoading ? <div className="p-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div> : (
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left"><tr><th className="p-3">Email</th><th className="p-3">Source</th><th className="p-3">Date</th></tr></thead>
          <tbody>{subs.map((s: any) => (
            <tr key={s.id} className="border-t border-border"><td className="p-3 font-medium">{s.email}</td><td className="p-3 text-muted-foreground">{s.source || "—"}</td><td className="p-3 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td></tr>
          ))}</tbody>
        </table>
      )}</Card>
    </div>
  );
};
export default AdminSubscribers;