import express from "express";
//import path from 'path';


//const __dirname = path.resolve();
const app = express();

//pug 페이지들을 렌더하기 위해 pug설정
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

//route 생성
//express로 views를 설정해주고 render해준다.
//catchall url : 사용자가 어떤 url로 이동하던지 홈으로 돌려보낸다.
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));
//app.get("/", (req, res) => res.render("home"));

console.log("hello");

const handleListen = () => console.log('Listening on http://localhost:3000');
app.listen(3000, handleListen);