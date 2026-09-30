const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    mail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.createWithPassword = async function (mail, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  return this.create({
    mail: mail.toLowerCase().trim(),
    passwordHash
  });
};

module.exports = mongoose.model('User', userSchema);