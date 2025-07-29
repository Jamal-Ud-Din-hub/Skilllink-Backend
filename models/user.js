const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  avatar: String,
  description: String,
  skills: [String],
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

UserSchema.methods.comparePassword = async function (pass) {
  return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model('User', UserSchema);
