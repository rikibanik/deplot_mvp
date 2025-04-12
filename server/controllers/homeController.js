



module.exports.loadHomePage = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.render('index', { title: 'Home', user: user });
}