var facebook = require('../services/facebook');
var User = require('../models/user');
var config = require('config.json');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

module.exports = function(passport){

    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
       db.users.findById(id, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });
    });

    facebook(passport);
    
}