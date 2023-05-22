let lastPaintTime = 0;
let SNAKE_SPEED = 3;
let inputDirection = {
   x: -1,
   y: 0
}
let lastInputDirection = inputDirection;
let gameOver = false;


let myAudio = document.querySelector('#audio')




const EXPENTION_AMOUNT = 1;

let score = 0;
const snakeBody = [{ x: 8, y: 8 },
{ x: 9, y: 8 },
{ x: 10, y: 8 },
];

food = getFoodrandomPosition();





let leaderBoard = document.getElementById("leaderBoard");

const gameBoard = document.querySelector(".game-board");
const scoreBox = document.getElementById("score");

function paint(currentTime) {
   let TimeSeconds = (currentTime - lastPaintTime) / 1000;
   requestAnimationFrame(paint);
   if (TimeSeconds < 1 / SNAKE_SPEED) return;
   lastPaintTime = currentTime;


   if (gameOver != true) {
      update();
      draw();
   }
}





window.requestAnimationFrame(paint);




function draw() {
   drawSnake();
   drawFood();


}

function update() {
   gameBoard.innerHTML = "";
   snakeMove();
   snakeEatFood();


}
//drawing the snake body
function drawSnake() {
   snakeBody.forEach((segment, index) => {
      let snakeElement = document.createElement("div");
      snakeElement.style.gridColumnStart = segment.x;
      snakeElement.style.gridRowStart = segment.y;

      
      snakeElement.style.transform = "rotate(0deg)";
      if (index == 0) {
         snakeElement.classList.add("head");


         if (inputDirection.x == 1) {
            snakeElement.style.transition = "rotate(-90deg)";
         } else if (inputDirection.x == -1) {
            snakeElement.style.transition = "rotate(90deg)";
         } else if (inputDirection.y == -1) {
            snakeElement.style.transition = "rotate(180deg)";
         } else if (inputDirection.y == 1) {
            snakeElement.style.transition = "rotate(0deg)";
         }
      } else {
         snakeElement.classList.add("snake");
      }
      gameBoard.appendChild(snakeElement);

   });
}

function drawFood() {
   let foodElement = document.createElement("div");
   foodElement.style.gridColumnStart = food.x;
   foodElement.style.gridRowStart = food.y;
   foodElement.classList.add("food");
   gameBoard.appendChild(foodElement);

}






function snakeMove() {
   inputDirection = getInputDirection();



   for (i = snakeBody.length - 2; i >= 0; i--) {
      snakeBody[i + 1] = {
         ...snakeBody[i]
      }
   }
   snakeBody[0].x += inputDirection.x;
   snakeBody[0].y += inputDirection.y;

   checkGameOver();


}


//movement of snake
function getInputDirection() {
   window.addEventListener("keydown", e => {


      switch (e.key) {
         case 'ArrowUp':
            if (lastInputDirection.y == 1) break;
            inputDirection = {
               x: 0,
               y: -1
            }
            break;
         case 'ArrowDown':
            if (lastInputDirection.y == -1) break;
            inputDirection = {
               x: 0,
               y: 1
            }
            break;
         case 'ArrowLeft':
            if (lastInputDirection.x == 1) break;
            inputDirection = {
               x: -1,
               y: 0
            }
            break;
         case 'ArrowRight':
            if (lastInputDirection.x == -1) break;
            inputDirection = {
               x: 1,
               y: 0
            }
            break;
         default:
            inputDirection = {
               x: 0,
               y: 0
            }
      }
   })

   lastInputDirection = inputDirection;
   return inputDirection;



}


//snake eating the food
function snakeEatFood() {
   if (snakeBody[0].x === food.x && snakeBody[0].y === food.y) {

      score += 1;
      myAudio.play();

      scoreBox.innerHTML = score;
      console.log("eated")
      food = getFoodrandomPosition();



      SNAKE_SPEED++;
      expendSnake();
      startTimer();



   }
}


function isEat() {

   return snakeBody[0].x === food.x && snakeBody[0].y === food.y;

}


