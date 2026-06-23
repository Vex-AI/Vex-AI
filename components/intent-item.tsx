import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, PlusCircle, MessageSquareQuote, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IIntent } from "@/types"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />
      
      <div className="relative bg-white/[0.03] border border-white/10 shadow-lg rounded-3xl p-5 sm:p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-xl">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white/90 tracking-tight">
              {intent.name}
            </h3>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
            onClick={onDeleteIntent}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          {/* Phrases */}
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400/80 uppercase tracking-wider">
              <MessageSquareQuote className="w-4 h-4" />
              <span>{t("intent_page.user_says")} ({intent.trainingPhrases.length})</span>
            </div>

            <div className="flex flex-wrap gap-2 max-w-full">
              <AnimatePresence>
                {intent.trainingPhrases.length ? (
                  intent.trainingPhrases.map((p) => (
                    <motion.div 
                      key={p} 
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                    >
                      <div className="group/pill relative flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl text-sm transition-all hover:bg-emerald-500/20">
                        <span className="break-words whitespace-normal max-w-full">{p}</span>
                        <div 
                          className="flex items-center justify-center bg-black/40 rounded-full p-1 opacity-0 group-hover/pill:opacity-100 cursor-pointer transition-all hover:bg-red-500/80 hover:text-white"
                          onClick={() => onDeletePhrase(p)}
                        >
                          <X className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-neutral-500 text-sm italic">{t("intent_page.no_phrases_added")}</p>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-auto pt-4">
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-white/5 border-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 text-neutral-300 transition-all rounded-xl h-10"
                onClick={onAddPhrase}
              >
                <PlusCircle className="mr-2 w-4 h-4" />
                {t("intent_page.manage_phrases")}
              </Button>
            </div>
          </div>

          {/* Responses */}
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-400/80 uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>{t("intent_page.vex_responds")} ({intent.responses.length})</span>
            </div>

            <div className="flex flex-wrap gap-2 max-w-full">
              <AnimatePresence>
                {intent.responses.length ? (
                  intent.responses.map((r) => (
                    <motion.div 
                      key={r} 
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                    >
                      <div className="group/pill relative flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-xl text-sm transition-all hover:bg-purple-500/20">
                        <span className="break-words whitespace-normal max-w-full">{r}</span>
                        <div 
                          className="flex items-center justify-center bg-black/40 rounded-full p-1 opacity-0 group-hover/pill:opacity-100 cursor-pointer transition-all hover:bg-red-500/80 hover:text-white"
                          onClick={() => onDeleteResponse(r)}
                        >
                          <X className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-neutral-500 text-sm italic">{t("intent_page.no_responses_added")}</p>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-auto pt-4">
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-white/5 border-white/10 hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/30 text-neutral-300 transition-all rounded-xl h-10"
                onClick={onAddResponse}
              >
                <PlusCircle className="mr-2 w-4 h-4" />
                {t("intent_page.manage_responses")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
