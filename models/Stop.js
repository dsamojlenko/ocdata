var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Stop = mongoose.model('Stop', new Schema({
    stop_id           :  { type: String, index: true }
  , stop_code         :  { type: String }
  , stop_name         :  { type: String }
  , stop_desc         :  { type: String }
  , stop_lat          :  { type: Number }
  , stop_lon          :  { type: Number }
  , zone_id           :  { type: String }
}, { strict: true }));
