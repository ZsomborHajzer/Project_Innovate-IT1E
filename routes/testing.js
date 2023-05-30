const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
const readline = require('readline');
let openai;

require("dotenv").config();

// openAI configuration
if (process.env.OPENAI_API_KEY) {
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    openai = new OpenAIApi(configuration);
}
//import controllers
const { getTesting } = require('../controllers/testing');

// api routes
router.get('/', getTesting);

module.exports = router;

const instructions = "You are an AI teacher. Answer the questions as clearly and concisely as possible.";

let htmlCss = "HTML and CSS, You are a teacher, write down a test question about HTML and CSS with multiple answers to it, make in a alphabet order, but not say which one is correct.";
let php = "PHP, You are a teacher, write down a test question about PHP with multiple answers to it, make in a alphabet order, but not say which one is correct.";
let java = "Java, You are a teacher, write down a test question about Java with multiple answers to it, make in a alphabet order, but not say which one is correct.";
let arrayPrompts = [htmlCss, php, java];


function selectPrompt() {
    return new Promise(async (resolve) => {
        console.log("Select a topic:");
        arrayPrompts.forEach((prompt, index) => {
            console.log(`${index + 1}: ${prompt.split(',')[0]}`);
        });

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Enter the number of your choice: ", function (userChoice) {
            const selectedIndex = parseInt(userChoice) - 1;
            if (selectedIndex >= 0 && selectedIndex < arrayPrompts.length) {
                resolve(arrayPrompts[selectedIndex]);
            } else {
                console.log("Invalid choice! Please try again.");
                selectPrompt().then(resolve);
            }
            rl.close();
        });
    });
}

async function startAssistant() {
    const selectedPrompt = await selectPrompt();

    let correctAnswers = 0;
    for (let i = 0; i < 10; i++) {
        let response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `\n${selectedPrompt}\n`,
            "max_tokens": 256,
            "temperature": 1,
        });

        let response_text = response.data.choices[0].text;
        console.log(response_text);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let userAnswer = await new Promise((resolve) => {
            rl.question("Enter your answer: ", function (answer) {
                resolve(answer);
                rl.close();
            });
        });

        let checkAnswerResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `The question is:\n${response_text}\nThe user's answer is ${userAnswer}. Respond 'yes' if the answer is correct, 'no' otherwise.`,
            "max_tokens": 10,
            "temperature": 0.5,
        });

        let checkAnswerText = checkAnswerResponse.data.choices[0].text.trim();
        console.log(checkAnswerResponse.data.choices[0].text);

        if (checkAnswerText.toLowerCase() === 'yes' || checkAnswerText.toLowerCase() === 'correct') {
            console.log("Correct!");
            correctAnswers++;
        } else {
            console.log("Incorrect!");
        }
    }

    console.log(`You got ${correctAnswers} out of 10 questions correct!`);
}

startAssistant();