var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Route = mongoose.model('Route', new Schema({
    route_id          :  { type: String }
  , route_short_name  :  { type: Number }
  , route_long_name   :  { type: String }
  , route_desc        :  { type: String }
  , route_type        :  { type: String }
}, { strict: true }));
