const express = require('express');
const router = express.Router();
const { Configuration,  OpenAIApi } = require('openai');
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

// Replace "instructions" with your desired instructions
const instructions = "You are an AI teacher. Answer the questions as clearly and concisely as possible.";

// back-end testing (function for AI) //
async function startAssistant() {
    let response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "You are a teacher, write down a test question about HTML and CSS with multiple answers to it, make in a alphabet order, but not say which one is correct.",
        "max_tokens": 256,
        "temperature": 1,
    });

    let response_text = response.data.choices[0].text;
    console.log(response_text);

    // Read user's answer from console
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter your answer: ", async function (userAnswer) {
        // Check if the answer is correct
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
        } else {
            console.log("Incorrect!");
        }

        rl.close();
    });
}

startAssistant();