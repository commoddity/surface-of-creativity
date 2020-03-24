const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get(
  '/',
  require('connect-ensure-login').ensureLoggedOut(),
  (req, res) => {
    res.render('login', {
      user: null,
      errors: {
        email: req.flash('email'),
        password: req.flash('password')
      }
    });
  }
);

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.post(
  '/',
  passport.authenticate('localLogin', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

module.exports = router;
