const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  admin: Boolean,
  host_id: Number,
  host_name: String,
  host_description: String,
  category_id: String,
  subcategory_id: String,
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

module.exports = EventSchema;
