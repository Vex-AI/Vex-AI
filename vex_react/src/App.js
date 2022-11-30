import './App.css';
import ProfileBar from "./components/ProfileBar"
import ListView from "./components/ListView"
import Input from "./components/Input"
import React, { useState } from 'react';

const App = ()=> {
const [messages, setMessages] = useState([{
  "msg":"test",
  "user":"vex",
  "hour":"22:22"
}])

const [input, setInput] = useState("")
const sendMessage = (message, user, hour)=>{
  const data = {
    message,
    user,
    hour
  }
  setInput(...input, data)
}
  return (
    <div id="content">
    <ProfileBar>Vex</ProfileBar>
    <ListView messages={messages}/>
    <Input setInput={setInput} input={input} sendMessage={sendMessage}/>
    </div>
  );
}
export default App
