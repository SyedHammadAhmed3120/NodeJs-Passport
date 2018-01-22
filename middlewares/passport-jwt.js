var passportJWT = require('passport-jwt');
var dotenv = require('dotenv');

var cloudant = require('../helpers/database');
var usersService = require('../services/users-service');

// Load environment variables.
dotenv.load();

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}

module.exports = function(passport) {
    passport.use('jwt', new JwtStrategy(jwtOptions, function(payload, next) {
        // Check for claims. Can use custom authorization login.
        // We're checking if the user is a valid user and exists in the database.
        
        usersService.getUserById(payload._id)
        .then(function(results) {
            next(null, results);
        })
        .catch(function(err) {
            next(err);
        });
    }));
}