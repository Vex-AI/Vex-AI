// Home.tsx - VERSÃO FINAL E LIMPA

import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonInput,
  IonList,
  IonFooter,
  IonText,
  IonMenuButton,
  IonThumbnail,
  IonSkeletonText,
  IonImg,
  useIonViewWillEnter,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TypingIndicator from "@/components/TypingIndicator";

import { send } from "ionicons/icons";
import { useLiveQuery } from "dexie-react-hooks";
import Message from "@/components/Message";
import { db } from "@/lib/vexDB";
// O 'analyzer' é importado pelo nosso hook, não precisamos mais dele diretamente aqui.
import SideMenu from "@/components/SideMenu";
import DateSeparator from "@/components/DateSeparator";
// NÂO PRECISAMOS MAIS DO BAYESCLASSIFIER
// import BayesClassifier from "bayes";

import { useTranslation } from "react-i18next";
import { initializeAdmob, showInterstitial } from "@/lib/admob";
import { scheduleRandomNotification } from "@/lib/notifications";
import { monitorAppUsage, scheduleStreakReminder } from "@/lib/streaks";
import { LocalNotifications } from "@capacitor/local-notifications";
import { useNavigate } from "react-router";
import { formatHour, scrollToBottom, sendMessage } from "@/lib/utils";
import { useVexMessage } from "@/hooks/useVexMessage"; // <<< NOSSO NOVO HOOK

