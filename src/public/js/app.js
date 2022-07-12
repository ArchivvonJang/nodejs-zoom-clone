const socket = io(); //io 자동적으로 back-end와 socket-io를 연결해주는 function
//화면 가져오기
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event){
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  //입력받은 메시지를 back-end로 보내준다.
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You : ${value}`); //백엔드에서 시작시킬 수 있는 function
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function showRoom(){
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
};


function handleRoomSubmit(event){
  event.preventDefault();
  const input = form.querySelector("input");
   //argument ->  1. 이벤트이름, 2. 보내고 싶은 payload, 3. 서버에서 호출하는 function
  socket.emit(
    "enter_room",
    input.value, //방 이름
    showRoom//function - backend에서 끝났다는 사실을 알리기 위한 function은 맨 마지막 arg가 되어야한다.
  );
  roomName = input.value;
  input.value="";
  // 1. 특정한 event 를 어떤 이름이든 상관없이 emit 해줄 수 있다.
  // 2. JS object 를 전송할 수 있다.
}

form.addEventListener("submit", handleRoomSubmit);

//새로운 참여자가 room에 들어오면 수행될 function
socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`[ ${user} arrived. ]`);
});
//참여자가 방을 나가면 수행하게 될 function
socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`[ ${left} left. ]`);
});
//메시지 확인
socket.on("new_message", addMessage);
//위와 동일 === socket.on("new_message", (msg)=>{addMessage(msg)});

socket.on("room_change", (rooms) => {
  roomList.innerHTML = '';
  //room이 하나도 없을 때, 모든 것을 비워준다.
  if(room.length === 0){
    return;
  }
  const roomList = welcome.querySelector("ul");
  rooms.forEach(room => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  })
});