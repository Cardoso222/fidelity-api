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
  cnpj: Sequelize.INTEGER,
  cpf: Sequelize.INTEGER,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  points: Sequelize.INTEGER
});

//shop model
var Shop = sequelize.define('shop', {
  name: Sequelize.STRING,
  lat: Sequelize.STRING,
  lng: Sequelize.STRING
});


//middleware
app.use(function(req, res, next) {
 // if(req.headers.token != 'UGF1bG8gQ2FyZG9zbwo=') return res.status(500).json({error: "You dont have permission"});
  next();
});

//create new user
app.post('/users/new', function(req, res){
  var data = req.body;
  User.create({
    cnpj:data.cnpj,
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
  
    return res.status(500).json({error: 'User not found'});
    })
});

//Update user points
app.post('/users/:cpf', function(req, res) {
  var data = req.body;
  if(data.points.length <= 0) return res.status(500).json({error: 'You need to pass the points'});
  User.findAll({
  where: {cpf: parseInt(req.params.cpf)}
  }).then(function(users) {
    users[0].updateAttributes({points: parseInt(users[0].dataValues.points + req.body.points)});
      return res.status(200).json({success: true, user: users[0]});
    });
});

//create new shop
app.post('/shop/new', function(req, res){
  var data = req.body;
  Shop.create({
    name: data.name,
    lat: data.lat,  
    lng: data.lng,  
    url_friendly: data.url_friendly  
  }).then(function(user) {
    console.log(shop.get({ plain: true }));
   return res.status(200).json({success: true, shop: shop });
  })
});

//Get shopkeeper information
app.get('/users/show/:cnpj', function(req, res){
User.findOne({
  where: {cpnj: parseInt(req.params.cnpj)}
  }).then(function(user) {
    if (user != null) return res.status(200).json({success: true, user: user});
    
    return res.status(500).json({error: 'shopkeeper not found'});
  })
});

app.listen(3000, function() {
  console.log('Server running on port: ' + 3000);
});
