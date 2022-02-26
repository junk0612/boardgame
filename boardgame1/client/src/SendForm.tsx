import React, { Component } from "react";
import ReactDOM from "react-dom";
import Socket from "./socket";

const SendForm = (props: {socket: Socket}) => {
  const [message, setMessage] = React.useState("");

  const sendMessage = () => {
    props.socket.emit(message);
    setMessage("");
  }

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  return (
    <div>
      <input value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeMessage(e)} size={64} />
      <button onClick={sendMessage} disabled={message.length === 0}>Send</button>
    </div>
  );
}

export default SendForm;
