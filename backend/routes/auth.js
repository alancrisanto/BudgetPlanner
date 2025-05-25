const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/AuthController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-token', verifyToken)

module.exports = router;
