const express = require('express');
const router = express.Router();
const { register, login, verifyToken, forgotPassword, resetPassword } = require('../controllers/AuthController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-token', verifyToken)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
module.exports = router;
