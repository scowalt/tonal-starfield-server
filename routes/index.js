module.exports = function(io) {
	var express = require('express');
	var router = express.Router();

	router.get('/', function (req, res){
		res.redirect('/simulation');
	});

	router.post('/client/submit', function (req, res) {
		io.emit('comet', req.body);
		res.redirect('/thanks');
		res.status(200).send('ok');
	});

	return router;
};
