
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {  Trash2, PlusCircle } from "lucide-react"

import { IIntent } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import { useMemo } from "react"

export interface PhraseModalProps {
  isOpen: boolean
  onClose: () => void
  newPhrase: string
  setNewPhrase: (phrase: string) => void
  onAddPhrase: () => void
  onDeletePhrase: (phrase: string) => void
  intentId?: number
  intents: IIntent[]
}

export default function PhraseModal({
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
    return intents.find((i) => i.id === intentId)
  }, [intentId, intents])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="bg-neutral-900 text-white border-neutral-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Editar Frases de Treinamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Input + Add */}
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

          {/* Lista */}
          <ScrollArea className="max-h-72 pr-2">
            <AnimatePresence>
              {currentIntent?.trainingPhrases.map((phrase) => (
                <motion.div
                  key={phrase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 mb-2"
                >
                  <span className="text-sm text-neutral-200 wrap-break-words">
                    {phrase}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-500"
                    onClick={() => onDeletePhrase(phrase)}
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
            <Button variant="outline" className="border-neutral-700 text-neutral-300">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
