const mongoose = require('mongoose');

exports.User = mongoose.model('User', require('./UserSchema'));
exports.Event = mongoose.model('Event', require('./EventSchema'));
exports.EventCategory = mongoose.model('EventCategory', require('./EventCategorySchema'));
