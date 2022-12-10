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
    end.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(goBottom, [messages]);
  const send = async (message, user) => {
    // alert({ messages, user });
    if (message.trim().length === 0) return;
    const data = {
      msg: message,
      user,
      hour: util.getHours(),
    };
    let time = 0;
    if (user === "vex")
      time = message.length <= 150 ? message.length * 100 : 1100;

    setTimeout(() => {
      setMessages((prev) => [...prev, data]);
      goBottom();
    }, time);
  };

  useEffect(() => {
    /*window.scroll({
      behavior: "smooth",
      bottom: 0,
      left: 0,
    });*/
    /*window.scroll({
      behavior: "smooth",
      bottom: document.body.scrollHeight,
      left: 0,
    });*/
  });

  return (
    <Content
      styles={{
        justifyContent: "flex-start",
      }}
    >
      <ProfileBar>Vex</ProfileBar>
      <ListView messages={messages} />
      {messages.length >= 7 && <Dummy ref={end} />}
      <Input send={send} />
    </Content>
  );
};

export default Home;
