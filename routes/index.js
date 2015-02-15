module.exports = function(io) {
	var express = require('express');
	var router = express.Router();

	router.post('/client/submit', function (req, res) {
		io.emit('comet', {});
		res.status(200).send('ok');
	});

	return router;
};
