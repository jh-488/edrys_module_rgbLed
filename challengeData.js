export const colors = [
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


export const challengeTemplates = [
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


export const challengeAnswers = (challengeIdx, randomColor) => {
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


export const requiredInputs = [
    ["redPin", "output", "redValue", "greenValue", "blueValue", "greenPin", "blueValueArg"], 
    ["pinMode", "redValue", "greenValue", "blueValue", "setColor", "analogWrite"], 
    ["redPin", "output", "greenPin", "bluePin", "redValue", "greenValue", "blueValue", "redValueArg", "greenValueArg", "blueValueArg"] 
];


export const finalCode = (chosenColor) => {
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