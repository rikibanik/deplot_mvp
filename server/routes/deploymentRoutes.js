const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const deploymentController = require('../controllers/deploymentController');




router.get('/new',authMiddleware.authUser,deploymentController.newDeployement); ;

module.exports = router;