"use client";

import { useMemo } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
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

export default function ResponseModal({
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
    return intents.find((i) => i.id === intentId);
  }, [intentId, intents]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="bg-neutral-900 text-white border-neutral-800 max-w-lg">
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

          <ScrollArea className="max-h-72 pr-2">
            <AnimatePresence>
              {currentIntent?.responses.map((resp) => (
                <motion.div
                  key={resp}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 mb-2"
                >
                  <span className="text-sm text-neutral-200 wrap-break-words">
                    {resp}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-500"
                    onClick={() => onDeleteResponse(resp)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
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
