var ws = require('nodejs-websocket');

var ports = process.argv.splice(2,process.argv.length-2);

if (ports.length === 0){
	throw 'give me some ports';
} else {
	ports.forEach(function(port){
		var server = ws.createServer(function(conn){
			console.log('New connection on port ' + port);
			conn.on('close', function (code, reason){
				console.log('connection closed');
			});
		}).listen(port);
	});
}
