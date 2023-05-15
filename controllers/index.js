exports.getIndexPage = async (req, res) => {
    res.status(200).json({
        message: 'Index Page is Working',
    })
};