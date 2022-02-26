package main

import (
    "fmt"
    "log"
    "net/http"

    "golang.org/x/net/websocket"
)

func main() {
    http.Handle("/ws", websocket.Handler(msgHandler))

    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal(err)
    }
}

func msgHandler(ws *websocket.Conn) {
    defer ws.Close()

    // 初回のメッセージを送信
    err := websocket.Message.Send(ws, "こんにちは！ :)")
    if err != nil {
        log.Fatalln(err)
    }

    for {
        // メッセージを受信する
        msg := ""
        err = websocket.Message.Receive(ws, &msg)
        if err != nil {
            log.Fatalln(err)
        }

        // メッセージを返信する
        err := websocket.Message.Send(ws, fmt.Sprintf(`%q というメッセージを受け取りました。`, msg))
        if err != nil {
            log.Fatalln(err)
        }
    }
}
