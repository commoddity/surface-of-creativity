// Load in .env variables
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const middleware = require('connect-ensure-login');
const fileStore = require('session-file-store')(session);
const path = require('path');
const flash = require('connect-flash');
const passport = require('./auth/passport');

const mongoose = require('mongoose');
// const config = require('./config/default');

const port = process.env.SERVER_PORT;

// Create Express app
const app = express();

// Database connection
mongoose.connect(`mongodb://localhost/${process.env.MONGO_DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('public'));
app.use(flash());

app.use(cookieParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    store: new fileStore({
      path: './server/sessions'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    maxAge: Date().now + 60 * 1000 * 30
  })
);

// Register app routes
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));

app.get('*', middleware.ensureLoggedIn(), (req, res) => {
  res.render('index');
});

app.listen(port, () => console.log(`App listening on ${port}!`));
