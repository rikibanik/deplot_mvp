const express = require('express');
const router = express.Router();
const deployController = require('../controllers/deployController');

router.post('/', deployController.handleDeployment);

module.exports = router;
