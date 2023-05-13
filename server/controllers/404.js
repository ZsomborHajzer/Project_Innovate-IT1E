exports.getErrorPage = async (req, res) => {
    res.status(200).json({
        message: '404 ErrorPageIsWorking!!!',
    })
};