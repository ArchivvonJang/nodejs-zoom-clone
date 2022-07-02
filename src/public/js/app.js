const socket = io(); //io 자동적으로 back-end와 socket-io를 연결해주는 function
//화면 가져오기
const welcom = document.getElementById("welcome");
const form = welcom.querySelector("form");

function backendDone(msg){
  console.log('The backend says : ', msg);
}

function handleRoomSubmit(event){
  event.preventDefault();
  const input = form.querySelector("input");
   //argument ->  1. 이벤트이름, 2. 보내고 싶은 payload, 3. 서버에서 호출하는 function
  socket.emit(
    "enter_room",
    input.value, //방 이름
    backendDone()//function - backend에서 끝났다는 사실을 알리기 위한 function은 맨 마지막 arg가 되어야한다.
  );
  input.value="";
  // 1. 특정한 event 를 어떤 이름이든 상관없이 emit 해줄 수 있다.
  // 2. JS object 를 전송할 수 있다.

}

form.addEventListener("submit", handleRoomSubmit);
