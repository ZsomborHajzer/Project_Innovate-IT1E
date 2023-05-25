const express = require('express');
const router = express.Router();
const { Configuration,  OpenAIApi } = require('openai');
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
        prompt: "You are a teacher, write down a test question about HTML and CSS with multiple answers to it, but not say which one is correct.",
        "max_tokens": 60,
        "temperature": 1,
    });

    let response_text = response.data.choices[0].text;
    console.log(response_text);


}

// Call the startAssistant function

startAssistant();