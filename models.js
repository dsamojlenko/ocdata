module.exports = function(app, mongoose){
// models.examples = require('./models/example')(app.mongoose);

var Agency = require('./models/Agency')(mongoose)
  , Calendar = require('./models/Calendar')(mongoose)
  , CalendarDate = require('./models/CalendarDate')(mongoose)
  , Route = require('./models/Route')(mongoose)
  , Stop = require('./models/Stop')(mongoose)
  , StopTime = require('./models/StopTime')(mongoose)
  , Trip = require('./models/Trip')(mongoose);

}
/*
var	Agency = db.model('Agency')
  , Calendar = db.model('Calendar')
  , CalendarDate = db.model('CalendarDate')
  , Route = db.model('Route')
  , Stop = db.model('Stop')
  , StopTime = db.model('StopTime')
  , Trip = db.model('Trip');
  
*/