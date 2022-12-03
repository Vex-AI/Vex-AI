import "./App.css";
import ProfileBar from "./components/ProfileBar";
import ListView from "./components/ListView";
import Input from "./components/Input";
import React, { useState, useEffect, useRef } from "react";
import Content from "./components/Content";
import Dummy from "./components/Dummy";

const App = () => {
  let end = useRef(null);

  const [messages, setMessages] = useState([
    {
      msg: "test",
      user: "vex",
      hour: getHours(),
    },
    {
      msg: "test",
      user: "vex",
      hour: getHours(),
    },
    {
      msg: "test",
      user: "vex",
      hour: getHours(),
    },
    {
      msg: "test",
      user: "vex",
      hour: getHours(),
    },
    {
      msg: "test",
      user: "vex",
      hour: getHours(),
    },
    {
      msg: "test",
      user: "vex",
      hour: getHours(),
    },
  ]);

  const send = (message, user) => {
    if (message.trim().length === 0) return;

    const data = {
      msg: message,
      user,
      hour: getHours(),
    };
    setMessages([...messages, data]);
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

const getHours = () => {
  let date = new Date();
  return `${date.getHours()}:${date.getMinutes()}`;
};

export default App;
