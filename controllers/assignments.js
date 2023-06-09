


exports.getAssigment = async (req, res) => {


    res.status(200).json({
        message: 'Assigment page is working',
    })
};

exports.getSpecificAssigment = async (req, res) => {
    res.status(200).json({
        message: 'Specific assigment page is working',
    })
}

exports.getNumberOfQuestions = async (req, res) => {
    res.status(200).json({
        message: 'Number of questions page is working',
    })
};