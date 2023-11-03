import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import util from "../classes/utils";
import { useTranslation } from "react-i18next";
import {
  addMessage,
  setIsTyping,
  setMessages,
  deleteMessage,
} from "../store/reducers/vexReducer";
import { db } from "../classes/vexDB";
import { RootState } from "../store/";
import { analyzer } from "../classes/analyzer";
import StarsBG from "../components/StarsBG";
import Swipe from "../components/Swipe";
import List from "../components/List";
import MessageItem from "../components/MessageItem";
import Container from "../components/Container";
import ProfileBar from "../components/ProfileBar";
import "react-toastify/dist/ReactToastify.css";
import Input from "../components/Input";
import TypeBar from "../components/TypeBar";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Hidden from "@mui/material/Hidden";
import { IoSend } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import MenuIcon from "@mui/icons-material/Menu";
import { v4 } from "uuid";
import { useNavigate, NavigateFunction } from "react-router-dom";
const { log } = console;

interface IMessage {
  content: string;
  isVex: boolean;
  hour: string;
  date: string;
  id: string;
}

interface HomeProps {
  messageList: IMessage[];
  dispatch: Dispatch;
  isTyping: boolean;
  vexName: string;
}

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

let copy: string = "";

const l = console.log;

const vexStyle: Style = localStorage.getItem("vexStyle")
  ? JSON.parse(localStorage.getItem("vexStyle") as string)
  : {};

const userStyle: Style = localStorage.getItem("userStyle")
  ? JSON.parse(localStorage.getItem("userStyle") as string)
  : {};

const Home: React.FC<HomeProps> = ({
  messageList,
  dispatch,
  isTyping,
  vexName,
}) => {
  l(0);
  const navigate: NavigateFunction = useNavigate();

  const { t } = useTranslation();

  const endRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState<string>("");

  const toggleType = useCallback(
    (toggle?: boolean) => {
      log(5);
      dispatch(setIsTyping({ payload: null }));
    },
    [dispatch, isTyping]
  );

  useEffect(() => {
    const fetchMessages = async () => {
      const mess: IMessage[] = await db.getAllMessages();
      dispatch(setMessages(mess));
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);
    },
    []
  );
  const sendUserMessage = useCallback(
    (content: string) => {
      dispatch(
        addMessage({
          content,
          isVex: false,
          id: v4(),
        })
      );
    },
    [dispatch]
  );

  const sendVexMessage = useCallback(
    (content: string) => {
      copy = content;
      const num: number = copy.length;
      toggleType();

      setTimeout(
        () => {
          dispatch(
            addMessage({
              content,
              isVex: true,
              id: v4(),
            })
          );
          toggleType();
        },
        num < 6 ? 1200 : num < 10 ? 1500 : num < 20 ? 2000 : 1800
      );
    },
    [dispatch]
  );

  const handleSendClick = useCallback(() => {
    if (!text) return;
    sendUserMessage(text);
    setText("");
    (async () => {
      const answer = await analyzer(text);
      sendVexMessage(answer ?? (await util.getResponse()));
    })();
  }, [text, sendVexMessage, sendUserMessage]);

  return (
    <Container>
      <ProfileBar vexName={vexName} />
      <List
        style={{
          margin: "90px 0 20px",
        }}
      >
        {messageList.map((message: IMessage) => (
          <MessageItem
            styles={message.isVex ? vexStyle : userStyle}
            key={message.id}
            message={message}
            onItemDelete={() => {
              dispatch(deleteMessage(message.id));
            }}
          />
        ))}
      </List>
      <TypeBar />
      <StarsBG />
      <Input>
        <IconButton
          onClick={() => navigate("/synon")}
          color="primary"
          style={{ padding: "5px 10px 5px 10px" }}
          aria-label="Adicionar"
        >
          <MdAdd size={28} />
        </IconButton>
        <TextField
          label={t("write_message")}
          variant="outlined"
          value={text}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              handleSendClick();
            }
          }}
          onChange={handleInputChange}
          fullWidth
        />
        <IconButton
          style={{ padding: "5px 10px 5px 10px" }}
          onClick={handleSendClick}
        >
          <IoSend color={"#fff"} />
        </IconButton>
      </Input>
      <div ref={endRef} />
    </Container>
  );
};

export default connect((state: RootState) => ({
  messageList: state.vex.messageList,
  isTyping: state.vex.isTyping,
  vexName: state.vex.vexName,
}))(Home);
