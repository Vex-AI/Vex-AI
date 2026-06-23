"use client";

import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

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
import { Trash2, PlusCircle, Bot } from "lucide-react";
import { IIntent } from "@/types";

export interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  newResponse: string;
  setNewResponse: (resp: string) => void;
  onAddResponse: () => void;
  onDeleteResponse: (response: string) => void;
  intentId?: number;
  intents: IIntent[];
}

function ResponseModalBase({
  isOpen,
  onClose,
  newResponse,
  setNewResponse,
  onAddResponse,
  onDeleteResponse,
  intentId,
  intents,
}: ResponseModalProps) {
  const { t } = useTranslation();

  const currentIntent = useMemo(() => {
    if (!intentId) return undefined;
    return intents.find((i) => i.id === intentId);
  }, [intentId, intents]);

  const responses = currentIntent?.responses ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] text-white border-white/10 rounded-3xl max-w-lg p-6 shadow-2xl">
        <DialogDescription className="sr-only">
          Modal para gerenciar as respostas da intenção.
        </DialogDescription>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            {t("intent_page.edit_responses_title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-3">
            <Input
              placeholder={t("intent_page.type_new_variation")}
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              className="bg-black/40 border-white/10 text-white focus-visible:ring-purple-500/50 rounded-xl h-12 flex-1"
            />

            <Button
              onClick={onAddResponse}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl h-12 px-6"
            >
              <PlusCircle className="size-5 mr-2" />
              {t("intent_page.add_btn")}
            </Button>
          </div>

          <ScrollArea className="h-64 pr-4 -mr-4">
            {responses.map((resp, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-colors rounded-xl px-4 py-3 mb-2 group"
              >
                <span className="text-sm text-neutral-200 break-words whitespace-normal w-full">
                  {resp}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-white hover:bg-red-500/80 shrink-0 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => onDeleteResponse(resp)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
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
}

export default memo(ResponseModalBase);
