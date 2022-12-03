import React, { useState } from "react";
import "./css/Input.css"

const Input = ({send})=>{
  const [input, setInput] = useState("")
  
  return (
    <div id="buttons">
    <img
    src="https://akveo.github.io/eva-icons/fill/png/128/plus-circle.png"
    alt="a circle with a plus in the center"
    className="icon"
    id="save"/>
    <div className="input">
    <input
    onChange={(e) => setInput(e.target.value)}
    type="text"
    placeholder="Type here..."
    value={input}
    id="text"/>
    <img
    src="https://github.com/cookieukw/VexIA/blob/main/vex_react/src/images/send.png"
    className="icon"
    id="send"
    alt="a send message icon, resembling a spaceship "
    onClick={()=>{
    send(input,"user")
    setInput("")
    }}
    />
    </div>
    </div>)
}


export default Input