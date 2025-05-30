const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthMiddleware');
const Transaction = require('../models/Transaction');

const {
    getTransactionsByAccount,
    getTransactions,
    createTransaction,
    deleteTransaction,
    updateTransaction
} = require('../controllers/TransactionController');

router.get('/', auth, getTransactions); // by user
router.get('/:id', auth, getTransactionsByAccount); // by account
router.post('/', auth, createTransaction);
router.delete('/:id', auth, deleteTransaction);
router.put('/:id', auth, updateTransaction);


module.exports = router;
