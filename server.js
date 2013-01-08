var express = require('express'),
	routes = require('./lib/ocdata.js');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/api/:agency/getRoutesForStop/:stop', routes.getRoutesForStop);
app.get('/api/:agency/getNextTripsForStop/:stop/:route', routes.getNextTripsForStop);

app.listen(3000);
console.log('Listening on port 3000...');