const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/contact', apiController.submitContact);
router.post('/chat', apiController.chatWithAI);

module.exports = router;
