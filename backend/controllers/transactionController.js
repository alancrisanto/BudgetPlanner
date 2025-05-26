const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const mongoose = require('mongoose');

exports.getTransactions = async (req, res) => {
    try {
        const accountId = new mongoose.Types.ObjectId(req.query.account_id);
        const transactions = await Transaction.find({ account_id: accountId }).populate('category_id tags');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching transactions', error: err.message });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const {
            account_id,
            type,
            amount,
            date,
            category_id,
            name,
            tags,
            recurring,
            frequency,
            next_date,
            end_date
        } = req.body;


        const newTransaction = await Transaction.create({
            account_id,
            type,
            amount,
            date,
            category_id,
            name,
            tags,
            recurring,
            frequency,
            next_date,
            end_date

        });

        // Update account totals
        const account = await Account.findById(account_id);
        if (!account) return res.status(404).json({ message: 'Account not found' });

        if (type === 'income') {
            account.income_total += amount;
        } else {
            account.expense_total += amount;
        }

        account.remainder = account.income_total - account.expense_total;
        await account.save();

        // populate category and tags for the response
        const populatedTransaction = await newTransaction.populate('category_id tags');

        res.status(201).json(populatedTransaction);
    } catch (err) {
        res.status(500).json({ message: 'Error creating transaction', error: err.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findById(id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        const account = await Account.findById(transaction.account_id);
        if (transaction.type === 'income') {
            account.income_total -= transaction.amount;
        } else {
            account.expense_total -= transaction.amount;
        }

        account.remainder = account.income_total - account.expense_total;
        await account.save();

        await transaction.deleteOne();

        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting transaction', error: err.message });
    }
};
