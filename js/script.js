import { Question } from "./questions.js";


const errorValidation = document.querySelector('.form-error');
const errorValidationMessage = document.querySelector('.form-error span');

// SOUND EFFECTS
const sounds = {
    wrong: new Audio("./audio/wrong.mp3"),
    correct: new Audio("./audio/right.mp3"),
    timeup: new Audio("./audio/time-up.mp3"),
    quizComleate: new Audio("./audio/quiz-compleate.mp3"),
    countdown: new Audio("./audio/countdown.mp3")
};

const playerName = document.getElementById("playerName");
const categorySelect = document.getElementById("categorySelect");
const categorySelectTrigger = categorySelect.querySelector(".custom-select-trigger");
const categorySelectIcon = categorySelect.querySelector(".custom-select-icon i");
const categorySelectText = categorySelect.querySelector(".custom-select-text");
const categoryOptions = categorySelect.querySelectorAll(".custom-select-option");
const categoryMenu = document.getElementById("categoryMenu");
let category = categoryMenu.value;

//  SELECT CATEGORY 
categorySelectTrigger.addEventListener("click", function () {
    categorySelect.classList.toggle("open");
});

// console.log(categoryOptions);
for (const option of categoryOptions) {
    option.addEventListener("click", function () {
        categorySelect.classList.remove("open");
        categorySelectText.innerHTML = option.textContent;
        categorySelectIcon.className = option.querySelector("i").className;
        categorySelect.setAttribute("data-value", option.getAttribute("data-value"))
        categoryMenu.value = option.getAttribute("data-value")
        category = categoryMenu.value;
    });
};

const difficultySelect = document.getElementById("difficultySelect");
const difficultySelectTrigger = difficultySelect.querySelector(".custom-select-trigger");
const difficultySelectIcon = difficultySelect.querySelector(".custom-select-icon i");
const difficultySelectText = difficultySelect.querySelector(".custom-select-text");
const difficultyOptions = difficultySelect.querySelectorAll(".custom-select-option");
const difficultyOption = document.getElementById("difficultyOptions");
let difficulty = difficultyOption.value;

// SELECT DEFFICULTY
difficultySelectTrigger.addEventListener("click", function () {
    difficultySelect.classList.toggle("open");
});

for (const option of difficultyOptions) {
    option.addEventListener("click", function () {
        difficultySelect.classList.remove("open");
        difficultySelectText.innerHTML = option.textContent;
        const icon = option.querySelector("i").className;
        difficultySelectIcon.className = option.querySelector("i").className;
        difficultySelect.setAttribute("data-value", option.getAttribute("data-value"));
        difficultyOption.value = option.getAttribute("data-value");
        difficulty = difficultyOption.value;
    });
};

// CLOSE CATEGORIES 
document.addEventListener("click", function (e) {
    if (!categorySelect.contains(e.target)) {
        categorySelect.classList.remove("open");
    }

    if (!difficultySelect.contains(e.target)) {
        difficultySelect.classList.remove("open");
    }
});

const questionsNumber = document.getElementById("questionsNumber");
const btnNum = document.querySelectorAll(".number-btn");
let amount = questionsNumber.value;

// NUMBER OF QUESTIONS 
for (const btn of btnNum) {
    // INCREAMENT , DECREAMENT
    btn.addEventListener("click", function () {
        const action = btn.getAttribute("data-action");
        if (action === "increment") {
            questionsNumber.value = Number(questionsNumber.value) + 1;
            if (Number(questionsNumber.value) > Number(questionsNumber.max)) {
                questionsNumber.value = questionsNumber.max;
            }
        } else {
            questionsNumber.value = Number(questionsNumber.value) - 1
            if (Number(questionsNumber.value) < Number(questionsNumber.min)) {
                questionsNumber.value = questionsNumber.min;
            }
        };
    });
};
// TYPING THE NUMBER
questionsNumber.addEventListener("input", function () {
    errorValidation.classList.add("hidden");
    if (questionsNumber.value >= questionsNumber.min && questionsNumber.value <= questionsNumber.max) {
        amount = questionsNumber.value
    };
});

