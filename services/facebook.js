var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var configAuthentication = require('../config/auth.js');
var config = require('config.json');
var _ = require('lodash');
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
        callbackURL     : configAuthentication.facebookAuth.callbackURL
	},
function(access_token, refresh_token, profile, done) {
		var deferred = Q.defer();
    	console.log('profile', profile);
		process.nextTick(function() {
			
	        db.users.findOne({ 'id' : profile.id }, function(err, user) {

	        	if (err)
	                return done(err);

	            if (user) {
					//deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
					user.token = jwt.sign({ sub: user._id }, config.secret);
                    return done(null, user); 
	            } else {
	                
					var user = new User();
					 //var newUser = _.omit(user, 'password');
					 var newUser = {
								email        : '',
								username     : profile.displayName,
								hash 		 : bcrypt.hashSync(profile.id, 10),
								firstName    : profile.displayName,
								lastName    : profile.name.familyName,
								access_token : access_token,
								id : profile.id
							}
					
	            //     newUser.id    = profile.id; 
	            //     newUser.access_token = access_token;
	            //     newUser.firstName  = profile.displayName;
	            //     newUser.lastName = profile.name.familyName;
	            //    // newUser.email = profile.emails[0].value;
				// 	newUser.hash = bcrypt.hashSync(profile.id, 10);

					db.users.insert(
						newUser,
						function (err, doc) {
							if (err) 
							{
								//console.log("get error");
								throw err;
								//deferred.reject(err.name + ': ' + err.message);
							}
						//deferred.resolve(jwt.sign({ sub: newUser._id }, config.secret));
						newUser.token = jwt.sign({ sub: newUser._id }, config.secret);
						return done(null, newUser);
					});
	            }

	        });
        });

    }));

};
