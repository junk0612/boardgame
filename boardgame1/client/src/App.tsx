import React from "react";
import Socket from "./socket";
import SendForm from "./SendForm";

const App = () => {
  const [logs, setLogs] = React.useState(new Array<string>());
  const [socket] = React.useState(new Socket());

  React.useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", receiveMessage);

    return () => {
      socket.close();
    }
  }, [])

  const onConnect = () => {
    logs.push("onConnect.")
    setLogs([...logs])
  };

  const onDisconnect = () => {
    logs.push("onDisconnect.")
    setLogs([...logs])
  };

  const receiveMessage = (e: {data: string}) => {
    logs.push(e.data)
    setLogs([...logs])
  }

  return (
    <div>
      <h1>Go×React Chatサンプル</h1>
      <SendForm socket={socket} />
      <ul>
        {logs.map((log: string, i: number) => {
          return <li key={i}>{log}</li>
        })}
      </ul>
    </div>
  );
}

export default App;
