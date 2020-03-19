const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  admin: Boolean,
  host: Boolean,
  active: Boolean,
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  password: String,
  location: String,
  description: String
});

UserSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = UserSchema;
