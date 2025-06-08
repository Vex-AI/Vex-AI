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
import { analyzer } from "@/lib/analyzer";
import SideMenu from "@/components/SideMenu";
import DateSeparator from "@/components/DateSeparator";
//@ts-ignore
import BayesClassifier from "bayes";

import { useTranslation } from "react-i18next";
import { initializeAdmob, showInterstitial } from "@/lib/admob";
import { scheduleRandomNotification } from "@/lib/notifications";
import { monitorAppUsage, scheduleStreakReminder } from "@/lib/streaks";
import { LocalNotifications } from "@capacitor/local-notifications";
import { useNavigate } from "react-router";
import { formatHour, scrollToBottom, sendMessage } from "@/lib/utils";
import { useVexMessage } from "@/hooks/useVexMessage";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const messages = useLiveQuery(() => db.messages.toArray(), []);
  const classifierModel = useLiveQuery(() => db.classifier.get(1), []);
  const vexInfo = useLiveQuery(() => db.vexInfo.toArray(), []);
  const [text, setText] = useState<string>("");

  const { t } = useTranslation();

  let classifier = BayesClassifier();
  const { sendVexMessage, isTrainDisabled, status } = useVexMessage({
    classifier,
    analyzer,
  });

  // Train the model when user change data
  useEffect(() => {
    const trainFromMessages = async () => {
      const msgs = await db.messages.toArray();
      const pairs = msgs
        .filter((msg) => !msg.isVex)
        .map(async (msg) => {
          const reply = msgs.find((r) => r.date > msg.date && r.isVex);
          if (reply) classifier.learn(msg.content, reply.content);
        });
      await Promise.all(pairs);
      const data = classifier.toJson();
      await db.classifier.put({ id: 1, classifierData: data });
    };
    trainFromMessages();
  }, []);

  if (classifierModel?.classifierData) {
    classifier = BayesClassifier.fromJson(classifierModel.classifierData);
  }

  const go = (path: string) => {
    navigate(path, { replace: true });
  };

  const handleKeyUp = (e: any) => {
    if (e.key === "Enter") {
      const copy = text;
      setText("");
      sendMessage(copy, false);
      sendVexMessage(copy);
    }
  };

  useEffect(() => {
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

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        <IonHeader>
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
                  <div
                    style={{
                      position: "relative",
                      height: "20px",
                    }}
                  >
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
          {status !== "on-line" && <TypingIndicator />}
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
            disabled={isTrainDisabled}
          >
            <IonIcon
              onClick={() => {
                const copy = text;
                setText("");
                sendMessage(copy, false);
                sendVexMessage(copy);
              }}
              slot="end"
              icon={send}
              color="light"
            />
          </IonInput>
        </IonFooter>
      </IonPage>
    </>
  );
};

export default Home;
