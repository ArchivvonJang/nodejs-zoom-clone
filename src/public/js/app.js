const socket = io(); //io 자동적으로 back-end와 socket-io를 연결해주는 function
//화면 가져오기
const welcom = document.getElementById("welcome");
const form = welcom.querySelector("form");

function handleRoomSubmit(event){
  event.preventDefault();
  const input = form.querySelector("input");
   //argument ->  1. 이벤트이름, 2. 보내고 싶은 payload, 3. 서버에서 호출하는 function
  socket.emit("enter_room", { payload: input.value}, () => {
    console.log("[FrontEnd] server is done!");
  });
  input.value="";
  // 1. 특정한 event 를 어떤 이름이든 상관없이 emit 해줄 수 있다.
  // 2. JS object 를 전송할 수 있다.

}

form.addEventListener("submit", handleRoomSubmit);
