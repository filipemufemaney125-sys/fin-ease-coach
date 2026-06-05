import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
      <Card className="p-10 text-center border-dashed">
        <Construction className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h2 className="font-semibold">Módulo em desenvolvimento</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Este módulo será entregue numa próxima fase do projeto TMCEL CRM.
        </p>
      </Card>
    </div>
  );
}