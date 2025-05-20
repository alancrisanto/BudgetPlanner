const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
});

module.exports = mongoose.model('Transaction', transactionSchema);
