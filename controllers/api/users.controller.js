var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

router.post('/checkUser', checkUser);
router.post('/register', registerUser);

module.exports = router;

function checkUser(req, res) {
    userService.checkUser(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                
                res.send({ token: token });
            } else {
                
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

