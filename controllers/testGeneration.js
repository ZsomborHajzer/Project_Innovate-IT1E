

exports.getTestGenerationPage = async (req, res) => {
    const topic = req.body.topic;
    const difficulty = req.body.difficulty;
    const numberOfQuestions = req.body.numberOfQuestions;

    /**
     * TODO: TEST GENERATION HERE
     */

    res.status(200).json({
        message: 'Test Generation Page is Working',
    })

};

exports.postTestGenerationPage = async (req, res) => {

};