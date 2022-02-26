import { EventEmitter } from "events";

export default class Socket {
  public ws: WebSocket;
  public ee: EventEmitter;

  constructor(ws = new WebSocket("ws://localhost:8080/ws"), ee = new EventEmitter()) {
    this.ws = ws;
    this.ee = ee;
    ws.onmessage = this.message.bind(this);
    ws.onopen = this.open.bind(this);
    ws.onclose = this.close.bind(this);
  }

  on(name: string, fn: (...args: any[]) => void) {
    this.ee.on(name, fn);
  }

  off(name: string, fn: (...args: any[]) => void) {
    this.ee.removeListener(name, fn);
  }

  open() {
    this.ee.emit("connect");
  }

  close() {
    this.ws.close();
    this.ee.emit("disconnect");
  }

  emit = (data: string) => {
    this.ws.send(data)
  }

  message = (e: MessageEvent<any>) => {
    try {
      this.ee.emit("message", e);
    } catch (err) {
      this.ee.emit("error", err);
      console.log(Date().toString() + ": ", err);
    }
  }
}
