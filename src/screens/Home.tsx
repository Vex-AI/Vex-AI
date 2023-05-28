import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import {
  addMessage,
  setIsTyping,
  setMessages,
  getAllMessages,
  deleteMessage,
} from "../store/reducers/vexReducer";
import { RootState } from "../store/";
import { Analyzer } from "../classes/analyzer";
import StarsBG from "../components/StarsBG";
import Swipe from "../components/Swipe";
import List from "../components/List";
import MessageItem from "../components/MessageItem";
import Container from "../components/Container";
import ProfileBar from "../components/ProfileBar";
import "react-toastify/dist/ReactToastify.css";
import Input from "../components/Input";
import TypeBar from "../components/TypeBar";
import styles from "../index.css?inline";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { IoSend } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { v4 } from "uuid";
import { useNavigate, NavigateFunction } from "react-router-dom";

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
  console.log(0)
  const navigate: NavigateFunction = useNavigate();
  const endRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>("");

  const toggleType = useCallback(() => {
    dispatch(setIsTyping());
  }, [dispatch]);

  const sendMessage = useCallback(
    (content: string, isVex: boolean) => {
      copy = content;
      const num: number = copy.length;
      if (isVex) toggleType();
      setTimeout(
        () => {
          dispatch(
            addMessage({
              content,
              isVex,
              id: v4(),
            })
          );
          if (isVex) toggleType();
        },
        isVex ? (num < 6 ? 1200 : num < 10 ? 1500 : num < 20 ? 2000 : 1800) : 0
      );
    },
    [dispatch, toggleType]
  );

  useEffect(() => {
    const fetchMessages = async () => {
      const mess: IMessage[] = await getAllMessages();
      dispatch(setMessages(mess));
    };

    fetchMessages();
  }, [dispatch]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);
    },
    []
  );

  const handleSendClick = useCallback(() => {
    if (!text) return;
    sendMessage(text, false);
    setText("");

    const analyzeAndSendMessage = async () => {
      const answer: string = await Analyzer(copy);
      sendMessage(answer, true);
    };

    analyzeAndSendMessage();
  }, [text, copy, sendMessage]);

  return (
    <Container>
      <ProfileBar vexName={vexName} />
      <List style={{ margin: "90px 0 20px" }}>
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
          label="Write a message"
          variant="outlined"
          value={text}
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
