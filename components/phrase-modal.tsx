"use client";

import { useMemo, memo } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, PlusCircle, MessageSquareQuote } from "lucide-react";
import { IIntent } from "@/types";
import { useTranslation } from "react-i18next";

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
    <div className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-colors rounded-xl px-4 py-3 mb-2 group">
      <span className="text-sm text-neutral-200 break-words whitespace-normal w-full">
        {phrase}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="text-red-400 hover:text-white hover:bg-red-500/80 shrink-0 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-all"
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
  const { t } = useTranslation();

  const currentIntent = useMemo(() => {
    return intents.find((i) => i.id === intentId);
  }, [intentId, intents]);

  const phrases = useMemo(
    () => currentIntent?.trainingPhrases || [],
    [currentIntent]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] text-white border-white/10 rounded-3xl max-w-lg p-6 shadow-2xl">
        <DialogDescription className="sr-only">
          Modal para gerenciar as frases da intenção.
        </DialogDescription>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <MessageSquareQuote className="w-5 h-5 text-emerald-400" />
            </div>
            {t("intent_page.edit_phrases_title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-3">
            <Input
              placeholder={t("intent_page.type_new_variation")}
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              className="bg-[#131313] border border-white/5 text-white focus-visible:ring-0 focus-visible:border-white/10 rounded-xl h-12 flex-1"
            />

            <Button
              onClick={onAddPhrase}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 px-6 transition-colors shadow-none border-none"
            >
              <PlusCircle className="size-5 mr-2" />
              {t("intent_page.add_btn")}
            </Button>
          </div>

          <ScrollArea className="h-64 pr-4 -mr-4">
            {phrases.map((phrase) => (
              <PhraseItem
                key={phrase}
                phrase={phrase}
                onDeletePhrase={onDeletePhrase}
              />
            ))}
          </ScrollArea>
        </div>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white rounded-xl w-full sm:w-auto"
            >
              {t("intent_page.close_btn")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
