const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, maxlength: 55 },
  password: { type: String, required: true, maxlength: 255 }
});

module.exports = mongoose.model('User', userSchema);
