// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '629444930595634',
		'clientSecret' 	: '1cb63e4a680bc424aed43d9f48ff4895', 
		'callbackURL' 	: 'http://localhost:3000/login/facebook/callback'
	}
};