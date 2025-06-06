const Account = require('../models/Account');

exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user_id: req.user.id });
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching accounts', error: err.message });
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await Account.findOne({ _id: id, user_id: req.user.id });
        res.json(account);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching account', error: err.message });
    }
}

exports.createAccount = async (req, res) => {
  try {

        console.log('req.user:', req.user);
        console.log('req.body:', req.body);
        const { name } = req.body;
        const newAccount = await Account.create({
            user_id: req.user.id,
            name
        });
        res.status(201).json(newAccount);
    } catch (err) {
        res.status(500).json({ message: 'Error creating account', error: err.message });
    }
};


exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Account.findOneAndDelete({ _id: id, user_id: req.user.id });
        if (!deleted) return res.status(404).json({ message: 'Account not found' });
        res.json({ message: 'Account deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting account', error: err.message });
    }
};
