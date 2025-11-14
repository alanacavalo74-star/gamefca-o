const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const shopBtn = document.getElementById("shopBtn");
const shopModal = document.getElementById("shopModal");
const closeShop = document.getElementById("closeShop");
const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

let score = -190;
let playerX = window.innerWidth / 2 - 40;
let gameRunning = true;

// Movimentação do jogador
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft") playerX -= 30;
  else if (e.key === "ArrowRight") playerX += 30;

  playerX = Math.max(0, Math.min(window.innerWidth - 80, playerX));
  player.style.left = playerX + "px";
});

// Criar itens
function createItem() {
  if (!gameRunning) return;

  const item = document.createElement("div");
  item.classList.add("item");

  const types = ["coin", "bill", "wallet"];
  const type = types[Math.floor(Math.random() * types.length)];
  item.classList.add(type);

  let value = 0;
  if (type === "coin") value = 10;
  if (type === "bill") value = Math.floor(Math.random() * 51) + 50; // nota aleatória 50–100
  if (type === "wallet") value = -20;

  item.dataset.value = value;
  item.style.left = Math.floor(Math.random() * (window.innerWidth - 40)) + "px";
  game.appendChild(item);

  let topPos = 0;
  const fall = setInterval(() => {
    if (!gameRunning) {
      clearInterval(fall);
      item.remove();
      return;
    }

    topPos += 5;
    item.style.top = topPos + "px";

    if (topPos > window.innerHeight - 140) {
      const itemLeft = item.offsetLeft;
      const itemRight = itemLeft + 40;
      const playerLeft = player.offsetLeft;
      const playerRight = playerLeft + 80;

      // colisão
      if (itemRight > playerLeft && itemLeft < playerRight) {
        let total = parseInt(item.dataset.value);
        total += Math.floor(total * 0.5); // +50% renda de emergência
        score += total;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        item.remove();
        clearInterval(fall);
      }
    }

    if (topPos > window.innerHeight) {
      item.remove();
      clearInterval(fall);
    }
  }, 30);
}

setInterval(createItem, 1000);

// Loja
shopBtn.addEventListener("click", () => shopModal.classList.remove("hidden"));
closeShop.addEventListener("click", () => shopModal.classList.add("hidden"));

// Game Over simulado (ao atingir -100)
setInterval(() => {
  if (score <= -100 && gameRunning) {
    gameRunning = false;
    finalScore.textContent = `Sua pontuação final: ${score}`;
    gameOver.classList.remove("hidden");
  }
}, 500);

restartBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.textContent = "Pontuação: 0";
  gameOver.classList.add("hidden");
  gameRunning = true;
});
