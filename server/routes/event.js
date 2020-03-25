const express = require('express');
const router = express.Router();
const Event = require('../database/Schema').Event;
const EventCategory = require('../database/Schema').EventCategory;

router.get('/',
  async (req, res) => {
    try {
      const search = { status: 'Live' };
      const q = res.locals.search = req.query.query || '';
      if (q !== 'all' &&
        q !== '') {
        search.$or = [
          { 'title': { '$regex': q, '$options': 'i' } },
          { 'category_id': { '$regex': q, '$options': 'i' } },
          { 'subcategory_id': { '$regex': q, '$options': 'i' } },
          { 'description': { '$regex': q, '$options': 'i' } },
          { 'host_name': { '$regex': q, '$options': 'i' } },
          { 'host_description': { '$regex': q, '$options': 'i' } },
          { 'location': { '$regex': q, '$options': 'i' } },
        ]
      }
      res.locals.events = await Event.find(search);
      res.render('events/events', { pageTitle: `Events` });
    } catch (error) {
      console.log(`error`, error);
    }
  });

router.get('/create',
  async (req, res) => {
    try {
      res.locals.categories = await EventCategory.find();
      res.render('events/create-event', { event: null });
    } catch (error) {
      console.log(`error`, error);
    }
  });


router.get('/category/:category_id', async (req, res) => {
  try {
    const search = res.locals.search = `${req.params.category_id}`;
    res.locals.events = await Event.find({ status: 'Live', $or: [{ 'category_id': { '$regex': search, '$options': 'i' } }, { 'subcategory_id': { '$regex': search, '$options': 'i' } }] });
    res.render('events/events', { pageTitle: `Events | ${req.params.category_id}` });
  } catch (error) {
    console.log(`error`, error);
  }
});

router.get('/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = res.locals.event = await Event.findOne({ key: eventId });
    res.render('events/event', { pageTitle: `Event | ${event.title}` });
  } catch (error) {
    console.log(`error`, error);
  }
});

router.post('/create/:eventId?', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (eventId) {
      var event = await Event.findById(eventId);
      for (var prop in req.body) {
        event[prop] = req.body[prop]
      }
      await event.save();
    } else {
      req.body.status = 'Review';
      var event = await new Event(req.body).save();
    }
    res.redirect(`/event/${event.key}`);
  } catch (error) {
    console.log(`error`, error);
  }
});

module.exports = router;
