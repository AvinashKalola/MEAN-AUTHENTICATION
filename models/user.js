
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
        email        : String,
        password     : String,
		username     : String,
		hash 		 : String,
		firstName    : String,
		lastName    : String,
		access_token : String
    });