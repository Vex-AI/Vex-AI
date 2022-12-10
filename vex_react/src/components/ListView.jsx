import "./css/ListView.css";
import { useEffect, useRef } from "react";
import Message from "./Message";
import Dummy from "./Dummy";

const ListView = ({ messages, children }) => {
  return (
    <ul
      id="msg_content"
   
    >
      {messages.map((item) => {
        return <Message msg={item} />;
      })}
      {children}
    </ul>
  );
};
export default ListView;
