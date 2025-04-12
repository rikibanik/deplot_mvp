const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const userModel = require("../db/models/userModel");
const githubController = require("../controllers/githubController");
const axios = require("axios");

router.post(
  "/register",
  [
    // body('name.firstname').isLength({ min: 3 }).withMessage("Name must be atleast 3 characters long"),
    // body('name.lastname').isLength({ min: 3 }).withMessage("Name must be atleast 3 characters long"),
    // body('email').isEmail().withMessage("Email must be a valid email"),
    // body('password').isLength({ min: 5 }).withMessage("Password must be atleast 5 characters long")
  ],
  userController.registerUser
);
router.post(
  "/login",
  [
    // body('email').isEmail().withMessage("Email must be a valid email"),
    // body('password').isLength({ min: 5 }).withMessage("Password must be atleast 5 characters long")
  ],
  userController.loginUser
);
router.get("/", async (req, res) => {
  try {
  } catch (e) {
    res.status(400).json({ e });
  }
});
router.get("/auth/github", authMiddleware.authUser, (req, res) => {
    const redirectUrl = `https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new`;
    res.redirect(redirectUrl);
});


router.get("/auth/github/callback",authMiddleware.authUser, githubController.storeGithubAccessToken);





router.get("/login", userController.loadLoginPage);
// router.get('/get-repos',authMiddleware.authUser,async (req,res)=>{
//   const email = req.user.email
//   const user = await userModel.findOne({email:email});
//   if(!user.githubREpos){
//     return res.status(400).json({message:"No repos found"});
//   }
//   res.json(user.githubREpos);
// })
module.exports = router;
