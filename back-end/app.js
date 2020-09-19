require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var admin = require('./lib/FirebaseService');
var GetAuthToken = require('./lib/GetAuthToken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var datasetsRouter = require('./routes/datasets');
var adminsRouter = require('./routes/admins');
var restrictedRouter = require('./routes/restricted');
var updateDatabaseRouter = require('./routes/update-database');
var deleteFromDatabaseRouter = require('./routes/delete-from-database');

var cors = require('cors');

const checkIfAuthenticated = (req, res, next) => {
  console.log('checking if authenticated');
 GetAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin
        .auth()
        .verifyIdToken(authToken);
      req.authId = userInfo.uid;
      return next();
    } catch (e) {
      return res
        .status(401)
        .send({ error: 'You are not authorized to make this request' });
    }
  });
};

const checkIfAdmin = (req, res, next) => {
  console.log('checking if admin');
  GetAuthToken(req, res, async () => {
     try {
       const { authToken } = req;
       const userInfo = await admin
         .auth()
         .verifyIdToken(authToken);

       if (userInfo.admin === true) {
         req.authId = userInfo.uid;
         return next();
       }

       throw new Error('unauthorized')
     } catch (e) {
       return res
         .status(401)
         .send({ error: 'You are not authorized to make this request' });
     }
   });
 };


var app = express();

var corsOptions = {
  origin: 'http://localhost:3000'
}

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/datasets',checkIfAuthenticated,datasetsRouter);
app.use('/admins',checkIfAuthenticated, adminsRouter);
app.use('/update-database',checkIfAuthenticated, updateDatabaseRouter);
app.use('/delete-from-database',checkIfAuthenticated, deleteFromDatabaseRouter);

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
  // res.render('error');
});

module.exports = app;
