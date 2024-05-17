import { colors } from './colorValues.js';

const startContainer = document.querySelector('.start_container');
const startChallenge = document.getElementById('start_challenge');
const generatingColorContainer = document.querySelector('.generating_color_container');

const waitingContainer = document.querySelector('.waiting_container');
const chosenColor = document.getElementById('chosen_color');
const countdown = document.getElementById('countdown');

const challengeContainer = document.querySelector('.challenge_container');
const codeText = document.getElementById('code_text');
const submitButton = document.getElementById('submit');
const incorrectAnswer = document.getElementById('incorrect_answer');

const winContainer = document.querySelector('.win_container');
const tryAgainButton = document.getElementById('try_again');

const ChallengeInfoButton = document.querySelector('.challenge_info');
const colorsInfoModal = document.querySelector('.colors_info_modal');
const closeModalButton = document.getElementById('close_modal');

let randomColor;

const testText = `
    int redPin= 12;
    int greenPin = 11;
    int  bluePin = 13;

    void setup() {
        pinMode(<input class="input_large" type="text" id="redPin" name="redPin" />,  <input class="input_large" type="text" id="output" name="output" />);              
        pinMode(greenPin, OUTPUT);
        pinMode(bluePin, OUTPUT);
    }

    void  loop() {
        setColor( <input class="input_small" type="text" id="redValue" name="redValue" />, <input class="input_small" type="text" id="greenValue" name="greenValue" />, <input class="input_small" type="text" id="blueValue" name="blueValue" />); 
    }

    void setColor(int redValue, int greenValue,  int blueValue) {
        analogWrite(redPin, redValue);
        analogWrite(<input class="input_large" type="text" id="greenPin" name="greenPin" />,  greenValue);
        analogWrite(bluePin, <input class="input_large" type="text" id="blueValueArg" name="blueValueArg" />);
    }
    `
;

Edrys.onReady(() => {
    console.log("Module Fill The Blank is ready!!");

    //codeText.innerHTML = Edrys.module.config.codeText;
    codeText.innerHTML = testText;
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
    const randomIndex = Math.floor(Math.random() * colors.length);
    randomColor = colors[randomIndex];

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


submitButton.onclick = () => {
    const redPin = document.getElementById('redPin').value;
    const output = document.getElementById('output').value;
    const redValue = +document.getElementById('redValue').value;
    const greenValue = +document.getElementById('greenValue').value;
    const blueValue = +document.getElementById('blueValue').value;
    const greenPin = document.getElementById('greenPin').value;
    const blueValueArg = document.getElementById('blueValueArg').value;

    /*challengeContainer.style.display = 'none';
    winContainer.style.display = 'flex';*/

    if (redPin === 'redPin' && output === 'OUTPUT' && redValue === randomColor.redValue && greenValue === randomColor.greenValue && blueValue === randomColor.blueValue && greenPin === 'greenPin' && blueValueArg === 'blueValue') {
        challengeContainer.style.display = 'none';
        ChallengeInfoButton.style.display = 'none';
        colorsInfoModal.style.display = 'none';
        winContainer.style.display = 'flex';
    } else {
        incorrectAnswer.style.display = 'block';
        setTimeout(() => {
            incorrectAnswer.style.display = 'none';
        }, 3000);
    }
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