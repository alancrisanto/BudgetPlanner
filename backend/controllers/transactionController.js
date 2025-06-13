const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Tag = require('../models/Tag');
const Category = require('../models/Category');
const mongoose = require('mongoose');

exports.getTransactionsByAccount = async (req, res) => {
    try {
        const accountId = new mongoose.Types.ObjectId(req.params.id);
        const transactions = await Transaction.find({ account_id: accountId }).populate('category_id tags');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching transactions from account', error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const accounts = await Account.find({ user_id: userId });
        if (!accounts || accounts.length === 0) {
            return res.status(200).json([]);
        }

        const query = { account_id: { $in: accounts.map(a => a._id) } };

        if (req.query.startDate && req.query.endDate) {
            query.date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate),
            };
        }

        const transactions = await Transaction.find(query)
            .populate('category_id tags account_id');

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching transactions', error: err.message });
    }
};


exports.createTransaction = async (req, res) => {
    try {
        let {
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

        const tagIds = [];

        for (const tagName of tags) {
            const trimmedName = tagName.trim().toLowerCase(); // normalize tag
            let tag = await Tag.findOne({ name: trimmedName });

            if (!tag) {
                tag = await Tag.create({ name: trimmedName });
            }

            tagIds.push(tag._id);
        }
      
        const newTransaction = await Transaction.create({
            account_id,
            type,
            amount,
            date,
            category_id,
            name,
            tags: tagIds,
            recurring,
            frequency,
            next_date,
            end_date
        });

        // Update account totals
        const account = await Account.findById(account_id);
        if (!account) return res.status(404).json({ message: 'Account not found' });

        const numericAmount = parseFloat(amount);
        if (type === 'income') {
            account.income_total += numericAmount;
        } else {
            account.expense_total += numericAmount;
        }

        account.remainder = account.income_total - account.expense_total;
        await account.save();

        // Safely populate by re-querying
        const populatedTransaction = await Transaction.findById(newTransaction._id)
            .populate('account_id category_id tags');

        res.status(201).json(populatedTransaction);
    } catch (err) {
        console.error('Error creating transaction:', err);
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

exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
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

        const transaction = await Transaction.findById(id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        // Update account totals before updating the transaction
        const account = await Account.findById(transaction.account_id);

        if (transaction.type === 'income') {
            account.income_total -= transaction.amount;
        }
        else {
            account.expense_total -= transaction.amount;
        }
        account.remainder = account.income_total - account.expense_total;
        await account.save();

        // Update the transaction
        transaction.account_id = account_id;
        transaction.type = type;
        transaction.amount = amount;
        transaction.date = date;
        transaction.category_id = category_id;
        transaction.name = name;

        const tagIds = [];
        for (const tagName of tags) {
            const trimmed = (typeof tagName === 'object' ? tagName.name : tagName).trim().toLowerCase();
            let tag = await Tag.findOne({ name: trimmed });
            if (!tag) {
                tag = await Tag.create({ name: trimmed });
            }
            tagIds.push(tag._id);
            }
        transaction.tags = tagIds;
        transaction.recurring = recurring;
        transaction.frequency = frequency;
        transaction.next_date = next_date;
        transaction.end_date = end_date;
        await transaction.save();
        // Update account totals after updating the transaction
        if (type === 'income') {
            account.income_total += amount;
        } else {
            account.expense_total += amount;
        }
        account.remainder = account.income_total - account.expense_total;
        await account.save();
        // populate category and tags for the response
        const populatedTransaction = await transaction.populate('category_id tags');
        res.json(populatedTransaction);
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating transaction', error: err.message });
    }
}

exports.getLastTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find all accounts for the user
        const accounts = await Account.find({ user_id: userId });
        if (!accounts || accounts.length === 0) {
            return res.status(200).json([]);
        }
        // Find the last 10 transactions for the user's accounts
        const transactions = await Transaction.find({ account_id: { $in: accounts.map(account => account._id) } })
            .sort({ date: -1 })
            .limit(5)
            .populate('category_id')
            .populate('tags')
            .populate('account_id');
        if (!transactions || transactions.length === 0) {
            return res.status(200).json([]);
        }
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching last transactions from user', error: err.message });
    }
}
