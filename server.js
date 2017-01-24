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


app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/checkUser','/api/users/register','/login/facebook/callback'] }));


app.use('/login', require('./controllers/login.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/register', require('./controllers/register.controller'));

app.get('/', function (req, res) {
    return res.redirect('/app');
});

var initPassport = require('./passport/init');
initPassport(passport);

// handle the callback after facebook has authenticated the user
// app.use('/login/facebook/callback',
//     passport.authenticate('facebook', {
// 	successRedirect : '/app',
// 	failureRedirect : '/'
// 	})
// );

app.use('/login/facebook/callback', passport.authenticate('facebook', {session: false, failureRedirect : '/'}), function(req, res) {
 // The token we have created on FacebookStrategy above 
//var token = req.user.token;
req.session.token = req.user.token;
var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
res.redirect(returnUrl);
 //res.send({ token: token });
});


// route for facebook authentication and login
app.use('/login/facebook', 
    passport.authenticate('facebook', { scope : 'email' }));

var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});