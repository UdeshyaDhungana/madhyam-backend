// Dependencies
require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articlesRouter = require('./routes/articles');
const loginRouter = require('./routes/login');
const verificationRouter = require('./routes/verification');
var verifyToken = require('./utilities/verifyToken');


// Middlewares

var app = express();

mongoose.connect('mongodb://127.0.0.1/madhyam', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false});
var connection = mongoose.connection;
connection.on('error', () => {
	console.log('Connnection failed');
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Check if user exists and load into user_query variable if  exists
app.use(verifyToken);

// Routing middlewares
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/login', loginRouter);
app.use('/verification', verificationRouter);



module.exports = app;
