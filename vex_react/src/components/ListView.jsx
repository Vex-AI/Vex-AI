import "./css/ListView.css";
import React from "react";
import Message from "./Message";

const ListView = ({ messages, children }) => {
  return (
    <ul id="msg_content">
      {messages.map((item) => {
        return <Message msg={item} />;
      })}
      {children}
    </ul>
  );
};
export default ListView;
