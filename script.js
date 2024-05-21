import { colors, challengeTemplates, challengeAnswers, requiredInputs, finalCode } from './challengeData.js';

const startContainer = document.querySelector('.start_container');
const startChallenge = document.getElementById('start_challenge');
const generatingColorContainer = document.querySelector('.generating_color_container');

const waitingContainer = document.querySelector('.waiting_container');
const chosenColor = document.getElementById('chosen_color');
const countdown = document.getElementById('countdown');

const challengeContainer = document.querySelector('.challenge_container');
const codeText = document.getElementById('code_text');
const submitButton = document.getElementById('submit');

const winContainer = document.querySelector('.win_container');
const tryAgainButton = document.getElementById('try_again');

const ChallengeInfoButton = document.querySelector('.challenge_info');
const colorsInfoModal = document.querySelector('.colors_info_modal');
const closeModalButton = document.getElementById('close_modal');

let randomColor;
let challengeIndex;


Edrys.onReady(() => {
    console.log("Module Fill The Blank is ready!!");

    const randomChallengeIdx = Math.floor(Math.random() * challengeTemplates.length);
    const randomColorIdx = Math.floor(Math.random() * colors.length);
    Edrys.setItem("challengeIndex", randomChallengeIdx);
    Edrys.setItem("randomColorIndex", randomColorIdx);
});

startChallenge.onclick = () => {
    startChallenge.style.display = 'none';
    generatingColorContainer.style.display = 'block';

    setTimeout(() => {
        startContainer.style.display = 'none';
        generatingColorContainer.style.display = 'none';
        waitingContainer.style.display = 'block';
        startCountdown();
    }, 3000);
};

const startCountdown = () => {
    challengeIndex = Edrys.getItem("challengeIndex");
    codeText.innerHTML = challengeTemplates[challengeIndex];

    const randomColorIndex = Edrys.getItem("randomColorIndex");
    randomColor = colors[randomColorIndex];

    chosenColor.style.color = `${randomColor.name}`;
    chosenColor.innerText = randomColor.name;
     
    let count = 5;
    countdown.innerText = count;
    const interval = setInterval(() => {
        count--;
        countdown.innerText = count;
        if (count === 0) {
            clearInterval(interval);
            waitingContainer.style.display = 'none';
            challengeContainer.style.display = 'block';
            ChallengeInfoButton.style.display = 'inline-block';
        }
    }, 1000);
};


const getUsersAnswer = () => {
    const usersAnswers = {};

    for (const input of requiredInputs[challengeIndex]) {
        if (input === 'redValue' || input === 'greenValue' || input === 'blueValue') {
            usersAnswers[input] = +document.getElementById(input).value;
        } else {
            usersAnswers[input] = document.getElementById(input).value.trim();
        }
    }

    return usersAnswers;
};

submitButton.onclick = () => {
    const usersAnswers = getUsersAnswer();
    const correctAnswers = challengeAnswers(+challengeIndex, randomColor);

    for (const key in correctAnswers) {
        if (correctAnswers[key] !== usersAnswers[key]) {
            feedback.style.display = 'block';
            changeFeedback("Incorrect Answer, try again!!", "#ea3943");
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 3000);
            return;
        }
    };

    Edrys.sendMessage("send-sketch", JSON.stringify({ redValue: randomColor.redValue, greenValue: randomColor.greenValue, blueValue: randomColor.blueValue }));
};


tryAgainButton.onclick = () => {
    winContainer.style.display = 'none';
    startContainer.style.display = 'block';
    startChallenge.style.display = 'block';
};


ChallengeInfoButton.onclick = () => {
    colorsInfoModal.style.display = 'block';
};

closeModalButton.onclick = () => {
    colorsInfoModal.style.display = 'none';
};


let socket = new WebSocket(Edrys?.module?.serverURL || "ws://localhost:8080");

const sendSketch = (color) => {
    const code = finalCode(color);

    if (Edrys.role === "station") {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            Edrys.sendMessage("feedback", JSON.stringify({ text: "Server not connected, please try again later!!", color: "#ea3943" }));
        } else {
            socket.send(JSON.stringify({
                code: code,
                challengeId: Edrys.module.challengeId,
            }))
            Edrys.sendMessage("feedback", JSON.stringify({ text: "Uploading to the board...", color: "#f4f4f4" }));
        }
    }
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.error) {
        Edrys.sendMessage("feedback", JSON.stringify({ text: "Internal server error, please try again later!!", color: "#ea3943" }));
    } else {
        Edrys.sendMessage("challenge-solved", "Challenge solved successfully!!");
    }
};


const changeFeedback = (message, color) => {
    const feedback = document.getElementById('feedback');

    feedback.style.color = color;
    feedback.innerHTML = message;
};


Edrys.onMessage(({ from, subject, body }) => {
    if (subject === "send-sketch") {
        const color = JSON.parse(body);
        sendSketch(color);
    } else if (subject === "challenge-solved") {
        feedback.style.display = 'none';
        startContainer.style.display = 'none';
        challengeContainer.style.display = 'none';
        ChallengeInfoButton.style.display = 'none';
        colorsInfoModal.style.display = 'none';
        winContainer.style.display = 'flex';
    } else if (subject === "feedback") {
        const data = JSON.parse(body);

        feedback.style.display = 'block';
        changeFeedback(data.text, data.color);
    }
});