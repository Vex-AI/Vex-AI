import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-sm border-dashed">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Nada por aqui ainda</p>
            <p className="text-xs text-muted-foreground">
              Comece a conversa enviando a primeira mensagem.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default EmptyState;
