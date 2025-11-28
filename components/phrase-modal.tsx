"use client";

import { useMemo, memo } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, PlusCircle } from "lucide-react";
import { IIntent } from "@/types";

export interface PhraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPhrase: string;
  setNewPhrase: (phrase: string) => void;
  onAddPhrase: () => void;
  onDeletePhrase: (phrase: string) => void;
  intentId?: number;
  intents: IIntent[];
}

const PhraseItem = memo(function PhraseItem({
  phrase,
  onDeletePhrase,
}: {
  phrase: string;
  onDeletePhrase: (p: string) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 mb-2">
      <span className="text-sm text-neutral-200 break-words whitespace-normal w-full">
        {phrase}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="text-red-400 hover:text-red-500 shrink-0"
        onClick={() => onDeletePhrase(phrase)}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
});

export default memo(function PhraseModal({
  isOpen,
  onClose,
  newPhrase,
  setNewPhrase,
  onAddPhrase,
  onDeletePhrase,
  intentId,
  intents,
}: PhraseModalProps) {
  const currentIntent = useMemo(() => {
    return intents.find((i) => i.id === intentId);
  }, [intentId, intents]);

  const phrases = useMemo(
    () => currentIntent?.trainingPhrases || [],
    [currentIntent]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="bg-neutral-900 text-white border-neutral-800 max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Editar Frases
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite uma nova variação"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
            />

            <Button
              onClick={onAddPhrase}
              className="bg-purple-600 hover:bg-purple-700 rounded-xl"
            >
              <PlusCircle className="size-4 mr-1" />
              Add
            </Button>
          </div>

          <ScrollArea className="max-h-full h-100 pr-2">
            {phrases.map((phrase) => (
              <PhraseItem
                key={phrase}
                phrase={phrase}
                onDeletePhrase={onDeletePhrase}
              />
            ))}
          </ScrollArea>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300"
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
