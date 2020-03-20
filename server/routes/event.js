const express = require('express');
const router = express.Router();
const passport = require('passport');
const Event = require('../database/Schema').Event;

router.get('/', async (req, res) => {
  try {

    const events = await Event.find();
    console.log(`Event`);
    return res.status(200).json({ data: events });
  } catch (error) {
    console.log(`error`, error);
  }

});
router.post('/create', async (req, res) => {
  try {
    const event = await new Event(req.body).save();
    return res.status(200).json({ data: event });
  } catch (error) {
    console.log(`error`, error);
  }
});
router.post('/edit', async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(req.body);
    return res.status(200).json({ data: event });
  } catch (error) {
    console.log(`error`, error);
  }
});

module.exports = router;
