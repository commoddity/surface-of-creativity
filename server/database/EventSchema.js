const mongoose = require('mongoose');
const slugify = require('../util/slugify');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  host_id: Number,
  host_name: String,
  host_description: String,
  category_id: String,
  subcategory_id: String,
  key: String,
  title: String,
  link: String,
  description: String,
  photo_url: String,
  location: String,
  date: Date,
  time: String,
  public: Boolean,
  status: String,
  approval: {
    timestamp: Date,
    approvedBy: String,
  }
});

EventSchema.pre('save', function (next) {
  this.key = slugify(this.title);
  next();
})

module.exports = EventSchema;
