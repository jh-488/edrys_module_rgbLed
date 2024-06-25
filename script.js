const app = document.querySelector('.app');

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

    if (Edrys.module.challengeType === "multiplayer") {
        app.classList.add("disabled");
    }

    const randomChallengeIdx = Math.floor(Math.random() * challengeTemplates.length);
    const randomColorIdx = Math.floor(Math.random() * colors.length);
    Edrys.setItem("challengeIndex", randomChallengeIdx);
    Edrys.setItem("randomColorIndex", randomColorIdx);
});

const changeTab = (showContainers, hideContainers, displayStyle) => {
    hideContainers.forEach(container => container.style.display = 'none');
    showContainers.forEach(container => container.style.display = displayStyle);
};

startChallenge.onclick = () => {
    changeTab([generatingColorContainer], [startChallenge], "block");

    setTimeout(() => {
        changeTab([waitingContainer], [startContainer, generatingColorContainer], "block");
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
            changeTab([challengeContainer], [waitingContainer], "block");
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
    changeTab([startContainer, startChallenge], [winContainer], "block");
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
        if (Edrys.role !== "station") {
            feedback.style.display = 'none';
            changeTab([winContainer], [challengeContainer, ChallengeInfoButton, colorsInfoModal], "flex");
        } 
        if (Edrys.module.challengeType === "multiplayer") {
            changeTab([startContainer, startChallenge], [winContainer], "block");
            app.classList.add("disabled");
        }
    } else if (subject === "feedback") {
        const data = JSON.parse(body);

        feedback.style.display = 'block';
        changeFeedback(data.text, data.color);
    }
});


// Handling the multiplayer mode messages
Edrys.onMessage(({ from, subject, body, module }) => {
    if (subject === "player-turn" && body === Edrys.liveUser.displayName) {
        app.classList.remove("disabled");
    } else if (subject === "player-turn" && body !== Edrys.liveUser.displayName) {
        app.classList.add("disabled");
    } 
}, (promiscuous = true));




// Challenge Data

const colors = [
    {
        name: "RED",
        redValue: 255,
        greenValue: 0,
        blueValue: 0
    },
    {
        name: "GREEN",
        redValue: 0,
        greenValue: 255,
        blueValue: 0
    },
    {
        name: "BLUE",
        redValue: 0,
        greenValue: 0,
        blueValue: 255
    },
    {
        name: "YELLOW",
        redValue: 255,
        greenValue: 255,
        blueValue: 0
    },
    {
        name: "CYAN",
        redValue: 0,
        greenValue: 255,
        blueValue: 255
    },
    {
        name: "PURPLE",
        redValue: 255,
        greenValue: 0,
        blueValue: 255
    },
    {
        name: "WHITE",
        redValue: 255,
        greenValue: 255,
        blueValue: 255
    }
];


const challengeTemplates = [
    `
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
    `,
    `
    int redPin= 12;
    int greenPin = 11;
    int  bluePin = 13;

    void setup() {
        <input class="input_large" type="text" id="pinMode" name="pinMode" />(redPin,  OUTPUT);              
        <input class="input_large" type="text" id="pinMode" name="pinMode" />(greenPin, OUTPUT);
        <input class="input_large" type="text" id="pinMode" name="pinMode" />(bluePin, OUTPUT);
    }

    void  loop() {
        <input class="input_large" type="text" id="setColor" name="setColor" />( <input class="input_small" type="text" id="redValue" name="redValue" />, <input class="input_small" type="text" id="greenValue" name="greenValue" />, <input class="input_small" type="text" id="blueValue" name="blueValue" />); 
    }

    void setColor(int redValue, int greenValue,  int blueValue) {
        <input class="input_large" type="text" id="analogWrite" name="analogWrite" />(redPin, redValue);
        <input class="input_large" type="text" id="analogWrite" name="analogWrite" />(greenPin,  greenValue);
        <input class="input_large" type="text" id="analogWrite" name="analogWrite" />(bluePin, blueValue);
    }
    `,
    `
    int redPin= 12;
    int greenPin = 11;
    int  bluePin = 13;

    void setup() {
        pinMode(<input class="input_large" type="text" id="redPin" name="redPin" />,  <input class="input_large" type="text" id="output" name="output" />);              
        pinMode(<input class="input_large" type="text" id="greenPin" name="greenPin" />, <input class="input_large" type="text" id="output" name="output" />);
        pinMode(<input class="input_large" type="text" id="bluePin" name="bluePin" />, <input class="input_large" type="text" id="output" name="output" />);
    }

    void  loop() {
        setColor( <input class="input_small" type="text" id="redValue" name="redValue" />, <input class="input_small" type="text" id="greenValue" name="greenValue" />, <input class="input_small" type="text" id="blueValue" name="blueValue" />); 
    }

    void setColor(int <input class="input_large" type="text" id="redValueArg" name="redValueArg" />, int <input class="input_large" type="text" id="greenValueArg" name="greenValueArg" />,  int <input class="input_large" type="text" id="blueValueArg" name="blueValueArg" />) {
        analogWrite(redPin, redValue);
        analogWrite(greenPin,  greenValue);
        analogWrite(bluePin, blueValue);
    }
    `
];


const challengeAnswers = (challengeIdx, randomColor) => {
    switch (challengeIdx) {
        case 0:
            return {
                redPin: 'redPin',
                output: 'OUTPUT',
                redValue: randomColor.redValue,
                greenValue: randomColor.greenValue,
                blueValue: randomColor.blueValue,
                greenPin: 'greenPin',
                blueValueArg: 'blueValue',
            };
        case 1:
            return {
                pinMode: 'pinMode',
                setColor: 'setColor',
                redValue: randomColor.redValue,
                greenValue: randomColor.greenValue,
                blueValue: randomColor.blueValue,
                analogWrite: 'analogWrite',
            };
        case 2:
            return {
                redPin: 'redPin',
                greenPin: 'greenPin',
                bluePin: 'bluePin',
                output: 'OUTPUT',
                redValue: randomColor.redValue,
                greenValue: randomColor.greenValue,
                blueValue: randomColor.blueValue,
                redValueArg: 'redValue',
                greenValueArg: 'greenValue',
                blueValueArg: 'blueValue',
            };
        default:
            break;
    }
};


const requiredInputs = [
    ["redPin", "output", "redValue", "greenValue", "blueValue", "greenPin", "blueValueArg"], 
    ["pinMode", "redValue", "greenValue", "blueValue", "setColor", "analogWrite"], 
    ["redPin", "output", "greenPin", "bluePin", "redValue", "greenValue", "blueValue", "redValueArg", "greenValueArg", "blueValueArg"] 
];


const finalCode = (chosenColor) => {
    const code = `
        int redPin= 12;
        int greenPin = 11;
        int  bluePin = 13;

        void setup() {
            pinMode(redPin,  OUTPUT);              
            pinMode(greenPin, OUTPUT);
            pinMode(bluePin, OUTPUT);
        }

        void  loop() {
            setColor( ${chosenColor.redValue}, ${chosenColor.greenValue}, ${chosenColor.blueValue}); 
        }

        void setColor(int redValue, int greenValue,  int blueValue) {
            analogWrite(redPin, redValue);
            analogWrite(greenPin,  greenValue);
            analogWrite(bluePin, blueValue);
        }
    `

    return code
};