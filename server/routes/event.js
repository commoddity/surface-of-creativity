const express = require('express');
const router = express.Router();
const moment = require('moment');
const middleware = require('connect-ensure-login');
const Event = require('../database/Schema').Event;

router.use((req, res, next) => {
  res.locals.moment = moment;
  res.locals.user = req.user;
  next();
});

router.get('/all',
  async (req, res) => {
    res.locals.events = await Event.find({ status: 'Live' });
    res.render('events/events', { pageTitle: `Events` });
  });

router.get('/admin/list/asdf123',
  async (req, res) => {
    res.locals.events = await Event.find();
    res.render('events/list-event', { pageTitle: `Events` });
  });
router.get('/create',
  (req, res) => {
    res.render('events/create-event', { event: null });
  });

router.get('/delete/:id',
  async (req, res) => {
    try {
      await Event.deleteOne({ _id: req.params.id })
      res.redirect('/event/admin/list/asdf123');
    } catch (error) {
      console.log(`error`, error);
    }
  });
router.get('/edit/:id',
  async (req, res) => {
    try {
      const event = res.locals.event = await Event.findById(req.params.id)
      res.render('events/create-event', { pageTitle: `Edit Event | ${event.title}` });
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
    const event = res.locals.event = await Event.findById(eventId);
    res.render('events/event', { pageTitle: `Event | ${event.title}` });
  } catch (error) {
    console.log(`error`, error);
  }
});

router.post('/create/:eventId?', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (eventId) {
      await Event.updateOne({ _id: eventId }, req.body);
    } else {
      req.body.status = 'Review';
      var event = await new Event(req.body).save();
    }
    res.redirect(`/event/${eventId || event._id}`);
  } catch (error) {
    console.log(`error`, error);
  }
});

module.exports = router;
