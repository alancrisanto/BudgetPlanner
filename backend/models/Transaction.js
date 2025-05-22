const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  recurring: { type: Boolean, default: false },
  frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly', 'yearly'], default: null },
  next_date: { type: Date }, // auto-populate for tracking
  end_date: { type: Date, default: null }, // ⏱ Stop recurring after this
  recurring_id: { type: mongoose.Schema.Types.ObjectId, default: null } // points to the "parent" recurring


});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
