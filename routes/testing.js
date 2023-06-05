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
// import controllers
const { getTesting } = require('../controllers/testing');

// api routes
router.get('/', getTesting);

module.exports = router;

let arrayPrompts = [
    { language: "HTML and CSS", topics: ['Styling', 'Grids', 'Flex boxes', 'HTML syntax'] },
    { language: "PHP", topics: ['Login and registration', 'Fetching', 'Upload files',] },
    { language: "Java", topics: ['Basics', 'OOP', 'JUnit testing'] },
];

function selectPrompt() {
    return new Promise(async (resolve) => {
        console.log("Select a programming language:");
        arrayPrompts.forEach((prompt, index) => {
            console.log(`${index + 1}: ${prompt.language}`);
        });

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Enter the number of your choice: ", async function (userChoice) {
            const selectedIndex = parseInt(userChoice) - 1;
            if (selectedIndex >= 0 && selectedIndex < arrayPrompts.length) {
                const selectedLanguage = arrayPrompts[selectedIndex].language;
                console.log(`You have selected ${selectedLanguage}.`);

                // Display list of topics and ask for topic
                console.log("Select a topic:");
                arrayPrompts[selectedIndex].topics.forEach((topic, index) => {
                    console.log(`${index + 1}: ${topic}`);
                });

                rl.question("Enter the number of your choice: ", function (userTopicChoice) {
                    const selectedTopicIndex = parseInt(userTopicChoice) - 1;
                    if (selectedTopicIndex >= 0 && selectedTopicIndex < arrayPrompts[selectedIndex].topics.length) {
                        const selectedTopic = arrayPrompts[selectedIndex].topics[selectedTopicIndex];
                        console.log(`You have selected ${selectedTopic}.`);
                        resolve({ language: selectedLanguage, topic: selectedTopic });
                    } else {
                        console.log("Invalid choice! Please try again.");
                        selectPrompt().then(resolve);
                    }
                    rl.close();
                });

            } else {
                console.log("Invalid choice! Please try again.");
                selectPrompt().then(resolve);
            }
        });
    });
}

async function generateQuestions(promptObj) {
    let questions = [];

    for (let i = 0; i < 10; i++) {
        // Include language and topic in a prompt
        let prompt = `You are a teacher, be specific, write down a test question about ${promptObj.language} (${promptObj.topic}) with multiple answers to it, make one line gap between them, sometimes ask where is a mistake in a code. Make questions and answers in alphabet order and only use A,B,C,D,E. Do not say which one is correct.`;

        let response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            "max_tokens": 2000,
            "temperature": 1,
        });

        let response_text = response.data.choices[0].text;
        questions.push(response_text);
    }

    return questions;
}

async function startAssistant() {
    const selectedPrompt = await selectPrompt();
    const questions = await generateQuestions(selectedPrompt);

    let correctAnswers = 0;
    for (let i = 0; i < 10; i++) {
        console.log(`Question ${i + 1}:`);
        console.log(questions[i]);

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
            prompt: `The question is:\n${questions[i]}\nThe user's answer is ${userAnswer}. Respond 'yes' if the answer is correct, 'no' otherwise.`,
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