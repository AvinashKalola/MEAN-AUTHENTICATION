require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

// Configuring Passport
var passport = require('passport');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());


app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/checkUser','/api/users/register'] }));


app.use('/login', require('./controllers/login.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/register', require('./controllers/register.controller'));


var initPassport = require('./passport/init');
initPassport(passport);

// handle the callback after facebook has authenticated the user
app.use('/login/facebook/callback',
    passport.authenticate('facebook', {
	successRedirect : '/app',
	failureRedirect : '/login'
	})
);

// route for facebook authentication and login
app.use('/login/facebook', 
    passport.authenticate('facebook', { scope : 'email' }));


app.get('/', function (req, res) {
    return res.redirect('/app');
});


var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});