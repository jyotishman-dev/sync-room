
import express, { type Request } from "express"
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";


const app = express()

const httpServer = createServer(app);

const wss = new WebSocketServer({ server: httpServer });



app.use(express.json());


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Service is running",
  });
});




wss.on("connection", (ws: WebSocket, req : Request)=>{
    console.log(`new wss socket connected `)

 console.log("Remote Address:", req.socket.remoteAddress);
    console.log("Remote Port:", req.socket.remotePort);
    console.log("Ready State:", ws.readyState);
    console.log("Protocol:", ws.protocol);
    ws.send(JSON.stringify({
        type : "connection",
        message : "Connected to websocket server"
    }))


    ws.on("message", (data)=> {
        const message = data.toString();

        console.log(`received`, message)
  
   ws.send(JSON.stringify({
      type: "response",
      message: `Server received: ${message}`,
    }));


  
    })


    ws.on("close", ()=>{
        console.log('client disconnected')
    })

    ws.on("error", (error)=>{
        console.log('error on serever ws side', error)
    })
    
  });























httpServer.listen(3001 , ()=>{
    console.log("HTTP server running on http://localhost:3001");
    console.log("WebSocket server running on ws://localhost:3001");
})