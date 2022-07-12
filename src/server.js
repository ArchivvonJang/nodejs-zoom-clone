import http from 'http';
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";
import {isBrowsersQueryValid} from "@babel/preset-env/lib/targets-parser";

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
const httpServer = http.createServer(app);

// -------------  socket io server 생성 (/socket.io/socket.io.js) -------------
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
});
instrument(wsServer, {
  auth: false
});

function publicRooms(){
  const { sockets: { adapter: { sids, rooms }, },} = wsServer;
  /*위와 같다.
  const sids = wsServer.sockets.adapter.sids;
  const rooms = wsServer.sockets.adapter.rooms;*/

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if(sids.get(key) === undefined){
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName){
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) =>{
  //wsServer.socketsJoin("announcement"); 입장하면 바로 공지로 가게하기
  socket["nickname"] = "Anonymous";
  socket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
    console.log(`Socket Event : ${event}`);
  });

  //채팅방에 참가하고, 참가했다는 것을 모든 사람에게 알리기
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    //메세지를 하나의 socket에만 보내기
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    //메시지를 모든 socket에 보내주기
    wsServer.sockets.emit("room_change", publicRooms());
  });

  //클라이언트가 서버와 연결이 끊어지기 전에 마지막에 굿바이 메시지 보내기
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room)- 1 ));
  });
  socket.on("disconnect", () => {
    //모두에게 room이 변경되었다고 알리기 (방이 사라졌을수도 있음)
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
    done();
  });

  socket.on("nickname", nickname => socket["nickname"] = nickname);
});

// ------------- websocket server 생성 -------------
// //http server를 사용하고 싶지 않을 때는 websocket server(아래)만 만들면 된다.
// // 여기서 서버를 전달해준다.
// const wss = new WebSocket.Server({ server });
//
// function onSocketClose(){
//   console.log("[Back] Disconnected from the Browser");
// }
//
// //fake database 누군가 서버에 연결하면 해당 connection 담아준다.
// const sockets = [];
//
// wss.on("connection", (socket) => {
//   //브라우저에 연결될 때, 브라우저를 sockets array 에 담아준다.
//   sockets.push(socket);
//
//   socket["nickname"] = "Anony"; //익명으로 챗에 참여한 사람들의 닉네임을 설정
//   console.log("[Back] ✅ Connected to Browser");
//   socket.on("close", onSocketClose);
//   socket.on("message", (msg) => {
//
//     //JSON.stringify : convert javascript object to String
//     const message = JSON.parse(msg);
//
//     switch(message.type){
//       case "new_message":
//         //각 브라우저를 aSocket 으로 표시하고 메시지를 보낸다.
//         sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
//         break;
//       case "nickname":
//         //type : 메시지 종류, payload : 메시지에 담겨있는 중요한 정보들
//         //socket[여기에 정보를 저장할 수 있다. ]
//         socket["nickname"] = message.payload;
//         break;
//     }
//   });
// });

httpServer.listen(3000, handleListen);

