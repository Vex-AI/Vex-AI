import { useState, useCallback, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonToast,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { db, ISynon } from "../classes/vexDB";

import {
  logoYoutube,
  trainSharp,
  cloudUpload,
  saveOutline,
  arrowBack,
} from "ionicons/icons";
import { useLiveQuery } from "dexie-react-hooks";
//@ts-ignore
import BayesClassifier from "bayes";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
const Train: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const classifierModel = useLiveQuery(() => db.classifier.get(1), []);
  const classifier: BayesClassifier = classifierModel?.classifierData
    ? BayesClassifier.fromJson(classifierModel?.classifierData)
    : BayesClassifier();

  const [showToast, setShowToast] = useState<{
    message: string;
    duration: number;
  } | null>(null);

  const { t } = useTranslation();
  const platform = Capacitor.getPlatform();
  const router = useIonRouter();
  const [isTrainDisabled, setIsTrainDisabled] = useState<boolean>(false);
  const navigate = (path: string) => router.push(path, "root", "replace");

  const trainModel = useCallback(async () => {
    if (!classifier) {
      setShowToast({ message: t("classifierNotLoaded"), duration: 2000 });
      return;
    }

    setShowToast({ message: t("trainingStarted"), duration: 2000 });
    setIsTrainDisabled(true);
    const search = await db.synons.toArray();
    for (const synon of search) {
      for (const r of synon.reply) {
        for (const w of synon.word) {
          await classifier.learn(w, r);
        }
      }
    }

    await db.classifier.put({ id: 1, classifierData: classifier.toJson() });
    setIsTrainDisabled(false);
    setShowToast({ message: t("trainingCompleted"), duration: 2000 });
  }, [classifier, t]);

  const getSynonsToFile = useCallback(() => {
    const input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = ".vex";

    input.addEventListener("change", (event: Event) => {
      const file: File | undefined = (event.target as HTMLInputElement)
        ?.files?.[0];
      const reader: FileReader = new FileReader();

      if (file) {
        reader.onload = async (e: ProgressEvent<FileReader>) => {
          const contents = e.target?.result as string | null;
          try {
            if (contents) {
              const jsonData: ISynon[] = JSON.parse(contents);

              if (!Array.isArray(jsonData)) {
                setShowToast({
                  message: t("invalidSynonsArray"),
                  duration: 2000,
                });
                return;
              }
              await db.synons.clear();
              await db.synons.bulkAdd(jsonData);

              setShowToast({ message: t("synonsAdded"), duration: 2000 });
            }
          } catch (error) {
            setShowToast({ message: t("fileProcessingError"), duration: 2000 });
            console.log("Error processing file:", error);
          }
        };

        reader.readAsText(file);
      }
    });

    input.click();
  }, [t]);

  const saveSynonsToFile = useCallback(async () => {
    const synons: ISynon[] = await db.synons.toArray();

    if (synons.length === 0) {
      setShowToast({ message: t("noSynonsData"), duration: 2000 });

      return;
    }

    const id: number = Math.floor(Math.random() * 10000);
    const fileName: string = `vex_db_${id}.vex`;
    const fileContents: string = JSON.stringify(synons);
    console.log({ platform });
    if (platform === "android") {
      await Filesystem.writeFile({
        path: fileName,
        data: fileContents,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      setShowToast({
        message: `${t("savedToFile")} "Document/Vex/${fileName}`,
        duration: 2000,
      });
    } else {
      const blob: Blob = new Blob([fileContents], { type: "application/json" });
      const url: string = URL.createObjectURL(blob);
      const link: HTMLAnchorElement = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [t]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => navigate("home")} color="light">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{t("functions")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {showToast && (
          <IonToast
            isOpen={!!showToast}
            message={showToast.message}
            duration={showToast.duration}
            onDidDismiss={() => setShowToast(null)}
          />
        )}

        <IonInput
          value={content}
          onIonChange={(e: any) => setContent(e.detail.value as string)}
          placeholder={t("placeholderText")}
          label="Type a message..."
          labelPlacement="floating"
          fill="outline"
          shape="round"
        />

        <IonButton
          expand="full"
          onClick={async () => {
            if (!content) {
              setShowToast({ message: t("fillField"), duration: 2000 });
              return;
            }
            if (!classifier) {
              setShowToast({
                message: t("classifierNotLoaded"),
                duration: 2000,
              });
              return;
            }
            
            const result = await classifier.categorize(content);
            if (!result) {
              setShowToast({ message: t("trainModelBefore"), duration: 2000 });
            } else {
              setShowToast({ message: result, duration: 2000 });
            }
          }}
          color="primary"
          shape="round"
        >
          <IonIcon icon={logoYoutube} slot="start" />
          {t("predict")}
        </IonButton>

        <IonButton
          expand="full"
          onClick={trainModel}
          color="secondary"
          shape="round"
          disabled={isTrainDisabled}
        >
          <IonIcon icon={trainSharp} slot="start" />
          {t("train")}
        </IonButton>

        <IonButton
          expand="full"
          onClick={getSynonsToFile}
          color="tertiary"
          shape="round"
        >
          <IonIcon icon={cloudUpload} slot="start" />
          {t("importData")}
        </IonButton>

        <IonButton
          expand="full"
          onClick={saveSynonsToFile}
          color="success"
          shape="round"
        >
          <IonIcon icon={saveOutline} slot="start" />
          {t("exportData")}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Train;
