// ==========================
// 🎮 기본 설정
// ==========================
let solved = 0;
let totalPuzzle = 10;
let gameEnd = false;
let time = 1800;
let hints = 3;

// ==========================
// 📳 진동
// ==========================
function vibrate(ms=100){
 if(navigator.vibrate) navigator.vibrate(ms);
}

// ==========================
// 🎮 조이스틱 이동
// ==========================
let moveX=0, moveZ=0;
let joy=document.getElementById("joystick");
let stick=document.getElementById("stick");

joy.addEventListener("touchmove",(e)=>{
 let rect=joy.getBoundingClientRect();
 let x=e.touches[0].clientX-rect.left-60;
 let y=e.touches[0].clientY-rect.top-60;

 let dist=Math.sqrt(x*x+y*y);
 if(dist>40){ x=x/dist*40; y=y/dist*40; }

 stick.style.left=(60+x-25)+"px";
 stick.style.top=(60+y-25)+"px";

 moveX=x/40;
 moveZ=y/40;
});

joy.addEventListener("touchend",()=>{
 stick.style.left="35px";
 stick.style.top="35px";
 moveX=0; moveZ=0;
});

setInterval(()=>{
 let p=document.querySelector("#player");
 let pos=p.getAttribute("position");
 pos.x+=moveX*0.1;
 pos.z+=moveZ*0.1;
 p.setAttribute("position",pos);
},16);

// ==========================
// 🔍 조사 시스템
// ==========================
document.querySelectorAll(".clickable").forEach(el=>{
 el.addEventListener("click",()=>{
  vibrate(200);
  alert(el.dataset.text);
 });
});

// ==========================
// 🚪 방 이동
// ==========================
document.querySelectorAll(".door").forEach(el=>{
 el.addEventListener("click",()=>{
  let move=Number(el.dataset.move);
  let p=document.querySelector("#player");
  let pos=p.getAttribute("position");
  pos.x=move;
  p.setAttribute("position",pos);
  vibrate(300);
 });
});

// ==========================
// 📱 카톡 시스템 (소름 버전)
// ==========================
let chat=document.getElementById("chat");

function chatMessage(msg, delay=1000){
 let div=document.createElement("div");
 div.innerHTML="입력중...";
 chat.appendChild(div);

 setTimeout(()=>{
  div.innerHTML=msg + " <span style='color:gray'>1</span>";
  vibrate(100);

  // 읽음 사라짐
  setTimeout(()=>{
   div.innerHTML=msg;
  },2000);

 },delay);
}

// 시작 메시지
setTimeout(()=>chatMessage("은혜:지금 203호지?"),2000);
setTimeout(()=>chatMessage("민교:맞아 나 여기서 못 나갔어"),5000);

// ==========================
// ⏱ 타이머
// ==========================
setInterval(()=>{
 if(gameEnd) return;

 time--;
 let m=Math.floor(time/60);
 let s=time%60;
 document.getElementById("timer").innerText=
 `${m}:${s<10?"0":""}${s}`;

 if(time<=0){
  endingFail();
 }
},1000);

// ==========================
// 🧠 힌트
// ==========================
document.getElementById("hint").onclick=()=>{
 if(hints<=0) return alert("힌트 없음");

 hints--;
 vibrate(200);
 alert("힌트:처음 단서를 다시 봐");
 document.getElementById("hint").innerText="힌트 "+hints;
};

// ==========================
// 🧩 퍼즐 해결
// ==========================
function solvePuzzle(){
 solved++;
 vibrate(200);

 if(solved >= totalPuzzle){
  endingSuccess();
 }
}

// ==========================
// 🌫 공포 연출
// ==========================
setInterval(()=>{
 if(Math.random()>0.95){
  document.body.style.opacity="0.6";
  setTimeout(()=>document.body.style.opacity="1",200);
 }
},500);

// ==========================
// 🎬 엔딩 연출
// ==========================
function fadeOut(callback){
 let op=1;
 let fade=setInterval(()=>{
  op-=0.05;
  document.body.style.opacity=op;
  if(op<=0){
   clearInterval(fade);
   callback();
  }
 },100);
}

// ==========================
// ✅ 성공 엔딩 (루프 공포)
// ==========================
function endingSuccess(){
 if(gameEnd) return;
 gameEnd = true;

 fadeOut(()=>{
  document.body.innerHTML = `
  <div style="color:white;text-align:center;margin-top:40%;">
    <h1>탈출 성공</h1>
    <p>문이 열렸다</p>
    <p>밖이다 살았다</p>
  </div>
  `;

  vibrate(500);

  setTimeout(()=>{
    document.body.innerHTML += "<p>핸드폰이 울린다</p>";
    chatMessage("은혜:너 아직 203호야",500);

    // 다시 시작 위치로 강제 이동 (루프)
    setTimeout(()=>{
      location.reload();
    },4000);

  },3000);

 });
}

// ==========================
// ❌ 실패 엔딩 (고립 공포)
// ==========================
function endingFail(){
 if(gameEnd) return;
 gameEnd = true;

 fadeOut(()=>{
  document.body.innerHTML = `
  <div style="color:red;text-align:center;margin-top:40%;">
    <h1>탈출 실패</h1>
    <p>…불이 꺼졌다</p>
    <p>아무 소리도 들리지 않는다</p>
  </div>
  `;

  vibrate(1000);

  setTimeout(()=>{
    let div=document.createElement("div");
    div.innerHTML="민교:아직 거기야…?";
    document.body.appendChild(div);

    // 읽음 사라짐 없이 멈춤
  },3000);

 });
}
// 🎬 스토리
let story = [
 "눈을 떴을 때, 나는 낯선 방에 누워 있었다.",
 "형광등은 깜빡이고 있었고…",
 "방 안에는 나말고 아무도 없었다.",
 "",
 "문 손잡이를 돌려봤지만 열리지 않는다.",
 "",
 "그때, 핸드폰이 울렸다.",
 "",
 "은혜:지금 203호 들어갔어?",
 "",
 "민교:거기 들어가면 안된다고 했잖아",
 "",
 "은혜:그 방… 나 예전에 갔었어",
 "은혜:근데 나 분명 나왔는데…",
 "",
 "민교:이상하다… 너 위치가 계속 바뀌고 있어",
 "",
 "그 순간, 벽에서 긁히는 소리가 들린다.",
 "",
 "‘203호는… 나갈 수 없다’",
 "",
 "이제, 너 차례다."
];

let idx = 0;
let textBox = document.getElementById("storyText");

function typeStory(){
 if(idx >= story.length) return;

 let line = story[idx];
 let i = 0;
 let interval = setInterval(()=>{
  textBox.innerHTML += line.charAt(i);
  i++;
  if(i >= line.length){
   clearInterval(interval);
   textBox.innerHTML += "<br><br>";
   idx++;
   setTimeout(typeStory, 800);
  }
 },40);

 vibrate(50);
}

// 시작
typeStory();

function startGame(){
 document.getElementById("intro").style.display="none";
 vibrate(300);
}
