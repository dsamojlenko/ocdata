try {
  var config = require('../config.js');
} catch (e) {
  console.log(e)
}

var   mongo = require('mongodb')
	, mongoose = require('mongoose')
	, utils = require('./utils.js')
	, async = require('async')
	, dbName = process.env['MONGO_NODE_DATABASE'] || config.mongo_node_database
	, host = process.env['MONGO_NODE_HOST'] || config.mongo_node_host
	, port = process.env['MONGO_NODE_PORT'] || config.mongo_node_port
	, db = (port) ? mongoose.connect(host, dbName, port) : mongoose.connect(host, dbName);

require('../models/Agency');
require('../models/Calendar');
require('../models/CalendarDate');
require('../models/Route');
require('../models/Stop');
require('../models/StopTime');
require('../models/Trip');

var Agency = db.model('Agency')
  , Calendar = db.model('Calendar')
  , CalendarDate = db.model('CalendarDate')
  , Route = db.model('Route')
  , Stop = db.model('Stop')
  , StopTime = db.model('StopTime')
  , Trip = db.model('Trip');


module.exports = {  

	getRoutesForStop: function(request, response) {
		var stop = request.params.stop;
		console.log('retrieving routes for stop: ' + stop);
		
	    response.send([{ route:'95'}, {route:'96'}]);
	},
			
	getNextTripsForStop: function(request, response) {
		var today = new Date()
	      , service_ids = []
	      , trip_ids = []
	      , add_services = []
	      , remove_services = []
	      , times = []
	      , trip_details = []
	      , stop = request.params.stop
	      , route = request.params.route;
	    
	      
	    async.series([
	      checkFields,
	      findExceptions,
	      findServices,
	      findTrips,
	      findTimes
	    ], function(e, results){
	      if(e){
	        console.log(e);
	        response.send(e);
	        // cb(e,null);
	      } else {
	        console.log(results);
	        // console.log(times);
	        response.send( times || {error: 'No times for agency/route/stop combination.'});
	      }
	    });
	    
		function checkFields(cb){
			if(!stop){
				cb(new Error('No agency_key specified'), 'fields');
				// error
			} else {
				cb(null, 'fields');
			}
		}
		
		// console.log('retrieving trips for stop: ' + stop);
		
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
				      console.log(service.service_id);
			      }
			    });
			    cb(null, 'services');
			  } else {
			    cb(new Error('No Service for this date'), 'services');
			  }
			});
		}
		
		function findTrips(cb) {
			var query = {
				route_id: route
			}
			// var query = [];
			// var trips = [];
			
			Trip
				.find(query)
				.where('service_id').in(service_ids)
				.exec(function(e, trips){
					if(trips.length){
						trips.forEach(function(trip){
							trip_ids.push(trip.trip_id);
							trip_details.push({ 'trip_id': trip.trip_id, 'trip_headsign': trip.trip_headsign });
							console.log(trip.trip_id);
						});
						cb(null, 'trips')
					} else {
						cb(new Error('No trips for this date'), 'trips');
					}
				});
		}
		
		function findTimes(cb) {
			var query = {
				stop_id: stop
			}
			, timeFormatted = utils.secondsToTime(utils.timeToSeconds(today));
			
			// console.log(utils.secondsToTime('29:46:00'));
			// console.log(utils.timeToSeconds('29:46:00')); 
			console.log('timeFormatted ' + timeFormatted);
			
			StopTime
				.find(query)
				.where('trip_id').in(trip_ids)
				.where('arrival_time').gte(timeFormatted)
				.sort('arrival_time')
				.exec(function(e, stopTimes){
					if(stopTimes.length){
						stopTimes.forEach(function(stopTime){
							times.push(stopTime.arrival_time);
							console.log(stopTime.arrival_time);
						});
						cb(null, 'times');
					} else {
						cb(new Error('No times available for this stop on this date'), 'times');
					}
				});
		}
      
		
	    // response.send({stop:request.params.stop, route: "95", time: "5 mins"});
	}

}