//import dependencies
const { Configuration, OpenAIApi } = require('openai');
require("dotenv").config();

//openai variable
let openai;

/**
     * TODO: TEST GENERATION HERE
 */

exports.getTestGenerationPage = async (req, res) => {
    const topic = req.body.topic;
    const difficulty = req.body.difficulty;
    const numberOfQuestions = req.body.numberOfQuestions;

    const prompt = ` Write a multiple-choice test about ${topic} with ${numberOfQuestions} questions in JSON format. Difficulty should be ${difficulty}, order the possible answers with letters a, b, c, d. Also send the correct answer seperately. The format of the response should be the following: 
    [{
        "question1": "Question about topic",
        "possibleAnswers":[{"a": "answer a"}, {"b": "answer b"}, {"c": "answer c"}, {"d": "answer d"}],
        "correctAnswer": "answer key"
    }...]
    
    The response should not include any new line characters and should be compaitable with the JSON.parse() function.`;

    console.log(process.env.OPENAI_API_KEY);

    if (process.env.OPENAI_API_KEY) {
        const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
        openai = new OpenAIApi(configuration);
    }

    try {
        let response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            "max_tokens": 2000,
            "temperature": 0.7
        });
        res.status(200).json({ response: JSON.parse(response.data.choices[0].text) });
    } catch (err) {
        res.status(500).json({ error: err });
        console.log(err);
    }
};



/*exports.postTestGenerationPage = async (req, res) => {

};*/