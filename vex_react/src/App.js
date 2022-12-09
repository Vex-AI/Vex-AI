import "./App.css";
import ProfileBar from "./components/ProfileBar";
import ListView from "./components/ListView";
import Input from "./components/Input";
import React, { useState, useEffect, useRef } from "react";
import Content from "./components/Content";
import Dummy from "./components/Dummy";
import Utils from "./classes/Utils";
const App = () => {
  let end = useRef(null);
  const util = new Utils();

  const [messages, setMessages] = useState(util.getSample("message"));

  const send = (message, user) => {
    // alert({ messages, user });
    if (message.trim().length === 0) return;

    const data = {
      msg: message,
      user,
      hour: "16:16", //util.getHours(),
    };
    setMessages((prev) => [...prev, data]);
  };

  useEffect(() => {
    window.scroll({
      behavior: "smooth",
      top: document.body.scrollHeight,
    });
    if (end.current)
      end.current.scrollIntoView({
        behavior: "smooth",
      });
  });

  return (
    <Content>
      <ProfileBar>Vex</ProfileBar>
      <ListView messages={messages} />
      {true && <Dummy ref={end} />}
      <Input send={send} />
    </Content>
  );
};

export default App;
