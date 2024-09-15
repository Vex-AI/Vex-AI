import { createRef, useCallback, useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonList,
  IonFooter,
  IonText,
  IonMenuButton,
} from "@ionic/react";
import { send } from "ionicons/icons";
import { useLiveQuery } from "dexie-react-hooks";
import "./css/Home.css";
import Message from "../components/Message";
import { db, IMessage, IVexInfo } from "../classes/vexDB";
import { analyzer } from "../classes/analyzer";
import utils from "../classes/utils";
import SideMenu from "../components/SideMenu";
import DateSeparator from "../components/DateSeparator";

interface Style {
  borderTopRightRadius: number;
  borderTopLeftRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  borderColor: string;
  borderWidth: number;
  backgroundColor: string;
  textColor: string;
}

const vexStyle: Style = localStorage.getItem("vexStyle")
  ? JSON.parse(localStorage.getItem("vexStyle") as string)
  : {};

const userStyle: Style = localStorage.getItem("userStyle")
  ? JSON.parse(localStorage.getItem("userStyle") as string)
  : {};

const Home: React.FC = () => {
  const [classifier, setClassifier] = useState<any>(null);
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<string>("on-line");
  const messages = useLiveQuery(() => db.messages.toArray(), []);
  const vexInfo = useLiveQuery<IVexInfo[]>(() => db.vexInfo.toArray(), []);
  const [isTrainDisabled, setIsTrainDisabled] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement>(null);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);
    },
    []
  );
  
  const sendVexMessage = useCallback((content: string) => {
    const copy = content;
    const num: number = copy.length;
    const timeout = num < 6 ? 1200 : num < 10 ? 1500 : num < 20 ? 2000 : 1800;
    const useBayes = localStorage.getItem("bayes") ? true : false;
    setIsTrainDisabled(true);
    setStatus("digitando...");
    {
      (async () => {
        let answer = "";
        if (useBayes) {
          console.log("with bayes");
          answer = await classifier.categorize(content);
          if (!answer) return sendMessage("trains your model first", true);
        } else {
          console.log("no bayes");
          answer = await analyzer(content);
        }

        setTimeout(async () => {
          sendMessage(answer ?? (await utils.getResponse()), true);
          setStatus("on-line");
          setIsTrainDisabled(false);
          
        }, timeout);
      })();
    }
  }, []);

  const sendMessage = async (content: string, isVex: boolean) => {
    if (content.trim() === "") return;
    const newMessage: IMessage = {
      content,
      isVex,
      hour: new Date().toLocaleTimeString(),
      date: Date.now(),
    };

    await db.messages.add(newMessage);
   
    setText("");
  };

  const shouldShowDateSeparator = (
    currentDate: number,
    previousDate: number
  ) => {
    const current = new Date(currentDate).toDateString();
    const previous = new Date(previousDate).toDateString();
    return current !== previous;
  };
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  });
  return (
    <IonPage id="main-content">
      <SideMenu />
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>
            <div className="chat-contact">
              <img src={vexInfo ? vexInfo[0]?.profileImage : ""} alt="avatar" />
              <div className="chat-contact-details">
                <p>{vexInfo ? vexInfo[0]?.name : "Vex"}</p>
                <IonText color="medium">{status}</IonText>
              </div>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent  className="chat-content">
        <IonList>
          {messages?.reduce((acc: JSX.Element[], msg, index) => {
            const previousMsg = messages[index - 1];
            const showSeparator =
              previousMsg &&
              shouldShowDateSeparator(msg.date, previousMsg.date);

            if (showSeparator) {
              acc.push(
                <DateSeparator key={`separator-${index}`} date={msg.date} />
              );
            }

            acc.push(
              <Message
                key={index}
                content={msg.content}
                isVex={msg.isVex}
                hour={utils.formatHour(msg.hour)}
                date={msg.date}
              />
            );

            return acc;
          }, [])}
        </IonList>
        <div ref={endRef} />
      </IonContent>

      <IonFooter>
        <IonToolbar className="toolbar">
          <IonInput
            value={text}
            onIonChange={handleInputChange}
            placeholder="Type a message..."
            label="Type a message..."
            labelPlacement="floating"
            fill="outline"
            shape="round"
            onKeyUp={(event: any) => {
              if (event.key === "Enter") {
                sendMessage(text, false);
                sendVexMessage(text);
              }
            }}
          />
          <IonButton
            disabled={isTrainDisabled}
            onClick={() => {
              sendMessage(text, false);
              sendVexMessage(text);
            }}
            slot="end"
            fill="clear"
            className="send-button"
          >
            <IonIcon icon={send} color="light" />
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
