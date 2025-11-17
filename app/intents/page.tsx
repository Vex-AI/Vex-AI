// src/pages/IntentPage.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/vexDB";
import { analyzer } from "@/lib/analyzer";
import { IIntent } from "@/types";

import ResponseModal from "@/components/response-modal";

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

import { Trash2, PlusCircle, ArrowLeft, GraduationCap } from "lucide-react";
import IntentItem from "@/components/intent-item";
import PhraseModal from "@/components/phrase-modal";

export default function IntentPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [intentName, setIntentName] = useState<string>("");
  const [initialPhrase, setInitialPhrase] = useState<string>("");
  const [initialResponse, setInitialResponse] = useState<string>("");

  const [editingIntentId, setEditingIntentId] = useState<number | undefined>();
  const [phraseModalOpen, setPhraseModalOpen] = useState<boolean>(false);
  const [newPhrase, setNewPhrase] = useState<string>("");
  const [responseModalOpen, setResponseModalOpen] = useState<boolean>(false);
  const [newResponse, setNewResponse] = useState<string>("");

  const [toast, setToast] = useState<{
    message: string;
    duration?: number;
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // dexie live query
  const intents = useLiveQuery<IIntent[]>(() => db.intents.toArray(), []);

  const go = (path: string) => navigate(path, { replace: true });

  const pushToast = useCallback((message: string, duration = 2000) => {
    setToast({ message, duration });
    setTimeout(() => setToast(null), duration);
  }, []);

  const handleAddIntent = useCallback(async () => {
    if (!intentName.trim())
      return pushToast(t("intent_page.write_intent_name"));
    if (!initialPhrase.trim())
      return pushToast(t("intent_page.write_training_phrase"));
    if (!initialResponse.trim())
      return pushToast(t("intent_page.write_intent_response"));

    const existingIntent = await db.intents
      .where("name")
      .equalsIgnoreCase(intentName.trim())
      .first();
    if (existingIntent) {
      return pushToast(t("intent_page.intent_already_exists"));
    }

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

  const handleDeleteIntent = useCallback(async (id: number | undefined) => {
    if (id === undefined) return;
    await db.intents.delete(id);
  }, []);

  const handleAddPhrase = useCallback(async () => {
    if (!newPhrase.trim() || !editingIntentId) return;
    const intent = await db.intents.get(editingIntentId);
    if (intent) {
      await db.intents.update(editingIntentId, {
        trainingPhrases: [...intent.trainingPhrases, newPhrase.trim()],
      });
      setNewPhrase("");
    }
  }, [newPhrase, editingIntentId]);

  const handleAddResponse = useCallback(async () => {
    if (!newResponse.trim() || !editingIntentId) return;
    const intent = await db.intents.get(editingIntentId);
    if (intent) {
      await db.intents.update(editingIntentId, {
        responses: [...intent.responses, newResponse.trim()],
      });
      setNewResponse("");
    }
  }, [newResponse, editingIntentId]);

  const handleDeletePhrase = useCallback(
    async (phraseToDelete: string) => {
      if (!editingIntentId) return;
      const intent = await db.intents.get(editingIntentId);
      if (intent) {
        await db.intents.update(editingIntentId, {
          trainingPhrases: intent.trainingPhrases.filter(
            (p) => p !== phraseToDelete
          ),
        });
      }
    },
    [editingIntentId]
  );

  const handleDeleteResponse = useCallback(
    async (responseToDelete: string) => {
      if (!editingIntentId) return;
      const intent = await db.intents.get(editingIntentId);
      if (intent) {
        await db.intents.update(editingIntentId, {
          responses: intent.responses.filter((r) => r !== responseToDelete),
        });
      }
    },
    [editingIntentId]
  );

  const handleDeleteAllIntents = useCallback(async () => {
    await db.intents.clear();
    pushToast(t("intent_page.all_intents_deleted"));
  }, [pushToast, t]);

  const handleRetrain = useCallback(async () => {
    pushToast(t("intent_page.training_ai_start"));
    await analyzer("");
    pushToast(t("intent_page.training_ai_success"));
  }, [pushToast, t]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            aria-label="voltar"
            onClick={() => go("/home")}
            className="p-2 rounded-md hover:bg-white/10 shrink-0"
          >
            <ArrowLeft className="size-5" />
          </button>

          <h1 className="text-base sm:text-lg font-semibold flex-1 truncate">
            {t("intent_page.title")}
          </h1>

          <div className="flex items-center gap-2">
            {/* some buttons somem no mobile, viram só ícone */}
            <Button
              variant="ghost"
              onClick={handleRetrain}
              className="hidden sm:flex items-center gap-2"
            >
              <GraduationCap className="size-4" />
              {t("intent_page.retrain_ai")}
            </Button>

            <Button
              variant="ghost"
              onClick={handleRetrain}
              className="sm:hidden p-2"
            >
              <GraduationCap className="size-5" />
            </Button>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="hidden sm:flex items-center gap-2"
                >
                  <Trash2 className="size-4" />
                  {t("intent_page.delete_all")}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="sm:hidden p-2">
                  <Trash2 className="size-5" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent aria-describedby={undefined}>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("intent_page.confirmation")}
                  </AlertDialogTitle>
                  <div className="text-sm text-neutral-400 mt-2">
                    {t("intent_page.are_you_sure_delete_all_intents")}
                  </div>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>

                  <AlertDialogAction
                    onClick={async () => {
                      await handleDeleteAllIntents();
                      setConfirmOpen(false);
                    }}
                    className="bg-red-600"
                  >
                    {t("delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* page content */}
      <div className="max-w-3xl mx-auto px-4 pt-[72px] pb-20">
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {t("intent_page.add_new_intent_title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder={t("intent_page.intent_name_placeholder")}
              value={intentName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIntentName(e.target.value)
              }
              className="md:col-span-1 bg-neutral-800 border-neutral-700 text-white"
            />

            <Input
              placeholder={t("intent_page.initial_phrase_placeholder")}
              value={initialPhrase}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInitialPhrase(e.target.value)
              }
              className="md:col-span-1 bg-neutral-800 border-neutral-700 text-white"
            />

            <Input
              placeholder={t("intent_page.initial_response_placeholder")}
              value={initialResponse}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInitialResponse(e.target.value)
              }
              className="md:col-span-1 bg-neutral-800 border-neutral-700 text-white"
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

            <Button variant="secondary" onClick={handleRetrain}>
              <GraduationCap className="size-4 mr-2" />
              {t("intent_page.retrain_ai")}
            </Button>

            <Button variant="ghost" onClick={() => setConfirmOpen(true)}>
              {t("intent_page.delete_all_intents")}
            </Button>
          </div>
        </section>

        <Separator />

        <section className="mt-6 space-y-4">
          {intents && intents.length > 0 ? (
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
                onDeletePhrase={(phrase) => {
                  setEditingIntentId(intent.id);
                  handleDeletePhrase(phrase);
                }}
                onDeleteResponse={(response) => {
                  setEditingIntentId(intent.id);
                  handleDeleteResponse(response);
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

      {/* Modals */}
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

      {/* Toast (simple) */}
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
