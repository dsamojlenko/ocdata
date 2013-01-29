var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
  	
module.exports = mongoose.model('Stop', new Schema({
    stop_id           :  { type: String, index: true }
  , stop_code         :  { type: Number }
  , stop_name         :  { type: String }
  , stop_desc         :  { type: String }
  , stop_lat          :  { type: Number }
  , stop_lon          :  { type: Number }
  , zone_id           :  { type: String }
}, { strict: true }));
