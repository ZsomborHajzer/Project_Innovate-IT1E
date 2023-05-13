exports.getHomePage = async (req, res) => {
    res.status(200).json({
        message: 'Home Page Is Working!',
    })
};