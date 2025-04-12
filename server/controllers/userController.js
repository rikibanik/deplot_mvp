const { validationResult, ExpressValidator } = require('express-validator');
const userModel = require('../db/models/userModel');
// const blackList = require('../db/models/blacklistToken');
const userService = require('../services/userService');
const axios = require('axios');

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        
        return res.status(400).json({ errors: errors.array() });
    }
    const exist = await userModel.findOne({ email: req.body.email });
    if (exist) {
        return res.status(401).json({ errors: "user with this email exist" })
    }
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: await userModel.hashPassword(req.body.password)
    };
    const result = await userService.registerUser(user);
    res.cookie('token', result.token, {
        httpOnly: true,  // Prevents JavaScript from accessing it
        secure: process.env.NODE_ENV === 'production',   // Set to `true` if using HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
        partitioned: process.env.NODE_ENV === 'production'  // Adjust for cross-site requests
    }).status(201).json({ result });

};
module.exports.loginUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() });
    }
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    const result = await userService.loginUser(user);
    console.log(result.token)
    res.cookie('token', result.token, {
        httpOnly: true,  // Prevents JavaScript from accessing it
        secure: process.env.NODE_ENV === 'production',   // Set to `true` if using HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
        partioned: process.env.NODE_ENV === 'production'  // Adjust for cross-site requests
    })
    res.status(201).redirect('/'); // Redirect to the home page after successful login
}
module.exports.logoutUser = async (req, res) => {
    res.clearCookie('token');
    const token = req.cookies.token || (req.header('Authorization') && req.header('Authorization').split(' ')[1]);
    await blackList.create({ token });
    res.status(200).json({message: "Successfully logged out"});
}


module.exports.loadLoginPage = async (req, res) => {
    res.render('login-form', { title: 'Login' });
}
module.exports.getTokenResponse = async (code, email) => {
    try{
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
              client_id: process.env.GITHUB_CLIENT_ID,
              client_secret: process.env.GITHUB_CLIENT_SECRET,
              code: code,
            },
            {
              headers: {
                accept: "application/json",
              },
            }
          );
          console.log(tokenResponse.data);
          
        const accessToken = tokenResponse.data.access_token; //store this token in the database
        const user = await userModel.findOne({ email: email });
        user.githubAccessToken = accessToken;
        await user.save();
        console.log(user);
        return accessToken;
    }
    catch(err){
        console.error(err);
        throw new Error("Error fetching access token");
    }
    
}
module.exports.getRepoResponse = async (accessToken,email) => {
    //this will be fetched from the database in future
    const reposResponse = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: "application/vnd.github+json",
        },
      });
      const user = await userModel.findOne({ email: email });
      user.githubREpos = reposResponse.data.map(repo => ({
        name: repo.name,
        url: repo.html_url,
        language: repo.language,
      }));
      console.log(user.githubREpos);
      await user.save();
    return reposResponse.data;
}