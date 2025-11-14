// src/components/ChipSection.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface ChipSectionProps {
  title: string;
  items: string[];
  onAddItem: () => void;
  onDeleteItem: (item: string) => void;
  chipClassName?: string;
  icon?: React.ReactNode;
}

const ChipSection: React.FC<ChipSectionProps> = ({
  title,
  items,
  onAddItem,
  onDeleteItem,
  chipClassName,
  icon,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
        {icon}
        {title} ({items.length})
      </div>

      {/* CHIPS */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {items.length > 0 ? (
            items.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className={`flex items-center gap-1 rounded-full px-3 py-1 cursor-default ${chipClassName}`}
                >
                  {item}
                  <X
                    className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
                    onClick={() => onDeleteItem(item)}
                  />
                </Badge>
              </motion.div>
            ))
          ) : (
            <p className="text-xs text-white/60">Nenhum item adicionado.</p>
          )}
        </AnimatePresence>
      </div>

      {/* ADD BUTTON */}
      <Button
        variant="outline"
        size="sm"
        className="self-start gap-2 rounded-full"
        onClick={onAddItem}
      >
        <Plus className="h-4 w-4" />
        Adicionar
      </Button>
    </div>
  );
};

export default ChipSection;
