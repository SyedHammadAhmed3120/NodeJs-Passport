var validate = require('express-joi-validator');

var usersService = require('../services/users-service');
var userModel = require('../models/user');

module.exports = function(app) {
    app.get('/users', function(req, res, next) {
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
    
    app.get('/users/:userId', function(req, res, next) {
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
    
    app.post('/users/login', function(req, res, next) {
        
    });
    
    app.put('/users/:userId', function(req, res, next) {
            
    });
    
    app.delete('/users::userId', function(req, res, next) {
        
    });
}