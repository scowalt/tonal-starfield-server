/**
 * IMPORTS
 */
var express = require('express');
var app = express();
var server = require('http').Server(app);

/**
 * ROUTES
 */
// serve static content
app.use('/', express.static(__dirname + '/public'));

/**
 * START SERVER
 */
server.listen(process.env.PORT || 8080, function listenCallback() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
});
