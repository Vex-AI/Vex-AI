import './css/Message.css';
import './css/anim.css'
import React from 'react';

const Message = ({msg})=> {
  return (
    <li className={`msg ${msg.user}`}>
    <span className="msg_text">{msg.msg}</span>
    <span className="data">{msg.hour}</span>
    
    </li>
    );
}
export default Message ;
