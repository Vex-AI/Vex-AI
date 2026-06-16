"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/vexDB";

import ResponseModal from "@/components/response-modal";
import PhraseModal from "@/components/phrase-modal";
import IntentItem from "@/components/intent-item";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { Trash2, PlusCircle, ArrowLeft, Bot } from "lucide-react";
import { IIntent } from "@/types";

export default function IntentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [intentName, setIntentName] = useState("");
  const [initialPhrase, setInitialPhrase] = useState("");
  const [initialResponse, setInitialResponse] = useState("");

  const [editingIntentId, setEditingIntentId] = useState<number>();
  const [phraseModalOpen, setPhraseModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);

  const [newPhrase, setNewPhrase] = useState("");
  const [newResponse, setNewResponse] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    duration?: number;
  } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // LiveQuery isolado do resto
  const intents = useLiveQuery(() => db.intents.toArray(), []);

  const go = useCallback(
    (path: string) => {
      navigate(path, { replace: true });
    },
    [navigate]
  );

  const pushToast = useCallback((msg: string, duration = 2000) => {
    setToast({ message: msg, duration });

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, duration);
  }, []);

  const updateIntent = useCallback(
    async (id: number, data: Partial<IIntent>) => {
      return db.intents.update(id, data);
    },
    []
  );

  const validateInputs = useCallback(() => {
    if (!intentName.trim()) return t("intent_page.write_intent_name");
    if (!initialPhrase.trim()) return t("intent_page.write_training_phrase");
    if (!initialResponse.trim()) return t("intent_page.write_intent_response");
    return null;
  }, [intentName, initialPhrase, initialResponse, t]);

  const handleAddIntent = useCallback(async () => {
    const err = validateInputs();
    if (err) return pushToast(err);

    const exists = await db.intents
      .where("name")
      .equalsIgnoreCase(intentName.trim())
      .first();
    if (exists) return pushToast(t("intent_page.intent_already_exists"));

    await db.intents.add({
      name: intentName.trim(),
      trainingPhrases: [initialPhrase.trim()],
      responses: [initialResponse.trim()],
    });

    setIntentName("");
    setInitialPhrase("");
    setInitialResponse("");
    pushToast(t("intent_page.intent_added_success"));
  }, [
    intentName,
    initialPhrase,
    initialResponse,
    validateInputs,
    pushToast,
    t,
  ]);

  const handleDeleteIntent = useCallback(async (id?: number) => {
    if (!id) return;
    await db.intents.delete(id);
  }, []);

  const handleAddPhrase = useCallback(async () => {
    if (!newPhrase.trim() || !editingIntentId) return;
    const intent = await db.intents.get(editingIntentId);
    if (!intent) return;

    await updateIntent(editingIntentId, {
      trainingPhrases: [...intent.trainingPhrases, newPhrase.trim()],
    });
    setNewPhrase("");
  }, [newPhrase, editingIntentId, updateIntent]);

  const handleAddResponse = useCallback(async () => {
    if (!newResponse.trim() || !editingIntentId) return;
    const intent = await db.intents.get(editingIntentId);
    if (!intent) return;

    await updateIntent(editingIntentId, {
      responses: [...intent.responses, newResponse.trim()],
    });
    setNewResponse("");
  }, [newResponse, editingIntentId, updateIntent]);

  const handleDeletePhrase = useCallback(
    async (phrase: string) => {
      if (!editingIntentId) return;
      const intent = await db.intents.get(editingIntentId);
      if (!intent) return;

      await updateIntent(editingIntentId, {
        trainingPhrases: intent.trainingPhrases.filter((p) => p !== phrase),
      });
    },
    [editingIntentId, updateIntent]
  );

  const handleDeleteResponse = useCallback(
    async (response: string) => {
      if (!editingIntentId) return;
      const intent = await db.intents.get(editingIntentId);
      if (!intent) return;

      await updateIntent(editingIntentId, {
        responses: intent.responses.filter((r) => r !== response),
      });
    },
    [editingIntentId, updateIntent]
  );

  const handleDeleteAll = useCallback(async () => {
    await db.intents.clear();
    pushToast(t("intent_page.all_intents_deleted"));
  }, [pushToast, t]);

  // Handlers fixos pra cada Intent (evita recriar funções no map)
  const handlersRef = useRef(new Map());

  const getHandlersForIntent = useCallback(
    (id: number) => {
      if (handlersRef.current.has(id)) return handlersRef.current.get(id);

      const h = {
        onDeleteIntent: () => handleDeleteIntent(id),
        onAddPhrase: () => {
          setEditingIntentId(id);
          setPhraseModalOpen(true);
        },
        onAddResponse: () => {
          setEditingIntentId(id);
          setResponseModalOpen(true);
        },
        onDeletePhrase: (p: string) => {
          setEditingIntentId(id);
          handleDeletePhrase(p);
        },
        onDeleteResponse: (r: string) => {
          setEditingIntentId(id);
          handleDeleteResponse(r);
        },
      };

      handlersRef.current.set(id, h);
      return h;
    },
    [handleDeleteIntent, handleDeletePhrase, handleDeleteResponse]
  );

  const memoIntents = useMemo(() => intents ?? [], [intents]);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      {/* TOP BAR */}
      <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => go("/home")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-300" />
          </button>

          <h1 className="text-xl sm:text-2xl font-bold flex-1 truncate text-white/90">
            {t("intent_page.title")}
          </h1>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="hidden sm:flex gap-2 rounded-xl border-red-500/20 bg-red-500/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all">
                <Trash2 className="w-4 h-4" />
                {t("intent_page.delete_all")}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden rounded-xl border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/20">
                <Trash2 className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-[#1a1a1a] border-white/10 text-white rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold">
                  {t("intent_page.confirmation")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-neutral-400 mt-2">
                  {t("intent_page.are_you_sure_delete_all_intents")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-4 gap-2">
                <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300 rounded-xl m-0">{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.3)] m-0"
                  onClick={handleDeleteAll}
                >
                  {t("clear")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-24">
        {/* ADD INTENT */}
        <section className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 mb-10 overflow-hidden group">
          <h2 className="text-xl font-bold mb-6 text-white/90 relative z-10 flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
            </div>
            {t("intent_page.add_new_intent_title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-400 ml-1">{t("intent_page.name_label")}</label>
              <Input
                value={intentName}
                onChange={(e) => setIntentName(e.target.value)}
                placeholder={t("intent_page.intent_name_placeholder")}
                className="bg-black/40 border-white/10 text-white focus-visible:ring-indigo-500/50 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-400 ml-1">{t("intent_page.initial_phrase_label")}</label>
              <Input
                value={initialPhrase}
                onChange={(e) => setInitialPhrase(e.target.value)}
                placeholder={t("intent_page.initial_phrase_placeholder")}
                className="bg-black/40 border-white/10 text-white focus-visible:ring-indigo-500/50 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-400 ml-1">{t("intent_page.initial_response_label")}</label>
              <Input
                value={initialResponse}
                onChange={(e) => setInitialResponse(e.target.value)}
                placeholder={t("intent_page.initial_response_placeholder")}
                className="bg-black/40 border-white/10 text-white focus-visible:ring-indigo-500/50 rounded-xl h-12"
              />
            </div>
          </div>

          <Button
            onClick={handleAddIntent}
            className="w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white mt-6 rounded-xl h-12 px-8 transition-all relative z-10"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {t("intent_page.add_intent")}
          </Button>
        </section>

        {/* INTENT LIST */}
        <section className="space-y-6">
          {memoIntents.length ? (
            memoIntents.map((intent) => {
              const handlers = getHandlersForIntent(intent.id!);
              return (
                <IntentItem key={intent.id} intent={intent} {...handlers} />
              );
            })
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-neutral-600" />
              </div>
              <p className="text-neutral-500 text-lg">{t("intent_page.no_intents_found")}</p>
              <p className="text-neutral-600 text-sm mt-2 max-w-sm mx-auto">Adicione intents acima para ensinar novos comportamentos à Vex.</p>
            </div>
          )}
        </section>
      </div>

      {/* MODAIS */}
      {phraseModalOpen && (
        <PhraseModal
          isOpen={phraseModalOpen}
          onClose={() => setPhraseModalOpen(false)}
          newPhrase={newPhrase}
          setNewPhrase={setNewPhrase}
          onAddPhrase={handleAddPhrase}
          onDeletePhrase={handleDeletePhrase}
          intentId={editingIntentId}
          intents={memoIntents}
        />
      )}

      {responseModalOpen && (
        <ResponseModal
          isOpen={responseModalOpen}
          onClose={() => setResponseModalOpen(false)}
          newResponse={newResponse}
          setNewResponse={setNewResponse}
          onAddResponse={handleAddResponse}
          onDeleteResponse={handleDeleteResponse}
          intentId={editingIntentId}
          intents={memoIntents}
        />
      )}

      {toast && (
        <div className="fixed right-6 bottom-6 z-50">
          <div className="bg-neutral-800 text-white px-4 py-2 rounded-lg shadow-lg">
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
}
