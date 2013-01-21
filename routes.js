var ocdata = require('./lib/ocdata');

module.exports = function(app){
	
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
	
}