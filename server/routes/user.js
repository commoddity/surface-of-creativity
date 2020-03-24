const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const { User } = require('../database/Schema');



router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = res.locals.user = await User.findById(userId);
    res.render('users/user', { pageTitle: `User | ${user.first_name}` });
  } catch (error) {
    console.log(`error`, error);
  }
});


module.exports = router;
