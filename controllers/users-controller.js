var validate = require('express-joi-validator');

var usersService = require('../services/users-service');
var userModel = require('../models/user');
var credentialsModel = require('../models/credentials');

module.exports = function(app, passport) {
    app.get('/users', passport.authenticate('jwt', { session: false }), function(req, res, next) {
        var limit = req.params.limit || 10;
        var skip = req.params.skip || 0;
        
        usersService.getUsers(limit, skip)
        .then(function(results) {
            res.status(200).json(results); 
        })
        .catch(function(err) {
            res.status(err.statusCode).json(err.message);
        });
    });
    
    app.get('/users/:userId', passport.authenticate('jwt', { session: false }), function(req, res, next) {
        var userId = req.params.userId;
        
        usersService.getUserById(userId)
        .then(function(results) {
            res.status(200).json(results); 
        })
        .catch(function(err) {
            res.status(err.statusCode).json(err.message);
        });
    });
    
    app.post('/users', validate(userModel), function(req, res, next) {
        var user = req.body;
        
        usersService.postUser(user)
        .then(function(results) {
            res.status(200).json(results); 
        })
        .catch(function(err) {
            res.status(err.statusCode).json(err.message);
        });
    });
    
    app.post('/users/login', validate(credentialsModel), function(req, res, next) {
        var credentials = req.body;
        
        usersService.loginUser(credentials)
        .then(function(results) {
            res.status(200).json(results); 
        })
        .catch(function(err) {
            res.status(err.statusCode).json(err.message);
        });
    });
    
    app.get('/users/login/facebook', passport.authenticate('facebook', { session: false }), function(req, res, next) { 
        
    });
    
    app.get('/users/login/facebook/callback', passport.authenticate('facebook', { session: false }), function(req, res, next) { 
        // Returning the token.
        res.status(200).json(req.user);
    });
    
    app.put('/users/:userId', function(req, res, next) {
            
    });
    
    app.delete('/users::userId', function(req, res, next) {
        
    });
}