const btnStartQuiz = document.getElementById("startQuiz");
const loadingSpinner = document.querySelector(".loading-overlay");

// CARDS
const form = document.querySelector(".game-card.quiz-setup");
const questionCard = document.querySelector(".game-card.question-card");
const resultsCard = document.querySelector(".game-card.results-card");
const errorCard = document.querySelector(".game-card.error-card");

const questionCounter = document.querySelector('.xp-value');
const progressFill = document.querySelector('.xp-bar-fill');
const categoryText = document.querySelector('.stat-badge.category span');
const categoryIcon = document.querySelector('.stat-badge.category i');
const difficultyText = document.querySelector('.stat-badge.difficulty span');
const difficultyIcon = document.querySelector('.stat-badge.difficulty i');
const timerValue = document.querySelector('.timer-value');
const timerBadge = document.querySelector('.stat-badge.timer');
const counterText = document.querySelector('.stat-badge.counter span');
const timeUpMessage = document.querySelector('.time-up-message');
const questionText = document.querySelector('.question-text');
const answerTexts = document.querySelectorAll('.answer-text');
const scoreValue = document.querySelector('.score-item-value');
const answersGrid = document.querySelector(".answers-grid");
let answerButtons = document.querySelectorAll('.answer-btn'); //CREATE IT DYNAMIC 

const resultScore = document.querySelector(".results-score-display");
const resultPercentage = document.querySelector(".results-percentage");
const leaderboardList = document.querySelector(".leaderboard-list");


let questionsData = [];
let index = 0;
let time; //COUNTER
let score = 0;
let answerdEvent = false; // TO NOT CHOOSE MORE ONE ANSWER

// RANK PLAYERS 
let rankList = [];
if (localStorage.getItem('rankList') != null) {
    rankList = JSON.parse(localStorage.getItem('rankList'));
};

console.log(categoryText);

btnStartQuiz.addEventListener("click", function () {
    // CHECK VALUES BEFORE START
    if (validation()) {
        startGame();
    }
});


