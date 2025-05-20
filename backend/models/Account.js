const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  income_total: { type: Number, default: 0 },
  expense_total: { type: Number, default: 0 },
  remainder: { type: Number, default: 0 }
});

module.exports = mongoose.model('Account', accountSchema);
