const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const tourRoutes = require('./routes/tourRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRoutes);

app.use('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
