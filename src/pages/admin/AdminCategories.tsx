import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const AdminCategories = () => {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const { data: cats = [], isLoading } = useQuery({
    queryKey: ["admin-cats"],
    queryFn: async () => (await supabase.from("categories").select("*").order("sort_order")).data || [],
  });
  const create = async () => {
    if (!name || !slug) return;
    const { error } = await supabase.from("categories").insert({ name, slug });
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { setName(""); setSlug(""); qc.invalidateQueries({ queryKey: ["admin-cats"] }); }
  };
  const del = async (id: string) => {
    if (!confirm("Delete category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-cats"] });
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Categories</h1>
      <Card className="p-5 flex gap-2">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <Button variant="hero" onClick={create}><Plus className="h-4 w-4" /> Add</Button>
      </Card>
      <Card>
        {isLoading ? <div className="p-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left"><tr><th className="p-3">Name</th><th className="p-3">Slug</th><th></th></tr></thead>
            <tbody>{cats.map((c: any) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3">{c.name}</td>
                <td className="p-3 text-muted-foreground">/{c.slug}</td>
                <td className="p-3 text-right"><Button size="sm" variant="ghost" onClick={() => del(c.id)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default AdminCategories;