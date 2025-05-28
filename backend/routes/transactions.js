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

function calculateNextDate(current, frequency) {
    const d = new Date(current);
    switch (frequency) {
        case 'weekly': d.setDate(d.getDate() + 7); break;
        case 'biweekly': d.setDate(d.getDate() + 14); break;
        case 'monthly': d.setMonth(d.getMonth() + 1); break;
        case 'yearly': d.setFullYear(d.getFullYear() + 1); break;
    }
    return d;
}



router.get('/byAccount/:id', auth, getTransactionsByAccount); // ?account_id=...
router.get('/', auth, getTransactions); // Get all transactions for the user
router.post('/', auth, createTransaction);
router.delete('/:id', auth, deleteTransaction);
router.put('/:id', auth, updateTransaction);




router.post('/process-recurring', auth, async (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    const dueTxns = await Transaction.find({
        recurring: true,
        next_date: { $lte: new Date(today) },
        $or: [
            { end_date: null },
            { end_date: { $gte: new Date(today) } }
        ]
    });

    let created = [];

    for (const txn of dueTxns) {
        let currDate = new Date(txn.next_date);
        const endDate = txn.end_date ? new Date(txn.end_date) : new Date(today);
        const parentId = txn._id;

        // loop to create all missing transactions up to end_date probably call after recurring transaction is created. need to debug with UI still
        while (currDate <= endDate) {
            // prevent duplicates
            const exists = await Transaction.findOne({
                recurring_id: parentId,
                date: currDate
            });
            if (!exists) {
                const newTxn = await Transaction.create({
                    account_id: txn.account_id,
                    type: txn.type,
                    amount: txn.amount,
                    date: new Date(currDate),
                    category_id: txn.category_id,
                    name: txn.name,
                    tags: txn.tags,
                    recurring: false,
                    recurring_id: parentId
                });
                created.push(newTxn);
            }

            currDate = calculateNextDate(currDate, txn.frequency);
        }
    }

    res.json({ message: 'Processed all due recurring transactions', created });
});



module.exports = router;
