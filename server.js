var express = require('express');
var expressSession = require('express-session');

var app = module.exports = express();

app.listen(3000, function() {
  console.log('Server running on port: ' + 3000);
});
