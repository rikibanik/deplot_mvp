const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const homeController = require('../controllers/homeController');



router.get('/',authMiddleware.authUser,homeController.loadHomePage); ;

module.exports = router;