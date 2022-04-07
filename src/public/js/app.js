
const messageList = document.querySelector('ul');
const messageForm = document.querySelector('#message');
const nickForm = document.querySelector('#nick');
//frontend의 socket : 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

//JSON object -> String
function makeMessage(type, payload){
    const msg = {type, payload}
    return JSON.stringify(msg);
}

//open
socket.addEventListener("open", ()=>{
    console.log("Connected to Server ✅");
})

//message
socket.addEventListener("message", (message)=>{
    //message를 ul안에 넣어주기!
   const li = document.createElement("li");
   li.innerText = message.data;
   messageList.append(li);
});

//close
socket.addEventListener("close", ()=>{
    console.log("Disconnected to Server")
})

//send a message to backend
function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value="";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nikcname", input.value));
}

