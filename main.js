/**
 * IMPORTS
 */
var express = require('express');
var app = express();
var server = require('http').Server(app);

var bodyParser = require('body-parser');
var io = require('socket.io')(server);

app.use(bodyParser.urlencoded());

/**
 * ROUTES
 */
app.use(require(__dirname + '/routes')(io));
// serve static content
app.use(express.static(__dirname + '/public'));
// serve bower components
app.use(express.static(__dirname + '/bower_components'));

/**
 * START SERVER
 */
server.listen(process.env.PORT || 8080, function listenCallback() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
});
