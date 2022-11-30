import './css/ListView.css';
import React from 'react';
import Message from "./Message"

const ListView = ({messages})=> {
  
  return (
    <ul id="msg_content">
   {messages.map(item=>{
     return(<Message msg={item}/>)
   })}
    </ul>
  );
}
export default ListView
