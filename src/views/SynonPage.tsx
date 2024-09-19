import { useState, useCallback } from "react";
import { v4 } from "uuid";
import { useTranslation } from "react-i18next";
import { db, ISynon } from "../classes/vexDB";
import Synon from "../components/Synon";
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
  useIonRouter,
  IonAlert,
  IonItem,
} from "@ionic/react";
import { arrowBack, addCircleOutline, trash, school } from "ionicons/icons";
import ReplyModal from "../components/ReplyModal";
import WordModal from "../components/WordModal";
import { useLiveQuery } from "dexie-react-hooks";

const SynonPage: React.FC = () => {
  const { t } = useTranslation();
  const [word, setWord] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [synonID, setSynonID] = useState<string>("");
  const [wordModal, setWordModal] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>("");
  const [replyModal, setReplyModal] = useState<boolean>(false);
  const [newReply, setNewReply] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showToast, setShowToast] = useState<{
    message: string;
    duration?: number;
  } | null>({ message: "", duration: 2000 });

  const synons = useLiveQuery<ISynon[]>(() => db.synons.toArray(), []);
  const router = useIonRouter();
  const navigate = (path: string) => {
    router.push(path, "root", "replace");
  };
  const handleAddSynon = useCallback(async () => {
    if (!word) return setShowToast({ message: t("write_word") });
    if (!reply) return setShowToast({ message: t("write_reply") });

    const existingSynon = await db.synons
      .where("word")
      .equals(word.trim())
      .first();
    if (existingSynon)
      return setShowToast({ message: t("already_registered_word") });

    await db.synons.add({
      word: [word.trim()],
      reply: [reply],
      id: v4(),
    });
    setWord("");
    setReply("");
  }, [word, reply, t]);

  const handleDeleteSynon = async (id: string) => {
    await db.synons.delete(id);
  };

  const handleAddWord = async () => {
    if (newWord.trim().length === 0)
      return setShowToast({ message: t("write_new_word") });

    const synon = await db.synons.get(synonID);
    if (synon) {
      await db.synons.update(synonID, {
        word: [...synon.word, newWord.trim()],
      });
      setNewWord("");
    }
  };

  const handleAddReply = async () => {
    if (newReply.trim().length === 0)
      return setShowToast({ message: t("write_new_reply") });

    const synon = await db.synons.get(synonID);
    if (synon) {
      await db.synons.update(synonID, {
        reply: [...synon.reply, newReply.trim()],
      });
      setNewReply("");
    }
  };

  const handleDeleteWord = async (wordToDelete: string) => {
    const synon = await db.synons.get(synonID);
    if (synon) {
      await db.synons.update(synonID, {
        word: synon.word.filter((w) => w !== wordToDelete),
      });
    }
  };

  const handleDeleteReply = async (replyToDelete: string) => {
    const synon = await db.synons.get(synonID);
    if (synon) {
      await db.synons.update(synonID, {
        reply: synon.reply.filter((r) => r !== replyToDelete),
      });
    }
  };

  const handleDeleteAllSynons = async () => {
    try {
      await db.synons.clear();
      setShowToast({ message: t("deleteALlSynonsSucess"), duration: 2000 });
    } catch (error) {
      setShowToast({
        message: `${t("deleteAllSynonsFail")}: ${error}`,
        duration: 2000,
      });
    }
  };
  const handleDoubleClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleDeleteAllSynons();
    } else {
      setShowToast({ message: t("deleteAllSynonsClick"), duration: 2000 });

      const timeout = setTimeout(() => setClickTimeout(null), 300);
      setClickTimeout(timeout);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              onClick={() => {
                navigate("home");
              }}
              content={t("back")}
              color="light"
            >
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          clearInput={true}
          style={{ marginBottom: "1rem" }}
          labelPlacement="floating"
          label={t("write_word")}
          placeholder={t("write_new_word")}
          fill="outline"
          shape="round"
          value={word}
          onIonChange={(e: any) => setWord(e.detail.value)}
        />
        <IonInput
          clearInput={true}
          labelPlacement="floating"
          label={t("write_reply")}
          placeholder={t("write_new_reply")}
          fill="outline"
          shape="round"
          value={reply}
          onIonChange={(e: any) => setReply(e.detail.value)}
        />
        <IonButton
          className="ion-padding"
          onClick={handleAddSynon}
          color="tertiary"
          expand="full"
          shape="round"
        >
          <IonIcon icon={addCircleOutline} />
          {t("add")}
        </IonButton>
        <IonButton
         className="ion-padding"
          shape="round"
          color="primary"
          expand="full"
          onClick={() => navigate("/functions")}
        >
          <IonIcon color="light" slot="start" icon={school} />
          {t("functions")}
        </IonButton>
        <IonButton
          className="ion-padding"
          shape="round"
          color="danger"
          expand="full"
          onClick={handleDoubleClick}
        >
          <IonIcon icon={trash} />
          {t("deleteAllSynons")}
        </IonButton>{" "}
        <IonList>
          {synons?.map((syn, index) => (
            <Synon
              key={syn.id}
              syn={syn}
              onDeleteSynon={() => handleDeleteSynon(syn.id)}
              onAddWordSynon={() => {
                setSynonID(syn.id);
                setWordModal(true);
              }}
              onAddReplySynon={() => {
                setSynonID(syn.id);
                setReplyModal(true);
              }}
              index={index}
            />
          ))}
        </IonList>
        <WordModal
          wordModal={wordModal}
          setWordModal={setWordModal}
          newWord={newWord}
          setNewWord={setNewWord}
          handleAddWord={handleAddWord}
          handleDeleteWord={handleDeleteWord}
          synonID={synonID}
          synons={synons ?? []}
        />
        <ReplyModal
          replyModal={replyModal}
          setReplyModal={setReplyModal}
          newReply={newReply}
          setNewReply={setNewReply}
          handleAddReply={handleAddReply}
          handleDeleteReply={handleDeleteReply}
          synonID={synonID}
          synons={synons ?? []}
        />
        {showToast && (
          <IonToast
            isOpen={!!showToast}
            message={showToast.message}
            duration={showToast.duration}
            onDidDismiss={() => setShowToast(null)}
          />
        )}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Confirmação"}
          message={"Todos os sinônimos serão deletados. Deseja continuar?"}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => console.log("Operação cancelada"),
            },
            {
              text: "Confirmar",
              handler: () => handleDeleteAllSynons(),
            },
          ]}
        />
      </IonContent>
      {showToast && (
        <IonToast
          isOpen={!!showToast}
          message={showToast.message}
          duration={showToast.duration}
          onDidDismiss={() => setShowToast(null)}
        />
      )}
    </IonPage>
  );
};

export default SynonPage;
