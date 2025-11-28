// src/pages/IntentPage.tsx
"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/vexDB";
import { IIntent } from "@/types";

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
} from "@/components/ui/alert-dialog";

import { Trash2, PlusCircle, ArrowLeft } from "lucide-react";

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

  const intents = useLiveQuery<IIntent[]>(() => db.intents.toArray(), []);

  const go = (path: string) => navigate(path, { replace: true });

  const pushToast = useCallback((msg: string, duration = 2000) => {
    setToast({ message: msg, duration });
    setTimeout(() => setToast(null), duration);
  }, []);

  const updateIntent = async (id: number, data: Partial<IIntent>) =>
    db.intents.update(id, data);

  const validateInputs = () => {
    if (!intentName.trim()) return t("intent_page.write_intent_name");
    if (!initialPhrase.trim()) return t("intent_page.write_training_phrase");
    if (!initialResponse.trim()) return t("intent_page.write_intent_response");
    return null;
  };

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
  }, [intentName, initialPhrase, initialResponse, t, pushToast]);


  const handleDeleteIntent = async (id?: number) => {
    if (id) await db.intents.delete(id);
  };

  const handleAddPhrase = async () => {
    if (!newPhrase.trim() || !editingIntentId) return;

    const intent = await db.intents.get(editingIntentId);
    if (!intent) return;

    await updateIntent(editingIntentId, {
      trainingPhrases: [...intent.trainingPhrases, newPhrase.trim()],
    });

    setNewPhrase("");
  };

  const handleAddResponse = async () => {
    if (!newResponse.trim() || !editingIntentId) return;

    const intent = await db.intents.get(editingIntentId);
    if (!intent) return;

    await updateIntent(editingIntentId, {
      responses: [...intent.responses, newResponse.trim()],
    });

    setNewResponse("");
  };

  const handleDeletePhrase = async (phrase: string) => {
    if (!editingIntentId) return;
    const intent = await db.intents.get(editingIntentId);
    if (!intent) return;

    await updateIntent(editingIntentId, {
      trainingPhrases: intent.trainingPhrases.filter((p) => p !== phrase),
    });
  };

  const handleDeleteResponse = async (response: string) => {
    if (!editingIntentId) return;
    const intent = await db.intents.get(editingIntentId);
    if (!intent) return;

    await updateIntent(editingIntentId, {
      responses: intent.responses.filter((r) => r !== response),
    });
  };

  const handleDeleteAll = async () => {
    await db.intents.clear();
    pushToast(t("intent_page.all_intents_deleted"));
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            aria-label="voltar"
            onClick={() => go("/home")}
            className="p-2 rounded-md hover:bg-white/10"
          >
            <ArrowLeft className="size-5" />
          </button>

          <h1 className="text-base sm:text-lg font-semibold flex-1 truncate">
            {t("intent_page.title")}
          </h1>

          <div className="flex items-center gap-2">
           

            

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
        
              </AlertDialogTrigger>

              <AlertDialogContent
                className="bg-[#090b0c]"
                aria-describedby={undefined}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("intent_page.confirmation")}
                  </AlertDialogTitle>
                  <p className="text-sm text-neutral-400 mt-2">
                    {t("intent_page.are_you_sure_delete_all_intents")}
                  </p>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>

                  <AlertDialogAction
                    className="bg-red-600"
                    onClick={async () => {
                      await handleDeleteAll();
                      setConfirmOpen(false);
                    }}
                  >
                    {t("clear")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="hidden sm:flex gap-2">
                  <Trash2 className="size-4" />
                  {t("intent_page.delete_all")}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="sm:hidden p-2">
                  <Trash2 className="size-5" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent
                className="bg-[#090b0c]"
                aria-describedby={undefined}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("intent_page.confirmation")}
                  </AlertDialogTitle>
                  <p className="text-sm text-neutral-400 mt-2">
                    {t("intent_page.are_you_sure_delete_all_intents")}
                  </p>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600"
                    onClick={async () => {
                      await handleDeleteAll();
                      setConfirmOpen(false);
                    }}
                  >
                    {t("clear")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-[72px] pb-20">
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {t("intent_page.add_new_intent_title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder={t("intent_page.intent_name_placeholder")}
              value={intentName}
              onChange={(e) => setIntentName(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
            />

            <Input
              placeholder={t("intent_page.initial_phrase_placeholder")}
              value={initialPhrase}
              onChange={(e) => setInitialPhrase(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
            />

            <Input
              placeholder={t("intent_page.initial_response_placeholder")}
              value={initialResponse}
              onChange={(e) => setInitialResponse(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            <Button
              onClick={handleAddIntent}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <PlusCircle className="size-4 mr-2" />
              {t("intent_page.add_intent")}
            </Button>

     
            
          </div>
        </section>

        <Separator />

        <section className="mt-6 space-y-4">
          {intents?.length ? (
            intents.map((intent) => (
              <IntentItem
                key={intent.id}
                intent={intent}
                onDeleteIntent={() => handleDeleteIntent(intent.id)}
                onAddPhrase={() => {
                  setEditingIntentId(intent.id);
                  setPhraseModalOpen(true);
                }}
                onAddResponse={() => {
                  setEditingIntentId(intent.id);
                  setResponseModalOpen(true);
                }}
                onDeletePhrase={(p) => {
                  setEditingIntentId(intent.id);
                  handleDeletePhrase(p);
                }}
                onDeleteResponse={(r) => {
                  setEditingIntentId(intent.id);
                  handleDeleteResponse(r);
                }}
              />
            ))
          ) : (
            <div className="py-12 text-center text-neutral-400">
              {t("intent_page.no_intents_found")}
            </div>
          )}
        </section>
      </div>

      <PhraseModal
        isOpen={phraseModalOpen}
        onClose={() => setPhraseModalOpen(false)}
        newPhrase={newPhrase}
        setNewPhrase={setNewPhrase}
        onAddPhrase={handleAddPhrase}
        onDeletePhrase={handleDeletePhrase}
        intentId={editingIntentId}
        intents={intents ?? []}
      />

      <ResponseModal
        isOpen={responseModalOpen}
        onClose={() => setResponseModalOpen(false)}
        newResponse={newResponse}
        setNewResponse={setNewResponse}
        onAddResponse={handleAddResponse}
        onDeleteResponse={handleDeleteResponse}
        intentId={editingIntentId}
        intents={intents ?? []}
      />

      {toast && (
        <div className="fixed right-6 bottom-6 z-50">
          <div className="bg-neutral-800 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4">
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
}
