const express = require('express');
const router = express.Router();
// const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const githubController = require('../controllers/githubController');
router.get('/repos', authMiddleware.authUser, githubController.getRepositories);



module.exports = router;