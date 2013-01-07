var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Agency = mongoose.model('Agency', new Schema({
    agency_name       :  { type: String }
  , agency_url        :  { type: String }
  , agency_timezone   :  { type: String }
  , agency_lang       :  { type: String }
}, { strict: true }));
