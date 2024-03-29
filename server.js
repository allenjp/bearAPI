// server.js - Left off on Creating Routes for a single item (http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4)

// BASE SERUP
// ============================================================================

// call the packages we need
var express = require('express');			// call express
var app = express();						// define our app using express
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080		// set our port

var mongoose = require('mongoose');
var mongoURL = "mongodb://jtbosujallen:27017/Bears";

var connectWithRetry = function() {
	return mongoose.connect(mongoURL, function(err) {
		if (err) {
			console.error('Failed to connect to mongo on startup' , err);
		}
	});
};
connectWithRetry();

var Bear = require('./app/models/bear');

// configure the app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

// ROUTES FOR OUR API
// ============================================================================
var router = express.Router();				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /bears
// --------------------------------------------------------
router.route('/bears')

	// create a bear (accessed at POST http://localhost:8080/api/bears)
	.post(function(req, res) {

		var bear = new Bear();			// create a new instance of the Bear model
		bear.name = req.body.name;		// set the bear's name (comes from the request)
		bear.age = req.body.age;		// bear age
		bear.color = req.body.color;	// bear color

		
		// check that all bear fields are filled out
		if ((bear.name != null) && (bear.age != null) && (bear.color != null)) {

			// save the bear and check for errors
			bear.save(function(err) {
				if (err) {
					res.send(err);
				}

				res.json({ message: 'Bear created!' });
			});
		}	

		else {
			res.json({ message: 'Make sure all fields are filled out'});
		}
	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err) {
				res.send(err);
			}

			res.json(bears);
		});
	})

	// delete all the bears (accessed at DELETE http://localhost:8080/api/bears)
	.delete(function(req, res) {
		Bear.remove(function(err) {
			if (err) {
				res.json(err);
			}
			res.json({ message: 'All bears deleted' });
		})
	});

// on routes that end in /bears/:bear_id
// --------------------------------------------------------
router.route('/bears/:bear_id')

	// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {

			if (err) {
				res.send(err);
			}
			res.json(bear);
		});
	})

	// update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
	.put(function(req, res) {

		// use our bear model to find the bear we want
		Bear.findById(req.params.bear_id, function(err, bear) {

			if (err) {
				res.send(err);
			}

			bear.name = req.body.name;

			// save the bear
			bear.save(function(err) {

				if (err) {
					res.send(err);
				}

				res.json({ message: 'Bear updated!' });
			});
		}); 
	})

	// delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
	.delete(function(req, res) {

		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {

			if (err) {
				res.send(err);
			}

			res.json({ message: 'Successfully deleted' });
		});
	});

// REGISTER OUR ROUTES ------------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
