var gzippo = require('gzippo');
var express = require('express');

var app = express.createServer(express.logger());
app.use(gzippo.staticGzip(__dirname + '/dist'));
app.listen(process.env.PORT || 5000);
