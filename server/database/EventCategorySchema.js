const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventCategorySchema = new Schema({
  name: String,
  icon: String,
  showOnBlocksSection: Boolean,
  showOnNavbar: Boolean,
  createdAt: Date,
});

module.exports = EventCategorySchema;
