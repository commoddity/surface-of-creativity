const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  isAdmin: Boolean,
  host: Boolean,
  active: Boolean,
  first_name: String,
  last_name: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  location: String,
  description: String,
  createdAt: Date,
  updatedAt: Date,
});

UserSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = UserSchema;
