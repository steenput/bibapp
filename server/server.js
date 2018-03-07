// NPM modules
const Log = require('log');
const log = new Log('debug');
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');                   // log requests to the console (express4)
const bodyParser = require('body-parser');         // pull information from HTML POST (express4)

// My modules and const
const router = require('./app/routes');
const dbConfig = require('./config/db');

// Config
mongoose.connect(dbConfig.url);
app.use(morgan('dev'));                                          // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));             // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(cors());

router(app);

app.listen(8082);
console.log('server listen on port 8082');
