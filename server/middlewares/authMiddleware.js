
const jwt = require('jsonwebtoken');
const blackList = require('../db/models/blacklistToken');
const userModel = require('../db/models/userModel');

// import captainModel = require('../db/models/captain.model';


module.exports.authUser = async (req, res, next) => {

    const token = req.cookies.token || (req.header('Authorization') && req.header('Authorization').split(' ')[1]);
    if (!token) {
        return res.status(401).redirect('/user/login');
    }

    // const isBlackListed = await blackList.findOne({ token: token.token });
    // if (isBlackListed) {
    //     res.clearCookie('token');
    //     return res.status(401).redirect('/user/login');
    // }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        // id of the user is stored is decode._id
        //    console.log(decode)
        const user = await userModel.findById(decode._id);
        if (!user) {
            return res.status(401).json({ message: `User not found ${decode._id}` });
        }
        req.user = user;
        req.token = token;    // added to pass token to logout
        next();
    } catch (error) {
        res.clearCookie('token');
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

