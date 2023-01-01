/* Imports */
import React, { useState, useEffect, useRef } from "react";
import "./css/Home.css";
import { message_style } from "../classes/styles";

/* Components */
import Content from "./Content";
import Dummy from "./Dummy";
import Utils from "../classes/Utils";
import ProfileBar from "./ProfileBar";
import ListView from "./ListView";
import Input from "./Input";
import Message from "./Message";
import ItemDrawer from "./ItemDrawer";
import { SwipeableDrawer, Divider, List } from "@mui/material";

const Home = () => {
  const util = new Utils();
  const [messages, setMessages] = useState([]);
  let end = useRef(null);
  const [drawer, setDrawer] = useState(false);

  const toggleDrawer = () => {
    setDrawer((prev) => !prev);
  };
  const goBottom = () => {
    if (messages.length <= 6) return;
    end.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(goBottom, [messages]);

  const send = (message, user, cb) => {
    if (message.trim().length === 0) return;
    const data = {
      msg: message,
      user,
      hour: util.getHours(),
    };
    let time = 0;
    if (user === "vex")
      time = message.length <= 120 ? message.length * 50 : 1100;

    setTimeout(() => {
      setMessages((prev) => {
        goBottom();
        if (cb) cb();
        return [...prev, data];
      });
    }, time);
  };

  return (
    <Content>
      <SwipeableDrawer
        variant={"temporary"}
        anchor={"right"}
        open={drawer}
        onClose={() => toggleDrawer()}
        onOpen={() => toggleDrawer()}
      >
        <List sx={{ width: "100%", bgcolor: "black" }}>
          <ItemDrawer>Test</ItemDrawer>
         <Divider/>
          <ItemDrawer>Test</ItemDrawer>
        </List>
      </SwipeableDrawer>
      <ProfileBar>Vex</ProfileBar>
      <ListView style={message_style}>
        {messages.map((item) => (
          <Message msg={item} />
        ))}
      </ListView>
      <Dummy refer={end} />
      <Input send={send} />
    </Content>
  );
};

export default Home;
