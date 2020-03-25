const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');
const { EventCategory, Event, User } = require('../database/Schema');

router.get('/events', 
  async (req, res) => {
    res.locals.events = await Event.find();
    res.render('events/list-event', { pageTitle: `Events` });
  });

  router.get('/event/delete/:id',
  async (req, res) => {
    try {
      await Event.deleteOne({ _id: req.params.id })
      res.redirect('/admin/events');
    } catch (error) {
      console.log(`error`, error);
    }
  });
router.get('/event/edit/:id',
  async (req, res) => {
    try {
      res.locals.categories = await EventCategory.find();
      const event = res.locals.event = await Event.findById(req.params.id)
      res.render('events/create-event', { pageTitle: `Edit Event | ${event.title}` });
    } catch (error) {
      console.log(`error`, error);
    }
  });
// ==================== categories ==============================
router.get('/categories',
  async (req, res) => {
    res.locals.categories = await EventCategory.find();
    res.render('categories/list-categories', { pageTitle: `Categories` });
  });

// ==================== USERS ==============================
router.get('/users',
  async (req, res) => {
    res.locals.users = await User.find();
    res.render('users/list-users', { pageTitle: `Users` });
  });

router.get('/user/delete/:id',
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      await User.deleteOne({ _id: req.params.id })
      res.redirect('/admin/users');
    } catch (error) {
      console.log(`error`, error);
    }
  });
router.get('/user/edit/:id',
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const user = res.locals.user = await User.findById(req.params.id)
      res.render('users/create-user', { pageTitle: `Edit User | ${user.first_name}` });
    } catch (error) {
      console.log(`error`, error);
    }
  });

router.post('/user/create/:userId?',
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      if (userId) {
        await User.updateOne({ _id: userId }, req.body);
      } else {
        req.body.status = 'Review';
        var user = await new User(req.body).save();
      }
      res.redirect(`/admin/users`);
    } catch (error) {
      console.log(`error`, error);
    }
  });
module.exports = router;
