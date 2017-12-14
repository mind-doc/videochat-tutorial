// Config is loaded from either the environment or a .env file
require('dotenv-safe').load();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('port', (process.env.PORT || 3000));

// Parse json in the body - available later as an object in req.body
app.use(bodyParser.json());

// Routes for our API
require('./routes')(app);

module.exports = app;
