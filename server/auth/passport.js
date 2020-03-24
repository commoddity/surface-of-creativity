const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../database/Schema').User;
const shortid = require('shortid');

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Passport strategy for handling user registration
passport.use(
  'localRegister',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne(
        { $or: [{ email: email }, { username: req.body.username }] },
        (err, user) => {
          if (err) return done(err);
          if (user) {
            if (user.email === email) {
              req.flash('email', 'Email is already taken');
            }
            if (user.username === req.body.username) {
              req.flash('username', 'Username is already taken');
            }

            return done(null, false);
          } else {
            console.log(`======new User====== ${req.body.first_name}`);
            let user = new User();
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.email = req.body.email;
            user.password = user.generateHash(password);
            user.username = req.body.username;
            user.save((err) => {
              if (err) throw err;
              return done(null, user);
            });
          }
        }
      );
    }
  )
);

// Passport strategy for authenticating users
passport.use(
  'localLogin',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);

        if (!user)
          return done(null, false, req.flash('email', "username doesn't exist."));

        if (!user.validPassword(password))
          return done(
            null,
            false,
            req.flash('password', 'Oops! Wrong password.')
          );
        return done(null, user);
      });
    }
  )
);

module.exports = passport;
