var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , utils = require('../lib/utils');
	
mongoose.model('StopTime', new Schema({
    trip_id           :  { type: String, index: true }
  , arrival_time      :  { type: String }
  , departure_time    :  { type: String, index: true }
  , stop_id           :  { type: String, index: true }
  , stop_sequence     :  { type: Number, index: true }
  , pickup_type       :  { type: String }
  , drop_off_type     :  { type: String }
}, {collection: 'stoptimes'},{ strict: true }));
