var passportFacebook = require('passport-facebook');
var dotenv = require('dotenv');

var cloudant = require('../helpers/database');
var usersService = require('../services/users-service');

// Load environment variables.
dotenv.load();

var FacebookStrategy = passportFacebook.Strategy;

module.exports = function(passport) {
    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        
        //By default, not all the fields in a profile are returned. 
        //The fields needed by an application can be indicated by setting the profileFields option. 
        profileFields: ['id', 'displayName', 'email'],
    
        //If you need additional permissions from the user, the permissions can be requested via the scope option
        scope: ['user_friends']
    }, function(token, refreshToken, profile, done) {
        // Check for claims. Can use custom authorization login.
        // We're checking if the user is a valid user and exists in the database.
        
        usersService.getUserById(profile.id)
        .then(function(results) {
            done(null, token);
        })
        .catch(function(err) {
            // If user does not exists then add the user.
            var user = {
                _id: profile.id,
                provider: 'Facebook'
            }
            
            usersService.postUser(user)
            .then(function(results) {
                done(null, token);
            })
            .catch(function(err) {
                done(err);
            });
        });
    }));
}