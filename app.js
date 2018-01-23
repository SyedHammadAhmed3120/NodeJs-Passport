var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var dotenv = require('dotenv');
var passport = require('passport');

// Load environment variables.
dotenv.load();

var app = express();
var port = process.env.PORT;

// Configure passport.
require('./middlewares/passport-jwt')(passport);
require('./middlewares/passport-facebook')(passport);

// Log requests.
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Call all routes.
require('./controllers/users-controller')(app, passport);

// Start the server.
app.listen(port, function() {
    console.log('App running on port ' + port); 
});