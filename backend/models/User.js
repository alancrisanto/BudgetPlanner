const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  firstName: String,
  lastName: String,

  preferences: {
    currencySymbol: { type: String, default: '$' },
  },

  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('User', userSchema);