const Home: React.FC = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const messages = useLiveQuery(() => db.messages.toArray(), []);

  // const classifierModel = useLiveQuery(() => db.classifier.get(1), []);

  const vexInfo = useLiveQuery(() => db.vexInfo.toArray(), []);
  const [text, setText] = useState<string>("");

  const { t } = useTranslation();

  // O hook agora é muito mais simples de usar!
  const { sendVexMessage, isProcessing, status } = useVexMessage();

  // REMOVEMOS COMPLETAMENTE O useEffect DE TREINAMENTO.
  // O treinamento agora acontece uma vez, dentro do 'initializeAnalyzer'.
  // O componente da UI não precisa saber sobre isso.

  const go = (path: string) => {
    navigate(path, { replace: true });
  };

  const handleSendMessage = () => {
    const messageToSend = text.trim();
    if (!messageToSend) return;

    setText(""); // Limpa o input imediatamente
    sendMessage(messageToSend, false); // Mostra a mensagem do usuário na tela
    sendVexMessage(messageToSend); // Envia para a IA processar
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Este bloco de inicialização está ótimo!
    if (!localStorage.getItem("language")) {
      go("/language");
    }
    monitorAppUsage();
    scheduleStreakReminder();
    scheduleRandomNotification();
    if (!localStorage.getItem("notification")) {
      LocalNotifications.checkPermissions().then((result) => {
        if (result.display !== "granted") go("/consent");
      });
    }
  }, []);

  useIonViewWillEnter(() => {
    initializeAdmob();
    showInterstitial();
  });

  useEffect(() => {
    if (messages && contentRef.current) {
      scrollToBottom(contentRef);
    }
  }, [messages]);

  useEffect(() => {
    const checkAndSeedVexInfo = async () => {
      // Conta quantos registros existem na tabela vexInfo.
      const count = await db.vexInfo.count();
      // Se não houver nenhum (count === 0), adiciona o padrão.
      if (count === 0) {
        console.log("Dados do Vex não encontrados, inserindo dados padrão...");
        await db.vexInfo.add({
          //id: 1, // Adicionamos um ID fixo
          name: "Vex",
          profileImage: "/Vex_320.png",
        });
      }
    };
    const checkAndSeedIntents = async () => {
      const count = await db.intents.count();
      if (count === 0) {
        console.log("Populando intenções iniciais com o novo DB...");

        // Adiciona todas as intenções ao banco de dados
       
        console.log("Novas intenções populadas com sucesso!");
      }
    };
    checkAndSeedIntents();
    checkAndSeedVexInfo();
  }, []); // O array vazio [] garante que isso só rode uma vez quando o componente montar.

  useEffect(() => {
    // Função para garantir que os dados do Vex existam
    const checkAndSeedVexInfo = async () => {
      const count = await db.vexInfo.count();
      if (count === 0) {
        console.log("Populando dados do Vex...");
        await db.vexInfo.add({
          //id: 1,
          name: "Vex",
          profileImage: "/Vex_320.png",
        });
      }
    };

    // Função para garantir que as intenções básicas existam
    const checkAndSeedIntents = async () => {
      const count = await db.intents.count();
      if (count === 0) {
        console.log("Populando intenções iniciais...");
        // Usando uma função auxiliar para facilitar
        const addIntent = (
          name: string,
          trainingPhrases: string[],
          responses: string[]
        ) => {
          return db.intents.add({ name, trainingPhrases, responses });
        };

        // Adiciona as intenções aqui
        await Promise.all([
          addIntent(
            "saudacao",
            ["oi", "olá", "e aí", "alô", "bom dia", "boa tarde", "boa noite"],
            ["Olá! Como posso te ajudar hoje?", "Oi, tudo bem?"]
          ),
          addIntent(
            "despedida",
            ["tchau", "adeus", "até mais", "até logo", "falou"],
            ["Até mais! Se precisar de algo, é só chamar.", "Tchau, tchau!"]
          ),
          addIntent(
            "agradecimento",
            ["obrigado", "obrigada", "valeu", "vlw", "obg"],
            ["De nada! 😊", "Não há de quê!", "Qualquer coisa, estou por aqui!"]
          ),
        ]);
      }
    };

    // Roda as duas verificações
    checkAndSeedVexInfo();
    checkAndSeedIntents();
  }, []); // O array vazio garante que isso só rode uma vez.

  // Dentro do useEffect em Home.tsx ou page.tsx

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        <IonHeader>
          {/* O seu código do Header está perfeito, sem necessidade de alteração */}
          <IonToolbar>
            <IonButtons slot="end">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>
              <div className="chat-contact">
                <IonThumbnail slot="start">
                  {!vexInfo ? (
                    <IonSkeletonText animated />
                  ) : (
                    <IonImg src={vexInfo[0]?.profileImage ?? "/Vex_320.png"} />
                  )}
                </IonThumbnail>
                <div className="chat-contact-details">
                  <p>{vexInfo ? vexInfo[0]?.name : "Vex"}</p>
                  <div style={{ position: "relative", height: "20px" }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={status}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        style={{ position: "absolute" }}
                      >
                        <IonText color="medium">{status}</IonText>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent ref={contentRef} className="chat-content">
          <IonList>
            {messages?.map((msg, i) => {
              const prev = messages[i - 1];
              const showDate =
                prev &&
                new Date(msg.date).toDateString() !==
                  new Date(prev.date).toDateString();
              return (
                <div key={msg.id ?? `${msg.date}-${i}`}>
                  {showDate && <DateSeparator date={msg.date} />}
                  <Message
                    content={msg.content}
                    isVex={msg.isVex}
                    hour={formatHour(msg.hour)}
                    date={msg.date}
                    onClose={() => msg.id && db.messages.delete(msg.id)}
                  />
                </div>
              );
            })}
          </IonList>
          {isProcessing && <TypingIndicator />}
        </IonContent>

        <IonFooter className="ion-padding">
          <IonInput
            clearInput
            value={text}
            onIonInput={(e: any) => setText(e.target.value)}
            placeholder={t("write_message")}
            labelPlacement="floating"
            fill="outline"
            shape="round"
            onKeyUp={handleKeyUp}
            disabled={isProcessing} // Desabilitado enquanto Vex está "digitando"
          >
            <IonIcon
              onClick={handleSendMessage}
              slot="end"
              icon={send}
              color="light"
              style={{ cursor: "pointer" }}
            />
          </IonInput>
        </IonFooter>
      </IonPage>
    </>
  );
};

export default Home;
