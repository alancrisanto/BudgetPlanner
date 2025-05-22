const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthMiddleware');
const {
    getAccounts,
    createAccount,
    deleteAccount
} = require('../controllers/accountController');

router.get('/', auth, getAccounts);
router.post('/', auth, createAccount);
router.delete('/:id', auth, deleteAccount);

module.exports = router;
