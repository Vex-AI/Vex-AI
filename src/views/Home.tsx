import { createRef, useCallback, useEffect, useRef, useState } from "react";
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
} from "@ionic/react";
import { menuController } from "@ionic/core/components";
import { send } from "ionicons/icons";
import { useLiveQuery } from "dexie-react-hooks";
import "./css/Home.css";
import Message from "../components/Message";
import { db, IMessage, IVexInfo } from "../classes/vexDB";
import { analyzer } from "../classes/analyzer";
import utils from "../classes/utils";
import SideMenu from "../components/SideMenu";
import DateSeparator from "../components/DateSeparator";
//@ts-ignore
import BayesClassifier from "bayes";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  async function openFirstMenu() {
    await menuController.open("sideMenu");
  }
  const classifierModel = useLiveQuery(() => db.classifier.get(1), []);
  const classifier: BayesClassifier = classifierModel?.classifierData
    ? BayesClassifier.fromJson(classifierModel?.classifierData)
    : BayesClassifier();

  const messages = useLiveQuery<IMessage[]>(() => db.messages.toArray(), []);
  const [text, setText] = useState<string>("");
  const { t } = useTranslation();
  const [status, setStatus] = useState<string>("on-line");
  const vexInfo = useLiveQuery<IVexInfo[]>(() => db.vexInfo.toArray(), []);
  const [isTrainDisabled, setIsTrainDisabled] = useState<boolean>(false);
  const contentRef = createRef<HTMLIonContentElement>();

  const sendVexMessage = useCallback((content: string) => {
    const copy = content;
    const num: number = copy.length;
    const timeout = num < 6 ? 1200 : num < 10 ? 1500 : num < 20 ? 2000 : 1800;
    const useBayes =
      localStorage.getItem("bayesEnabled") === null
        ? true
        : localStorage.getItem("bayesEnabled") ==="true"
        
    setIsTrainDisabled(true);
    setStatus("digitando...");
    {
      (async () => {
        let answer = "";
        if (useBayes) {
          console.log("with bayes");
          answer = await classifier.categorize(content);
          if (!answer) {
            sendMessage(t("trainModelBefore"), true);
            setStatus("on-line");
            scrollToBottom();

            openFirstMenu();
            setIsTrainDisabled(false);
          }
          return;
        } else {
          console.log("no bayes");
          answer = await analyzer(content);
        }

        setTimeout(async () => {
          sendMessage(answer ?? (await utils.getResponse()), true);
          setStatus("on-line");
          setIsTrainDisabled(false);
          scrollToBottom();
        }, timeout);
      })();
    }
  }, []);

  const sendMessage = (content: string, isVex: boolean) => {
    if (content.trim() === "") return;

    const newMessage: IMessage = {
      content,
      isVex,
      hour: new Date().toLocaleTimeString(),
      date: Date.now(),
    };
    scrollToBottom();

    db.messages.add(newMessage).catch((error) => {
      console.error("Error adding message to Dexie:", error);
    });
  };

  const shouldShowDateSeparator = (
    currentDate: number,
    previousDate: number
  ) => {
    const current = new Date(currentDate).toDateString();
    const previous = new Date(previousDate).toDateString();
    return current !== previous;
  };
  function scrollToBottom() {
    contentRef.current?.scrollToBottom(500);
  }

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>
              <div className="chat-contact">
                <img
                  src={vexInfo ? vexInfo[0]?.profileImage : "/Vex_320.png"}
                  alt="avatar"
                />
                <div className="chat-contact-details">
                  <p>{vexInfo ? vexInfo[0]?.name : "Vex"}</p>
                  <IonText color="medium">{status}</IonText>
                </div>
              </div>
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent ref={contentRef} className="chat-content">
          <IonList>
            {messages?.map((msg: IMessage, index: number) => {
              const previousMsg = messages[index - 1];
              const showSeparator =
                previousMsg &&
                shouldShowDateSeparator(msg.date, previousMsg.date);

              return (
                <div key={`${msg.date}-${index}`}>
                  {showSeparator && <DateSeparator date={msg.date} />}

                  <Message
                    content={msg.content}
                    isVex={msg.isVex}
                    hour={utils.formatHour(msg.hour)}
                    date={msg.date}
                  />
                </div>
              );
            })}
          </IonList>
        </IonContent>

        <IonFooter className="ion-padding">
          <IonInput
            clearInput={true}
            value={text}
            onIonInput={(event: React.ChangeEvent<HTMLInputElement>) => {
              setText(event.target.value);
            }}
            placeholder="Type a message..."
            label="Type a message..."
            labelPlacement="floating"
            fill="outline"
            shape="round"
            onKeyUp={(event: any) => {
              if (event.key === "Enter") {
                const copy = text;
                setText("");
                sendMessage(copy, false);
                sendVexMessage(copy);
              }
            }}
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
