import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const AdminArticles = () => {
  const qc = useQueryClient();
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, published, updated_at, categories(name)")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const del = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); qc.invalidateQueries({ queryKey: ["admin-articles"] }); }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Articles</h1>
          <p className="text-muted-foreground mt-1">{articles.length} total</p>
        </div>
        <Link to="/admin/articles/new"><Button variant="hero"><Plus className="h-4 w-4" /> New article</Button></Link>
      </div>
      <Card className="overflow-hidden">
        {isLoading ? <div className="p-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left"><tr><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3 w-32"></th></tr></thead>
            <tbody>
              {articles.map((a: any) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="p-3"><p className="font-medium">{a.title}</p><p className="text-xs text-muted-foreground">/{a.slug}</p></td>
                  <td className="p-3 text-muted-foreground">{a.categories?.name || "—"}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full border ${a.published ? "border-green-500/30 text-green-400 bg-green-500/10" : "border-border text-muted-foreground"}`}>{a.published ? "Published" : "Draft"}</span></td>
                  <td className="p-3 text-right">
                    <Link to={`/admin/articles/${a.id}`}><Button size="sm" variant="ghost"><Pencil className="h-4 w-4" /></Button></Link>
                    <Button size="sm" variant="ghost" onClick={() => del(a.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default AdminArticles;