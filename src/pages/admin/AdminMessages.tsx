import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const AdminMessages = () => {
  const { data: msgs = [], isLoading } = useQuery({
    queryKey: ["msgs"],
    queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })).data || [],
  });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Messages</h1>
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-3">
          {msgs.map((m: any) => (
            <Card key={m.id} className="p-5">
              <div className="flex justify-between text-sm"><p className="font-medium">{m.name} <span className="text-muted-foreground font-normal">— {m.email}</span></p><p className="text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p></div>
              <p className="mt-3 text-sm text-foreground/90 whitespace-pre-wrap">{m.message}</p>
            </Card>
          ))}
          {msgs.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
        </div>
      )}
    </div>
  );
};
export default AdminMessages;