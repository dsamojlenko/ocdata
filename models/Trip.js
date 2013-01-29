var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
  	
module.exports = mongoose.model('Trip', new Schema({
    route_id          :  { type: String, index: true }
  , service_id        :  { type: String, index: true }
  , trip_id           :  { type: String }
  , trip_headsign     :  { type: String }
  , block_id          :  { type: String }
}, { strict: true }));
