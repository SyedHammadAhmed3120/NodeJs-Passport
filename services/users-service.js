var bcrypt = require('bcrypt');
var dotenv = require('dotenv');
var jwt = require('jsonwebtoken');

var cloudant = require('../helpers/database');
var dateParser = require('../helpers/date-parser');

// Load environment variables.
dotenv.load();

module.exports = {
    getUsers: function(limit, skip) {
        var query = {
            selector: {
                schema: 'User'
            },
            fields: [ '_id', '_rev', 'firstname', 'lastname', 'email', 'created', 'schema', 'roles' ],
            limit: limit,
            skip: skip
        }
        
        return new Promise(function(resolve, reject) {
            cloudant.find(query, function(err, results) {
                if(err) {
                    reject({
                        statusCode: 400,
                        message: err.message
                    });
                } else {
                    resolve(results.docs);
                }
            });
        });
    },
    
    getUserById: function(userId) {
        var query = {
            selector: {
                schema: 'User',
                _id: userId
            },
            fields: [ '_id', '_rev', 'firstname', 'lastname', 'email', 'created', 'schema', 'roles' ],
            limit: 1
        }
        
        return new Promise(function(resolve, reject) {
            cloudant.find(query, function(err, results) {
                if(err) {
                    reject({
                        statusCode: 400,
                        message: err.message
                    });
                } else {
                    if(!results.docs[0]) {
                        reject({
                            statusCode: 404,
                            message: 'User not found.'
                        });
                    } else {
                        resolve(results.docs[0]);
                    }
                }
            });
        });
    },
    
    postUser: function(user) {
        // Add additional properties.
        user.schema = 'User';
        user.created = dateParser.toInt(dateParser.get());
        user.roles = [ 'User' ];
        if(user.password) {
            user.saltRounds = parseInt((Math.random() * 10) + 1);
            user.password = bcrypt.hashSync(user.password, user.saltRounds);
        }
        
        return new Promise(function(resolve, reject) {
            cloudant.insert(user, function(err, results) {
                if(err) {
                    reject({
                        statusCode: 400,
                        message: err.message
                    });
                } else {
                    user._rev = results._rev;
                    
                    // Remove all password related fields before returning object.
                    delete user.password;
                    delete user.saltRounds;
                    
                    resolve(user);
                }
            });
        });
    },
    
    loginUser: function(credentials) {
        var query = {
            selector: {
                _id: credentials._id,
                schema: 'User'
            },
            limit: 1
        }
        
        return new Promise(function(resolve, reject) {
            cloudant.find(query, function(err, results) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    if(results.docs[0] && bcrypt.compareSync(credentials.password, results.docs[0].password)) {
                        var payload = {
                            _id: results.docs[0]._id,
                            roles: results.docs[0].roles
                        }
                        
                        var token = jwt.sign(payload, process.env.SECRET_KEY, {
                            expiresIn: 3600 // seconds
                        });

                        resolve({
                            token: token,
                            expiresIn: 3600
                        });
                    } else {
                        reject({ 
                            statusCode: 401,
                            message: 'Authentication failed.' 
                        });
                    }
                }
            });
        });
    },
    
    updateUser: function(user, newUser) {
        
    },
    
    deleteUser: function(user) {
        
    }
}