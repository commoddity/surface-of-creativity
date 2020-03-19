const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  admin: Boolean,
  host_id: Number,
  category_id: Number,
  title: String,
  link: String,
  description: String,
  photo_url: String,
  location: String,
  date: Date,
  time: String,
  public: Boolean
});

module.exports = EventSchema;
