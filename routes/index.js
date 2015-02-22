module.exports = function(io) {
	var express = require('express');
	var router = express.Router();

	router.post('/client/submit', function (req, res) {
		io.emit('comet', req.form.data);
		console.log(req.form.data);
		res.status(200).send('ok');
	});

	return router;
};
