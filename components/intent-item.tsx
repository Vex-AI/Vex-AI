import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, PlusCircle } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { IIntent } from "@/types"

export interface IntentItemProps {
  intent: IIntent
  onDeleteIntent: () => void
  onAddPhrase: () => void
  onAddResponse: () => void
  onDeletePhrase: (phrase: string) => void
  onDeleteResponse: (response: string) => void
}

export default function IntentItem({
  intent,
  onDeleteIntent,
  onAddPhrase,
  onAddResponse,
  onDeletePhrase,
  onDeleteResponse,
}: IntentItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className="bg-neutral-900 border-neutral-800 shadow-lg rounded-2xl p-2 sm:p-4">
        <CardHeader className="p-2 sm:p-4">
          <CardTitle className="flex items-center justify-between text-neutral-100 text-base sm:text-lg">
            {intent.name}

            <Button
              variant="ghost"
              size="icon"
              className="text-red-400 hover:text-red-500"
              onClick={onDeleteIntent}
            >
              <Trash2 className="size-5" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 p-2 sm:p-4">
          <div>
            <div className="text-sm font-semibold text-neutral-300 mb-3">
              Frases de Treinamento ({intent.trainingPhrases.length})
            </div>

            <div className="flex flex-wrap gap-2 max-w-full">
              <AnimatePresence>
                {intent.trainingPhrases.length ? (
                  intent.trainingPhrases.map((p) => (
                    <motion.div key={p} exit={{ opacity: 0, scale: 0.6 }}>
                      <Badge
                        variant="secondary"
                        className=" bg-neutral-800 text-white px-3 py-1 rounded-xl flex gap-2 items-center break-all max-w-full"
                      >
                        {p}
                        <X
                          className="hidden size-3 cursor-pointer opacity-70 hover:opacity-100"
                          onClick={() => onDeletePhrase(p)}
                        />
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-neutral-500 text-sm">Nenhuma frase de treinamento.</p>
                )}
              </AnimatePresence>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="mt-4 w-full"
              onClick={onAddPhrase}
            >
              <PlusCircle className="mr-2 size-4" />
              Adicionar Frase
            </Button>
          </div>

          <div>
            <div className="text-sm font-semibold text-neutral-300 mb-3">
              Respostas ({intent.responses.length})
            </div>

            <div className="flex flex-wrap gap-2 max-w-full">
              <AnimatePresence>
                {intent.responses.length ? (
                  intent.responses.map((r) => (
                    <motion.div key={r} exit={{ opacity: 0, scale: 0.6 }}>
                      <Badge
                        variant="secondary"
                        className="bg-blue-600 text-white px-3 py-1 rounded-xl flex gap-2 items-center max-w-full break-words whitespace-normal overflow-hidden">
                        <span className="break-words whitespace-normal max-w-full">{r}</span>
                        <X
                       
                          className="hidden size-3 cursor-pointer opacity-70 hover:opacity-100"
                          onClick={() => onDeleteResponse(r)}
                        />
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-neutral-500 text-sm">Nenhuma resposta.</p>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={onAddResponse}
            >
              <PlusCircle className="mr-2 size-4" />
              Adicionar Resposta
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
