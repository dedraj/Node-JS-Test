const express = require('express');
const morgan = require('morgan');
const cron = require('./cronjob/cron');

const app = express();
require('dotenv').config();
app.use(morgan('dev'));

const authRoute = require('./Routes/auth');
const createError = require('http-errors');
const bodyParser = require('body-parser');
require('./DBConnections/mongoConnection');
// require('./DBConnections/sqlConnection');

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.use('/auth', authRoute);

app.use(async (req, res, next) => {
    next(createError.NotFound("Not found the route"));
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

cron.updateLogedInUserTime();
module.exports = app;