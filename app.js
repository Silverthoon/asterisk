var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var favicon = require('serve-favicon');
const paginate = require('express-paginate');

//session database infos
var MySQLStore = require('express-mysql-session')(session);

var options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'asterisk'
};

var sessionStore = new MySQLStore(options);

//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var asteriskRouter = require('./routes/asterisk');

const { signedCookie } = require('cookie-parser');

//sequelize connection
const db = require('./public/database/connection');

db.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err =>console.log('Error : '+ err));

var app = express();

app.use(paginate.middleware(10, 50));

//favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session database
const TWO_HOURS = 1000 * 60 * 60 * 2;

app.use(session({
  saveUninitialized: false,
  resave: false,
  store: sessionStore,
  name: 'sid',
  secret: 'nyan neeko secret',  
  cookie: { 
    maxAge: TWO_HOURS,
    sameSite: true 
  }
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/asterisk', asteriskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
