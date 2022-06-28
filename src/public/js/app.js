
const messageList = document.querySelector('ul');
const messageForm = document.querySelector('#message');
const nickForm = document.querySelector('#nick');
//frontend의 socket : 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

//메시지를 만들고 stringify 해주는 함수
//JSON object -> String
function makeMessage(type, payload){
  const msg = {type, payload}
  return JSON.stringify(msg);
}


function handleOpen(){
  console.log("[Front] ✅ Connected to Server");
}

//open
socket.addEventListener("open", handleOpen);


//message
socket.addEventListener("message", (message)=>{
  //message를 ul안에 넣어주기!
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

//close
socket.addEventListener("close", ()=>{
  console.log("[Front] Disconnected to Server")
})

//send a message to backend
function handleSubmit(event){
  event.preventDefault();
  const input = messageForm.querySelector("input");
  //                                  type, payload
  socket.send(makeMessage("new_message", input.value));

  //message를 ul안에 넣어주기!
  /*  const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value="";*/
}

function handleNickSubmit(event){
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  /* socket.send({
    type: "nickname",
    payload: input.value
  });*/
  console.log(input.value);
  input.value="";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
