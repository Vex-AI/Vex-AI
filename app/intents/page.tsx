import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/vexDB";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonList,
  IonHeader,
  IonPage,
  IonToast,
  IonToolbar,
  IonAlert,
} from "@ionic/react";
import { arrowBack, addCircleOutline, trash, school, saveOutline, folderOpenOutline } from "ionicons/icons";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router";
import { IIntent } from "@/types";
import IntentItem from "@/components/IntentItem"; 
import PhraseModal from "@/components/PhraseModal"; 
import ResponseModal from "@/components/ResponseModal";  
import { analyzer } from "@/lib/analyzer"; 


const IntentPage: React.FC = () => {
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
  const fileInputRef = useRef<HTMLInputElement>(null); 

  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState<{
    message: string;
    duration?: number;
  } | null>(null);


  const intents = useLiveQuery<IIntent[]>(() => db.intents.toArray(), []);

  const go = (path: string) => {
    navigate(path, { replace: true });
  };

   const handleImportClick = () => {

    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read");
        
        const importedIntents: IIntent[] = JSON.parse(text);

       
        if (!Array.isArray(importedIntents)) {
           throw new Error("Invalid format: JSON is not an array.");
        }

    
        await db.transaction('rw', db.intents, async () => {
            await db.intents.clear(); 
            await db.intents.bulkAdd(importedIntents); 
        });

        setShowToast({ message: t("import_success", "Intenções importadas! Retreinando a IA...") });
        
        await handleRetrain();

      } catch (error) {
        console.error("Import failed:", error);
        setShowToast({ message: t("import_failed", "Falha ao importar: arquivo inválido ou corrompido.") });
      } finally {
       
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };


  const handleAddIntent = useCallback(async () => {
    if (!intentName.trim())
      return setShowToast({ message: t("write_intent_name") });
    if (!initialPhrase.trim())
      return setShowToast({ message: t("write_training_phrase") });
    if (!initialResponse.trim())
      return setShowToast({ message: t("write_intent_response") });

    const existingIntent = await db.intents
      .where("name")
      .equalsIgnoreCase(intentName.trim())
      .first();
    if (existingIntent) {
      return setShowToast({ message: t("intent_already_exists") });
    }

    await db.intents.add({
      name: intentName.trim(),
      trainingPhrases: [initialPhrase.trim()],
      responses: [initialResponse.trim()],
    });

    setIntentName("");
    setInitialPhrase("");
    setInitialResponse("");
    setShowToast({ message: t("intent_added_success") });
  }, [intentName, initialPhrase, initialResponse, t]);

  
  const handleDeleteIntent = async (id: number | undefined) => {
    if (id === undefined) return;
    await db.intents.delete(id);
  };

  const handleAddPhrase = async () => {
    if (!newPhrase.trim() || !editingIntentId) return;
    const intent = await db.intents.get(editingIntentId);
    if (intent) {
      await db.intents.update(editingIntentId, {
        trainingPhrases: [...intent.trainingPhrases, newPhrase.trim()],
      });
      setNewPhrase("");
    }
  };

  const handleAddResponse = async () => {
    if (!newResponse.trim() || !editingIntentId) return;
    const intent = await db.intents.get(editingIntentId);
    if (intent) {
      await db.intents.update(editingIntentId, {
        responses: [...intent.responses, newResponse.trim()],
      });
      setNewResponse("");
    }
  };

  const handleDeletePhrase = async (phraseToDelete: string) => {
    if (!editingIntentId) return;
    const intent = await db.intents.get(editingIntentId);
    if (intent) {
      await db.intents.update(editingIntentId, {
        trainingPhrases: intent.trainingPhrases.filter(
          (p) => p !== phraseToDelete
        ),
      });
    }
  };

  const handleDeleteResponse = async (responseToDelete: string) => {
    if (!editingIntentId) return;
    const intent = await db.intents.get(editingIntentId);
    if (intent) {
      await db.intents.update(editingIntentId, {
        responses: intent.responses.filter((r) => r !== responseToDelete),
      });
    }
  };

  const handleDeleteAllIntents = async () => {
    await db.intents.clear();
    setShowToast({ message: t("all_intents_deleted") });
  };


  const handleRetrain = async () => {
    setShowToast({ message: t("training_ai_start") });
    
    await analyzer(""); 
    setShowToast({ message: t("training_ai_success") });
  };
const handleExport = async () => {
    try {
      const allIntents = await db.intents.toArray();
      const dataStr = JSON.stringify(allIntents, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "intents.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting intents:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => go("/home")} color="light">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
      {/* Adicione um container para o formulário */}
        <div className="intent-form-container">
          <h2>{t("add_new_intent_title", "Adicionar Nova Intenção")}</h2>

      

          <IonButton onClick={handleAddIntent} color="tertiary" shape="round">
            <IonIcon slot="start" icon={addCircleOutline} />
            {t("add_intent", "Adicionar Intenção")}
          </IonButton>

          {/* NOVOS BOTÕES DE IMPORTAR E EXPORTAR */}
          <IonButton onClick={handleExport} color="primary" shape="round">
            <IonIcon slot="start" icon={saveOutline} />
            {t("export_intents", "Exportar Intenções")}
          </IonButton>

          <IonButton onClick={handleImportClick} color="primary" shape="round">
            <IonIcon slot="start" icon={folderOpenOutline} />
            {t("import_intents", "Importar Intenções")}
          </IonButton>
          {/* FIM DOS NOVOS BOTÕES */}

          <IonButton onClick={handleRetrain} color="secondary" shape="round">
            <IonIcon slot="start" icon={school} />
            {t("retrain_ai", "Retreinar IA")}
          </IonButton>

          <IonButton
            onClick={() => setShowAlert(true)}
            color="danger"
            shape="round"
          >
            <IonIcon slot="start" icon={trash} />
            {t("delete_all_intents", "Apagar Todas Intenções")}
          </IonButton>

          {/* Input de arquivo escondido */}
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileSelected}
            style={{ display: 'none' }}
          />
        </div>
        <div className="intent-form-container">
          <h2>{t("add_new_intent_title", "Adicionar Nova Intenção")}</h2>

          <IonInput
            style={{ marginBottom: "1rem" }}
            labelPlacement="floating"
            label={t("intent_name_label", "Nome da Intenção")}
            placeholder={t(
              "intent_name_placeholder",
              "Ex: saudacao, despedida"
            )}
            value={intentName}
            onIonChange={(e) => setIntentName(e.detail.value!)}
            fill="outline"
            shape="round"
            clearInput
          />
          <IonInput
            style={{ marginBottom: "1rem" }}
            labelPlacement="floating"
            label={t("initial_phrase_label", "Frase de Treinamento Inicial")}
            placeholder={t("initial_phrase_placeholder", "Ex: olá, tudo bem?")}
            value={initialPhrase}
            onIonChange={(e) => setInitialPhrase(e.detail.value!)}
            fill="outline"
            shape="round"
            clearInput
          />
          <IonInput
            style={{ marginBottom: "1rem" }}
            labelPlacement="floating"
            label={t("initial_response_label", "Resposta Inicial")}
            placeholder={t(
              "initial_response_placeholder",
              "Ex: Olá! Como posso ajudar?"
            )}
            value={initialResponse}
            onIonChange={(e) => setInitialResponse(e.detail.value!)}
            fill="outline"
            shape="round"
            clearInput
          />

         
          <IonButton onClick={handleAddIntent} color="tertiary" shape="round">
            <IonIcon slot="start" icon={addCircleOutline} />
            {t("add_intent", "Adicionar Intenção")}
          </IonButton>

          <IonButton onClick={handleRetrain} color="secondary" shape="round">
            <IonIcon slot="start" icon={school} />
            {t("retrain_ai", "Retreinar IA")}
          </IonButton>

          <IonButton
            onClick={() => setShowAlert(true)}
            color="danger"
            shape="round"
          >
            <IonIcon slot="start" icon={trash} />
            {t("delete_all_intents", "Apagar Todas Intenções")}
          </IonButton>
        </div>

        <hr style={{ margin: "2rem 0" }} />
   
        <IonList>
          {intents?.map((intent) => (
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
          ))}
        </IonList>

      
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

        <IonToast
          isOpen={!!showToast}
          message={showToast?.message}
          duration={showToast?.duration || 2000}
          onDidDismiss={() => setShowToast(null)}
        />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={t("confirmation")}
          message={t("are_you_sure_delete_all_intents")}
          buttons={[
            { text: t("cancel"), role: "cancel" },
            { text: t("confirm"), handler: handleDeleteAllIntents },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default IntentPage;
