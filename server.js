var express = require('express'),
	ocdata = require('./lib/ocdata.js');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/api/:agency/getRoutesForStop/:stop', function(request, repsonse) {
	
	var agency = request.params.agency
	  , stop = request.params.stop;
	  
	ocdata.getRoutesForStop(agency,stop, function(e,data) {
		response.send( data || { error: "error dude" });
	});
});

app.get('/api/:agency/getNextTripsForStop/:stop/:route', function(request, response) {
	
	var agency = request.params.agency
	  , stop = request.params.stop
	  , route = request.params.route;
	  
	ocdata.getNextTripsForStop(agency,stop,route, function(e, data) {
		response.send( data || { error: "error dude" });
	});
	
});

app.listen(3000);
console.log('Listening on port 3000...');