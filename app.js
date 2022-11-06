const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');
const viewrouter = require('./routes/viewrouter');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//SERVERING STATIC FILES

app.use(express.static(path.join(__dirname, 'public')));
//1)  GLOBAL  MIDDLEWARES

//SET SECURITY HTTP HEADERS

app.use(helmet());

//DEVELPMENT LOGIN
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//LIMIT REQUEST FROM SAME API

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in hour ',
});
app.use('/api', limiter);
//BODY PARSER,READING DATA FROM BODY INTO REQ.BODY

app.use(express.json({ limit: '10kb' }));
//DATA SANITIZATION AGAINST NO SQL QUERY INJECTION
app.use(mongoSanitize());

//DATA SANITIZATION AGAINST XSS
app.use(xss());

//PREVENT PARAMETR POLLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//SERVER STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
//TEST MIDDLEWARE

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//2) ROUTE HANDLERS

//ROUTES
app.use('/', viewrouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
// app.use('api/v1/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// STARTING THE SERVER
module.exports = app;
