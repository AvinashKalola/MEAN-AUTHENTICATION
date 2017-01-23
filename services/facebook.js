var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var configAuthentication = require('../config/auth.js');
var config = require('config.json');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : configAuthentication.facebookAuth.clientID,
        clientSecret    : configAuthentication.facebookAuth.clientSecret,
        callbackURL     : configAuthentication.facebookAuth.callbackURL,
	    passReqToCallback : true,
    	enableProof: true,
    	session: false
    },

function(access_token, refresh_token, profile, done) {
    	console.log('profile', profile);
		process.nextTick(function() {
	        User.findOne({ 'id' : profile.id }, function(err, user) {

	        	if (err)
	                return done(err);

	            if (user) {
					deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
	                return done(null, user); 
	            } else {
	                
					var newUser = new User();

	                newUser.id    = profile.id; 
	                newUser.access_token = access_token;
	                newUser.firstName  = profile.name.givenName;
	                newUser.lastName = profile.name.familyName;
	                newUser.email = profile.emails[0].value;
					newUser.hash = bcrypt.hashSync(userParam.access_token, 10);

					db.users.insert(
						newUser,
						function (err, doc) {
							if (err) deferred.reject(err.name + ': ' + err.message);
						deferred.resolve(jwt.sign({ sub: newUser._id }, config.secret));
					});
	            }

	        });
        });

    }));

};
