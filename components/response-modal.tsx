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
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, PlusCircle } from "lucide-react";
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
      <DialogContent
        aria-describedby={undefined}
        className="bg-neutral-900 text-white border-neutral-800 max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("response_modal.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={t("response_modal.placeholder")}
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
            />

            <Button
              onClick={onAddResponse}
              className="bg-purple-600 hover:bg-purple-700 rounded-xl"
            >
              <PlusCircle className="size-4 mr-1" />
              {t("response_modal.add")}
            </Button>
          </div>

          <ScrollArea className="h-100 pr-2">
            {responses.map((resp, index) => (
              <div
                key={index}
                className="flex items-start justify-between bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 mb-2 w-full gap-2"
              >
                <span className="text-sm text-neutral-200 break-words whitespace-normal w-full">
                  {resp}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-500 shrink-0"
                  onClick={() => onDeleteResponse(resp)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300"
            >
              {t("response_modal.close")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(ResponseModalBase);
