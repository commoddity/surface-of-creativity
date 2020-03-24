// Load in .env variables
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const passport = require('./auth/passport');
const moment = require('moment');
const { EventCategory, Event } = require('./database/Schema');


const mongoose = require('mongoose');

const port = process.env.SERVER_PORT;

// Create Express app
const app = express();

// Database connection
mongoose.connect(`${process.env.MONGO_DB_NAME}`, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', () => console.error.bind(console, 'connection error:'));
db.once('open', () =>
  console.log(`MongoDB connected to ${process.env.MONGO_DB_NAME}`)
);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(flash());

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

app.use(async (req, res, next) => {
  res.locals.moment = moment;
  res.locals.user = req.user;
  res.locals.navbarCategories = await EventCategory.find({ showOnNavbar: true });
  res.locals.blocksSectionCategories = await EventCategory.find({ showOnBlocksSection: true });
  next();
});


// Register app routes
app.use('/category', require('./routes/category'));
app.use('/event', require('./routes/event'));
app.use('/events', async (req, res) => {
  res.locals.search = '';
  res.locals.events = await Event.find({ status: "Live" });
  res.render('events/events', { pageTitle: `Events` });
});
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => console.log(`App listening on ${port}!`));
