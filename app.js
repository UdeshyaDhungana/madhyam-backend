// Dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const debug = require('debug')('database');
const compression = require('compression');
const helmet = require('helmet');
// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
//const articlesRouter = require('./routes/articles');
//const loginRouter = require('./routes/login');
//const verificationRouter = require('./routes/verification');
//const validateTokenRouter = require('./routes/validateToken')
//const logoutRouter = require('./routes/logout');

// Middlewares

const app = express();

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false});
const connection = mongoose.connection;
connection.on('error', (x) => {
	debug('Update error: '+ x);
});

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, './public')));

// Routing middlewares
app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
//app.use('/api/articles', articlesRouter);
//app.use('/api/login', loginRouter);
//app.use('/api/validatetoken', validateTokenRouter);
//app.use('/api/logout', logoutRouter);
//used for link verification
//app.use('/api/verification', verificationRouter);

module.exports = app;
