import http from 'http';
import WebSocket from 'ws';
import express from "express";

const app = express();

//pug 페이지들을 렌더하기 위해 pug설정
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

//route 생성 : express로 views를 설정해주고 render해준다.
//catchall url : 사용자가 어떤 url로 이동하던지 홈으로 돌려보낸다.
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

//http server 설정
const handleListen = () => console.log('Listening on ws && http://localhost:3000');

//server에서 websocket을 만들 수 있도록 준비
//같은 서버에서 http, websocket 둘 다 작동하도록 http server 위에 websocket 서버 생성 
const server = http.createServer(app);

//websocket server 생성  
//http server를 사용하고 싶지 않을 때는 websocket server(아래)만 만들면 된다.
                                    // 여기서 서버를 전달해준다. 
const wss = new WebSocket.Server({ server });

function onSocketClose(){
    console.log("Disconnected from the Browser");
}

//fake database 누군가 서버에 연결하면 해당 connection을 담아준다.
const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anony"; //익명으로 챗에 참여한 사람들의 닉네임을 설정
    console.log("✅ Connected to Browser");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {

        //JSON.stringify : convert javascript object to String
        const message = JSON.parse(msg);

        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                //type : 메시지 종류, payload : 메시지에 담겨있는 중요한 정보들
                //socket[여기에 정보를 저장할 수 있다. ]
                socket["nickname"] = message.payload;
                break;
        }
    
        
    });
});

server.listen(3000, handleListen);

