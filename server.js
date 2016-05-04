var express = require('express');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

var app = module.exports = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Sequelize = require('sequelize');
var sequelize = new Sequelize('fidelity', 'root', '');

//user model
var User = sequelize.define('user', {
  cpf: Sequelize.INTEGER,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  points: Sequelize.INTEGER
});

//middleware
app.use(function(req, res, next) {
  if(req.headers.token != 'UGF1bG8gQ2FyZG9zbwo=') return res.status(500).json({error: "You dont have permission"});

  next();
});

//create new user
app.post('/users/new', function(req, res){
  var data = req.body;
  User.create({
    cpf: data.cpf,
    username: data.username,
    password: data.password,
    points: data.points,
  }).then(function(user) {
    console.log(user.get({ plain: true }));
   return res.status(200).json({success: true});
  })
});

//Get user information
app.get('/users/show/:cpf', function(req, res){
User.findOne({
  where: {cpf: parseInt(req.params.cpf)}
  }).then(function(user) {
    if (user != null) return res.status(200).json({success: true, user: user});
  })
});

app.listen(3000, function() {
  console.log('Server running on port: ' + 3000);
});
