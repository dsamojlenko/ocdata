var mongoose = require('mongoose')
  , Agency = mongoose.model('Agency')
  , Calendar = mongoose.model('Calendar')
  , CalendarDate = mongoose.model('CalendarDate')
  , Route = mongoose.model('Route')
  , Stop = mongoose.model('Stop')
  , StopTime = mongoose.model('StopTime')
  , Trip = mongoose.model('Trip')
  , async = require('async')
  , utils = require('./utils.js')


module.exports = {  

	getRoutesForStop: function(request, response) {
		var stop = request.params.stop;
		console.log('retrieving routes for stop: ' + stop);
		
	    response.send([{ route:'95'}, {route:'96'}]);
	},
	
	// gets upcoming times for a route at a stop
	getNextTripsForStop: function(agency,stop,route,cb) {
		var today = new Date()
		  , stop_ids = []
		  , route_ids = []
	      , service_ids = []
	      , trip_ids = []
	      , add_services = []
	      , remove_services = []
	      , times = []
	      , response_details = []
	      // , stop = request.params.stop
	      // , route = request.params.route
	      // , agency = request.params.route;
	    
	      
	    async.series([
	      checkFields,
	      findStopIds,
	      findRouteIds,
	      findExceptions,
	      findServices,
	      findTrips,
	      findTimes
	    ], function(e, results){
	      if(e){
	        console.log(e);
	        // response.send(e);
	        cb(e,null);
	      } else {
	        console.log(results);
	        // console.log(times);
	        // console.log(route_details);
	        // response.send( times || {error: 'No times for agency/route/stop combination.'});
	        cb(e,times);
	      }
	    });
	    
		function checkFields(cb){
			if(!agency){
				cb(new Error('No agency_key specified'), 'fields');
			} else if(!stop) {
				cb(new Error('No stop specified'), 'fields');
			} else if(!route) {
				cb(new Error('No route specified'), 'fields');
			} else {
				cb(null, 'fields');
			}
		}
		
		// if it's early in the morning, need to get any routes that began yesterday before midnight and end after 
		// they will have times over 24hrs and apply to today
		function findPreviousDayTimes(cb) {
			
		}
		
		function buildResponse(cb) {
			timeFormatted = utils.secondsToTime(utils.timeToSeconds(today));
			
			// findExceptions, findServices, findTrips
			Stop
			.find({'stop_code':3012})
			.exec(function(e,stops) {
				if(stops.length) {
					stops.forEach(function(cstop) {
						
			
						StopTime
							.find()
							.where('trip_id').in(trip_ids)
							.where('stop_id').equals(cstop.stop_id)
							.where('arrival_time').gte(timeFormatted)
							.sort('arrival_time')
							.exec(function(e, stopTimes){
								if(stopTimes.length){
									stopTimes.forEach(function(stopTime){
										times.push(stopTime.arrival_time);
										response_details.push({ 'trip_id': trip.trip_id, 'trip_headsign': trip.trip_headsign });
										// console.log(stopTime.arrival_time);
									});
									cb(null, 'times');
								} else {
									cb(new Error('No times available for this stop on this date'), 'times');
								}
							});
						
					/*
						Trip
						.find()
						.where('service_id').in(service_ids)
						.exec(function(e, trips){
							if(trips.length){
								trips.forEach(function(trip){
									trip_ids.push(trip.trip_id);
									// route_details.push({ 'trip_id': trip.trip_id, 'trip_headsign': trip.trip_headsign });
									// console.log(trip.trip_id);
								});
								cb(null, 'trips')
							} else {
								cb(new Error('No trips for this date'), 'trips');
							}
						});
						*/
					});
				} else {
					cb(new Error('stop not found'), 'stops');
				}
			});
		}
		
		// so we can query stop_code
		function findStopIds(cb) {
			Stop
			.find({'stop_code':3012})
			.exec(function(e,stops) {
				if(stops.length){
					stops.forEach(function(astop) {
						stop_ids.push(astop.stop_id);
					});
					cb(null,'stops');
				} else {
					cb(new Error('stop not found ' + stop), 'stops');
				}
			});
		}
		
		// need to get routes first so we can use route_code (95) instead of route_id (95-140/139)
		function findRouteIds(cb) {
			Route
			.find()
			.where('route_short_name').equals(route)
			.exec(function(e,routes){
				if(routes.length){
					routes.forEach(function(route){
						route_ids.push(route.route_id);
					});
					cb(null,'routes');
				} else {
					cb(new Error('no route found'), 'routes');
				}
			});
		}
		
		// find any exceptions or additions to services for the day
		function findExceptions(cb) {
			var todayFormatted = utils.formatDay(today);
			
			CalendarDate
			.find()
			.where('date').equals(todayFormatted)
			.exec(function(e,exceptions) {
				if(exceptions.length){
					exceptions.forEach(function(except) {
						if(except.exception_type == 1) {
							service_ids.push(except.service_id);
							console.log('add service: ' + except.service_id);
						}
						if(except.exception_type == 2) {
							remove_services.push(except.service_id);
							console.log('remove service: ' + except.service_id);
						}
					});
					cb(null,'exceptions');
				} else {
					cb(null,'no exceptions');
				}
			});
			
			
		}
		
		// find available services for the day
		function findServices(cb){
		
			var todayFormatted = utils.formatDay(today);
			
			var query = {};
			query[utils.getDayName(today).toLowerCase()] = 1;
			
			Calendar
			.find(query)
			.where('start_date').lte( todayFormatted )
			.where('end_date').gte( todayFormatted )
			.exec(function(e, services){
			
			  if(services.length){
			    services.forEach(function(service){
			      if(remove_services.indexOf(service.service_id) == -1) {
				      service_ids.push(service.service_id);
				      //console.log(service.service_id);
			      }
			    });
			    cb(null, 'services');
			  } else {
			    cb(new Error('No Service for this date'), 'services');
			  }
			});
		}
		
		
		
		// will need to get trips for routes in both directions since we don't know the direction without the stop id
		function findTrips(cb) {
			//var query = {
			//	route_id: route
			//}
			// var query = [];
			// var trips = [];
			
			Trip
				.find()
				.where('service_id').in(service_ids)
				.where('route_id').in(route_ids)
				.exec(function(e, trips){
					if(trips.length){
						trips.forEach(function(trip){
							trip_ids.push(trip.trip_id);
							// route_details.push({ 'trip_id': trip.trip_id, 'trip_headsign': trip.trip_headsign });
							// console.log(trip.trip_id);
						});
						cb(null, 'trips')
					} else {
						cb(new Error('No trips for this date'), 'trips');
					}
				});
		}
		
		// find times for the trips at this stop
		function findTimes(cb) {
			timeFormatted = utils.secondsToTime(utils.timeToSeconds(today));
			
			StopTime
				.find()
				.where('trip_id').in(trip_ids)
				.where('stop_id').in(stop_ids)
				.where('arrival_time').gte(timeFormatted)
				.sort('arrival_time')
				.exec(function(e, stopTimes){
					if(stopTimes.length){
						stopTimes.forEach(function(stopTime){
							times.push(stopTime.arrival_time);
							// console.log(stopTime.arrival_time);
						});
						cb(null, 'times');
					} else {
						cb(new Error('No times available for this stop on this date'), 'times');
					}
				});
		}

	}

}