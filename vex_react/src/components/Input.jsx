import React from "react";
import "./css/Input.css"
import { PaperAirplaneIcon } from '@primer/octicons-react'
const Input = ({setInput, input, sendMessage})=>{
  
  return (
    <div id="buttons">
    <img
    src="https://akveo.github.io/eva-icons/fill/png/128/plus-circle.png"
    className="icon"
    id="save"/>
    <div className="input">
    <input
    onChange={(e) => setInput(e.target.value)}
    type="text"
    placeholder="Type here..."
    value={input}
    id="text"/>
    
    <PaperAirplaneIcon
    size={30}
    className="icon"
    id="send"
    />
    </div>
    </div>)
    }
    
    export default Input