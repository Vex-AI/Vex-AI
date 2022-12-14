/* Imports */
import React, { useState, useEffect, useRef } from "react";
import "./css/Home.css";

/* Components */
import Content from "./Content";
import Dummy from "./Dummy";
import Utils from "../classes/Utils";
import ProfileBar from "./ProfileBar";
import ListView from "./ListView";
import Input from "./Input";

const Home = () => {
  const util = new Utils();

  const [messages, setMessages] = useState(util.getSample("message"));
  let end = useRef(null);

  const goBottom = () => {
    if (messages.length <= 6) return;
    end.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(goBottom, [messages]);
  const send = async (message, user) => {
    if (message.trim().length === 0) return;
    const data = {
      msg: message,
      user,
      hour: util.getHours(),
    };
    let time = 0;
    if (user === "vex")
      time = message.length <= 150 ? message.length * 10 : 1100;

    setTimeout(() => {
      setMessages((prev) => {
        goBottom();
        return [...prev, data];
      });
    }, time);
  };

  return (
    <Content
      styles={{
        justifyContent: "center",
      }}
    >
      <ProfileBar>Vex</ProfileBar>
      <ListView messages={messages} />
      <Dummy ref={end} />
      <Input send={send} />
    </Content>
  );
};

export default Home;