function getFoodrandomPosition() {

   let a, b, myCondition = true;
   while (myCondition) {
      a = Math.ceil(Math.random() * 18);
      b = Math.ceil(Math.random() * 18);

      myCondition = snakeBody.some(segment => {
         return segment.x === a && segment.y === b;
      })
   }
   return {
      x: a,
      y: b
   };
}



function expendSnake() {
   for (i = 0; i < EXPENTION_AMOUNT; i++) {
      snakeBody.push(snakeBody[snakeBody.length - 1]);
   }
}

function checkGameOver() {
   if (snakeOutOfGrid() || snakeIntersection()) {
      lives--;
      updateLivesCount();

      updateLivesCount();
      decreaseLife();

   }
}








//code for the lives of snake 
let lives = 3; 


// Function to update the lives count on the webpage
function updateLivesCount() {
   var livesCountElement = document.getElementById("livesCount");
   livesCountElement.textContent = lives;
}



// Function to decrease a life
function decreaseLife() {
   if (lives == 3) {
      if (snakeOutOfGrid() || snakeIntersection()) {
         lives--;
         updateLivesCount();

      }


   }

   if (lives === 0) {
      alert("Game Over : you lost");
      gameOver = true;



   }
}


function snakeOutOfGrid() {
   return snakeBody[0].x < 0 || snakeBody[0].x > 20 || snakeBody[0].y < 0 || snakeBody[0].y > 20;

}

function snakeIntersection() {
   for (i = 1; i < snakeBody.length; i++) {
      if (snakeBody[0].x === snakeBody[i].x && snakeBody[0].y === snakeBody[i].y) {
         return true;
      }
   }
}


//function to display time and increment to 5s when snake eats the food 
function startTimer() {
   let duration = 60; // Duration in seconds

   let timer = setInterval(function () {
      let minutes = parseInt(duration / 60, 10);
      let seconds = parseInt(duration % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let timerDisplay = document.getElementById("timer");
      timerDisplay.textContent = minutes + ":" + seconds;

      if (--duration < 0) {
         clearInterval(timer);
         alert("Game Over : you lost");
         gameOver = true;
         timerDisplay.textContent = "Timer ended!";
      }
      while (snakeBody[0].x === food.x && snakeBody[0].y === food.y) {
         timer += 5;
         break;
      }
   }, 1000);
}

startTimer();



//RETRIVE DATA FROM LOCAL STORAGE

let leaderboardData = JSON.parse(localStorage.getItem("leaderboardData")) || [];


// Render leaderboard
function renderLeaderboard() {
   const leaderboardElement = document.getElementById("leaderboard");
   leaderboardElement.innerHTML = "";

   leaderboardData.forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${entry.name}: ${entry.score}`;
      listItem.classList.add("leaderboardEntry");
      leaderboardElement.appendChild(listItem);
   });
}

// Update leaderboard data and local storage
function updateLeaderboardData(name, score) {
   leaderboardData.push({ name, score });
   leaderboardData.sort((a, b) => b.score - a.score); // Sort by score in descending order
   localStorage.setItem("leaderboardData", JSON.stringify(leaderboardData));

}

// Handle form submission
const scoreForm = document.getElementById("scoreForm");
scoreForm.addEventListener("submit", function (event) {
   event.preventDefault();
   const playerName = document.getElementById("playerName").value;
   const playerScore = parseInt(document.getElementById("playerScore").value);

   updateLeaderboardData(playerName, playerScore);
   renderLeaderboard();

   // Clear form inputs
   document.getElementById("playerName").value = "";
   document.getElementById("playerScore").value = "";

   function save() {
      localStorage.setItem('playerName', JSON.stringify(playerName));
      localStorage.setItem('playerScore', JSON.stringify(playerScore));
   }

   function load() {
      player = JSON.parse(localStorage.getItem('playerName'));
      score = JSON.parse(localStorage.getItem('playScore'));
   }


});

renderLeaderboard();












