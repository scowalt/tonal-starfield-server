/**
 * IMPORTS
 */
var express = require('express');
var app = express();

app.get('/', function rootGet(request, response){
	response.send('Hello world!');
});

var server  = app.listen(8080, function listenCallback() {
	var host  = server.address().address;
	var port = server.address().port;
	
	console.log('Example app listening at http://%s:%s', host, port)
})