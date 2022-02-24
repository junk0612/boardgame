package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"golang.org/x/net/WebSocket"
)

var dataCh chan Data

type Data struct {
	MyData string `json:"myData"`
}

func main() {
	dataCh = make(chan Data, 1)

	http.HandleFunc("/", plotHandle)
	http.Handle("/data", WebSocket.Handler(dataHandler))
	err := http.ListenAndServe(":8888", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func plotHandle(w http.ResponseWriter, r *http.Request) {
	go func() {
		for {
			dataCh <- Data{strconv.Itoa(rand.Int())}
			time.Sleep(500 * time.Millisecond)
		}
	}()
	fmt.Fprintf(w, page)
}

func dataHandler(ws *WebSocket.Conn) {
	for data := range dataCh {
		err := WebSocket.JSON.Send(ws, data)
		if err != nil {
			log.Printf("error sending data: %v\n", err)
			return
		}
	}
}

const page = `
<html>
  <head>
      <title>Hello WebSocket</title>

      <script type="text/javascript">
      var sock = null;
      var myData = "";
      function update() {
          var p1 = document.getElementById("my-data-plot");
          p1.innerHTML = myData;
      };
      window.onload = function() {
          sock = new WebSocket("ws://"+location.host+"/data");
          sock.onmessage = function(event) {
              var data = JSON.parse(event.data);
              myData = data.myData;
              update();
          };
      };
      </script>
  </head>
  <body>
      <div id="header">
          <h1>Hello WebSocket</h1>
      </div>
      <div id="content">
          <div id="my-data-plot"></div>
      </div>
  </body>
</html>
`
