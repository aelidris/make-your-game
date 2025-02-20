import { createShip, moveShip} from "./ship.js";
import { createEnemies, createFire, moveEnemies } from "./enemy.js";

export const gameDiv = document.querySelector(".game");
export let boxBCR = document.querySelector(".box").getBoundingClientRect();
const titleDiv = document.querySelector(".title");
const gameOverScreen = document.getElementById("gameOverScreen");
export let gameRunning = false;
export let gameOver = false;
export let gamePaused = false;
export const gameKeys = {
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
};
const resumeBtn = document.getElementById("resume");
const restartBtn = document.getElementById("restart");

resumeBtn.addEventListener("click", ()=> {
  pauseScreen.close();
  gamePaused = false;
  startGame();
});
restartBtn.addEventListener("click",()=>{
  pauseScreen.close();
  gamePaused = false; 
  startGame();
  moveBullet();
});

window.addEventListener("load", () => {
  createShip();
  createEnemies(32);
  const startGame = document.getElementById("startGame");

  setInterval(() => {
    startGame.classList.toggle("hidden");
  }, 700);
});

let lastShotTime = 0; // Track last shot time
const shotCooldown = 1000; // 3 seconds (3000 milliseconds)

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") gameKeys["ArrowLeft"] = true;
  if (e.code === "ArrowRight") gameKeys["ArrowRight"] = true;
  const currentTime = Date.now(); // Get current timestamp

  if ((e.code == "Space" || e.key === " ") && !gameKeys["Space"]) {
    if (gameRunning && currentTime - lastShotTime >= shotCooldown) {
      gameKeys["Space"] = true; // Prevent holding
      lastShotTime = currentTime; // Update last shot time
      createFire(); // Call shooting function
    }

    if (!gameRunning) {
      titleDiv.remove();
      gameDiv.removeAttribute("hidden");
      gameRunning = true;
    }
  }

  if (e.code == "Escape") {
    if (gameRunning && !gamePaused) {
      pauseScreen.show();
      gamePaused = true;
    } else if (gamePaused) {
      pauseScreen.close();
      gamePaused = false;
      startGame();
      createFire();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") gameKeys["ArrowLeft"] = false;
  if (e.code === "ArrowRight") gameKeys["ArrowRight"] = false;
  if (e.code == "Space" || e.key === " ") {
    gameKeys["Space"] = false; // Reset space key on release
  }
});


// document.addEventListener("keydown", (e) => {
//   if (e.code === "ArrowLeft") gameKeys["ArrowLeft"] = true;
//   if (e.code === "ArrowRight") gameKeys["ArrowRight"] = true;

//   if (e.code == "Space" || e.key === " ") {
//     if (gameRunning) {
//       gameKeys["Space"] = true;
//       // shoot(); // Call the shoot function
//       createFire();
//     }
//     if (!gameRunning) {
//       titleDiv.remove();
//       gameDiv.removeAttribute("hidden");
//       gameRunning = true;
//     }
//   }
//   if (e.code == "Escape"){
//     if (gameRunning && !gamePaused){
//       pauseScreen.show();
//       gamePaused = true;
//     }else if(gamePaused){
//       pauseScreen.close();
//       gamePaused = false;
//       startGame();
//       createFire();
//     }
//   } 
// });

// document.addEventListener("keyup", (e) => {
//   if (e.code in gameKeys) {
//     gameKeys[e.code] = false;
//   }
// });

function startGame() {
 
  moveShip();
  moveEnemies();
  requestAnimationFrame(startGame);
  
}

export function gameLost() {
  gameRunning = false;
  gameOver = true;
  gameOverScreen.show();

}

startGame();
