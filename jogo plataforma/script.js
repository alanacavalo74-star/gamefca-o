const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const startGameBtn=document.getElementById('startGameBtn');
const colorChoices=document.getElementById('colorChoices');
const questionBox=document.getElementById('questionBox');
const questionText=document.getElementById('questionText');
const optionsDiv=document.getElementById('options');
const hud=document.getElementById('hud');
const openMenuBtn=document.getElementById('openMenuBtn');
const scoreDisplay=document.getElementById('scoreDisplay');
const levelDisplay=document.getElementById('levelDisplay');
const colorStore=document.getElementById('colorStore');
const storeColorsDiv=document.getElementById('storeColors');
const closeStoreBtn=document.getElementById('closeStoreBtn');
const coinChoices=document.getElementById('coinChoices');
const menu=document.getElementById('menu');

let player={x:280,y:500,width:40,height:40,color:'#9c88ff',jumping:false,velocityY:0,colors:[]};
let gravity=0.6,score=0,level=1;
let platforms=[],balls=[],keys={},animation;
let coinSkin='normal';

// 🟢 Cores iniciais
const initialColors=[
  {color:'#9c88ff',type:'normal'},
  {color:'#e17055',type:'normal'}
];

// 🟣 Loja de cores
const storeColors=[
  {color:'#6c5ce7',type:'normal',cost:2},
  {color:'#fab1a0',type:'normal',cost:2},
  {color:'#00cec9',type:'normal',cost:2},
  {color:'#ff7675,#74b9ff',type:'degrade',cost:4},
  {color:'#ffeaa7,#fd79a8',type:'degrade',cost:4},
  {color:'#a29bfe,#fdcb6e',type:'degrade',cost:4},
  {color:'#00cec9,#e84393',type:'degrade',cost:4},
  {color:'#fab1a0,#0984e3',type:'degrade',cost:4}
];

// 🧠 Perguntas
const questions=[
  {q:"O que é um orçamento?",options:["Gasto fixo","Planejamento financeiro","Empréstimo","Salário","Desconto"],correct:1},
  {q:"O que significa investir?",options:["Guardar dinheiro","Gastar dinheiro","Aumentar a renda","Pedir empréstimo","Doar dinheiro"],correct:2},
  {q:"O que é uma reserva de emergência?",options:["Um tipo de investimento de risco","Dinheiro guardado para imprevistos","Um empréstimo bancário","Uma despesa fixa","Um imposto"],correct:1}
];

// 🎮 Cores iniciais no menu
initialColors.forEach(c=>{
  const box=document.createElement('div');
  box.className='colorBox';
  box.style.background=c.color;
  box.onclick=()=>player.color=c.color;
  colorChoices.appendChild(box);
});

// 💰 Escolha de skin
document.querySelectorAll('.coinOption').forEach(opt=>{
  opt.onclick=()=>coinSkin=opt.dataset.skin;
});

// ▶️ Iniciar jogo
startGameBtn.onclick=()=>{
  menu.style.display='none';
  canvas.classList.remove('hidden');
  hud.classList.remove('hidden');
  loadLevel(1);
  loop();
};

// Teclas
document.addEventListener('keydown',e=>{
  keys[e.key]=true;
  if(e.key===' '&&!player.jumping){player.velocityY=-12;player.jumping=true;}
});
document.addEventListener('keyup',e=>keys[e.key]=false);

// 🧱 Fases
const levels=[
  {platforms:[{x:100,y:550,width:100,height:10},{x:300,y:450,width:100,height:10},{x:500,y:350,width:100,height:10}],
   balls:[{x:120,y:520,visible:true},{x:320,y:420,visible:true},{x:520,y:320,visible:true}]}
];
for(let i=2;i<=15;i++){
  levels.push({
    platforms:Array.from({length:Math.min(4+i,10)},(_,j)=>({
      x:80*j%500+50, y:550-(j*40), width:80, height:10
    })),
    balls:Array.from({length:Math.min(3+i,10)},(_,j)=>({
      x:100*j%550+60, y:500-(j*35), visible:true
    }))
  });
}

// 🪙 Imagens das moedas
const pizzaImg=new Image();
pizzaImg.src='pizza.png';
const bloxyImg=new Image();
bloxyImg.src='bloxy.png';

// 🔹 Carregar fase
function loadLevel(lvl){
  const current=levels[lvl-1];
  platforms=current.platforms;
  balls=current.balls.map(b=>({...b,radius:10}));
  player.x=250; player.y=500;
}

// 🧠 Mostrar pergunta
function showQuestion(){
  const q=questions[Math.floor(Math.random()*questions.length)];
  questionText.textContent=q.q;
  optionsDiv.innerHTML='';
  q.options.forEach((opt,i)=>{
    const btn=document.createElement('button');
    btn.textContent=opt;
    btn.onclick=()=>{
      if(i===q.correct){score+=10;alert('✅ Correto!');}
      else alert(`❌ Errado! A resposta certa é: ${q.options[q.correct]}`);
      scoreDisplay.textContent='Pontos: '+score;
      questionBox.classList.add('hidden');
      loop();
    };
    optionsDiv.appendChild(btn);
  });
  questionBox.classList.remove('hidden');
  cancelAnimationFrame(animation);
}

// 🔁 Loop principal
function loop(){
  animation=requestAnimationFrame(loop);
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(keys['ArrowLeft'])player.x-=4;
  if(keys['ArrowRight'])player.x+=4;

  player.velocityY+=gravity;
  player.y+=player.velocityY;

  if(player.y+player.height>canvas.height){
    player.y=canvas.height-player.height; player.velocityY=0; player.jumping=false;
  }

  platforms.forEach(p=>{
    if(player.x<p.x+p.width && player.x+player.width>p.x &&
      player.y+player.height>p.y && player.y+player.height<p.y+p.height+10 &&
      player.velocityY>=0){
        player.y=p.y-player.height; player.velocityY=0; player.jumping=false;
    }
  });

  // Plataformas
  ctx.fillStyle='#5c4033';
  platforms.forEach(p=>ctx.fillRect(p.x,p.y,p.width,p.height));

  // Moedas
  balls.forEach(ball=>{
    if(!ball.visible)return;
    if(coinSkin==='pizza')ctx.drawImage(pizzaImg,ball.x-10,ball.y-10,20,20);
    else if(coinSkin==='bloxy')ctx.drawImage(bloxyImg,ball.x-10,ball.y-10,20,20);
    else{ctx.beginPath();ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);ctx.fillStyle='#ffd166';ctx.fill();}

    if(player.x<ball.x+ball.radius && player.x+player.width>ball.x-ball.radius &&
       player.y<ball.y+ball.radius && player.y+player.height>ball.y-ball.radius){
      ball.visible=false; showQuestion();
    }
  });

  // Player
  if(player.color.includes(',')){
    const colors=player.color.split(',');
    const grad=ctx.createLinearGradient(player.x,player.y,player.x+player.width,player.y+player.height);
    grad.addColorStop(0,colors[0]);grad.addColorStop(1,colors[1]);
    ctx.fillStyle=grad;
  } else ctx.fillStyle=player.color;
  ctx.fillRect(player.x,player.y,player.width,player.height);

  if(balls.every(b=>!b.visible))nextLevel();
}

// 🌟 Avançar fase
function nextLevel(){
  cancelAnimationFrame(animation);
  if(level<levels.length){
    alert(`🎉 Fase ${level} concluída!`);
    level++; levelDisplay.textContent='Fase: '+level;
    loadLevel(level); loop();
  } else alert(`🏆 Parabéns! Você terminou todas as 15 fases! Pontos: ${score}`);
}