// START THE GAME // GET QUESTIONS  
async function startGame() {
    let API = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`;
    form.classList.add("hidden");
    loadingSpinner.classList.remove("hidden");
    try {
        console.log(API);

        let response = await fetch(API);
        let data = await response.json();
        questionsData = data.results.map(question => new Question(question));
        console.log(questionsData);
        console.log("Questions:", data.results.length);
        displayQuestion(index);
        questionCard.classList.remove("hidden")
        loadingSpinner.classList.add("hidden")
    }
    catch (error) {
        console.log(error);
        errorCard.classList.remove("hidden");
        loadingSpinner.classList.add("hidden")
    }
};

// QUESTION CARD
function displayQuestion(index) {
    answerdEvent = false; //REBOOT ANSWERED CHOOSED 
    for (const btn of answerButtons) {
        btn.classList.remove("correct")
        btn.classList.remove("wrong")
        btn.classList.remove("disabled")
    }
    // PREPARE THE CARD
    categoryText.innerHTML = questionsData[index].category;
    categoryIcon.className = categorySelectIcon.className
    difficultyText.innerHTML = difficulty;
    difficultyIcon.className = difficultySelectIcon.className
    questionText.innerHTML = questionsData[index].text
    questionCounter.innerHTML = `Question ${index + 1}/${amount}`
    counterText.innerHTML = `${index + 1}/${amount}`
    progressFill.style.width = `${(100 / amount) * (index + 1)}%`

    // CREATE ANSWER BTN
    let cartona = ''
    for (let i = 0; i < questionsData[index].answers.length; i++) {
        cartona += `
        <button class="answer-btn" data-answer="${questionsData[index].answers[i]}">
          <span class="answer-key">${i + 1}</span>
          <span class="answer-text">${questionsData[index].answers[i]}</span>
        </button>`;
    }
    answersGrid.innerHTML = cartona;
    answerButtons = answersGrid.querySelectorAll(".answer-btn"); // INITIALIZE IT AGAIN TO UPDATE BTN 
    counter(); // TURN ON COUNTER
    selectAnswer() // CHECK ANSWERS
};

//MOVE TO THE NEXT QUESTION OR RESULT CARD 
function nextQuestion() {
    index++;
    if (index < questionsData.length) {
        setTimeout(function () {
            displayQuestion(index);
        }, 2000)
        console.log("Current index:", index);
    } else {
        clearInterval(time);
        pauseSound(sounds.countdown);
        index = 0;
        setTimeout(function () {
            playSound(sounds.quizComleate);
            addRank();
        }, 2000)
    }
};

// COUNTER
function counter() {
    let timerCounter = 15;
    timeUpMessage.classList.add("hidden")
    timerBadge.classList.remove("warning")
    timerValue.innerHTML = timerCounter;

    time = setInterval(function () {
        timerValue.innerHTML = Number(timerValue.innerHTML) - 1;

        if (timerValue.innerHTML < 6) {
            timerBadge.classList.add("warning")
            playSound(sounds.countdown);
        };

        if (timerValue.innerHTML == 0) {
            clearInterval(time);
            pauseSound(sounds.countdown);
            playSound(sounds.timeup);
            timeUpMessage.classList.remove("hidden")
            for (const btn of answerButtons) {
                if (questionsData[index].isCorrect(btn.getAttribute("data-answer"))) {
                    btn.classList.add("correct")
                    disabledBtn(btn);
                }
            }
            nextQuestion()
        };
    }, 1000);
};

// ANSWER THE QUESTION AND CHECK THE ANSWER IF IT CORRECT OR NOT
function selectAnswer() {
    for (const btn of answerButtons) {
        btn.addEventListener("click", function () {

            //  CHECK THE QUESTION IS ANSWERED OR NOT 
            if (answerdEvent) {
                return;
            }

            let answer = btn.getAttribute("data-answer");
            if (questionsData[index].isCorrect(answer)) {
                answerdEvent = true;
                btn.classList.add("correct");
                playSound(sounds.correct);
                pauseSound(sounds.countdown);
                clearInterval(time);

                disabledBtn(btn);// ACTIVE DISABLED TO OTHER BTNS 

                nextQuestion(); //MOVE TO NEXT QUESTION 


                // SCORE INCREASE
                score++;
                scoreValue.innerHTML = score;
            } else {

                answerdEvent = true;
                btn.classList.add("wrong");
                playSound(sounds.wrong);
                pauseSound(sounds.countdown);
                clearInterval(time);

                // SHOW THE CORRECT ANSWER 
                for (const correctBtn of answerButtons) {
                    if (questionsData[index].isCorrect(correctBtn.getAttribute("data-answer"))) {
                        correctBtn.classList.add("correct");
                    };
                };

                // ACTIVE DISABLED TO OTHER BTNS EXEPT THE CORRECT
                disabledBtn(btn);

                nextQuestion(); //MOVE TO NEXT QUESTION
            }
        })
    }
};

//  KEYDOWN EVENT PRESS ENTER---> TO START GAME 
// PRESS 1-4 TO ANSWER THE QUESTIONS 
document.addEventListener("keydown", function (e) {
    console.log(e.key);
    if (!questionCard.classList.contains("hidden")) {
                  
        //  CHECK THE QUESTION IS ANSWERED OR NOT 
        if (answerdEvent) {
            return;
        }

        if (e.key >= 1 && e.key <= answerButtons.length) {
            answerButtons[Number(e.key) - 1].click();
        }
    }
    if (!form.classList.contains("hidden")) {
        // CHECK THE VALUES AND ENTER KEY
        if (e.key == "Enter" && validation()) {
            startGame();
        }
    }
});

// CONTROL OF SOUND PLAY OR PAUSE
function playSound(sound) {
    sound.preload = "auto";
    sound.play();
};
function pauseSound(sound) {
    sound.pause();
};

// ACTIVE DISABLED BTNS
function disabledBtn(selectBtn) {
    for (const otherBtn of answerButtons) {
        let otherBtnAnswer = otherBtn.getAttribute("data-answer");
        if (!questionsData[index].isCorrect(otherBtnAnswer) && otherBtn !== selectBtn) {
            otherBtn.classList.add("disabled");
        }
    }
};

function addRank() {
    if (!playerName.value) {
        playerName.value = "player"
    }

    let rank = {
        name: playerName.value,
        percentage: `${((score) / (amount) * 100).toFixed(0)}`
    };

    rankList.push(rank);
    localStorage.setItem("rankList", JSON.stringify(rankList));

    displayResults(rankList)
};

function displayResults(rankList) {

    questionCard.classList.add("hidden");
    resultsCard.classList.remove("hidden");
    resultScore.innerHTML = `${score}/${amount}`;

    let percentage = (score) / (amount) * 100;
    resultPercentage.innerHTML = `${percentage.toFixed(0)}% Accuracy`;

    rankList.sort(function (a, b) {
        return (b.percentage - a.percentage);
    })

    const medals = ["gold", "silver", "bronze"];
    let cartona = ''
    for (let i = 0; i < rankList.length; i++) {
        const medalStyle = medals[i];
        cartona += `
        <li class="leaderboard-item ${medalStyle}">
        <span class="leaderboard-rank">#${i + 1}</span>
        <span class="leaderboard-name">${rankList[i].name}</span>
        <span class="leaderboard-score">${rankList[i].percentage}%</span>
        </li> `;
    }
    leaderboardList.innerHTML = cartona
    console.log(leaderboardList.innerHTML);

};

const restartGame = document.querySelector(".btn-restart");
const restartGameIcon = document.querySelector(".btn-restart i");
const tryAgain = document.querySelector(".btn-play.retry-btn");

// TO PLAY THE GAME AGAIN
restartGame.addEventListener("click", function () {
    restartGameIcon.className = "fa-solid fa-spinner fa-spin"
    setTimeout(function () {
        reboot();
        resultsCard.classList.add("hidden");
        form.classList.remove("hidden");
    }, 2000)
});

// IF ERROR HAPPEND TO REQUEST
tryAgain.addEventListener("click", function () {
    form.classList.remove("hidden");
    errorCard.classList.add("hidden");
});

// CHECK THE NUMBER OF QUESTIONS 
function validation() {
    amount = questionsNumber.value

    if (amount == "" && playerName.value == "") {
        errorValidation.classList.remove("hidden");
        errorValidationMessage.innerHTML = "Please enter the number of questions."
        setTimeout(function () {
            errorValidation.classList.add("hidden");
        }, 3000)
        return false;
    }
    else if (amount < questionsNumber.min) {
        errorValidation.classList.remove("hidden");
        errorValidationMessage.innerHTML = "Minimum 1 question required."
        setTimeout(function () {
            errorValidation.classList.add("hidden");
        }, 3000)
        return false;
    }
    else if (amount > questionsNumber.max) {
        errorValidation.classList.remove("hidden");
        errorValidationMessage.innerHTML = "Miximum 50 questions required."
        setTimeout(function () {
            errorValidation.classList.add("hidden");
        }, 3000)
        return false;
    }
    else {
        errorValidation.classList.add("hidden");
        return true;
    }
}

// CLEAR ALL VALUES TO PLAY AGAIN 
function reboot() {
    restartGameIcon.className = "fa-solid fa-rotate-right";
    questionsNumber.value = "";
    amount = "";
    playerName.value = "";
    score = 0;
};

